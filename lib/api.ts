export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  deliveryTime: string;
  category: string;
  tags: string[];
  badges: ("discount" | "freeDelivery")[];
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category: string;
}

/* ===================== МОКИ (пока без базы) ===================== */
const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: "1", name: "Вкусно — и точка",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&auto=format&fit=crop&q=60",
    rating: 4.3, reviews: 200, deliveryTime: "25–35 мин",
    category: "Бургеры", tags: ["Бургеры", "Фастфуд"], badges: ["freeDelivery"],
  },
  {
    id: "2", name: "ROSTIC'S",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=60",
    rating: 4.3, reviews: 2000, deliveryTime: "25–35 мин",
    category: "Бургеры", tags: ["Курица", "Бургеры"], badges: [],
  },
  {
    id: "3", name: "Грант",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=60",
    rating: 4.9, reviews: 2400, deliveryTime: "40–50 мин",
    category: "Азиатская", tags: ["Европейская", "Коктейли"], badges: ["discount"],
  },
  {
    id: "4", name: "Фаст Фуд Ямка",
    image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=500&auto=format&fit=crop&q=60",
    rating: 4.3, reviews: 2000, deliveryTime: "25–35 мин",
    category: "Бургеры", tags: ["Бургеры", "Фастфуд"], badges: ["discount"],
  },
  {
    id: "5", name: "Чисто шаверма",
    image: "https://images.unsplash.com/photo-1561651823-34a0658ebc9d?w=500&auto=format&fit=crop&q=60",
    rating: 4.5, reviews: 1000, deliveryTime: "25–35 мин",
    category: "Сэндвичи", tags: ["Шаверма", "Восточная"], badges: ["discount"],
  },
  {
    id: "6", name: "Пышки Кофе",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=60",
    rating: 4.5, reviews: 52, deliveryTime: "25–35 мин",
    category: "Выпечка", tags: ["Кофе", "Выпечка"], badges: ["discount"],
  },
  {
    id: "7", name: "Burger King",
    image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=500&auto=format&fit=crop&q=60",
    rating: 4.4, reviews: 2500, deliveryTime: "25–35 мин",
    category: "Бургеры", tags: ["Бургеры", "Фастфуд"], badges: [],
  },
  {
    id: "8", name: "Центр Пиццы",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60",
    rating: 4.8, reviews: 1800, deliveryTime: "40–55 мин",
    category: "Пицца", tags: ["Пицца", "Итальянская"], badges: [],
  },
  {
    id: "9", name: "Sushi Boom",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&auto=format&fit=crop&q=60",
    rating: 4.6, reviews: 890, deliveryTime: "50–60 мин",
    category: "Суши", tags: ["Суши", "Роллы"], badges: ["freeDelivery"],
  },
];

const MOCK_MENU: Record<string, MenuItem[]> = {
  "1": [
    { id: "m1", name: "Биг Спешиал", description: "Сочная говядина, сыр, салат", price: 25900, category: "Бургеры", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300" },
    { id: "m2", name: "Картофель фри", description: "Классический фри", price: 9900, category: "Закуски" },
    { id: "m3", name: "Кола 0.5", price: 12900, category: "Напитки" },
  ],
  "2": [
    { id: "m4", name: "Острые крылышки", description: "10 штук", price: 34900, category: "Курица", image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=300" },
  ],
  "3": [
    { id: "m5", name: "Стейк Рибай", description: "С соусом демиглас", price: 129000, category: "Основное", image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=300" },
    { id: "m6", name: "Мохито", price: 45000, category: "Бар" },
  ],
};

export async function getRestaurants(category?: string): Promise<Restaurant[]> {
  await new Promise((r) => setTimeout(r, 300));
  if (!category || category === "Все") return MOCK_RESTAURANTS;
  return MOCK_RESTAURANTS.filter((r) => r.category === category);
}

export async function getRestaurant(id: string): Promise<Restaurant & { menuItems: MenuItem[] }> {
  await new Promise((r) => setTimeout(r, 300));
  const r = MOCK_RESTAURANTS.find((x) => x.id === id);
  if (!r) throw new Error("Not found");
  return { ...r, menuItems: MOCK_MENU[id] || [] };
}