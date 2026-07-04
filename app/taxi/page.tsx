"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const Map = dynamic(() => import("../../components/Map"), {
  ssr: false,
});

export default function TaxiPage() {
  const router = useRouter();
  
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  
  const [payment, setPayment] = useState("cash");
  const [changeAmount, setChangeAmount] = useState("");
  const [comment, setComment] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showStop, setShowStop] = useState(false);
  
  const [passengers4, setPassengers4] = useState(false);
  const [childSeat0_3, setChildSeat0_3] = useState(false);
  const [childSeat3_6, setChildSeat3_6] = useState(false);
  const [booster6_12, setBooster6_12] = useState(false);
  
  const [price, setPrice] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [stop, setStop] = useState("");
  const [loading, setLoading] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [suggestedPrice, setSuggestedPrice] = useState<number | null>(null);
  
  const [orderStatus, setOrderStatus] = useState<"idle" | "waiting" | "driver_found" | "completed" | "rejected">("idle");
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [driverOffer, setDriverOffer] = useState<{price: number, driverName: string} | null>(null);

  // 🔥 ПОДСКАЗКИ АДРЕСОВ
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeField, setActiveField] = useState<"from" | "to" | null>(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  // Сохранённые адреса
  const savedAddresses = [
    "На работу",
    "Роддом № 9",
    "Лиговский пр. 242",
    "Старообрядческая 24",
    "пр. Юрия Гагарина 34к3Д",
  ];

  useEffect(() => {
    function handleClickOutside(e: any) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔥 ПОИСК ПОДСКАЗОК
  useEffect(() => {
    const fetchSuggestions = async () => {
      const query = activeField === "from" ? from : to;
      if (!query || query.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoadingSuggestions(true);
      try {
        const apiKey = "9b4396dd-d203-4394-afba-2e826a3dbc29";
        const res = await fetch(
          `https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&format=json&geocode=${encodeURIComponent(query)}&results=5`
        );
        const data = await res.json();
        
        const items = data.response?.GeoObjectCollection?.featureMember || [];
        const addresses = items.map((item: any) => {
          const geo = item.GeoObject;
          return geo.name || geo.description || '';
        }).filter(Boolean);
        
        setSuggestions(addresses);
        setShowSuggestions(addresses.length > 0);
      } catch (error) {
        console.error("Ошибка поиска:", error);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    const timeout = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeout);
  }, [from, to, activeField]);

  const getPaymentText = () => {
    return payment === "cash" ? "💵 Naqd" : "💳 Karta";
  };

  const calculateChange = () => {
    const priceNum = Number(price);
    const changeNum = Number(changeAmount);
    if (priceNum && changeNum && changeNum > priceNum) {
      return changeNum - priceNum;
    }
    return 0;
  };

  // 📍 Расчет расстояния и стоимости
  const calculateDistanceAndPrice = async () => {
    if (!from || !to) return;
    
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
        
        const distRounded = Math.round(dist * 10) / 10;
        setDistance(distRounded);
        
        const pricePerKm = 2000;
        const calculatedPrice = Math.round(distRounded * pricePerKm / 1000) * 1000;
        setSuggestedPrice(calculatedPrice);
        setPrice(String(calculatedPrice));
      }
    } catch (error) {
      console.error("Xatolik:", error);
    }
  };

  useEffect(() => {
    if (from && to) {
      calculateDistanceAndPrice();
    }
  }, [from, to]);

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    if (!from) {
      setFrom(address);
    } else if (!to) {
      setTo(address);
    } else {
      setFrom(address);
      setTo("");
    }
  };

  const handleOrder = async () => {
    if (!from || !to) {
      alert("Iltimos, jo'natish va qabul qilish manzillarini to'ldiring");
      return;
    }

    if (!price || Number(price) <= 0) {
      alert("Iltimos, to'g'ri narxni kiriting");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          to,
          price: Number(price),
          packageType: "taxi",
          payment,
          comment,
          passengers: passengers4 ? 4 : 1,
          childSeat0_3,
          childSeat3_6,
          booster6_12,
          stop: stop || null,
          distance: distance,
        }),
      });

      if (!res.ok) throw new Error("Ошибка");

      const order = await res.json();
      setCurrentOrder(order);
      setOrderStatus("waiting");
      alert(`✅ Buyurtma №${order.id} yuborildi!\n\n⏳ Haydovchi qidirilmoqda...`);
      
      setTimeout(() => {
        const driverPrice = Number(price) + Math.floor(Math.random() * 5000) - 2500;
        setDriverOffer({
          price: Math.max(driverPrice, 5000),
          driverName: "Haydovchi"
        });
        setOrderStatus("driver_found");
        alert(`🚕 Haydovchi topildi!\n💰 Taklif: ${Math.max(driverPrice, 5000).toLocaleString()} so'm`);
      }, 3000);
      
    } catch (error) {
      console.error(error);
      alert("❌ Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const acceptDriverOffer = () => {
    setOrderStatus("completed");
    alert("✅ Buyurtma qabul qilindi! Haydovchi sizga yo'l oldi.");
    setFrom("");
    setTo("");
    setPrice("");
    setDistance(null);
    setSuggestedPrice(null);
  };

  const rejectDriverOffer = () => {
    setOrderStatus("rejected");
    alert("❌ Siz taklifni rad etdingiz. Yangi haydovchi qidirilmoqda...");
    setTimeout(() => {
      setOrderStatus("idle");
      setDriverOffer(null);
      setCurrentOrder(null);
    }, 2000);
  };

  const cancelOrder = () => {
    if (confirm("Buyurtmani bekor qilish?")) {
      setOrderStatus("idle");
      setDriverOffer(null);
      setCurrentOrder(null);
      alert("❌ Buyurtma bekor qilindi");
    }
  };

  return (
    <main className="h-screen flex flex-col bg-gray-100 relative">
      
      {/* ШАПКА */}
      <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black px-4 py-3 flex items-center justify-between shadow-lg relative z-30 rounded-b-3xl">
        <div>
          <p className="text-xs opacity-80">🚕 Taxi xizmati</p>
          <p className="text-sm font-semibold">Tez va qulay</p>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl">☰</button>
      </div>

      {/* КАРТА */}
      <div className="h-[40vh] w-full relative z-0">
        <Map onLocationSelect={handleLocationSelect} />
        
        {price && Number(price) > 0 && (
          <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md rounded-xl p-2 shadow-lg z-20">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">💰 Narx</span>
              <span className="font-bold text-yellow-600">{Number(price).toLocaleString()} so'm</span>
            </div>
            {distance && (
              <div className="flex justify-between items-center text-xs text-gray-400 mt-1">
                <span>📏 {distance} km</span>
                <span>⏱️ ~{Math.round(distance * 2)} daqiqa</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* СТАТУС ЗАКАЗА */}
      {orderStatus === "waiting" && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 bg-yellow-500 text-white px-4 py-2 rounded-full shadow-lg animate-pulse">
          ⏳ Haydovchi qidirilmoqda...
        </div>
      )}

      {orderStatus === "driver_found" && driverOffer && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg animate-pulse">
          🚕 Haydovchi topildi!
        </div>
      )}

      {/* ФОРМА */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-2 z-10 p-4 pb-32 space-y-4 shadow-xl overflow-y-auto relative">
        
        {/* РАССТОЯНИЕ И СТОИМОСТЬ */}
        {distance && suggestedPrice && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">📏 Masofa: {distance} km</p>
              <p className="text-xs text-gray-500">⏱️ Vaqt: ~{Math.round(distance * 2)} daqiqa</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">💰 Taklif qilingan narx</p>
              <p className="font-bold text-green-700">{suggestedPrice.toLocaleString()} so'm</p>
              <p className="text-xs text-gray-400">(2000 so'm/km)</p>
            </div>
          </div>
        )}

        {/* FROM с подсказками */}
        <div className="relative">
          <div className="absolute left-3 top-3 text-yellow-500 text-lg">📍</div>
          <input
            className="w-full p-3 pl-10 border rounded-xl focus:outline-none focus:border-yellow-500 transition"
            placeholder="Qayerdan olish"
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              setActiveField("from");
            }}
            onFocus={() => {
              setActiveField("from");
              if (suggestions.length > 0 && from.length > 1) {
                setShowSuggestions(true);
              }
            }}
            disabled={orderStatus !== "idle"}
          />
          
          {/* Подсказки для FROM */}
          {showSuggestions && activeField === "from" && suggestions.length > 0 && (
            <div className="absolute z-50 mt-1 w-full bg-white rounded-xl shadow-lg border max-h-48 overflow-y-auto">
              {suggestions.map((addr, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setFrom(addr);
                    setShowSuggestions(false);
                    setActiveField(null);
                  }}
                  className="w-full text-left p-3 hover:bg-gray-50 transition border-b last:border-b-0"
                >
                  <span className="text-sm">{addr}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* TO с подсказками */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute left-3 top-3 text-red-500 text-lg">🏁</div>
            <input
              className="w-full p-3 pl-10 border rounded-xl focus:outline-none focus:border-yellow-500 transition"
              placeholder="Qayerga yetkazish"
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                setActiveField("to");
              }}
              onFocus={() => {
                setActiveField("to");
                if (suggestions.length > 0 && to.length > 1) {
                  setShowSuggestions(true);
                }
              }}
              disabled={orderStatus !== "idle"}
            />
            
            {/* Подсказки для TO */}
            {showSuggestions && activeField === "to" && suggestions.length > 0 && (
              <div className="absolute z-50 mt-1 w-full bg-white rounded-xl shadow-lg border max-h-48 overflow-y-auto">
                {suggestions.map((addr, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setTo(addr);
                      setShowSuggestions(false);
                      setActiveField(null);
                    }}
                    className="w-full text-left p-3 hover:bg-gray-50 transition border-b last:border-b-0"
                  >
                    <span className="text-sm">{addr}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button
            onClick={() => setShowStop(!showStop)}
            className="w-12 rounded-xl bg-yellow-500 text-white text-xl hover:bg-yellow-600 transition shadow-md"
            disabled={orderStatus !== "idle"}
          >
            +
          </button>
        </div>

        {/* БЫСТРЫЕ АДРЕСА */}
        <div className="flex flex-wrap gap-2">
          {savedAddresses.map((addr, index) => (
            <button
              key={index}
              onClick={() => {
                if (!from) {
                  setFrom(addr);
                } else if (!to) {
                  setTo(addr);
                }
              }}
              className="px-3 py-1.5 bg-gray-100 rounded-full text-xs text-gray-600 hover:bg-gray-200 transition"
              disabled={orderStatus !== "idle"}
            >
              {addr}
            </button>
          ))}
        </div>

        {showStop && (
          <div className="relative">
            <div className="absolute left-3 top-3 text-blue-500 text-lg">🔄</div>
            <input
              type="text"
              value={stop}
              onChange={(e) => setStop(e.target.value)}
              placeholder="Qo'shimcha manzil"
              className="w-full p-3 pl-10 rounded-xl border focus:outline-none focus:border-yellow-500 transition"
              disabled={orderStatus !== "idle"}
            />
          </div>
        )}

        {/* PRICE */}
        <div className="bg-gradient-to-r from-yellow-50 to-white border border-yellow-200 rounded-2xl p-4 space-y-2">
          <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <span className="text-xl">💰</span> 
            Narx taklif qiling (торg)
          </p>
          
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">so'm</span>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Masalan: 25 000"
              className="w-full p-3 pl-16 rounded-xl border focus:outline-none focus:border-yellow-500 text-lg font-semibold"
              disabled={orderStatus !== "idle"}
            />
          </div>
          
          {price && Number(price) > 0 && (
            <div className="mt-2 p-3 bg-yellow-100 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">💎 Sizning narxingiz:</span>
                <span className="font-bold text-yellow-700 text-lg">
                  {Number(price).toLocaleString()} so'm
                </span>
              </div>
            </div>
          )}
          
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <span>ℹ️</span> 
            Haydovchi sizning narxingizni qabul qiladi yoki o‘z narxini taklif qiladi
          </p>
        </div>

        {/* PAYMENT & COMMENT */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setShowPaymentModal(true)}
            className="flex-1 p-3 border rounded-xl bg-gray-50 text-left hover:border-yellow-500 transition"
            disabled={orderStatus !== "idle"}
          >
            <div className="text-sm text-gray-500">To'lov turi</div>
            <div className="font-semibold">{getPaymentText()}</div>
            {payment === "cash" && changeAmount && (
              <div className="text-xs text-gray-500">Beriladi: {Number(changeAmount).toLocaleString()} so'm</div>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowCommentModal(true)}
            className="flex-1 p-3 border rounded-xl bg-gray-50 text-left hover:border-yellow-500 transition"
            disabled={orderStatus !== "idle"}
          >
            <div className="text-sm text-gray-500">Izoh</div>
            <div className="font-semibold truncate">
              {comment ? (comment.length > 20 ? comment.slice(0, 20) + "..." : comment) : "Izoh qo'shish"}
            </div>
          </button>
        </div>

        {/* OPTIONS */}
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="w-full p-3 border rounded-xl bg-gray-50 text-left hover:border-yellow-500 transition flex justify-between items-center"
          disabled={orderStatus !== "idle"}
        >
          <div>
            <div className="text-sm text-gray-500">Qo'shimcha opsiyalar</div>
            <div className="font-semibold">⚙️ Sozlamalar</div>
          </div>
          <span className="text-gray-400">{showOptions ? "▲" : "▼"}</span>
        </button>

        {showOptions && (
          <div className="space-y-3 p-3 bg-gray-50 rounded-xl">
            {[
              ["👥 4+ yo'lovchi", passengers4, setPassengers4],
              ["👶 0–3 bolalar o'rindig'i", childSeat0_3, setChildSeat0_3],
              ["🧒 3–6 bolalar o'rindig'i", childSeat3_6, setChildSeat3_6],
              ["🪑 Buster 6–12", booster6_12, setBooster6_12],
            ].map(([label, state, setState]: any) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-sm">{label}</span>
                <button
                  onClick={() => setState(!state)}
                  className={`w-12 h-6 rounded-full p-1 transition ${
                    state ? "bg-yellow-500" : "bg-gray-300"
                  }`}
                  disabled={orderStatus !== "idle"}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition ${
                      state ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 z-50 shadow-lg">
        {orderStatus === "idle" ? (
          <button
            onClick={handleOrder}
            disabled={loading || !from || !to || !price}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition transform active:scale-95 shadow-md"
          >
            {loading ? "⏳ Yuborilmoqda..." : "🚕 Buyurtma berish"}
          </button>
        ) : orderStatus === "waiting" ? (
          <button
            onClick={cancelOrder}
            className="w-full bg-red-500 text-white p-3 rounded-xl font-semibold shadow-md"
          >
            ❌ Buyurtmani bekor qilish
          </button>
        ) : orderStatus === "driver_found" && driverOffer ? (
          <div className="flex gap-2">
            <button
              onClick={acceptDriverOffer}
              className="flex-1 bg-green-600 text-white p-3 rounded-xl font-semibold shadow-md"
            >
              ✅ Qabul qilish ({driverOffer.price.toLocaleString()} so'm)
            </button>
            <button
              onClick={rejectDriverOffer}
              className="flex-1 bg-red-500 text-white p-3 rounded-xl font-semibold shadow-md"
            >
              ❌ Rad etish
            </button>
          </div>
        ) : orderStatus === "completed" ? (
          <div className="w-full bg-green-600 text-white p-3 rounded-xl font-semibold text-center shadow-md">
            ✅ Buyurtma qabul qilindi! Haydovchi yo'lda
          </div>
        ) : orderStatus === "rejected" ? (
          <div className="w-full bg-yellow-500 text-white p-3 rounded-xl font-semibold text-center shadow-md animate-pulse">
            ⏳ Yangi haydovchi qidirilmoqda...
          </div>
        ) : null}
      </div>

      {/* PAYMENT MODAL */}
      {showPaymentModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowPaymentModal(false)} />
          <div className="fixed left-0 bottom-0 w-80 bg-white rounded-tr-2xl shadow-2xl z-50 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">💳 To'lov turi</h2>
              <button onClick={() => setShowPaymentModal(false)} className="text-xl">✕</button>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setPayment("card");
                  setChangeAmount("");
                  setShowPaymentModal(false);
                }}
                className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 ${
                  payment === "card" ? "border-yellow-500 bg-yellow-50" : "border-gray-200"
                }`}
              >
                <span className="text-2xl">💳</span>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-sm">Plastik karta</div>
                  <div className="text-xs text-gray-500">Karta orqali to'lov</div>
                </div>
                {payment === "card" && <span className="text-yellow-600 text-lg">✓</span>}
              </button>
              <button
                onClick={() => setPayment("cash")}
                className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 ${
                  payment === "cash" ? "border-yellow-500 bg-yellow-50" : "border-gray-200"
                }`}
              >
                <span className="text-2xl">💵</span>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-sm">Naqd pul</div>
                  <div className="text-xs text-gray-500">Yetkazib berishda naqd to'lov</div>
                </div>
                {payment === "cash" && <span className="text-yellow-600 text-lg">✓</span>}
              </button>
              {payment === "cash" && (
                <div className="mt-3 p-3 bg-gray-50 rounded-xl">
                  <label className="text-xs font-semibold mb-1 block">💵 Qancha pul berasiz?</label>
                  <input
                    type="number"
                    value={changeAmount}
                    onChange={(e) => setChangeAmount(e.target.value)}
                    placeholder="Summani kiriting"
                    className="w-full p-2 border rounded-lg text-sm"
                  />
                  {changeAmount && Number(price) && Number(changeAmount) >= Number(price) && (
                    <div className="mt-2 p-2 bg-yellow-50 rounded-lg text-sm">
                      <div className="flex justify-between">
                        <span>To'lov:</span>
                        <span className="font-bold">{Number(price).toLocaleString()} so'm</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Berildi:</span>
                        <span className="font-bold">{Number(changeAmount).toLocaleString()} so'm</span>
                      </div>
                      <div className="flex justify-between text-yellow-700 font-bold">
                        <span>Qaytim:</span>
                        <span>{calculateChange().toLocaleString()} so'm</span>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      if (!changeAmount || Number(changeAmount) < Number(price)) {
                        alert("Iltimos, to'lov summasini to'g'ri kiriting");
                        return;
                      }
                      setShowPaymentModal(false);
                    }}
                    className="w-full bg-yellow-500 text-white p-2 rounded-lg font-semibold text-sm mt-2"
                  >
                    Tasdiqlash
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* COMMENT MODAL */}
      {showCommentModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowCommentModal(false)} />
          <div className="fixed right-0 bottom-0 w-80 bg-white rounded-tl-2xl shadow-2xl z-50 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">📝 Izoh</h2>
              <button onClick={() => setShowCommentModal(false)} className="text-xl">✕</button>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Buyurtma uchun izoh..."
              className="w-full p-3 border rounded-xl h-28 resize-none text-sm focus:outline-none focus:border-yellow-500"
              maxLength={200}
            />
            <div className="text-xs text-gray-500 text-right mt-1">
              {comment.length}/200
            </div>
            <button
              onClick={() => setShowCommentModal(false)}
              className="w-full bg-yellow-500 text-white p-2 rounded-lg font-semibold mt-3 text-sm"
            >
              Saqlash
            </button>
            {comment && (
              <button
                onClick={() => {
                  setComment("");
                  setShowCommentModal(false);
                }}
                className="w-full bg-gray-200 text-gray-700 p-2 rounded-lg font-semibold mt-2 text-sm"
              >
                Tozalash
              </button>
            )}
          </div>
        </>
      )}

      {/* BURGER MENU */}
      {menuOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <div ref={menuRef} className="absolute top-0 right-0 w-72 h-full bg-white p-4 text-black shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-xl">🚕 Menyu</h2>
              <button onClick={() => setMenuOpen(false)} className="text-2xl">✕</button>
            </div>
            <div className="p-3 bg-yellow-50 rounded-xl mb-4">
              <p className="text-xs text-gray-500">Sizning balans</p>
              <p className="font-bold text-lg">0 so'm</p>
            </div>
            <button
              onClick={() => {
                setMenuOpen(false);
                router.push("/");
              }}
              className="w-full text-left p-3 rounded-xl hover:bg-gray-100 transition"
            >
              🏠 Bosh sahifa
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                router.push("/taxi/orders");
              }}
              className="w-full text-left p-3 rounded-xl hover:bg-gray-100 transition"
            >
              📋 Mening buyurtmalarim
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                router.push("/taxi/history");
              }}
              className="w-full text-left p-3 rounded-xl hover:bg-gray-100 transition"
            >
              📜 Tarix
            </button>
            <hr className="my-3" />
            <button
              onClick={() => {
                setMenuOpen(false);
                router.push("/login");
              }}
              className="w-full text-left p-3 rounded-xl text-blue-600 hover:bg-blue-50 transition"
            >
              🔐 Kirish
            </button>
          </div>
        </div>
      )}
    </main>
  );
}