import { NextResponse } from "next/server";

const MOCK = [ /* скопируй MOCK_RESTAURANTS + menuItems если нужно */ ];

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const r = MOCK.find((x: any) => x.id === params.id);
  if (!r) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(r);
}