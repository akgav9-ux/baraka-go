"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RestaurantCard } from "@/components/RestaurantCard";
import { getRestaurants, Restaurant } from "@/lib/api";
import Header from "@/components/Header";

const CATEGORIES = [
  "Barchasi",
  "Sendvichlar",
  "Burgerlar",
  "Sushi",
  "Pizza",
  "Pishiriqlar",
  "Osiyo taomlari",
  "Sog‘lom taom",
];

export default function FoodPage() {
  const router = useRouter();

  const [activeCategory, setActiveCategory] = useState("Barchasi");
  const [items, setItems] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    getRestaurants(activeCategory)
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const freeDelivery = items.filter((r) =>
    r?.badges?.includes("freeDelivery")
  );

  const discount = items.filter((r) =>
    r?.badges?.includes("discount")
  );

  return (
    <main className="min-h-screen bg-gray-50 pb-24">

      {/* HEADER (ОДИН ОБЩИЙ) */}
      <Header />

      {/* CONTENT */}
      <div className="px-4 mt-4 space-y-6">

        <h1 className="font-bold text-lg">Ovqat</h1>

        {/* FREE DELIVERY */}
        {freeDelivery.length > 0 && (
          <section>
            <h2 className="font-bold text-lg mb-2">
              Bepul yetkazib berish
            </h2>

            <div className="flex gap-3 overflow-x-auto">
              {freeDelivery.map((r) => (
                <RestaurantCard key={r.id} {...r} horizontal />
              ))}
            </div>
          </section>
        )}

        {/* DISCOUNT */}
        {discount.length > 0 && (
          <section>
            <h2 className="font-bold text-lg mb-2">
              Chegirmalar
            </h2>

            <div className="flex gap-3 overflow-x-auto">
              {discount.map((r) => (
                <RestaurantCard key={r.id} {...r} horizontal />
              ))}
            </div>
          </section>
        )}

        {/* ALL */}
        <section>
          <h2 className="font-bold text-lg mb-2">
            Restoranlar
          </h2>

          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-40 bg-gray-200 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {items.map((r) => (
                <RestaurantCard key={r.id} {...r} />
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}