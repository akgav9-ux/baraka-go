import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";
import { writeFile } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

// GET - получить блюда
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const restaurantId = searchParams.get("restaurantId");
  
  try {
    const dishes = await prisma.dish.findMany({
      where: restaurantId ? { restaurantId: Number(restaurantId) } : {},
      orderBy: { category: "asc" },
    });
    return NextResponse.json(dishes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}

// POST - добавить блюдо
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const category = formData.get("category") as string;
    let restaurantId = Number(formData.get("restaurantId"));
    const imageFile = formData.get("image") as File;
    
    // ПРОВЕРКА: существует ли ресторан
    let restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId }
    });
    
    // Если ресторан не существует, создаем его
    if (!restaurant) {
      console.log(`Restaurant with id ${restaurantId} not found, creating new...`);
      
      restaurant = await prisma.restaurant.create({
        data: {
          name: "Restoran",
          category: "Pizza",
          description: "Restoran haqida ma'lumot",
          image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
          rating: 4.5,
          deliveryTime: "30-45 мин",
          minOrder: 50000,
          deliveryFee: 10000,
          price: 0,
          isOpen: true,
        },
      });
      
      console.log(`Created new restaurant with id: ${restaurant.id}`);
      restaurantId = restaurant.id;
    }
    
    let imageUrl = "";
    
    // Если есть файл, сохраняем его
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const filename = `${Date.now()}-${imageFile.name}`;
      const uploadDir = path.join(process.cwd(), "public/uploads");
      
      const fs = require("fs");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      const filepath = path.join(uploadDir, filename);
      await writeFile(filepath, buffer);
      imageUrl = `/uploads/${filename}`;
    }
    
    const dish = await prisma.dish.create({
      data: {
        name,
        description: description || "",
        price,
        image: imageUrl || "",
        category,
        restaurantId,
        isAvailable: true,
      },
    });
    
    return NextResponse.json(dish, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка создания блюда" }, { status: 500 });
  }
}

// PUT - обновить блюдо
export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const id = Number(formData.get("id"));
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const category = formData.get("category") as string;
    const imageFile = formData.get("image") as File;
    const existingImage = formData.get("existingImage") as string;
    
    let imageUrl = existingImage || "";
    
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const filename = `${Date.now()}-${imageFile.name}`;
      const uploadDir = path.join(process.cwd(), "public/uploads");
      
      const fs = require("fs");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      const filepath = path.join(uploadDir, filename);
      await writeFile(filepath, buffer);
      imageUrl = `/uploads/${filename}`;
    }
    
    const dish = await prisma.dish.update({
      where: { id },
      data: {
        name,
        description: description || "",
        price,
        image: imageUrl,
        category,
      },
    });
    
    return NextResponse.json(dish);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка обновления блюда" }, { status: 500 });
  }
}

// DELETE - удалить блюдо
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  
  try {
    await prisma.dish.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка удаления" }, { status: 500 });
  }
}