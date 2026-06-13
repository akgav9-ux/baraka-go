import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = parseInt(id, 10);

    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: "Noto'g'ri buyurtma ID" },
        { status: 400 }
      );
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: "Buyurtma topilmadi" },
        { status: 404 }
      );
    }

    if (existingOrder.status !== "pending") {
      return NextResponse.json(
        { error: "Buyurtma allaqachon qabul qilingan yoki bekor qilingan" },
        { status: 409 }
      );
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "accepted",
        courierName: "Ali",
        acceptedAt: new Date(),
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error accepting order:", error);
    return NextResponse.json(
      { error: "Server xatoligi" },
      { status: 500 }
    );
  }
}