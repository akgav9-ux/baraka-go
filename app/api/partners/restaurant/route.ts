import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const requests = await prisma.partnerRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(requests);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const request = await prisma.partnerRequest.create({
      data: {
        name: body.name,
        phone: body.phone,
        email: body.email,
        password: body.password,
        restaurantName: body.restaurantName,
        restaurantCategory: body.restaurantCategory,
        address: body.address,
        description: body.description,
        website: body.website,
        instagram: body.instagram,
        status: "pending",
      },
    });
    
    return NextResponse.json(request, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}

// PUT метод для обновления статуса и создания ресторана
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;
    
    // Обновляем статус заявки
    const request = await prisma.partnerRequest.update({
      where: { id: Number(id) },
      data: { status },
    });
    
    // Если заявка одобрена - создаем ресторан в таблице Restaurant
    if (status === "approved") {
      // Проверяем, не существует ли уже такой ресторан
      let restaurant = await prisma.restaurant.findFirst({
        where: { name: request.restaurantName }
      });
      
      if (!restaurant) {
        // Создаем ресторан с данными из заявки
        restaurant = await prisma.restaurant.create({
          data: {
            name: request.restaurantName,
            category: request.restaurantCategory,
            description: request.description || "Restoran haqida ma'lumot",
            image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
            rating: 4.5,
            deliveryTime: "30-45 мин",
            minOrder: 50000,
            deliveryFee: 10000,
            price: 0,
            isOpen: true,
          },
        });
        
        // Сохраняем restaurantId в заявке
        await prisma.partnerRequest.update({
          where: { id: Number(id) },
          data: { restaurantId: restaurant.id },
        });
        
        console.log("✅ Ресторан создан с ID:", restaurant.id);
      } else {
        console.log("ℹ️ Ресторан уже существует с ID:", restaurant.id);
      }
    }
    
    return NextResponse.json(request);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}