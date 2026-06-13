"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface RestaurantCardProps {
  id: number;
  name: string;
  category: string;
  image: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  horizontal?: boolean;
  badges?: string[];
}

export function RestaurantCard({
  id,
  name,
  category,
  image,
  rating,
  deliveryTime,
  deliveryFee,
  minOrder,
  horizontal = false,
  badges = [],
}: RestaurantCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/food/restaurant/${id}`);
  };

  if (horizontal) {
    return (
      <div
        onClick={handleClick}
        className="flex gap-3 bg-white rounded-xl p-2 shadow-sm min-w-[280px] cursor-pointer hover:shadow-md transition"
      >
        <img
          src={image}
          alt={name}
          className="w-20 h-20 rounded-lg object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">{name}</h3>
            <span className="text-xs text-yellow-500">⭐ {rating}</span>
          </div>
          <p className="text-xs text-gray-500">{category}</p>
          <div className="flex gap-2 mt-1 text-xs text-gray-500">
            <span>⏱️ {deliveryTime}</span>
            <span>🚚 {deliveryFee === 0 ? "Бесплатно" : `${deliveryFee.toLocaleString()} сум`}</span>
          </div>
          {badges?.includes("freeDelivery") && (
            <span className="text-xs text-green-600 font-semibold">🚚 Бесплатная доставка</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition"
    >
      <div className="relative h-32">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">
          ⭐ {rating}
        </div>
      </div>
      <div className="p-2">
        <h3 className="font-semibold text-sm truncate">{name}</h3>
        <p className="text-xs text-gray-500 truncate">{category}</p>
        <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
          <span>⏱️ {deliveryTime}</span>
          <span>{deliveryFee === 0 ? "Бесплатно" : `${deliveryFee.toLocaleString()} сум`}</span>
        </div>
        {badges?.includes("freeDelivery") && (
          <span className="text-xs text-green-600">🚚 Бесплатная доставка</span>
        )}
      </div>
    </div>
  );
}