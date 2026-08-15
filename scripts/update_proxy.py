import os

content = """import httpx
import uuid
import hashlib
from fastapi import APIRouter, Request, Header, HTTPException, Depends
from fastapi.responses import JSONResponse
from app.schemas.openai import ChatCompletionRequest
from app.services.scanner import evaluate_prompt
from app.core.config import settings
from supabase import create_client

router = APIRouter()
OPENAI_URL = "https://api.openai.com/v1/chat/completions"

supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY) if settings.SUPABASE_KEY else None

async def verify_krixai_key(x_krixai_api_key: str = Header(None)):
    if not x_krixai_api_key:
        raise HTTPException(status_code=401, detail="Missing X-Krixai-API-Key header")
        
    if not supabase:
        if x_krixai_api_key != settings.ENGINE_API_KEY:
            raise HTTPException(status_code=401, detail="Invalid X-Krixai-API-Key")
        return {"workspace_id": None, "id": None}

    key_hash = hashlib.sha256(x_krixai_api_key.encode()).hexdigest()
    
    try:
        result = supabase.table("api_keys") \\
            .select("*") \\
            .eq("key_hash", key_hash) \\
            .eq("status", "Active") \\
            .single() \\
            .execute()
            
        if not result.data:
            raise HTTPException(status_code=401, detail="Invalid API key")
            
        return result.data
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid API key")

@router.post("/v1/chat/completions")
async def chat_completions_proxy(
    request_data: ChatCompletionRequest, 
    request: Request,
    authorization: str = Header(None),
    api_key_data: dict = Depends(verify_krixai_key)
):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing OpenAI Authorization header")
    
    full_prompt = " ".join([msg.content for msg in request_data.messages if msg.role == "user"])
    
    scan_result = evaluate_prompt(full_prompt)
    
    request_id = f"kx-req-{uuid.uuid4().hex[:12]}"
    is_blocked = scan_result["decision"] == "BLOCK"
    status = "blocked" if is_blocked else "passed"
    action_taken = "block" if is_blocked else "pass"
    
    category = None
    sub_type = None
    confidence = 0.0
    if scan_result["detected_threats"]:
        threat = scan_result["detected_threats"][0]
        category = threat.get("type", "Prompt Injection")
        confidence = float(threat.get("confidence", 1.0))
        
    if supabase and api_key_data.get("workspace_id"):
        try:
            supabase.table("detection_logs").insert({
                "workspace_id": api_key_data["workspace_id"],
                "api_key_id": api_key_data["id"],
                "request_id": request_id,
                "status": status,
                "category": category,
                "sub_type": sub_type,
                "confidence": confidence,
                "action_taken": action_taken,
                "scan_time_ms": scan_result["processing_time_ms"]
            }).execute()
        except Exception as e:
            print(f"Failed to log detection: {e}")
    
    if is_blocked:
        return JSONResponse(
            status_code=400,
            content={
                "error": "Krixai Security Block",
                "details": scan_result["detected_threats"]
            }
        )

    headers = {
        "Authorization": authorization,
        "Content-Type": "application/json"
    }

    async with httpx.AsyncClient() as client:
        try:
            raw_body = await request.json()
            response = await client.post(
                OPENAI_URL, 
                json=raw_body, 
                headers=headers,
                timeout=60.0
            )
            
            return JSONResponse(
                status_code=response.status_code, 
                content=response.json(),
                headers={"x-krixai-security": "SAFE", "x-krixai-latency-ms": str(scan_result["processing_time_ms"])}
            )
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"OpenAI Proxy Error: {str(e)}")
"""

target_path = "/Users/krish/Desktop/krixai-detect v0.1/app/api/proxy.py"
with open(target_path, "w") as f:
    f.write(content)
print("Updated proxy.py successfully.")
