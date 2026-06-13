export interface Restaurant {
  id: number;
  name: string;
  category: string;
  description?: string;
  image: string;
  rating: number;
  deliveryTime: string;
  minOrder: number;
  deliveryFee: number;
  isOpen: boolean;
  badges?: string[];
}

export interface Dish {
  id: number;
  name: string;
  description?: string;
  price: number;
  image: string;
  category: string;
  restaurantId: number;
}

export async function getRestaurants(category?: string): Promise<Restaurant[]> {
  const url = category && category !== "Barchasi" 
    ? `/api/restaurants?category=${encodeURIComponent(category)}`
    : "/api/restaurants";
    
  const res = await fetch(url);
  if (!res.ok) throw new Error("Ошибка загрузки");
  return res.json();
}

export async function getRestaurant(id: number): Promise<Restaurant & { dishes: Dish[] }> {
  const res = await fetch(`/api/restaurants/${id}`);
  if (!res.ok) throw new Error("Ошибка загрузки");
  return res.json();
}

export async function createFoodOrder(orderData: any) {
  const res = await fetch("/api/food-orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error("Ошибка создания заказа");
  return res.json();
}