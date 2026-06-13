"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
}

interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  restaurantId: number;
}

export default function AdminFoodPage() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [showAddRestaurant, setShowAddRestaurant] = useState(false);
  const [showDishModal, setShowDishModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [restaurantForm, setRestaurantForm] = useState({
    name: "",
    category: "",
    description: "",
    image: "",
    deliveryTime: "30-45 мин",
    minOrder: 50000,
    deliveryFee: 10000,
  });

  const [dishForm, setDishForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "Горячее",
  });

  const dishCategories = ["Горячее", "Салаты", "Закуски", "Супы", "Пицца", "Бургеры", "Роллы", "Напитки", "Десерты"];

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      const res = await fetch("/api/restaurants");
      const data = await res.json();
      setRestaurants(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadDishes = async (restaurantId: number) => {
    try {
      const res = await fetch(`/api/dishes?restaurantId=${restaurantId}`);
      const data = await res.json();
      setDishes(data);
    } catch (error) {
      console.error(error);
    }
  };

  const addRestaurant = async () => {
    try {
      const res = await fetch("/api/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...restaurantForm, rating: 4.5, isOpen: true }),
      });
      if (res.ok) {
        alert("✅ Restoran qo'shildi!");
        setShowAddRestaurant(false);
        loadRestaurants();
        setRestaurantForm({
          name: "", category: "", description: "", image: "", deliveryTime: "30-45 мин", minOrder: 50000, deliveryFee: 10000,
        });
      }
    } catch (error) {
      alert("❌ Xatolik");
    }
  };

  const addDish = async () => {
    if (!selectedRestaurant) return;
    try {
      const res = await fetch("/api/dishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...dishForm,
          price: Number(dishForm.price),
          restaurantId: selectedRestaurant.id,
        }),
      });
      if (res.ok) {
        alert("✅ Taom qo'shildi!");
        setShowDishModal(false);
        loadDishes(selectedRestaurant.id);
        setDishForm({ name: "", description: "", price: "", image: "", category: "Горячее" });
      }
    } catch (error) {
      alert("❌ Xatolik");
    }
  };

  const deleteDish = async (id: number) => {
    if (confirm("Taomni o'chirish?")) {
      try {
        await fetch(`/api/dishes?id=${id}`, { method: "DELETE" });
        loadDishes(selectedRestaurant!.id);
      } catch (error) {
        alert("❌ Xatolik");
      }
    }
  };

  const toggleRestaurantStatus = async (id: number, isOpen: boolean) => {
    try {
      await fetch("/api/restaurants", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isOpen: !isOpen }),
      });
      loadRestaurants();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">⏳ Yuklanmoqda...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">🍕 Restoranlar va menyu</h1>
            <p className="text-xs opacity-80">Restoranlar va taomlarni boshqarish</p>
          </div>
          <button
            onClick={() => router.push("/admin")}
            className="bg-white/20 px-4 py-2 rounded-xl text-sm"
          >
            ← Asosiy panelga
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-72px)]">
        {/* Chap panel - Restoranlar ro'yxati */}
        <div className="w-80 bg-white border-r overflow-y-auto">
          <div className="p-4 border-b">
            <button
              onClick={() => setShowAddRestaurant(true)}
              className="w-full bg-orange-500 text-white py-2 rounded-xl font-semibold"
            >
              + Yangi restoran
            </button>
          </div>
          <div className="p-2 space-y-2">
            {restaurants.map((restaurant) => (
              <button
                key={restaurant.id}
                onClick={() => {
                  setSelectedRestaurant(restaurant);
                  loadDishes(restaurant.id);
                }}
                className={`w-full text-left p-3 rounded-xl transition ${
                  selectedRestaurant?.id === restaurant.id
                    ? "bg-orange-100 border-orange-500 border"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <img src={restaurant.image} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1">
                    <div className="font-semibold">{restaurant.name}</div>
                    <div className="text-xs text-gray-500">{restaurant.category}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs">⭐ {restaurant.rating}</span>
                      <span className="text-xs text-green-600">
                        {restaurant.isOpen ? "🟢 Ochilgan" : "🔴 Yopilgan"}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRestaurantStatus(restaurant.id, restaurant.isOpen);
                    }}
                    className="text-sm"
                  >
                    {restaurant.isOpen ? "🔴" : "🟢"}
                  </button>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* O'ng panel - Menyu */}
        <div className="flex-1 overflow-y-auto p-4">
          {selectedRestaurant ? (
            <>
              <div className="bg-white rounded-xl p-4 shadow mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedRestaurant.name}</h2>
                    <p className="text-gray-500 text-sm">{selectedRestaurant.category}</p>
                    <p className="text-sm mt-2">{selectedRestaurant.description}</p>
                    <div className="flex gap-3 mt-2 text-sm text-gray-500">
                      <span>⏱️ {selectedRestaurant.deliveryTime}</span>
                      <span>💰 {selectedRestaurant.minOrder.toLocaleString()} сум</span>
                      <span>🚚 {selectedRestaurant.deliveryFee.toLocaleString()} сум</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDishModal(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold"
                  >
                    + Yangi taom
                  </button>
                </div>
              </div>

              {/* Taomlar kategoriyalar bo'yicha */}
              {(() => {
                const grouped = dishes.reduce((acc, dish) => {
                  const cat = dish.category || "Boshqa";
                  if (!acc[cat]) acc[cat] = [];
                  acc[cat].push(dish);
                  return acc;
                }, {} as Record<string, Dish[]>);

                return Object.entries(grouped).map(([category, categoryDishes]) => (
                  <div key={category} className="mb-6">
                    <h3 className="font-bold text-lg mb-3">{category}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {categoryDishes.map((dish) => (
                        <div key={dish.id} className="bg-white rounded-xl shadow overflow-hidden">
                          <img src={dish.image} className="w-full h-32 object-cover" />
                          <div className="p-3">
                            <div className="flex justify-between">
                              <h4 className="font-semibold">{dish.name}</h4>
                              <span className="font-bold text-orange-600">
                                {dish.price.toLocaleString()} сум
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{dish.description}</p>
                            <button
                              onClick={() => deleteDish(dish.id)}
                              className="mt-2 text-red-500 text-sm w-full border-t pt-2"
                            >
                              🗑️ O'chirish
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ));
              })()}
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Chapdan restoranni tanlang
            </div>
          )}
        </div>
      </div>

      {/* Модалка добавления ресторана */}
      {showAddRestaurant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">➕ Yangi restoran</h2>
            <div className="space-y-3">
              <input placeholder="Nomi" className="w-full p-2 border rounded-lg" value={restaurantForm.name} onChange={(e) => setRestaurantForm({...restaurantForm, name: e.target.value})} />
              <input placeholder="Kategoriya" className="w-full p-2 border rounded-lg" value={restaurantForm.category} onChange={(e) => setRestaurantForm({...restaurantForm, category: e.target.value})} />
              <textarea placeholder="Tavsif" className="w-full p-2 border rounded-lg" rows={2} value={restaurantForm.description} onChange={(e) => setRestaurantForm({...restaurantForm, description: e.target.value})} />
              <input placeholder="Rasm URL" className="w-full p-2 border rounded-lg" value={restaurantForm.image} onChange={(e) => setRestaurantForm({...restaurantForm, image: e.target.value})} />
              <input placeholder="Yetkazish vaqti" className="w-full p-2 border rounded-lg" value={restaurantForm.deliveryTime} onChange={(e) => setRestaurantForm({...restaurantForm, deliveryTime: e.target.value})} />
              <input placeholder="Minimal buyurtma" type="number" className="w-full p-2 border rounded-lg" value={restaurantForm.minOrder} onChange={(e) => setRestaurantForm({...restaurantForm, minOrder: Number(e.target.value)})} />
              <input placeholder="Yetkazish narxi" type="number" className="w-full p-2 border rounded-lg" value={restaurantForm.deliveryFee} onChange={(e) => setRestaurantForm({...restaurantForm, deliveryFee: Number(e.target.value)})} />
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={addRestaurant} className="flex-1 bg-green-600 text-white py-2 rounded-lg">Qo'shish</button>
              <button onClick={() => setShowAddRestaurant(false)} className="flex-1 bg-gray-300 py-2 rounded-lg">Bekor qilish</button>
            </div>
          </div>
        </div>
      )}

      {/* Модалка добавления таом */}
      {showDishModal && selectedRestaurant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">➕ Yangi taom</h2>
            <div className="space-y-3">
              <input placeholder="Nomi" className="w-full p-2 border rounded-lg" value={dishForm.name} onChange={(e) => setDishForm({...dishForm, name: e.target.value})} />
              <textarea placeholder="Tavsif" className="w-full p-2 border rounded-lg" rows={2} value={dishForm.description} onChange={(e) => setDishForm({...dishForm, description: e.target.value})} />
              <input placeholder="Narxi" type="number" className="w-full p-2 border rounded-lg" value={dishForm.price} onChange={(e) => setDishForm({...dishForm, price: e.target.value})} />
              <input placeholder="Rasm URL" className="w-full p-2 border rounded-lg" value={dishForm.image} onChange={(e) => setDishForm({...dishForm, image: e.target.value})} />
              <select className="w-full p-2 border rounded-lg" value={dishForm.category} onChange={(e) => setDishForm({...dishForm, category: e.target.value})}>
                {dishCategories.map(cat => <option key={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={addDish} className="flex-1 bg-green-600 text-white py-2 rounded-lg">Qo'shish</button>
              <button onClick={() => setShowDishModal(false)} className="flex-1 bg-gray-300 py-2 rounded-lg">Bekor qilish</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}