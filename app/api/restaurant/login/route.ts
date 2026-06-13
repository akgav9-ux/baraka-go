import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    console.log("🔐 Login attempt:", email);

    // Ищем ресторан по email с статусом approved
    const restaurant = await prisma.partnerRequest.findFirst({
      where: {
        email: email,
        status: "approved",
      },
    });

    if (!restaurant) {
      console.log("❌ Restaurant not found or not approved:", email);
      return NextResponse.json(
        { error: "Email yoki parol noto'g'ri yoki arizangiz tasdiqlanmagan" },
        { status: 401 }
      );
    }

    // Проверяем пароль
    if (restaurant.password !== password) {
      console.log("❌ Password wrong for:", email);
      return NextResponse.json(
        { error: "Email yoki parol noto'g'ri" },
        { status: 401 }
      );
    }

    console.log("✅ Login successful:", email);

    return NextResponse.json({
      id: restaurant.id,
      name: restaurant.name,
      restaurantName: restaurant.restaurantName,
      email: restaurant.email,
      phone: restaurant.phone,
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}