import { NextRequest, NextResponse } from "next/server";
import { resolveWorkspace } from "@/utils/workspace";

export async function GET(req: NextRequest) {
  try {
    const { workspaceId, role } = await resolveWorkspace(req);
    
    // Parse query params
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const search = searchParams.get("search") || "";
    const source = searchParams.get("source") || "ALL";

    // Only owner and admin can decrypt prompts
    const canDecrypt = role === "owner" || role === "admin";

    // Call internal engine endpoint
    const engineUrl = process.env.KRIXAI_ENGINE_URL || "http://127.0.0.1:8000";
    
    try {
      const engineResponse = await fetch(
        `${engineUrl}/internal/logs?workspace_id=${workspaceId}&page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&source=${source}&decrypt=${canDecrypt}`,
        {
          headers: {
            "Authorization": `Bearer ${process.env.KRIXAI_ENGINE_API_KEY || ""}`,
          },
        }
      );

      if (engineResponse.ok) {
        const data = await engineResponse.json();
        return NextResponse.json(data);
      }
    } catch (e) {
      console.log("Engine unreachable, returning empty real data to prevent fake values.");
    }

    // Return empty data instead of fake data
    return NextResponse.json({
      logs: [],
      total: 0,
      page,
      limit
    });

  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("API Logs Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
