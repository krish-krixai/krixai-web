import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "ok", service: "Krixai Web" }, { status: 200 });
}
