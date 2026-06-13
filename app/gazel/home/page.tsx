"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface Order {
  id: number;
  from: string;
  to: string;
  price: number;
  status: string;
  packageType: string;
  comment: string;
  createdAt: string;
}

export default function GazelHomePage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [driver, setDriver] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    earnings: 0,
    cancelled: 0,
  });
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("gazel_theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Save theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("gazel_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("gazel_theme", "light");
    }
  }, [darkMode]);

  // Load online status
  useEffect(() => {
    const savedStatus = localStorage.getItem("gazel_online");
    if (savedStatus === "false") {
      setIsOnline(false);
    }
  }, []);

  // Save online status
  useEffect(() => {
    localStorage.setItem("gazel_online", String(isOnline));
  }, [isOnline]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e: any) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Check auth
  useEffect(() => {
    const driverData = localStorage.getItem("driver");
    if (!driverData) {
      router.push("/login");
      return;
    }
    setDriver(JSON.parse(driverData));
  }, [router]);

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        // Только заказы газели
        const gazelOrders = data.filter((o: Order) => o.packageType === "gazel");
        setOrders(gazelOrders);
        
        // Find active order (accepted or delivering)
        const active = gazelOrders.find((o: Order) => o.status === "accepted" || o.status === "delivering");
        setActiveOrder(active || null);
        
        // Calculate stats
        const completed = gazelOrders.filter((o: Order) => o.status === "delivered").length;
        const cancelled = gazelOrders.filter((o: Order) => o.status === "cancelled").length;
        const earnings = gazelOrders
          .filter((o: Order) => o.status === "delivered")
          .reduce((sum: number, o: Order) => sum + o.price, 0);
        
        setStats({
          total: gazelOrders.length,
          completed,
          earnings,
          cancelled,
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

  const formatPrice = (price: number) => {
    return price.toLocaleString("uz-UZ") + " so‘m";
  };

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

  if (!driver) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">⏳ Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <main className={`min-h-screen ${darkMode ? "bg-black" : "bg-gray-100"}`}>
      {/* HEADER with MENU BUTTON */}
      <div className={`${darkMode ? "bg-blue-900" : "bg-blue-700"} text-white px-4 py-3 flex items-center justify-between`}>
        <div>
          <p className="text-xs opacity-80">🚚 Yuk tashish</p>
          <p className="text-sm font-semibold">Gazel haydovchi</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Online/Offline Status */}
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isOnline ? "bg-green-500" : "bg-gray-500"
            }`}
          >
            {isOnline ? "🟢 Online" : "⚪ Offline"}
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl">
            ☰
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-4">
        {/* Driver Info */}
        <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white"} rounded-2xl p-4 shadow`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
              🚚
            </div>
            <div>
              <h2 className="font-bold text-lg">{driver.name} {driver.surname}</h2>
              <p className="text-sm text-gray-500">{driver.phone}</p>
              <p className="text-xs text-gray-400 mt-1">Avtomobil: {driver.carModel} | {driver.carNumber}</p>
            </div>
          </div>
        </div>

        {/* Online/Offline Message */}
        {!isOnline && (
          <div className="bg-yellow-100 text-yellow-800 p-3 rounded-xl text-center text-sm">
            ⚠️ Siz offline rejimdasiz. Yangi buyurtmalar kelmaydi!
          </div>
        )}

        {/* Active Order Banner */}
        {activeOrder && isOnline && (
          <div className="bg-blue-500 text-white p-4 rounded-2xl">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs opacity-80">Faol buyurtma</p>
                <p className="font-bold">#{activeOrder.id}</p>
                <p className="text-sm mt-1 truncate max-w-[200px]">{activeOrder.from} → {activeOrder.to}</p>
              </div>
              <button
                onClick={() => router.push("/gazel/active")}
                className="bg-white text-blue-600 px-4 py-2 rounded-xl text-sm font-semibold"
              >
                Ko‘rish →
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-2">
          <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white"} rounded-xl p-3 text-center shadow`}>
            <div className="text-xl">📦</div>
            <div className="text-lg font-bold">{stats.total}</div>
            <div className="text-xs opacity-70">Jami</div>
          </div>
          
          <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white"} rounded-xl p-3 text-center shadow`}>
            <div className="text-xl">✅</div>
            <div className="text-lg font-bold text-green-600">{stats.completed}</div>
            <div className="text-xs opacity-70">Yetkazilgan</div>
          </div>
          
          <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white"} rounded-xl p-3 text-center shadow`}>
            <div className="text-xl">❌</div>
            <div className="text-lg font-bold text-red-500">{stats.cancelled}</div>
            <div className="text-xs opacity-70">Bekor</div>
          </div>

          <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white"} rounded-xl p-3 text-center shadow`}>
            <div className="text-xl">💰</div>
            <div className="text-lg font-bold text-green-600">{stats.earnings.toLocaleString()}</div>
            <div className="text-xs opacity-70">Daromad</div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white"} rounded-2xl p-4 shadow`}>
          <h3 className="font-bold mb-3">📋 So'nggi buyurtmalar</h3>
          
          {orders.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">Hali buyurtmalar yo'q</p>
          ) : (
            <div className="space-y-2">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className={`flex justify-between items-center p-2 border-b ${darkMode ? "border-gray-700" : "border-gray-100"}`}
                >
                  <div>
                    <div className="font-medium text-sm">#{order.id} - {order.from.substring(0, 20)}...</div>
                    <div className="text-xs text-gray-400">{getStatusText(order.status)}</div>
                  </div>
                  <div className="text-green-600 font-bold">{formatPrice(order.price)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* BURGER MENU */}
      {menuOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <div
            ref={menuRef}
            className="absolute top-0 right-0 w-72 h-full bg-white p-4 text-black shadow-xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-xl">🚚 Menyu</h2>
              <button onClick={() => setMenuOpen(false)} className="text-2xl">✕</button>
            </div>

            <button
              onClick={() => {
                setMenuOpen(false);
                router.push("/gazel/home");
              }}
              className="w-full text-left p-3 rounded-xl hover:bg-gray-100"
            >
              🏠 Bosh sahifa
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                router.push("/gazel/orders");
              }}
              className="w-full text-left p-3 rounded-xl hover:bg-gray-100"
            >
              📦 Yangi buyurtmalar
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                router.push("/gazel/active");
              }}
              className="w-full text-left p-3 rounded-xl hover:bg-gray-100"
            >
              🚚 Faol buyurtma
            </button>

            <hr className="my-3" />

            <button
              onClick={() => {
                setDarkMode(!darkMode);
              }}
              className="w-full text-left p-3 rounded-xl hover:bg-gray-100 flex items-center gap-2"
            >
              <span>{darkMode ? "☀️" : "🌙"}</span>
              <span>{darkMode ? "Kunduzgi rejim" : "Tungi rejim"}</span>
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("driver");
                localStorage.removeItem("driver_phone");
                localStorage.removeItem("gazel_online");
                setMenuOpen(false);
                router.push("/");
              }}
              className="w-full text-left p-3 rounded-xl text-red-600 hover:bg-red-50 mt-2"
            >
              🚪 Chiqish
            </button>
          </div>
        </div>
      )}
    </main>
  );
}