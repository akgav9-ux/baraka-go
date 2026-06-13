"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const Map = dynamic(() => import("../../../components/Map"), {
  ssr: false,
});

export default function IntercityDriverHome() {
  const router = useRouter();
  
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  
  const [activeTab, setActiveTab] = useState("orders");
  const [isOnline, setIsOnline] = useState(true);
  const [driverName, setDriverName] = useState("Alisher Valiyev");
  const [driverRating, setDriverRating] = useState(4.8);
  const [driverTrips, setDriverTrips] = useState(234);
  const [orders, setOrders] = useState<any[]>([]);
  const [balance, setBalance] = useState(1250000);
  const [loading, setLoading] = useState(false);
  
  // Состояние для отслеживания начатых поездок
  const [startedTrips, setStartedTrips] = useState<number[]>([]);

  // Загрузка заказов из БД
  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders?type=intercity');
      const data = await res.json();
      console.log("📦 Заказы получены:", data.length);
      setOrders(data);
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error);
    }
  };

  // Автообновление каждые 3 секунды
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  // Close menu
  useEffect(() => {
    function handleClickOutside(e: any) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getExtraData = (order: any) => {
    try {
      return order.extraData ? JSON.parse(order.extraData) : { passengers: 1, stop: null };
    } catch {
      return { passengers: 1, stop: null };
    }
  };

  const handleAcceptOrder = async (order: any) => {
    if (!isOnline) {
      alert("Iltimos, avval onlayn holatga o'ting");
      return;
    }
    
    if (confirm(`${order.from} → ${order.to} yo'nalishidagi buyurtmani qabul qilasizmi?`)) {
      try {
        const res = await fetch('/api/orders', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: order.id,
            status: 'accepted',
            courierId: 1,
          }),
        });
        
        if (res.ok) {
          await fetchOrders();
          alert(`✅ Buyurtma qabul qilindi!\n\n📍 ${order.from} → ${order.to}\n💰 ${order.price.toLocaleString()} so'm`);
        }
      } catch (error) {
        alert("❌ Xatolik yuz berdi");
      }
    }
  };

  const handleRejectOrder = async (orderId: number) => {
    if (confirm("Buyurtmani rad etishni xohlaysizmi?")) {
      try {
        const res = await fetch('/api/orders', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: orderId,
            status: 'rejected',
          }),
        });
        
        if (res.ok) {
          await fetchOrders();
          alert("Buyurtma rad etildi");
        }
      } catch (error) {
        alert("❌ Xatolik yuz berdi");
      }
    }
  };

  // НАЧАТЬ ПОЕЗДКУ - кнопка исчезает
  const handleStartTrip = (orderId: number) => {
    if (confirm(`🚌 Sayohatni boshlashni tasdiqlaysizmi?`)) {
      setStartedTrips(prev => [...prev, orderId]);
      alert(`✅ Sayohat boshlandi!\n\nYo'lovchilarni manzilga olib boring.\n\nSayohat tugagach "Yakunlash" tugmasini bosing.`);
    }
  };

  // ЗАВЕРШИТЬ ПОЕЗДКУ
  const handleCompleteOrder = async (order: any) => {
    if (confirm(`🚌 "${order.from} → ${order.to}" yo'nalishidagi sayohatni yakunlashni tasdiqlaysizmi?\n\n💰 To'lov: ${order.price.toLocaleString()} so'm`)) {
      try {
        const res = await fetch('/api/orders', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: order.id,
            status: 'completed',
            courierId: 1,
          }),
        });
        
        if (res.ok) {
          // Убираем из startedTrips
          setStartedTrips(prev => prev.filter(id => id !== order.id));
          // Добавляем деньги на баланс
          setBalance(prev => prev + order.price);
          setDriverTrips(prev => prev + 1);
          await fetchOrders();
          alert(`✅ Sayohat yakunlandi!\n\n💰 ${order.price.toLocaleString()} so'm balansingizga qo'shildi.\n📊 Umumiy balans: ${(balance + order.price).toLocaleString()} so'm`);
        }
      } catch (error) {
        alert("❌ Xatolik yuz berdi");
      }
    }
  };

  const pendingOrders = orders.filter(o => o.status === "pending");
  const acceptedOrders = orders.filter(o => o.status === "accepted");
  const completedOrders = orders.filter(o => o.status === "completed");

  return (
    <main className="min-h-screen bg-gray-100 pb-24 relative">
      
      {/* ШАПКА */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-4 py-2 rounded-b-2xl shadow-lg flex justify-between items-center relative z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-lg">🚌</div>
          <div>
            <p className="text-xs opacity-80">Shaharlararo</p>
            <p className="text-sm font-bold">Haydovchi</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`w-3 h-3 rounded-full transition ${isOnline ? "bg-green-400 animate-pulse" : "bg-gray-400"}`}
            title={isOnline ? "Online" : "Offline"}
          />
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl">☰</button>
        </div>
      </div>

      {/* КАРТА */}
      <div className="h-[30vh] w-full relative z-0">
        <Map />
      </div>

      {/* БАЛАНС */}
      <div className="bg-white mx-3 mt-2 p-3 rounded-xl shadow-sm flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500">Balansingiz</p>
          <p className="font-bold text-lg text-green-600">{balance.toLocaleString()} so'm</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Umumiy reyslar</p>
          <p className="font-bold text-lg text-purple-600">{driverTrips}</p>
        </div>
      </div>

      {!isOnline && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-center mx-3 mt-3">
          <p className="text-yellow-700 text-sm">⚠️ Siz offline holatidasiz</p>
          <p className="text-xs text-yellow-600">Buyurtmalar ko'rinishi uchun onlayn bo'ling</p>
        </div>
      )}

      {/* ВКЛАДКИ */}
      <div className="flex gap-2 p-3 bg-white mt-2 rounded-t-2xl relative z-10">
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex-1 py-2 rounded-xl font-semibold text-sm transition ${
            activeTab === "orders" ? "bg-purple-500 text-white shadow-md" : "bg-gray-100 text-gray-600"
          }`}
        >
          📋 Yangi ({pendingOrders.length})
        </button>
        <button
          onClick={() => setActiveTab("active")}
          className={`flex-1 py-2 rounded-xl font-semibold text-sm transition ${
            activeTab === "active" ? "bg-purple-500 text-white shadow-md" : "bg-gray-100 text-gray-600"
          }`}
        >
          🚌 Faol ({acceptedOrders.length})
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex-1 py-2 rounded-xl font-semibold text-sm transition ${
            activeTab === "history" ? "bg-purple-500 text-white shadow-md" : "bg-gray-100 text-gray-600"
          }`}
        >
          📜 Tarix ({completedOrders.length})
        </button>
      </div>

      {/* КОНТЕНТ */}
      <div className="p-3 space-y-3 relative z-10 pb-32">
        
        {/* НОВЫЕ ЗАКАЗЫ */}
        {activeTab === "orders" && (
          <>
            {pendingOrders.length === 0 ? (
              <div className="bg-white rounded-xl p-6 text-center">
                <div className="text-4xl mb-2">📭</div>
                <p className="text-gray-500 text-sm">Hozircha yangi buyurtmalar yo'q</p>
              </div>
            ) : (
              pendingOrders.map((order) => {
                const extra = getExtraData(order);
                return (
                  <div key={order.id} className="bg-white rounded-xl p-3 shadow-md border-l-4 border-yellow-500">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-bold">{order.from} → {order.to}</div>
                        <div className="text-xs text-gray-500">
                          🆔 №{order.id} • 👥 {extra.passengers || 1} yo'lovchi
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">Новый</span>
                    </div>

                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>💰 {order.price.toLocaleString()} so'm</span>
                      <span>💳 {order.payment === "cash" ? "Naqd" : "Karta"}</span>
                    </div>

                    {order.comment && (
                      <div className="text-xs text-gray-500 mb-2">📝 {order.comment}</div>
                    )}

                    <div className="border-t pt-2 mt-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptOrder(order)}
                          disabled={!isOnline}
                          className="flex-1 bg-green-600 text-white py-1.5 rounded-lg text-sm font-semibold disabled:opacity-50"
                        >
                          ✅ Qabul qilish
                        </button>
                        <button
                          onClick={() => handleRejectOrder(order.id)}
                          className="flex-1 bg-red-500 text-white py-1.5 rounded-lg text-sm font-semibold"
                        >
                          ❌ Rad etish
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}

        {/* АКТИВНЫЕ ПОЕЗДКИ */}
        {activeTab === "active" && (
          <>
            {acceptedOrders.length === 0 ? (
              <div className="bg-white rounded-xl p-6 text-center">
                <div className="text-4xl mb-2">🚌</div>
                <p className="text-gray-500 text-sm">Faol reyslar yo'q</p>
                <p className="text-xs text-gray-400">Yangi buyurtma qabul qiling</p>
              </div>
            ) : (
              acceptedOrders.map((order) => {
                const extra = getExtraData(order);
                const isStarted = startedTrips.includes(order.id);
                
                return (
                  <div key={order.id} className="bg-white rounded-xl p-3 shadow-md border-l-4 border-green-500">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-bold">{order.from} → {order.to}</div>
                        <div className="text-xs text-gray-500">
                          🆔 №{order.id} • 👥 {extra.passengers || 1} yo'lovchi
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${isStarted ? "bg-blue-100 text-blue-700" : "bg-green-50 text-green-600"}`}>
                        {isStarted ? "🚌 Yo'lda" : "⏳ Kutilmoqda"}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>💰 {order.price.toLocaleString()} so'm</span>
                      <span>💳 {order.payment === "cash" ? "Naqd" : "Karta"}</span>
                    </div>

                    {order.comment && (
                      <div className="text-xs text-gray-500 mb-2 bg-gray-50 p-2 rounded-lg">
                        📝 Izoh: {order.comment}
                      </div>
                    )}

                    <div className="flex gap-2 mt-2">
                      {!isStarted ? (
                        <button
                          onClick={() => handleStartTrip(order.id)}
                          className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold"
                        >
                          🚌 Boshlash
                        </button>
                      ) : (
                        <button
                          onClick={() => handleCompleteOrder(order)}
                          className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-semibold"
                        >
                          ✅ Yakunlash
                        </button>
                      )}
                    </div>
                    
                    {isStarted && (
                      <div className="mt-2 text-xs text-center text-blue-600">
                        🟢 Sayohat davom etmoqda...
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </>
        )}

        {/* ИСТОРИЯ */}
        {activeTab === "history" && (
          <div className="bg-white rounded-xl p-3">
            {completedOrders.length === 0 ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-2">📜</div>
                <p className="text-gray-500 text-sm">Hali hech qanday tarix yo'q</p>
                <p className="text-xs text-gray-400">Sayohat tugatilgandan so'ng bu yerda ko'rinadi</p>
              </div>
            ) : (
              <div className="space-y-2">
                {completedOrders.map((order) => (
                  <div key={order.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{order.from} → {order.to}</div>
                        <div className="text-xs text-gray-500">🆔 №{order.id}</div>
                      </div>
                      <span className="text-green-600 font-bold">{order.price.toLocaleString()} so'm</span>
                    </div>
                    <div className="text-xs text-gray-500 flex justify-between mt-2">
                      <span>📅 {new Date(order.createdAt).toLocaleDateString()}</span>
                      <span>⏰ {new Date(order.createdAt).toLocaleTimeString()}</span>
                      <span>✅ Yakunlangan</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* БУРГЕР МЕНЮ С КНОПКОЙ "Yangi reys qo'shish" */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <div ref={menuRef} className="absolute top-0 right-0 w-72 h-full bg-white p-4 text-black shadow-xl z-[100] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-xl">🚌 Menyu</h2>
              <button onClick={() => setMenuOpen(false)} className="text-2xl">✕</button>
            </div>

            <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-purple-500 rounded-full flex items-center justify-center text-2xl text-white">🚌</div>
                <div>
                  <p className="font-bold text-lg">{driverName}</p>
                  <div className="flex gap-3 text-sm">
                    <span className="text-yellow-600">⭐ {driverRating}</span>
                    <span className="text-purple-600">🚌 {driverTrips} reys</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-2xl mb-4">
              <p className="text-xs text-gray-500">Balansingiz</p>
              <p className="font-bold text-2xl text-green-700">{balance.toLocaleString()} so'm</p>
              <button 
                onClick={() => alert("💰 Pul chiqarish so'rovi yuborildi! Admin bilan bog'lanasiz.")}
                className="mt-2 text-sm text-green-600 font-semibold"
              >
                💸 Chiqib olish
              </button>
            </div>

            {/* КНОПКА ДЛЯ ДОБАВЛЕНИЯ РЕЙСА */}
            <button
              onClick={() => {
                setMenuOpen(false);
                router.push("/intercity/create-trip");
              }}
              className="w-full text-left p-3 rounded-xl bg-purple-500 text-white hover:bg-purple-600 transition flex items-center gap-2 mb-2"
            >
              <span className="text-lg">➕</span>
              <span className="font-semibold">Yangi reys qo'shish</span>
            </button>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl mb-2">
              <div>
                <p className="font-semibold">Holat</p>
                <p className="text-xs text-gray-500">{isOnline ? "Online - buyurtmalar keladi" : "Offline - buyurtmalar kelmaydi"}</p>
              </div>
              <button
                onClick={() => {
                  setIsOnline(!isOnline);
                  setMenuOpen(false);
                }}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                  isOnline ? "bg-green-500 text-white" : "bg-gray-500 text-white"
                }`}
              >
                {isOnline ? "🟢 Online" : "⚫ Offline"}
              </button>
            </div>

            <hr className="my-3" />

            <button
              onClick={() => {
                setMenuOpen(false);
                router.push("/intercity/home");
              }}
              className="w-full text-left p-3 rounded-xl hover:bg-gray-100 transition flex items-center gap-2"
            >
              <span>🏠</span> Bosh sahifa
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                router.push("/");
              }}
              className="w-full text-left p-3 rounded-xl text-red-600 hover:bg-red-50 transition flex items-center gap-2"
            >
              <span>🚪</span> Chiqish
            </button>
          </div>
        </div>
      )}

    </main>
  );
}