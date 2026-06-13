"use client";

import { useEffect, useState } from "react";

type Order = {
  id: number;
  from: string;
  to: string;
  price: number;
  status: "pending" | "accepted" | "done";
  courierName?: string;
  createdAt: string;
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔥 LOAD FROM BACKEND (Prisma API)
  const loadOrders = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/orders", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("API ERROR:", data);
        setOrders([]);
        return;
      }

      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();

    // 🔥 REALTIME UPDATE (simple polling now)
    const interval = setInterval(() => {
      loadOrders();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusUI = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "🟡 Qidirilmoqda (Uber style)";
      case "accepted":
        return "🟢 Kuryer topildi";
      case "done":
        return "🔵 Yakunlandi";
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">📦 Mening buyurtmalarim</h1>

        <button
          onClick={loadOrders}
          className="bg-white px-3 py-1 rounded-xl shadow text-sm"
        >
          🔄 Yangilash
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="bg-white p-4 rounded-xl">
          Yuklanmoqda...
        </div>
      )}

      {/* EMPTY */}
      {!loading && orders.length === 0 && (
        <div className="bg-white p-4 rounded-xl">
          Hali buyurtma yo‘q
        </div>
      )}

      {/* LIST */}
      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="bg-white p-4 rounded-xl shadow">

            {/* ROUTE */}
            <p className="font-bold">
              📍 {order.from} → {order.to}
            </p>

            {/* PRICE */}
            <p className="text-green-600 font-bold">
              💰 {order.price} so‘m
            </p>

            {/* STATUS */}
            <p className="text-sm mt-1">
              {getStatusUI(order.status)}
            </p>

            {/* COURIER INFO */}
            {order.status === "accepted" && (
              <div className="mt-2 bg-green-50 border border-green-200 p-2 rounded-xl">
                <p className="text-sm font-semibold text-green-700">
                  🚗 Kuryer: {order.courierName || "Tez orada"}
                </p>
              </div>
            )}

            {/* TIME */}
            <p className="text-xs text-gray-400 mt-2">
              Yaratildi: {new Date(order.createdAt).toLocaleString()}
            </p>

          </div>
        ))}
      </div>
    </main>
  );
}