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
    ? `/api/food-restaurants?category=${encodeURIComponent(category)}`
    : "/api/food-restaurants";
    
  const res = await fetch(url);
  if (!res.ok) throw new Error("Ошибка загрузки");
  const data = await res.json();
  
  return data.map((r: Restaurant) => ({
    ...r,
    badges: [
      ...(r.deliveryFee === 0 ? ["freeDelivery"] : []),
      ...(r.rating >= 4.7 ? ["discount"] : [])
    ]
  }));
}

export async function getRestaurant(id: number): Promise<Restaurant & { dishes: Dish[] }> {
  const res = await fetch(`/api/food-restaurants/${id}`);
  if (!res.ok) throw new Error("Not found");
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