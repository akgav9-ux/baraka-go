"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DriverSidebar from "@/components/driver/DriverSidebar";

type Order = {
  id: number;
  from: string;
  to: string;
  fromCoords: [number, number];
  toCoords: [number, number];
  price: number;
  distance: string;
  status: "new" | "accepted" | "finished";
};

export default function DriverPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      from: "Chilonzor",
      to: "Toshkent Markaz",
      fromCoords: [41.2995, 69.2401],
      toCoords: [41.3123, 69.2787],
      price: 25000,
      distance: "8 km",
      status: "new",
    },
    {
      id: 2,
      from: "Yunusobod",
      to: "Chorsu",
      fromCoords: [41.3659, 69.2860],
      toCoords: [41.3292, 69.2401],
      price: 30000,
      distance: "12 km",
      status: "new",
    },
  ]);

  const acceptOrder = (id: number) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status: "accepted" } : o
      )
    );

    // 🚀 переход в навигатор страницу
    router.push(`/driver/order/${id}`);
  };

  const finishOrder = (id: number) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status: "finished" } : o
      )
    );
  };

  return (
    <main className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <header className="bg-black text-white px-4 py-3 flex justify-between">
        <h1 className="font-bold text-lg">🚕 Driver Mode</h1>

        <button onClick={() => setOpen(true)}>
          ☰
        </button>
      </header>

      {/* ORDERS */}
      <div className="p-4 space-y-4">

        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white p-4 rounded-xl shadow"
          >
            <p className="font-bold">
              📍 {order.from} → {order.to}
            </p>

            <p className="text-gray-500 text-sm">
              {order.distance}
            </p>

            <p className="text-green-600 font-bold">
              💰 {order.price} so‘m
            </p>

            <div className="flex gap-2 mt-3">

              {order.status === "new" && (
                <button
                  onClick={() => acceptOrder(order.id)}
                  className="bg-green-600 text-white flex-1 p-2 rounded-xl"
                >
                  Qabul qilish
                </button>
              )}

              {order.status === "accepted" && (
                <button
                  onClick={() => finishOrder(order.id)}
                  className="bg-blue-600 text-white flex-1 p-2 rounded-xl"
                >
                  Tugatish
                </button>
              )}

              {order.status === "finished" && (
                <span className="text-gray-500 font-semibold">
                  ✔ Yakunlandi
                </span>
              )}

            </div>
          </div>
        ))}

      </div>

      {/* SIDEBAR */}
      <DriverSidebar open={open} onClose={() => setOpen(false)} />

    </main>
  );
}