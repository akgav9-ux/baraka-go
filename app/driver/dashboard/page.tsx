"use client";

import { useState } from "react";

export default function DriverDashboard() {
  const [online, setOnline] = useState(false);

  const [balance] = useState(125000);
  const [orders] = useState(24);
  const [rating] = useState(4.9);

  return (
    <main className="min-h-screen bg-gray-100 p-4">

      <div className="max-w-md mx-auto space-y-4">

        {/* HEADER */}
        <div className="bg-white rounded-3xl p-5 shadow">

          <h1 className="text-2xl font-bold">
            🚗 Driver Dashboard
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Baraka Go kuryer paneli
          </p>

          {/* ONLINE STATUS */}
          <div className="mt-4 flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Holat
              </p>

              <p className={`font-bold ${
                online ? "text-green-600" : "text-red-500"
              }`}>
                {online ? "🟢 Online" : "🔴 Offline"}
              </p>
            </div>

            <button
              onClick={() => setOnline(!online)}
              className={`px-4 py-2 rounded-xl font-bold text-white ${
                online ? "bg-red-500" : "bg-green-600"
              }`}
            >
              {online ? "Chiqish" : "Online chiqish"}
            </button>

          </div>

        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-3">

          <div className="bg-white rounded-2xl p-3 text-center shadow">
            <p className="text-xs text-gray-500">Balans</p>
            <p className="font-bold text-green-600">
              {balance.toLocaleString()} so'm
            </p>
          </div>

          <div className="bg-white rounded-2xl p-3 text-center shadow">
            <p className="text-xs text-gray-500">Buyurtma</p>
            <p className="font-bold">{orders}</p>
          </div>

          <div className="bg-white rounded-2xl p-3 text-center shadow">
            <p className="text-xs text-gray-500">Reyting</p>
            <p className="font-bold">⭐ {rating}</p>
          </div>

        </div>

        {/* ACTIONS */}
        <div className="bg-white rounded-3xl p-5 shadow space-y-3">

          <button className="w-full bg-green-600 text-white py-3 rounded-xl font-bold">
            📦 Yangi buyurtmalar
          </button>

          <button className="w-full bg-gray-100 py-3 rounded-xl font-bold">
            🚚 Faol buyurtma
          </button>

          <button className="w-full bg-gray-100 py-3 rounded-xl font-bold">
            📜 Tarix
          </button>

          <button className="w-full bg-gray-100 py-3 rounded-xl font-bold">
            👤 Profil
          </button>

        </div>

      </div>

    </main>
  );
}