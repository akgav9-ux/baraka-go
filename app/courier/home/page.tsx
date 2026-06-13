"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Order = {
  id: number;
  from: string;
  to: string;
  price: number;
  status: "pending" | "accepted" | "delivering" | "delivered" | "cancelled";
};

export default function CourierHome() {
  const router = useRouter();

  const [menu, setMenu] = useState(false);
  const [online, setOnline] = useState(false);
  const [dark, setDark] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    earnings: 0,
  });

  const menuRef = useRef<HTMLDivElement | null>(null);

  // Theme
  useEffect(() => {
    const saved = localStorage.getItem("courier_theme");
    if (saved === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("courier_theme", dark ? "dark" : "light");
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
        
        // Find active order (accepted or delivering)
        const active = data.find((o: Order) => o.status === "accepted" || o.status === "delivering");
        setActiveOrder(active || null);
        
        // Calculate stats
        const completed = data.filter((o: Order) => o.status === "delivered").length;
        const earnings = data
          .filter((o: Order) => o.status === "delivered")
          .reduce((sum: number, o: Order) => sum + o.price, 0);
        
        setStats({
          total: data.length,
          completed,
          earnings,
        });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  // Close menu
  useEffect(() => {
    function handleClickOutside(e: any) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "⏳ Kutilmoqda";
      case "accepted": return "🚗 Qabul qilingan";
      case "delivering": return "📦 Yetkazilmoqda";
      case "delivered": return "✅ Yetkazilgan";
      case "cancelled": return "❌ Bekor qilingan";
      default: return status;
    }
  };

  return (
    <main
      className={
        dark
          ? "min-h-screen bg-black text-white"
          : "min-h-screen bg-gray-100 text-black"
      }
    >
      {/* HEADER */}
      <header className="bg-green-700 text-white px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-xs opacity-80">
            {online ? "🟢 Online" : "⚪ Offline"}
          </p>
          <p className="text-sm font-semibold">🚚 Kuryer paneli</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setOnline(!online)}
            className={`px-3 py-1 rounded-xl text-sm font-bold ${
              online ? "bg-green-600" : "bg-gray-700"
            }`}
          >
            {online ? "ON" : "OFF"}
          </button>

          <button
            onClick={() => setDark(!dark)}
            className="text-sm px-2 py-1 rounded bg-gray-800"
          >
            {dark ? "☀️" : "🌙"}
          </button>

          <button onClick={() => setMenu(!menu)} className="text-2xl">
            ☰
          </button>
        </div>
      </header>

      {/* CONTENT */}
      <div className="p-4 space-y-4">
        {/* Active Order Banner */}
        {activeOrder && (
          <div className="bg-blue-500 text-white p-4 rounded-2xl">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs opacity-80">Faol buyurtma</p>
                <p className="font-bold">#{activeOrder.id}</p>
                <p className="text-sm mt-1">{activeOrder.from} → {activeOrder.to}</p>
              </div>
              <button
                onClick={() => router.push("/courier/active")}
                className="bg-white text-blue-600 px-4 py-2 rounded-xl text-sm font-semibold"
              >
                Ko‘rish →
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className={dark ? "bg-gray-900 p-3 rounded-2xl text-center" : "bg-white p-3 rounded-2xl text-center shadow"}>
            <div className="text-2xl">📦</div>
            <div className="text-xl font-bold">{stats.total}</div>
            <div className="text-xs opacity-70">Jami buyurtmalar</div>
          </div>
          
          <div className={dark ? "bg-gray-900 p-3 rounded-2xl text-center" : "bg-white p-3 rounded-2xl text-center shadow"}>
            <div className="text-2xl">✅</div>
            <div className="text-xl font-bold">{stats.completed}</div>
            <div className="text-xs opacity-70">Yetkazilgan</div>
          </div>
          
          <div className={dark ? "bg-gray-900 p-3 rounded-2xl text-center" : "bg-white p-3 rounded-2xl text-center shadow"}>
            <div className="text-2xl">💰</div>
            <div className="text-xl font-bold">{stats.earnings.toLocaleString()}</div>
            <div className="text-xs opacity-70">Daromad</div>
          </div>
        </div>

        {/* Info Card */}
        <div className={dark ? "bg-gray-900 p-4 rounded-2xl" : "bg-white p-4 rounded-2xl shadow"}>
          <h2 className="font-bold text-lg">🚀 Kuryer paneli</h2>
          <p className="text-sm opacity-70 mt-1">
            {online 
              ? "Siz online rejimdasiz. Yangi buyurtmalar kelishi mumkin!" 
              : "Offline rejim. Buyurtmalarni ko'rish uchun ON tugmasini bosing"}
          </p>
        </div>

        {/* Recent Orders */}
        <div className={dark ? "bg-gray-900 p-4 rounded-2xl" : "bg-white p-4 rounded-2xl shadow"}>
          <h3 className="font-bold mb-3">📋 So'nggi buyurtmalar</h3>
          
          {orders.length === 0 ? (
            <p className="text-sm opacity-70 text-center py-4">Hali buyurtmalar yo'q</p>
          ) : (
            <div className="space-y-2">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex justify-between items-center p-2 border-b border-gray-200 dark:border-gray-700"
                >
                  <div>
                    <div className="font-medium text-sm">#{order.id} - {order.from} → {order.to}</div>
                    <div className="text-xs opacity-60">{getStatusText(order.status)}</div>
                  </div>
                  <div className="text-green-600 font-bold">{order.price.toLocaleString()} so‘m</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MENU */}
      {menu && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenu(false)} />

          <div
            ref={menuRef}
            className="absolute top-0 right-0 w-72 h-full bg-white p-4 text-black shadow-xl"
          >
            <h2 className="font-bold mb-4 text-lg">📋 Menyu</h2>

            <button
              onClick={() => {
                setMenu(false);
                router.push("/courier/home");
              }}
              className="w-full text-left p-3 rounded-xl hover:bg-gray-100"
            >
              🏠 Bosh sahifa
            </button>

            <button
              onClick={() => {
                setMenu(false);
                router.push("/courier/active");
              }}
              className="w-full text-left p-3 rounded-xl hover:bg-gray-100"
            >
              🚚 Faol buyurtma
            </button>

            <button
              onClick={() => {
                setMenu(false);
                router.push("/courier/orders");
              }}
              className="w-full text-left p-3 rounded-xl hover:bg-gray-100"
            >
              📦 Yangi buyurtmalar
            </button>

            <button
              onClick={() => {
                setMenu(false);
                router.push("/courier/history");
              }}
              className="w-full text-left p-3 rounded-xl hover:bg-gray-100"
            >
              📊 Tarix
            </button>

            <button
              onClick={() => {
                setMenu(false);
                router.push("/profile");
              }}
              className="w-full text-left p-3 rounded-xl hover:bg-gray-100"
            >
              👤 Profil
            </button>

            <hr className="my-3" />

            <button
              onClick={() => {
                localStorage.removeItem("current_user");
                router.push("/work-with-us/courier");
              }}
              className="w-full text-left p-3 rounded-xl text-red-600 hover:bg-red-50"
            >
              🚪 Chiqish
            </button>
          </div>
        </div>
      )}
    </main>
  );
}