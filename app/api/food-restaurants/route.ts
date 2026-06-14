import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  
  try {
    const where: any = { isOpen: true };
    if (category && category !== "Barchasi") {
      where.category = category;
    }
    
    const restaurants = await prisma.restaurant.findMany({
      where,
      orderBy: { rating: "desc" },
    });
    
    return NextResponse.json(restaurants);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}