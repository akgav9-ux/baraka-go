"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../../../components/Map"), {
  ssr: false,
});

interface Order {
  id: number;
  from: string;
  to: string;
  price: number;
  status: string;
  packageType: string;
  createdAt: string;
  comment?: string;
  payment?: string;
  passengers?: number;
  childSeat0_3?: boolean;
  childSeat3_6?: boolean;
  booster6_12?: boolean;
}

export default function TaxiDriverHome() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const [driver, setDriver] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showNavigator, setShowNavigator] = useState(false);
  const [tripPhase, setTripPhase] = useState<"waiting" | "to_a" | "at_a" | "to_b" | "completed">("waiting");
  const [distance, setDistance] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [routePoints, setRoutePoints] = useState<{from: string, to: string} | null>(null);
  
  // 📍 Храним расстояния для каждого заказа
  const [orderDistances, setOrderDistances] = useState<{[key: number]: string}>({});
  
  // 💰 Предложение своей цены
  const [showPriceOffer, setShowPriceOffer] = useState(false);
  const [offerPrice, setOfferPrice] = useState("");
  const [offerOrderId, setOfferOrderId] = useState<number | null>(null);

  useEffect(() => {
    const driverData = localStorage.getItem("driver");
    if (!driverData) {
      router.push("/work-with-us/taxi");
      return;
    }
    setDriver(JSON.parse(driverData));
  }, []);

  useEffect(() => {
    function handleClickOutside(e: any) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 📍 РАСЧЕТ РАССТОЯНИЯ
  const calculateDistanceForOrder = async (orderId: number, from: string, to: string) => {
    try {
      const apiKey = "9b4396dd-d203-4394-afba-2e826a3dbc29";
      
      const fromRes = await fetch(
        `https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&format=json&geocode=${encodeURIComponent(from)}`
      );
      const fromData = await fromRes.json();
      
      const toRes = await fetch(
        `https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&format=json&geocode=${encodeURIComponent(to)}`
      );
      const toData = await toRes.json();

      const fromGeo = fromData.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject;
      const toGeo = toData.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject;

      if (fromGeo && toGeo) {
        const fromPos = fromGeo.Point.pos.split(' ');
        const toPos = toGeo.Point.pos.split(' ');
        
        const lat1 = parseFloat(fromPos[1]);
        const lon1 = parseFloat(fromPos[0]);
        const lat2 = parseFloat(toPos[1]);
        const lon2 = parseFloat(toPos[0]);
        
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const dist = R * c;
        
        const distStr = dist.toFixed(1);
        setOrderDistances(prev => ({ ...prev, [orderId]: distStr }));
        return distStr;
      }
    } catch (error) {
      console.error("Xatolik:", error);
    }
    return "--";
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders?type=taxi");
      const data = await res.json();
      
      let filteredOrders = [];
      if (activeTab === "orders") {
        filteredOrders = data.filter((order: Order) => order.status === "pending");
      } else if (activeTab === "history") {
        filteredOrders = data.filter((order: Order) => 
          order.status === "completed" || order.status === "accepted"
        );
      } else if (activeTab === "active") {
        filteredOrders = data.filter((order: Order) => 
          order.status === "accepted"
        );
      } else {
        filteredOrders = data;
      }
      
      setOrders(filteredOrders);
      
      for (const order of filteredOrders) {
        if (order.status === "pending" && order.from && order.to) {
          await calculateDistanceForOrder(order.id, order.from, order.to);
        }
      }
    } catch (error) {
      console.error("Yuklashda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [activeTab]);

  // 💰 ОТКРЫТЬ ПРЕДЛОЖЕНИЕ ЦЕНЫ
  const openPriceOffer = (orderId: number, currentPrice: number) => {
    setOfferOrderId(orderId);
    setOfferPrice(String(currentPrice));
    setShowPriceOffer(true);
  };

  // 💰 ОТПРАВИТЬ ПРЕДЛОЖЕНИЕ ЦЕНЫ
  const sendPriceOffer = async () => {
    if (!offerOrderId || !offerPrice || Number(offerPrice) <= 0) {
      alert("Iltimos, to'g'ri narx kiriting!");
      return;
    }

    try {
      // Обновляем цену заказа
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: offerOrderId,
          price: Number(offerPrice),
          status: "pending", // Оставляем в ожидании
        }),
      });
      
      if (res.ok) {
        alert(`✅ Sizning narxingiz ${Number(offerPrice).toLocaleString()} so'm taklif qilindi! Yo'lovchi javob kutmoqda.`);
        setShowPriceOffer(false);
        setOfferPrice("");
        setOfferOrderId(null);
        fetchOrders();
      } else {
        alert("❌ Xatolik yuz berdi");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Xatolik yuz berdi");
    }
  };

  const openNavigator = (order: Order) => {
    setSelectedOrder(order);
    setShowNavigator(true);
    setTripPhase("waiting");
    if (order.from && order.to) {
      if (orderDistances[order.id]) {
        setDistance(orderDistances[order.id]);
        const dist = parseFloat(orderDistances[order.id]);
        setDuration(Math.round(dist * 2) + " daqiqa");
      } else {
        calculateDistanceForOrder(order.id, order.from, order.to).then(dist => {
          setDistance(dist);
          const num = parseFloat(dist);
          setDuration(Math.round(num * 2) + " daqiqa");
        });
      }
      setRoutePoints({ from: order.from, to: order.to });
    }
  };

  const closeNavigator = () => {
    setShowNavigator(false);
    setSelectedOrder(null);
  };

  const startToA = () => {
    setTripPhase("to_a");
    alert("🚗 A nuqtaga yo'l oldingiz!");
  };

  const arriveAtA = () => {
    setTripPhase("at_a");
    alert("📍 A nuqtaga yetib keldingiz! Yo'lovchini kuting.");
  };

  const startTrip = () => {
    setTripPhase("to_b");
    alert("🚕 Sayohat boshlandi! B nuqtaga yo'l oldingiz.");
  };

  const arriveAtB = () => {
    setTripPhase("completed");
    alert("✅ B nuqtaga yetib keldingiz! Sayohat yakunlandi.");
    completeOrder(selectedOrder!.id);
  };

  const acceptOrder = async (orderId: number) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: orderId,
          status: "accepted",
        }),
      });
      if (res.ok) {
        alert("✅ Buyurtma qabul qilindi!");
        await fetchOrders();
        const acceptedOrder = orders.find(o => o.id === orderId);
        if (acceptedOrder) {
          openNavigator(acceptedOrder);
        }
        setActiveTab("active");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Xatolik yuz berdi");
    }
  };

  const rejectOrder = async (orderId: number) => {
    if (confirm("Buyurtmani rad etish?")) {
      try {
        const res = await fetch("/api/orders", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: orderId,
            status: "rejected",
          }),
        });
        if (res.ok) {
          alert("❌ Buyurtma rad etildi");
          fetchOrders();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const completeOrder = async (orderId: number) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: orderId,
          status: "completed",
        }),
      });
      if (res.ok) {
        alert("✅ Buyurtma yakunlandi!");
        setTimeout(() => {
          setShowNavigator(false);
          fetchOrders();
          setActiveTab("history");
        }, 1500);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("driver");
    localStorage.removeItem("driver_phone");
    router.push("/work-with-us/taxi");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">⏳ Yangi</span>;
      case "accepted": return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">✅ Qabul qilingan</span>;
      case "completed": return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">✅ Yakunlangan</span>;
      case "rejected": return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">❌ Rad etilgan</span>;
      default: return <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">{status}</span>;
    }
  };

  const getExtraInfo = (order: Order) => {
    let info = [];
    if (order.payment === "cash") info.push("💵 Naqd");
    else info.push("💳 Karta");
    if (order.passengers && order.passengers > 1) {
      info.push(`👥 ${order.passengers} yo'lovchi`);
    }
    if (order.childSeat0_3) info.push("👶 0-3 o'rindiq");
    if (order.childSeat3_6) info.push("🧒 3-6 o'rindiq");
    if (order.booster6_12) info.push("🪑 6-12 buster");
    return info.join(" • ");
  };

  if (!driver) {
    return <div className="min-h-screen flex items-center justify-center">⏳ Yuklanmoqda...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-100 pb-24">
      
      {/* SHAPKA */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 py-3 flex justify-between items-center shadow-lg sticky top-0 z-20">
        <div>
          <p className="text-xs opacity-80">🚕 Taksi</p>
          <h1 className="text-lg font-bold">Haydovchi</h1>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl">☰</button>
      </div>

      {/* BURGER MENYU */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <div ref={menuRef} className="absolute top-0 right-0 w-72 h-full bg-white p-4 text-black shadow-xl z-[100] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-xl">🚕 Menyu</h2>
              <button onClick={() => setMenuOpen(false)} className="text-2xl">✕</button>
            </div>
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-2xl mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-yellow-500 rounded-full flex items-center justify-center text-2xl text-white">🚕</div>
                <div>
                  <p className="font-bold text-lg">{driver.name} {driver.surname}</p>
                  <p className="text-xs text-gray-500">{driver.phone}</p>
                  <p className="text-xs text-green-600 font-semibold">✅ Taksi haydovchi</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-green-50 p-3 rounded-xl text-center">
                <p className="text-2xl font-bold text-green-600">0</p>
                <p className="text-xs text-gray-500">💰 Topilgan</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-xl text-center">
                <p className="text-2xl font-bold text-yellow-600">0</p>
                <p className="text-xs text-gray-500">📊 Safarlar</p>
              </div>
            </div>
            <button onClick={() => { setActiveTab("orders"); setMenuOpen(false); }} className="w-full text-left p-3 rounded-xl hover:bg-gray-100 transition flex items-center gap-2">
              <span>📋</span> Yangi buyurtmalar
            </button>
            <button onClick={() => { setActiveTab("active"); setMenuOpen(false); }} className="w-full text-left p-3 rounded-xl hover:bg-gray-100 transition flex items-center gap-2">
              <span>🚕</span> Faol buyurtmalar
            </button>
            <button onClick={() => { setActiveTab("history"); setMenuOpen(false); }} className="w-full text-left p-3 rounded-xl hover:bg-gray-100 transition flex items-center gap-2">
              <span>📜</span> Tarix
            </button>
            <hr className="my-3" />
            <button onClick={() => { setMenuOpen(false); router.push("/"); }} className="w-full text-left p-3 rounded-xl hover:bg-gray-100 transition flex items-center gap-2">
              <span>🏠</span> Bosh sahifa
            </button>
            <button onClick={handleLogout} className="w-full text-left p-3 rounded-xl text-red-600 hover:bg-red-50 transition flex items-center gap-2 mt-2">
              <span>🚪</span> Chiqish
            </button>
          </div>
        </div>
      )}

      {/* ONLINE/OFFLINE */}
      <div className="p-4 flex justify-between items-center bg-white border-b">
        <div>
          <p className="text-sm font-semibold">📊 Holat</p>
          <p className="text-xs text-gray-500">{isOnline ? "🟢 Onlinesiz — buyurtmalar keladi" : "⚫ Offlinesiz — buyurtmalar kelmaydi"}</p>
        </div>
        <button onClick={() => setIsOnline(!isOnline)} className={`px-4 py-2 rounded-xl text-sm font-semibold ${isOnline ? "bg-green-500 text-white" : "bg-gray-500 text-white"}`}>
          {isOnline ? "🟢 Online" : "⚫ Offline"}
        </button>
      </div>

      {/* BUYURTMALAR RO'YXATI */}
      <div className="p-4 space-y-4">
        <h2 className="text-lg font-bold">
          {activeTab === "orders" && "📋 Yangi buyurtmalar"}
          {activeTab === "active" && "🚕 Faol buyurtmalar"}
          {activeTab === "history" && "📜 Buyurtmalar tarixi"}
        </h2>

        {loading ? (
          <div className="text-center py-10">⏳ Yuklanmoqda...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-gray-500">Buyurtmalar yo'q</p>
          </div>
        ) : (
          orders.map((order) => {
            const dist = orderDistances[order.id] || "--";
            return (
              <div key={order.id} className="bg-white rounded-xl p-4 shadow">
                <div className="flex justify-between">
                  <div>
                    <p className="font-bold">№{order.id}</p>
                    <p className="text-sm">{order.from} → {order.to}</p>
                    <p className="text-sm font-bold text-green-600">{order.price.toLocaleString()} so'm</p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
                
                {/* 📍 КИЛОМЕТРАЖ */}
                {order.status === "pending" && (
                  <div className="flex gap-4 mt-2 text-xs bg-gray-50 p-2 rounded-lg">
                    <span>📏 {dist} km</span>
                    <span>⏱️ {dist !== "--" ? Math.round(parseFloat(dist) * 2) + " daqiqa" : "--"}</span>
                  </div>
                )}

                {order.comment && <p className="text-xs text-gray-500 mt-2">📝 Izoh: {order.comment}</p>}
                
                <div className="flex gap-2 mt-3">
                  {order.status === "pending" && (
                    <>
                      <button onClick={() => acceptOrder(order.id)} className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold">
                        ✅ Qabul qilish {dist !== "--" && `(${dist} km)`}
                      </button>
                      {/* 💰 ПРЕДЛОЖИТЬ СВОЮ ЦЕНУ */}
                      <button 
                        onClick={() => openPriceOffer(order.id, order.price)} 
                        className="flex-1 bg-yellow-500 text-white py-2 rounded-lg font-semibold"
                      >
                        💰 Narx taklif qilish
                      </button>
                      <button onClick={() => rejectOrder(order.id)} className="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold">❌ Rad etish</button>
                    </>
                  )}
                  {order.status === "accepted" && (
                    <button onClick={() => openNavigator(order)} className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold">🗺️ Navigatsiyani boshlash</button>
                  )}
                  {order.status === "completed" && <span className="text-sm text-green-600 font-semibold w-full text-center">✅ Buyurtma bajarilgan</span>}
                  {order.status === "rejected" && <span className="text-sm text-red-600 font-semibold w-full text-center">❌ Buyurtma rad etilgan</span>}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 💰 МОДАЛКА ПРЕДЛОЖЕНИЯ ЦЕНЫ */}
      {showPriceOffer && (
        <div className="fixed inset-0 z-[300] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-center mb-4">💰 Narx taklif qilish</h2>
            <p className="text-sm text-gray-500 text-center mb-4">
              Hozirgi narx: <span className="font-bold text-green-600">{offerPrice ? Number(offerPrice).toLocaleString() : 0} so'm</span>
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Sizning narxingiz (so'm)</label>
              <input
                type="number"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                className="w-full p-3 border rounded-xl text-lg font-semibold focus:outline-none focus:border-yellow-500"
                placeholder="Masalan: 15000"
                min="0"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={sendPriceOffer}
                className="flex-1 bg-yellow-500 text-white py-3 rounded-xl font-semibold hover:bg-yellow-600 transition"
              >
                📤 Taklif qilish
              </button>
              <button
                onClick={() => setShowPriceOffer(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-400 transition"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* НАВИГАТОР */}
      {showNavigator && selectedOrder && (
        <div className="fixed inset-0 z-[200] bg-white flex flex-col">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 py-3 flex justify-between items-center shadow-lg z-10">
            <div className="flex items-center gap-3">
              <button onClick={closeNavigator} className="text-2xl">✕</button>
              <div>
                <p className="text-xs opacity-80">🚕 Buyurtma №{selectedOrder.id}</p>
                <p className="text-sm font-bold">{selectedOrder.from} → {selectedOrder.to}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-80">Masofa</p>
              <p className="text-sm font-bold">{distance || "--"} km</p>
            </div>
          </div>

          <div className="flex-1 relative bg-gray-100">
            {routePoints ? (
              <Map from={routePoints.from} to={routePoints.to} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <p>Karta yuklanmoqda...</p>
              </div>
            )}

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
              <div className="w-10 h-10 border-4 border-yellow-500 rounded-full animate-pulse bg-yellow-400/30" />
            </div>

            <div className="absolute bottom-32 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-lg z-10 border border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500">Sayohat holati</p>
                  <p className="text-lg font-bold text-gray-800">
                    {tripPhase === "waiting" && "⏳ Tayyor"}
                    {tripPhase === "to_a" && "🚗 A nuqtaga ketmoqda"}
                    {tripPhase === "at_a" && "📍 A nuqtada"}
                    {tripPhase === "to_b" && "🚕 B nuqtaga ketmoqda"}
                    {tripPhase === "completed" && "✅ Yakunlandi"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Vaqt</p>
                  <p className="text-lg font-bold text-yellow-600">{duration || "--"}</p>
                </div>
              </div>
              <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-500 transition-all duration-500 rounded-full"
                  style={{
                    width: tripPhase === "waiting" ? "0%" :
                           tripPhase === "to_a" ? "25%" :
                           tripPhase === "at_a" ? "50%" :
                           tripPhase === "to_b" ? "75%" :
                           tripPhase === "completed" ? "100%" : "0%"
                  }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white border-t border-gray-200 p-4 shadow-lg">
            <div className="flex gap-3">
              {tripPhase === "waiting" && (
                <button onClick={startToA} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg transition">🚗 A nuqtaga yo'l olish</button>
              )}
              {tripPhase === "to_a" && (
                <button onClick={arriveAtA} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold text-lg transition animate-pulse">📍 A nuqtaga yetib keldim</button>
              )}
              {tripPhase === "at_a" && (
                <button onClick={startTrip} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-2xl font-bold text-lg transition animate-pulse">🚕 Sayohatni boshlash</button>
              )}
              {tripPhase === "to_b" && (
                <button onClick={arriveAtB} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold text-lg transition animate-pulse">🏁 B nuqtaga yetib keldim</button>
              )}
              {tripPhase === "completed" && (
                <div className="flex-1 bg-green-500 text-white py-4 rounded-2xl font-bold text-lg text-center">✅ Sayohat yakunlandi</div>
              )}
            </div>
            <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
              <span>💰 {selectedOrder.price.toLocaleString()} so'm</span>
              <span>{getExtraInfo(selectedOrder)}</span>
              <span>{selectedOrder.payment === "cash" ? "💵 Naqd" : "💳 Karta"}</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}