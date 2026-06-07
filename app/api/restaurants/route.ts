import { NextResponse } from "next/server";

// Определяем тип для ресторана
interface Restaurant {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  description?: string;
}

// Пока моки. Когда подключишь Prisma — замени на запрос к базе
const MOCK: Restaurant[] = [];  // пустой массив с явным типом

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  let data: Restaurant[] = MOCK;  // <-- добавили тип для data
  
  if (category && category !== "Все") {
    data = data.filter((r: Restaurant) => r.category === category);
  }
  
  return NextResponse.json(data);
}