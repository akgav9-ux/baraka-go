import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const orderNumber = `FOOD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    const order = await prisma.foodOrder.create({
      data: {
        orderNumber,
        restaurantId: body.restaurantId,
        items: JSON.stringify(body.items),
        totalPrice: body.totalPrice,
        deliveryFee: body.deliveryFee,
        finalPrice: body.finalPrice,
        address: body.address,
        clientName: body.clientName,
        clientPhone: body.clientPhone,
        comment: body.comment,
        payment: body.payment,
      },
    });
    
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clientPhone = searchParams.get("clientPhone");
  
  try {
    const orders = await prisma.foodOrder.findMany({
      where: clientPhone ? { clientPhone } : {},
      orderBy: { createdAt: "desc" },
      include: { restaurant: true },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}