import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/utils/rate-limit';
const ENGINE_URL = process.env.KRIXAI_ENGINE_URL; // Railway URL
const ENGINE_SECRET = process.env.ENGINE_SECRET_KEY;

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
    const rateLimitResponse = await checkRateLimit('scan', `scan:${ip}`);
    if (rateLimitResponse) return rateLimitResponse;

    const body = await request.json();
    
    // Forward to Python engine
    const response = await fetch(`${ENGINE_URL}/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Engine-Secret': ENGINE_SECRET || '', // Authenticate with engine
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Scan API error:', error);
    return NextResponse.json(
      { error: 'Scan service unavailable' },
      { status: 503 }
    );
  }
}
