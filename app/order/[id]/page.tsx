"use client";

import { useParams, useRouter } from "next/navigation";
import DriverMap from "@/components/driver/DriverMap";

const orders = [
  {
    id: 1,
    from: "Chilonzor",
    to: "Toshkent Markaz",
    fromCoords: [41.2995, 69.2401],
    toCoords: [41.3123, 69.2787],
    price: 25000,
    payment: "Naqd",
    passengers: "1 kishi",
  },
  {
    id: 2,
    from: "Yunusobod",
    to: "Chorsu",
    fromCoords: [41.3659, 69.2860],
    toCoords: [41.3292, 69.2401],
    price: 30000,
    payment: "Karta",
    passengers: "Bolali",
  },
];

export default function DriverOrderPage() {
  const router = useRouter();
  const params = useParams();

  const order = orders.find((o) => o.id === Number(params.id));

  if (!order) {
    return <div className="p-4">Order not found</div>;
  }

  return (
    <main className="min-h-screen flex flex-col bg-gray-100">

      {/* 🔥 MAP TOP */}
      <div className="h-[55vh] w-full">
        <DriverMap
          from={order.fromCoords}
          to={order.toCoords}
        />
      </div>

      {/* 🔻 INFO BOTTOM */}
      <div className="flex-1 bg-white p-4 rounded-t-2xl shadow-xl space-y-3">

        <h2 className="font-bold text-lg">
          📍 {order.from} → {order.to}
        </h2>

        <p className="text-green-600 font-bold">
          💰 {order.price} so‘m
        </p>

        <p>
          💳 To‘lov: {order.payment}
        </p>

        <p>
          👤 Yo‘lovchi: {order.passengers}
        </p>

        {/* BUTTONS */}
        <div className="flex gap-2 mt-4">

          <button className="flex-1 bg-green-600 text-white p-3 rounded-xl">
            🚗 Boshlash
          </button>

          <button
            onClick={() => router.push("/driver")}
            className="flex-1 bg-gray-200 p-3 rounded-xl"
          >
            ⬅ Orqaga
          </button>

        </div>

      </div>

    </main>
  );
}