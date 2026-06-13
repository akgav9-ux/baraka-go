import { PrismaClient } from "../lib/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Добавляем рестораны...");

  // Добавляем рестораны
  const restaurants = await prisma.restaurant.createMany({
    data: [
      {
        name: "Pizza House",
        category: "Pizza",
        description: "Вкуснейшая пицца на тонком тесте. Свежие ингредиенты, быстрая доставка.",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
        rating: 4.8,
        deliveryTime: "30-45 мин",
        minOrder: 50000,
        deliveryFee: 10000,
        price: 35000,
        isOpen: true,
      },
      {
        name: "Sushi Master",
        category: "Sushi",
        description: "Свежие роллы и суши. Только натуральные ингредиенты.",
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400",
        rating: 4.9,
        deliveryTime: "35-50 мин",
        minOrder: 60000,
        deliveryFee: 12000,
        price: 45000,
        isOpen: true,
      },
      {
        name: "Burger King",
        category: "Burgerlar",
        description: "Сочные бургеры, картофель фри и напитки.",
        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400",
        rating: 4.5,
        deliveryTime: "20-30 мин",
        minOrder: 30000,
        deliveryFee: 5000,
        price: 25000,
        isOpen: true,
      },
      {
        name: "Samarkand Taomlari",
        category: "Osiyo taomlari",
        description: "Традиционная узбекская кухня. Плов, самса, шашлык.",
        image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400",
        rating: 4.7,
        deliveryTime: "40-60 мин",
        minOrder: 40000,
        deliveryFee: 8000,
        price: 30000,
        isOpen: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log(`✅ Добавлено ${restaurants.count} ресторанов`);

  // Получаем ID ресторанов
  const allRestaurants = await prisma.restaurant.findMany();
  
  // Добавляем блюда
  for (const restaurant of allRestaurants) {
    if (restaurant.name === "Pizza House") {
      await prisma.dish.createMany({
        data: [
          { name: "Маргарита", description: "Томатный соус, моцарелла, базилик", price: 45000, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200", category: "Пицца", restaurantId: restaurant.id },
          { name: "Пепперони", description: "Пицца с пепперони и моцареллой", price: 55000, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=200", category: "Пицца", restaurantId: restaurant.id },
          { name: "Четыре сыра", description: "Смесь четырех сыров", price: 60000, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200", category: "Пицца", restaurantId: restaurant.id },
        ],
      });
    } else if (restaurant.name === "Sushi Master") {
      await prisma.dish.createMany({
        data: [
          { name: "Филадельфия", description: "Лосось, сливочный сыр, огурец", price: 55000, image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200", category: "Роллы", restaurantId: restaurant.id },
          { name: "Калифорния", description: "Краб, авокадо, огурец", price: 50000, image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=200", category: "Роллы", restaurantId: restaurant.id },
        ],
      });
    } else if (restaurant.name === "Burger King") {
      await prisma.dish.createMany({
        data: [
          { name: "Воппер", description: "Классический бургер", price: 25000, image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200", category: "Бургеры", restaurantId: restaurant.id },
          { name: "Картофель фри", description: "Хрустящий картофель", price: 8000, image: "https://images.unsplash.com/photo-1630384060421-cf20b0d0641d?w=200", category: "Закуски", restaurantId: restaurant.id },
        ],
      });
    } else if (restaurant.name === "Samarkand Taomlari") {
      await prisma.dish.createMany({
        data: [
          { name: "Плов", description: "Узбекский плов", price: 35000, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200", category: "Горячее", restaurantId: restaurant.id },
          { name: "Самса", description: "Сочная самса", price: 8000, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200", category: "Выпечка", restaurantId: restaurant.id },
        ],
      });
    }
  }

  console.log("✅ Блюда добавлены!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());