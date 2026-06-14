import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const restaurantRequest = await prisma.partnerRequest.findFirst({
      where: {
        email: email,
        status: "approved",
      },
    });

    if (!restaurantRequest) {
      return NextResponse.json(
        { error: "Email yoki parol noto'g'ri" },
        { status: 401 }
      );
    }

    if (restaurantRequest.password !== password) {
      return NextResponse.json(
        { error: "Email yoki parol noto'g'ri" },
        { status: 401 }
      );
    }

    // ВАЖНО: возвращаем restaurantId
    return NextResponse.json({
      id: restaurantRequest.id,
      restaurantId: restaurantRequest.restaurantId, // ЭТО КЛЮЧЕВОЕ ПОЛЕ
      name: restaurantRequest.name,
      restaurantName: restaurantRequest.restaurantName,
      email: restaurantRequest.email,
      phone: restaurantRequest.phone,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}