"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RestaurantCard } from "@/components/RestaurantCard";

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

const CATEGORIES = [
  "Barchasi",
  "Fast Food",
  "Sushi",
  "Pizza",
  "Pishiriqlar",
  "Milliy taomlari",
  "Sog‘lom taom",
];

export default function FoodPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("Barchasi");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, [activeCategory]);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const url = activeCategory !== "Barchasi" 
        ? `/api/food-restaurants?category=${encodeURIComponent(activeCategory)}`
        : "/api/food-restaurants";
      
      const res = await fetch(url);
      const data = await res.json();
      setRestaurants(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const freeDelivery = restaurants.filter(r => r.deliveryFee === 0);
  const discount = restaurants.filter(r => r.rating >= 4.7);

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <header className="sticky top-0 z-20 bg-white border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100">←</button>
          <h1 className="font-bold text-lg text-black">Ovqat</h1>
          <div className="w-10" />
        </div>
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
                activeCategory === cat ? "bg-black text-white" : "bg-gray-100 text-black"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <div className="px-4 mt-4 space-y-6">
        {freeDelivery.length > 0 && (
          <section>
            <h2 className="font-bold text-lg mb-2">Bepul yetkazib berish</h2>
            <div className="flex gap-3 overflow-x-auto">
              {freeDelivery.map((r) => (
                <RestaurantCard key={r.id} {...r} horizontal />
              ))}
            </div>
          </section>
        )}

        {discount.length > 0 && (
          <section>
            <h2 className="font-bold text-lg mb-2">Chegirmalar</h2>
            <div className="flex gap-3 overflow-x-auto">
              {discount.map((r) => (
                <RestaurantCard key={r.id} {...r} horizontal />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="font-bold text-lg mb-2">Restoranlar</h2>
          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              {[1,2,3,4].map(i => <div key={i} className="h-40 bg-gray-200 rounded-xl animate-pulse" />)}
            </div>
          ) : restaurants.length === 0 ? (
            <p className="text-center text-gray-500 py-10">Hech narsa topilmadi</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {restaurants.map((r) => (
                <RestaurantCard key={r.id} {...r} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}