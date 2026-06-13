"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const Map = dynamic(() => import("../../components/Map"), {
  ssr: false,
});

export default function IntercityPage() {
  const router = useRouter();
  
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  
  const [showTrips, setShowTrips] = useState(false);
  const [showComment, setShowComment] = useState(false);

  const [payment, setPayment] = useState("cash");
  const [comment, setComment] = useState("");
  const [price, setPrice] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [stop, setStop] = useState("");
  const [loading, setLoading] = useState(false);
  const [passengers, setPassengers] = useState(1);
  const [showPassengers, setShowPassengers] = useState(false);
  const [changeAmount, setChangeAmount] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // Список попутных рейсов от водителей
  const [trips, setTrips] = useState<any[]>([]);
  const [loadingTrips, setLoadingTrips] = useState(false);

  // Загрузка рейсов от водителей
  const fetchTrips = async () => {
    setLoadingTrips(true);
    try {
      const res = await fetch('/api/trips');
      const data = await res.json();
      console.log("🚌 Попутные рейсы:", data);
      setTrips(data);
    } catch (error) {
      console.error('Ошибка загрузки рейсов:', error);
    } finally {
      setLoadingTrips(false);
    }
  };

  // Загружаем рейсы при открытии
  useEffect(() => {
    fetchTrips();
    // Обновляем каждые 10 секунд
    const interval = setInterval(fetchTrips, 10000);
    return () => clearInterval(interval);
  }, []);

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

  // Бронирование места у водителя
  const handleBookTrip = async (trip: any) => {
    if (confirm(`${trip.from} → ${trip.to} yo'nalishidagi safarga ${trip.price.toLocaleString()} so'mga bron qilasizmi?\n\n🚗 ${trip.car}\n👤 Haydovchi: ${trip.driver}\n⭐ Reyting: ${trip.rating}\n💺 ${trip.seats} ta joy mavjud`)) {
      
      try {
        // Уменьшаем количество мест
        const res = await fetch('/api/trips', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: trip.id,
            seats: trip.seats - 1,
            status: trip.seats - 1 === 0 ? 'full' : 'active',
          }),
        });
        
        if (res.ok) {
          alert(`✅ Safar bron qilindi!\n\n📍 ${trip.from} → ${trip.to}\n💰 ${trip.price.toLocaleString()} so'm\n🚗 Haydovchi: ${trip.driver}\n📞 Telefon: ${trip.driverPhone}\n\nHaydovchi sizga qo'ng'iroq qiladi!`);
          
          // Обновляем список рейсов
          await fetchTrips();
          
          // Закрываем список рейсов
          setShowTrips(false);
        } else {
          alert("❌ Xatolik yuz berdi");
        }
      } catch (error) {
        console.error(error);
        alert("❌ Xatolik yuz berdi");
      }
    }
  };

  // Позвонить водителю
  const handleCallDriver = (phone: string) => {
    window.location.href = `tel:${phone}`;
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

    if (payment === "cash" && changeAmount && Number(changeAmount) < Number(price)) {
      alert("Berilgan pul narxdan kam bo'lishi mumkin emas!");
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
          passengers,
          payment,
          comment,
          stop: stop || null,
          packageType: "intercity",
          weight: 0,
          urgent: false,
          changeAmount: payment === "cash" ? Number(changeAmount) : null,
        }),
      });

      if (!res.ok) throw new Error("Ошибка");

      const order = await res.json();
      alert(`✅ Buyurtma qabul qilindi! №${order.id}\n\n📍 ${from} → ${to}\n💰 ${Number(price).toLocaleString()} so'm\n👥 ${passengers} yo'lovchi\n\nTez orada haydovchi siz bilan bog'lanadi!`);
      router.push("/");
    } catch (error) {
      console.error(error);
      alert("❌ Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen flex flex-col bg-gray-100 relative">
      
      {/* ШАПКА */}
      <div className="bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 text-white px-4 py-3 flex items-center justify-between shadow-lg relative z-30 rounded-b-3xl">
        <div>
          <p className="text-xs opacity-80">🚌 Shaharlararo</p>
          <p className="text-sm font-semibold">Qulay va tez sayohat</p>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl">
          ☰
        </button>
      </div>

      {/* КАРТА */}
      <div className="h-[35vh] w-full relative z-0">
        <Map />
        
        {price && Number(price) > 0 && (
          <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md rounded-xl p-2 shadow-lg z-20">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">💰 Narx</span>
              <span className="font-bold text-purple-600">
                {Number(price).toLocaleString()} so'm
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ФОРМА */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-2 z-10 p-4 pb-32 space-y-4 shadow-xl overflow-y-auto">
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-lg text-gray-800">🚌 Shaharlararo</p>
            <p className="text-xs text-gray-500">Jo'nash vaqtini tanlang</p>
          </div>
          <button
            onClick={() => {
              fetchTrips();
              setShowTrips(!showTrips);
            }}
            className="px-4 py-2 bg-gray-100 text-purple-600 rounded-xl text-sm font-semibold border border-purple-200"
          >
            {showTrips ? "📋 Yopish" : "🚐 Safarlarni ko'rish"}
          </button>
        </div>

        {/* СПИСОК ПОПУТНЫХ РЕЙСОВ ОТ ВОДИТЕЛЕЙ */}
        {showTrips && (
          <div className="space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-500">🚌 Haydovchilarning reyslari:</p>
              <button onClick={fetchTrips} className="text-xs text-purple-500">
                🔄 Yangilash
              </button>
            </div>
            
            {loadingTrips ? (
              <div className="text-center py-8">
                <div className="inline-block w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-gray-400 mt-2">Yuklanmoqda...</p>
              </div>
            ) : trips.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <div className="text-4xl mb-2">🚌</div>
                <p className="text-gray-500 text-sm">Hozircha hech qanday reys yo'q</p>
                <p className="text-xs text-gray-400">Haydovchilar reys qo'shganda bu yerda ko'rinadi</p>
              </div>
            ) : (
              trips.map((trip) => (
                <div key={trip.id} className="bg-white border-2 border-purple-200 rounded-xl p-3 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-bold text-gray-800">
                        {trip.from} <span className="text-purple-500">→</span> {trip.to}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">📅 {trip.date}</span>
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">⏰ {trip.time}</span>
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">🚗 {trip.car}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-yellow-600">⭐ {trip.rating}</span>
                        <span className="text-xs text-green-600">💺 {trip.seats} ta joy</span>
                        <span className="text-xs text-purple-600 font-bold">{trip.price.toLocaleString()} so'm</span>
                      </div>
                      {trip.comment && (
                        <div className="text-xs text-gray-400 mt-1">📝 {trip.comment}</div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 ml-2">
                      <button
                        onClick={() => handleBookTrip(trip)}
                        disabled={trip.seats === 0}
                        className="px-3 py-1 bg-purple-500 text-white rounded-lg text-xs font-semibold disabled:opacity-50"
                      >
                        Bron qilish
                      </button>
                      <button
                        onClick={() => handleCallDriver(trip.driverPhone)}
                        className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs font-semibold"
                      >
                        📞 Qo'ng'iroq
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t text-xs text-gray-400">
                    👤 Haydovchi: {trip.driver}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* FROM */}
        <div className="relative">
          <div className="absolute left-3 top-3 text-purple-500 text-lg">📍</div>
          <input
            className="w-full p-3 pl-10 border rounded-xl focus:outline-none focus:border-purple-500 transition"
            placeholder="Qayerdan (shahar)"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>

        {/* TO */}
        <div className="relative">
          <div className="absolute left-3 top-3 text-red-500 text-lg">🏁</div>
          <input
            className="w-full p-3 pl-10 border rounded-xl focus:outline-none focus:border-purple-500 transition"
            placeholder="Qayerga (shahar)"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>

        {/* STOP */}
        <div className="relative">
          <div className="absolute left-3 top-3 text-blue-500 text-lg">🔄</div>
          <input
            className="w-full p-3 pl-10 border rounded-xl focus:outline-none focus:border-purple-500 transition"
            placeholder="To'xtash joyi (ixtiyoriy)"
            value={stop}
            onChange={(e) => setStop(e.target.value)}
          />
        </div>

        {/* Количество пассажиров */}
        <div>
          <button
            onClick={() => setShowPassengers(!showPassengers)}
            className="w-full p-3 border rounded-xl bg-gray-50 text-left hover:border-purple-500 transition flex justify-between items-center"
          >
            <div>
              <div className="text-sm text-gray-500">👥 Yo'lovchilar soni</div>
              <div className="font-semibold">{passengers} ta yo'lovchi</div>
            </div>
            <span className="text-gray-400">{showPassengers ? "▲" : "▼"}</span>
          </button>

          {showPassengers && (
            <div className="mt-2 p-3 bg-gray-50 rounded-xl flex gap-2">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    setPassengers(num);
                    setShowPassengers(false);
                  }}
                  className={`flex-1 p-2 rounded-lg border transition ${
                    passengers === num
                      ? "bg-purple-500 text-white border-purple-600"
                      : "bg-white border-gray-200"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Цена */}
        <div className="bg-gradient-to-r from-purple-50 to-white border border-purple-200 rounded-2xl p-4 space-y-2">
          <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <span className="text-xl">💰</span> 
            Narx taklif qiling (торг)
          </p>
          
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">so'm</span>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Masalan: 100 000"
              className="w-full p-3 pl-16 rounded-xl border focus:outline-none focus:border-purple-500 text-lg font-semibold"
            />
          </div>
          
          {price && Number(price) > 0 && (
            <div className="mt-2 p-3 bg-purple-100 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">💎 Sizning narxingiz:</span>
                <span className="font-bold text-purple-700 text-lg">
                  {Number(price).toLocaleString()} so'm
                </span>
              </div>
            </div>
          )}
          
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <span>ℹ️</span> 
            Siz narx taklif qilasiz, haydovchilar taklifni ko'rib chiqadi
          </p>
        </div>

        {/* Оплата и комментарий */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setShowPaymentModal(true)}
            className="flex-1 p-3 border rounded-xl bg-gray-50 text-left hover:border-purple-500 transition"
          >
            <div className="text-sm text-gray-500">To'lov turi</div>
            <div className="font-semibold">{getPaymentText()}</div>
          </button>

          <button
            type="button"
            onClick={() => setShowComment(true)}
            className="flex-1 p-3 border rounded-xl bg-gray-50 text-left hover:border-purple-500 transition"
          >
            <div className="text-sm text-gray-500">Izoh</div>
            <div className="font-semibold truncate">
              {comment ? (comment.length > 20 ? comment.slice(0, 20) + "..." : comment) : "Izoh qo'shish"}
            </div>
          </button>
        </div>
      </div>

      {/* Кнопка заказа */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 z-50 shadow-lg">
        <button
          onClick={handleOrder}
          disabled={loading || !from || !to || !price}
          className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed font-bold transition transform active:scale-95 shadow-md"
        >
          {loading ? "⏳ Yuborilmoqda..." : "🚐 Buyurtma berish"}
        </button>
      </div>

      {/* Модалка оплаты */}
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
                  payment === "card" ? "border-purple-500 bg-purple-50" : "border-gray-200"
                }`}
              >
                <span className="text-2xl">💳</span>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-sm">Plastik karta</div>
                  <div className="text-xs text-gray-500">Karta orqali to'lov</div>
                </div>
                {payment === "card" && <span className="text-purple-600 text-lg">✓</span>}
              </button>

              <button
                onClick={() => setPayment("cash")}
                className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 ${
                  payment === "cash" ? "border-purple-500 bg-purple-50" : "border-gray-200"
                }`}
              >
                <span className="text-2xl">💵</span>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-sm">Naqd pul</div>
                  <div className="text-xs text-gray-500">Yetkazib berishda naqd to'lov</div>
                </div>
                {payment === "cash" && <span className="text-purple-600 text-lg">✓</span>}
              </button>

              {payment === "cash" && (
                <div className="mt-3 p-3 bg-gray-50 rounded-xl">
                  <label className="text-xs font-semibold mb-1 block">
                    💵 Qancha pul berasiz?
                  </label>
                  <input
                    type="number"
                    value={changeAmount}
                    onChange={(e) => setChangeAmount(e.target.value)}
                    placeholder="Summani kiriting"
                    className="w-full p-2 border rounded-lg text-sm"
                  />
                  
                  {changeAmount && Number(price) && Number(changeAmount) >= Number(price) && (
                    <div className="mt-2 p-2 bg-purple-50 rounded-lg text-sm">
                      <div className="flex justify-between">
                        <span>To'lov:</span>
                        <span className="font-bold">{Number(price).toLocaleString()} so'm</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Berildi:</span>
                        <span className="font-bold">{Number(changeAmount).toLocaleString()} so'm</span>
                      </div>
                      <div className="flex justify-between text-purple-700 font-bold">
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
                    className="w-full bg-purple-500 text-white p-2 rounded-lg font-semibold text-sm mt-2"
                  >
                    Tasdiqlash
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Модалка комментария */}
      {showComment && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowComment(false)} />
          <div className="fixed right-0 bottom-0 w-80 bg-white rounded-tl-2xl shadow-2xl z-50 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">📝 Izoh</h2>
              <button onClick={() => setShowComment(false)} className="text-xl">✕</button>
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Buyurtma uchun izoh..."
              className="w-full p-3 border rounded-xl h-28 resize-none text-sm focus:outline-none focus:border-purple-500"
              maxLength={200}
            />

            <div className="text-xs text-gray-500 text-right mt-1">
              {comment.length}/200
            </div>

            <button
              onClick={() => setShowComment(false)}
              className="w-full bg-purple-500 text-white p-2 rounded-lg font-semibold mt-3 text-sm"
            >
              Saqlash
            </button>
          </div>
        </>
      )}

      {/* Бургер меню */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <div
            ref={menuRef}
            className="absolute top-0 right-0 w-72 h-full bg-white p-4 text-black shadow-xl z-[100]"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-xl">🚌 Menyu</h2>
              <button onClick={() => setMenuOpen(false)} className="text-2xl">✕</button>
            </div>

            <div className="p-3 bg-purple-50 rounded-xl mb-4">
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
                router.push("/intercity/history");
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

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </main>
  );
}