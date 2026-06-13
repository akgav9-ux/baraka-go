import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: Number(id) },
      include: { dishes: true },
    });
    
    if (!restaurant) {
      return NextResponse.json({ error: "Не найдено" }, { status: 404 });
    }
    
    return NextResponse.json(restaurant);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}