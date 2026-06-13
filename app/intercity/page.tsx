"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const Map = dynamic(() => import("../../components/Map"), {
  ssr: false,
});

const mockTrips = [
  {
    id: 1,
    from: "Asaka",
    to: "Toshkent",
    price: 120000,
    time: "14:00",
    seats: 3,
    driver: "Sarvar",
    car: "Toyota Camry",
    rating: 4.8,
  },
  {
    id: 2,
    from: "Andijon",
    to: "Toshkent",
    price: 150000,
    time: "09:00",
    seats: 2,
    driver: "Jasur",
    car: "Hyundai Sonata",
    rating: 4.9,
  },
  {
    id: 3,
    from: "Namangan",
    to: "Toshkent",
    price: 130000,
    time: "16:30",
    seats: 4,
    driver: "Alisher",
    car: "Kia Optima",
    rating: 4.7,
  },
];

export default function IntercityPage() {
  const router = useRouter();
  
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [showTrips, setShowTrips] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [showStop, setShowStop] = useState(false);

  const [payment, setPayment] = useState("cash");
  const [comment, setComment] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [stop, setStop] = useState("");
  const [loading, setLoading] = useState(false);
  const [passengers, setPassengers] = useState(1);
  const [showPassengers, setShowPassengers] = useState(false);
  const [changeAmount, setChangeAmount] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

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
    const priceNum = Number(offerPrice || selectedTrip?.price);
    const changeNum = Number(changeAmount);
    if (priceNum && changeNum && changeNum > priceNum) {
      return changeNum - priceNum;
    }
    return 0;
  };

  const handleOrder = async () => {
    if (!from || !to) {
      alert("Iltimos, jo'natish va qabul qilish manzillarini to'ldiring");
      return;
    }

    if (!selectedTrip) {
      alert("Iltimos, safarni tanlang");
      return;
    }

    const finalPrice = offerPrice ? Number(offerPrice) : selectedTrip.price;

    if (!finalPrice || finalPrice <= 0) {
      alert("Iltimos, to'g'ri narxni kiriting");
      return;
    }

    if (payment === "cash" && changeAmount && Number(changeAmount) < finalPrice) {
      alert("Berilgan pul narxdan kam bo'lishi mumkin emas!");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      alert(`✅ Buyurtma qabul qilindi!\n\n📍 Qayerdan: ${from}\n📍 Qayerga: ${to}\n🚗 Haydovchi: ${selectedTrip.driver}\n💰 Narx: ${finalPrice.toLocaleString()} so'm\n👥 Yo'lovchilar: ${passengers}\n💳 To'lov: ${getPaymentText()}\n\nHaydovchi siz bilan bog'lanadi!`);
      setLoading(false);
      router.push("/");
    }, 1500);
  };

  return (
    <main className="h-screen flex flex-col bg-gray-100 relative">
      
      {/* ========== СВЕТЛО-ФИОЛЕТОВАЯ ШАПКА С РАДИУСОМ СНИЗУ ========== */}
      <div className="bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 text-white px-4 py-3 flex items-center justify-between shadow-lg relative z-30 rounded-b-3xl">
        <div>
          <p className="text-xs opacity-80">🚌 Shaharlararo</p>
          <p className="text-sm font-semibold">Qulay va tez sayohat</p>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl">
          ☰
        </button>
      </div>

      {/* ========== КАРТА ========== */}
      <div className="h-[35vh] w-full relative z-0">
        <Map />
        
        {/* Floating price tag */}
        {(offerPrice || selectedTrip) && (
          <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md rounded-xl p-2 shadow-lg z-20">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">💰 Narx</span>
              <span className="font-bold text-purple-600">
                {(offerPrice ? Number(offerPrice) : selectedTrip?.price || 0).toLocaleString()} so'm
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ========== ФОРМА ========== */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-2 z-10 p-4 pb-32 space-y-4 shadow-xl overflow-y-auto">
        
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-lg text-gray-800">🚌 Shaharlararo</p>
            <p className="text-xs text-gray-500">Tanlang va jo'nang</p>
          </div>

          <button
            onClick={() => setShowTrips(!showTrips)}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition transform active:scale-95"
          >
            {showTrips ? "📋 Yopish" : "🚐 Safarlar"}
          </button>
        </div>

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
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute left-3 top-3 text-blue-500 text-lg">🔄</div>
            <input
              className="w-full p-3 pl-10 border rounded-xl focus:outline-none focus:border-purple-500 transition"
              placeholder="To'xtash joyi (ixtiyoriy)"
              value={stop}
              onChange={(e) => setStop(e.target.value)}
            />
          </div>
        </div>

        {/* TRIP LIST */}
        {showTrips && (
          <div className="space-y-2 animate-fadeIn">
            <p className="text-xs font-semibold text-gray-500">📋 Mavjud safarlar:</p>
            {mockTrips.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedTrip(t);
                  setFrom(t.from);
                  setTo(t.to);
                  setShowTrips(false);
                }}
                className={`w-full p-4 rounded-xl border-2 text-left transition transform active:scale-98 ${
                  selectedTrip?.id === t.id
                    ? "bg-purple-500 text-white border-purple-600 shadow-md"
                    : "bg-white border-gray-200 hover:border-purple-400 hover:shadow-md"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-lg">{t.from} → {t.to}</div>
                    <div className="text-sm opacity-80">🚗 {t.car} • 👤 {t.driver}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{t.time}</div>
                    <div className="text-xs opacity-80">⭐ {t.rating}</div>
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <span>💰 {t.price.toLocaleString()} so'm</span>
                  <span>💺 {t.seats} joy</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* SELECTED TRIP INFO */}
        {selectedTrip && !showTrips && (
          <div className="bg-gradient-to-r from-purple-50 to-white border border-purple-200 rounded-xl p-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500">Tanlangan safar</p>
                <p className="font-semibold">{selectedTrip.from} → {selectedTrip.to}</p>
                <p className="text-xs text-gray-500">{selectedTrip.time} • {selectedTrip.car} • {selectedTrip.driver}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">⭐ {selectedTrip.rating}</p>
                <p className="text-xs text-gray-500">💺 {selectedTrip.seats} joy</p>
              </div>
            </div>
          </div>
        )}

        {/* PASSENGERS COUNT */}
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
              {[1, 2, 3, 4].map((num) => (
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

        {/* OFFER PRICE (TORG) */}
        <div className="bg-gradient-to-r from-purple-50 to-white border border-purple-200 rounded-2xl p-4 space-y-2">
          <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <span className="text-xl">💰</span> 
            Narx taklif qiling (торг)
          </p>
          
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">so'm</span>
            <input
              type="number"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              placeholder={selectedTrip ? `Taklif narx (${selectedTrip.price.toLocaleString()} so'm)` : "Masalan: 100 000"}
              className="w-full p-3 pl-16 rounded-xl border focus:outline-none focus:border-purple-500 text-lg font-semibold"
            />
          </div>
          
          {offerPrice && Number(offerPrice) > 0 && selectedTrip && (
            <div className="mt-2 p-3 bg-purple-100 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">💎 Sizning narxingiz:</span>
                <span className="font-bold text-purple-700 text-lg">
                  {Number(offerPrice).toLocaleString()} so'm
                </span>
              </div>
              {Number(offerPrice) < selectedTrip.price && (
                <p className="text-xs text-green-600 mt-1">✅ Haydovchiga taklif yuboriladi</p>
              )}
            </div>
          )}
          
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <span>ℹ️</span> 
            Siz narx taklif qilasiz, haydovchi qabul qiladi yoki o‘zgartiradi
          </p>
        </div>

        {/* PAYMENT & COMMENT */}
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

      {/* ========== BOTTOM BAR ========== */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 z-50 shadow-lg">
        <button
          onClick={handleOrder}
          disabled={loading || !from || !to || !selectedTrip}
          className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed font-bold transition transform active:scale-95 shadow-md"
        >
          {loading ? "⏳ Yuborilmoqda..." : "🚐 Buyurtma berish"}
        </button>
      </div>

      {/* ========== PAYMENT MODAL ========== */}
      {showPaymentModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowPaymentModal(false)} />
          <div className="fixed left-0 bottom-0 w-80 bg-white rounded-tr-2xl shadow-2xl z-50 p-4 animate-slideUp">
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
                className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 transition ${
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
                className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 transition ${
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
                  
                  {changeAmount && Number(offerPrice || selectedTrip?.price) && Number(changeAmount) >= Number(offerPrice || selectedTrip?.price) && (
                    <div className="mt-2 p-2 bg-purple-50 rounded-lg text-sm">
                      <div className="flex justify-between">
                        <span>To'lov:</span>
                        <span className="font-bold">{(Number(offerPrice || selectedTrip?.price)).toLocaleString()} so'm</span>
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
                      const finalPrice = Number(offerPrice || selectedTrip?.price);
                      if (!changeAmount || Number(changeAmount) < finalPrice) {
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

      {/* ========== COMMENT MODAL ========== */}
      {showComment && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowComment(false)} />
          <div className="fixed right-0 bottom-0 w-80 bg-white rounded-tl-2xl shadow-2xl z-50 p-4 animate-slideUp">
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

      {/* ========== BURGER MENU ========== */}
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
                router.push("/intercity/trips");
              }}
              className="w-full text-left p-3 rounded-xl hover:bg-gray-100 transition"
            >
              📋 Mening safarlarim
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
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </main>
  );
}