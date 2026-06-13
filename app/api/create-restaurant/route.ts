import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const restaurants = await prisma.restaurant.findMany();
    
    if (restaurants.length === 0) {
      const restaurant = await prisma.restaurant.create({
        data: {
          name: "My Restaurant",
          category: "Pizza",
          description: "Delicious food",
          image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
          rating: 4.5,
          deliveryTime: "30-45 мин",
          minOrder: 50000,
          deliveryFee: 10000,
          price: 0,
          isOpen: true,
        },
      });
      return NextResponse.json({ message: "Restaurant created", id: restaurant.id });
    } else {
      return NextResponse.json({ 
        message: "Restaurants already exist", 
        restaurants: restaurants.map(r => ({ id: r.id, name: r.name }))
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}