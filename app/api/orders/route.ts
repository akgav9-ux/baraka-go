import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const order = await prisma.order.create({
      data: {
        from: body.from,
        to: body.to,
        price: Number(body.price) || 0,
        status: "pending",
        packageType: body.packageType || "posilka",
        weight: Number(body.weight) || 5,
        urgent: body.urgent || false,
        payment: body.payment || "cash",
        comment: body.comment || "",
        changeAmount: body.changeAmount ? Number(body.changeAmount) : null,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}