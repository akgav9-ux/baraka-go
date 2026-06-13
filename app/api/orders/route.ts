import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const type = searchParams.get("type");
  
  const where: any = {};
  if (status) where.status = status;
  if (type) where.packageType = type;
  
  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  
  console.log("📦 GET /api/orders - type:", type, "found:", orders.length);
  
  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    console.log("📝 POST /api/orders - body:", body);

    // Сохраняем дополнительные данные в extraData
    const extraData = {
      passengers: body.passengers || 1,
      stop: body.stop || null,
    };

    const order = await prisma.order.create({
      data: {
        from: body.from,
        to: body.to,
        price: Number(body.price) || 0,
        status: "pending",
        packageType: body.packageType || "intercity", // ВАЖНО!
        weight: body.weight || 0,
        urgent: body.urgent || false,
        payment: body.payment || "cash",
        comment: body.comment || "",
        changeAmount: body.changeAmount ? Number(body.changeAmount) : null,
        extraData: JSON.stringify(extraData),
      },
    });

    console.log("✅ Заказ создан:", order.id, "packageType:", order.packageType);

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("❌ Ошибка создания заказа:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, status, courierId } = body;

    const order = await prisma.order.update({
      where: { id: Number(id) },
      data: { 
        status,
        courierId: courierId ? Number(courierId) : null,
        acceptedAt: status === "accepted" ? new Date() : null,
      },
    });

    console.log("🔄 Заказ обновлен:", order.id, "status:", order.status);

    return NextResponse.json(order);
  } catch (error) {
    console.error("❌ Ошибка обновления заказа:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}