import { NextResponse } from "next/server";
import { initWebSocket } from "@/server/ws";

export async function GET() {
  // just trigger init
  initWebSocket(globalThis as any);

  return NextResponse.json({ ok: true });
}