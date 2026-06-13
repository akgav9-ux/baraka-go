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

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "delivered",
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error completing delivery:", error);
    return NextResponse.json(
      { error: "Server xatoligi" },
      { status: 500 }
    );
  }
}