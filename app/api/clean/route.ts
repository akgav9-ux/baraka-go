import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Удаляем все заявки ресторанов
    await prisma.partnerRequest.deleteMany({});
    
    // Удаляем все блюда
    await prisma.dish.deleteMany({});
    
    // Удаляем все заказы еды
    await prisma.foodOrder.deleteMany({});
    
    return NextResponse.json({ 
      success: true, 
      message: "✅ Все данные ресторанов очищены! Теперь зарегистрируйтесь заново." 
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка при очистке" }, { status: 500 });
  }
}