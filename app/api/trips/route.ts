import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

// GET - получить все активные рейсы
export async function GET() {
  try {
    const trips = await prisma.trip.findMany({
      where: { status: "active" },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(trips);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}

// POST - создать новый рейс
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const trip = await prisma.trip.create({
      data: {
        from: body.from,
        to: body.to,
        date: body.date,
        time: body.time,
        price: Number(body.price),
        seats: Number(body.seats),
        car: body.car,
        driver: body.driver,
        driverId: body.driverId,
        driverPhone: body.driverPhone,
        rating: body.rating || 4.5,
        comment: body.comment || "",
        status: "active",
      },
    });
    
    return NextResponse.json(trip, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка создания рейса" }, { status: 500 });
  }
}

// PUT - обновить рейс (уменьшить места или закрыть)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, seats, status } = body;
    
    const trip = await prisma.trip.update({
      where: { id: Number(id) },
      data: { 
        seats: seats !== undefined ? Number(seats) : undefined,
        status: status || undefined,
      },
    });
    
    return NextResponse.json(trip);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка обновления рейса" }, { status: 500 });
  }
}