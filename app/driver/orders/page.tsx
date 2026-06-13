"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Order = {
  id: number;
  from: string;
  to: string;
  price: number;
  status: "accepted" | "completed" | "cancelled";
  date: string;
};

export default function DriverOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState<"completed" | "cancelled">("completed");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(data);
  }, []);

  const completed = orders.filter((o) => o.status === "completed");
  const cancelled = orders.filter((o) => o.status === "cancelled");

  const totalIncome = completed.reduce((sum, o) => sum + o.price, 0);

  const list = tab === "completed" ? completed : cancelled;

  return (
    <main className="min-h-screen bg-gray-100 p-4">

      <h1 className="text-xl font-bold mb-4">
        🚕 Taksi buyurtmalar tarixi
      </h1>

      {/* TABS */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab("completed")}
          className={`flex-1 p-2 rounded-xl ${
            tab === "completed" ? "bg-green-600 text-white" : "bg-white"
          }`}
        >
          ✔ Completed
        </button>

        <button
          onClick={() => setTab("cancelled")}
          className={`flex-1 p-2 rounded-xl ${
            tab === "cancelled" ? "bg-red-600 text-white" : "bg-white"
          }`}
        >
          ❌ Cancelled
        </button>
      </div>

      {/* INCOME */}
      <div className="bg-white p-4 rounded-xl mb-4">
        <p className="text-sm text-gray-500">Umumiy daromad</p>
        <p className="text-green-600 font-bold text-xl">
          {totalIncome} so‘m
        </p>
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {list.length === 0 ? (
          <p className="text-gray-500">Hech qanday buyurtma yo‘q</p>
        ) : (
          list.map((o) => (
            <div key={o.id} className="bg-white p-4 rounded-xl">

              <p className="font-bold">
                📍 {o.from} → {o.to}
              </p>

              <p className="text-gray-500 text-sm">{o.date}</p>

              <p className="font-bold text-green-600">
                💰 {o.price} so‘m
              </p>

              <p
                className={
                  o.status === "completed"
                    ? "text-green-600 font-semibold"
                    : "text-red-600 font-semibold"
                }
              >
                {o.status === "completed"
                  ? "✔ Yakunlangan"
                  : "❌ Bekor qilingan"}
              </p>

            </div>
          ))
        )}
      </div>

      <button
        onClick={() => router.push("/driver")}
        className="mt-6 w-full bg-gray-200 p-3 rounded-xl"
      >
        ⬅ Orqaga
      </button>

    </main>
  );
}