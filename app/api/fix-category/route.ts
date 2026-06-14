import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const restaurant = await prisma.restaurant.update({
      where: { id: 1 },
      data: { category: "Milliy taomlari" }
    });
    return NextResponse.json(restaurant);
  } catch (error) {
    return NextResponse.json({ error: "Ошибка" });
  }
}