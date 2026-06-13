"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getRestaurant, Restaurant, Dish } from "@/lib/api";

export default function RestaurantPage() {
  const { id } = useParams();
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      loadRestaurant();
    }
    // Загружаем корзину из localStorage
    const savedCart = localStorage.getItem("foodCart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, [id]);

  const loadRestaurant = async () => {
    try {
      const data = await getRestaurant(Number(id));
      setRestaurant(data);
      setDishes(data.dishes || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (dish: Dish) => {
    const existingItem = cart.find(item => item.id === dish.id);
    let newCart;
    
    if (existingItem) {
      newCart = cart.map(item =>
        item.id === dish.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...cart, { ...dish, quantity: 1 }];
    }
    
    setCart(newCart);
    localStorage.setItem("foodCart", JSON.stringify(newCart));
    alert(`✅ ${dish.name} добавлен в корзину`);
  };

  const getCartCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">Загрузка...</div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">Ресторан не найден</div>
      </div>
    );
  }

  // Группируем блюда по категориям
  const groupedDishes = dishes.reduce((acc, dish) => {
    const category = dish.category || "Другое";
    if (!acc[category]) acc[category] = [];
    acc[category].push(dish);
    return acc;
  }, {} as Record<string, Dish[]>);

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100">
            ←
          </button>
          <h1 className="font-bold text-lg">{restaurant.name}</h1>
          <button 
            onClick={() => router.push("/food/cart")}
            className="relative p-2 rounded-full hover:bg-gray-100"
          >
            🛒
            {getCartCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getCartCount()}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Restaurant Info */}
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

      {/* Menu */}
      <div className="p-4 space-y-6">
        {Object.entries(groupedDishes).map(([category, categoryDishes]) => (
          <div key={category}>
            <h3 className="font-bold text-lg mb-3">{category}</h3>
            <div className="space-y-3">
              {categoryDishes.map((dish) => (
                <div key={dish.id} className="bg-white rounded-xl p-3 shadow-sm flex gap-3">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-semibold">{dish.name}</h4>
                      <span className="font-bold text-orange-600">
                        {dish.price.toLocaleString()} сум
                      </span>
                    </div>
                    {dish.description && (
                      <p className="text-xs text-gray-500 mt-1">{dish.description}</p>
                    )}
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
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-2 flex justify-around">
        <button onClick={() => router.push("/")} className="flex flex-col items-center p-2 text-gray-500">
          <span className="text-xl">🏠</span>
          <span className="text-xs">Главная</span>
        </button>
        <button onClick={() => router.push("/food")} className="flex flex-col items-center p-2 text-orange-500">
          <span className="text-xl">🍕</span>
          <span className="text-xs">Еда</span>
        </button>
        <button onClick={() => router.push("/food/orders")} className="flex flex-col items-center p-2 text-gray-500">
          <span className="text-xl">📋</span>
          <span className="text-xs">Заказы</span>
        </button>
      </div>
    </div>
  );
}