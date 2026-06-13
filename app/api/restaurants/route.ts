import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const restaurants = await prisma.restaurant.findMany({
      where: { isOpen: true },
      orderBy: { rating: "desc" },
    });
    return NextResponse.json(restaurants);
  } catch (error) {
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}