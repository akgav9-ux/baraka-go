import { NextResponse } from "next/server";

// Пока моки. Когда подключишь Prisma — замени на запрос к базе
const MOCK = [ /* скопируй массив MOCK_RESTAURANTS из lib/api.ts сюда если нужен реальный API */ ];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  let data = MOCK;
  if (category && category !== "Все") data = data.filter((r: any) => r.category === category);
  return NextResponse.json(data);
}