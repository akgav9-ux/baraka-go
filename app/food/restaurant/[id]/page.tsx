"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface Restaurant {
  id: number;
  name: string;
  category: string;
  description: string;
  image: string;
  rating: number;
  deliveryTime: string;
  minOrder: number;
  deliveryFee: number;
  isOpen: boolean;
  dishes: Dish[];
}

export default function RestaurantPage() {
  const { id } = useParams();
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchRestaurant();
    }
  }, [id]);

  const fetchRestaurant = async () => {
    try {
      const res = await fetch(`/api/food-restaurants/${id}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      setRestaurant(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (dish: Dish) => {
    const savedCart = localStorage.getItem("foodCart");
    const existingCart = savedCart ? JSON.parse(savedCart) : [];
    
    const existingItem = existingCart.find((item: any) => item.id === dish.id);
    let newCart;
    
    if (existingItem) {
      newCart = existingCart.map((item: any) =>
        item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newCart = [...existingCart, { 
        ...dish, 
        quantity: 1,
        restaurantId: restaurant?.id,
        restaurantName: restaurant?.name
      }];
    }
    
    localStorage.setItem("foodCart", JSON.stringify(newCart));
    alert(`✅ ${dish.name} добавлен в корзину`);
    console.log("Корзина:", newCart);
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Загрузка...</div>;
  }

  if (!restaurant) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Ресторан не найден</div>;
  }

  const groupedDishes = (restaurant.dishes || []).reduce((acc, dish) => {
    const category = dish.category || "Другое";
    if (!acc[category]) acc[category] = [];
    acc[category].push(dish);
    return acc;
  }, {} as Record<string, Dish[]>);

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100">←</button>
          <h1 className="font-bold text-lg">{restaurant.name}</h1>
          <button onClick={() => router.push("/food/cart")} className="relative p-2 rounded-full hover:bg-gray-100">🛒</button>
        </div>
      </div>

      <div className="relative h-48">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h2 className="text-white text-2xl font-bold">{restaurant.name}</h2>
          <div className="flex gap-3 text-white text-sm mt-1">
            <span>⭐ {restaurant.rating}</span>
            <span>⏱️ {restaurant.deliveryTime}</span>
            <span>🚚 {restaurant.deliveryFee === 0 ? "Бесплатно" : `${restaurant.deliveryFee.toLocaleString()} сум`}</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {Object.entries(groupedDishes).length === 0 ? (
          <div className="text-center py-10 text-gray-500">Блюда пока нет</div>
        ) : (
          Object.entries(groupedDishes).map(([category, categoryDishes]) => (
            <div key={category}>
              <h3 className="font-bold text-lg mb-3">{category}</h3>
              <div className="space-y-3">
                {categoryDishes.map((dish) => (
                  <div key={dish.id} className="bg-white rounded-xl p-3 shadow-sm flex gap-3">
                    {dish.image && <img src={dish.image} className="w-20 h-20 rounded-lg object-cover" />}
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-semibold">{dish.name}</h4>
                        <span className="font-bold text-orange-600">{dish.price.toLocaleString()} сум</span>
                      </div>
                      {dish.description && <p className="text-xs text-gray-500 mt-1">{dish.description}</p>}
                      <button
                        onClick={() => addToCart(dish)}
                        className="mt-2 bg-orange-500 text-white px-4 py-1.5 rounded-lg text-sm font-semibold"
                      >
                        В корзину
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}