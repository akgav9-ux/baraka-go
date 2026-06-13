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
  
  // 👥 OPTIONS
  const [passengers4, setPassengers4] = useState(false);
  const [childSeat0_3, setChildSeat0_3] = useState(false);
  const [childSeat3_6, setChildSeat3_6] = useState(false);
  const [booster6_12, setBooster6_12] = useState(false);
  
  const [price, setPrice] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [stop, setStop] = useState("");
  const [loading, setLoading] = useState(false);

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

    setTimeout(() => {
      alert(`✅ Buyurtma qabul qilindi!\n\n📍 Qayerdan: ${from}\n📍 Qayerga: ${to}\n💰 Narx: ${price} so'm\n💳 To'lov: ${getPaymentText()}\n\nHaydovchi qidirilmoqda...`);
      setLoading(false);
    }, 1500);
  };

  return (
    <main className="h-screen flex flex-col bg-gray-100 relative">
      
      {/* ========== ЖЕЛТАЯ ШАПКА как в Яндекс.Такси ========== */}
      <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black px-4 py-3 flex items-center justify-between shadow-lg relative z-30 rounded-b-3xl">
        <div>
          <p className="text-xs opacity-80">🚕 Taxi xizmati</p>
          <p className="text-sm font-semibold">Tez va qulay</p>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl">
          ☰
        </button>
      </div>

      {/* ========== КАРТА ========== */}
      <div className="h-[40vh] w-full relative z-0">
        <Map />
        
        {/* Floating price tag */}
        {price && (
          <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md rounded-xl p-2 shadow-lg z-20">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">💰 Taklif qilingan narx</span>
              <span className="font-bold text-yellow-600">{Number(price).toLocaleString()} so'm</span>
            </div>
          </div>
        )}
      </div>

      {/* ========== ФОРМА ========== */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-2 z-10 p-4 pb-32 space-y-4 shadow-xl overflow-y-auto relative">
        
        {/* FROM */}
        <div className="relative">
          <div className="absolute left-3 top-3 text-yellow-500 text-lg">📍</div>
          <input
            className="w-full p-3 pl-10 border rounded-xl focus:outline-none focus:border-yellow-500 transition"
            placeholder="Qayerdan olish"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>

        {/* TO with stop button */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute left-3 top-3 text-red-500 text-lg">🏁</div>
            <input
              className="w-full p-3 pl-10 border rounded-xl focus:outline-none focus:border-yellow-500 transition"
              placeholder="Qayerga yetkazish"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowStop(!showStop)}
            className="w-12 rounded-xl bg-yellow-500 text-white text-xl hover:bg-yellow-600 transition shadow-md"
          >
            +
          </button>
        </div>

        {/* STOP */}
        {showStop && (
          <div className="relative">
            <div className="absolute left-3 top-3 text-blue-500 text-lg">🔄</div>
            <input
              type="text"
              value={stop}
              onChange={(e) => setStop(e.target.value)}
              placeholder="Qo'shimcha manzil"
              className="w-full p-3 pl-10 rounded-xl border focus:outline-none focus:border-yellow-500 transition"
            />
          </div>
        )}

        {/* PRICE BID (TORG) */}
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
          >
            <div className="text-sm text-gray-500">Izoh</div>
            <div className="font-semibold truncate">
              {comment ? (comment.length > 20 ? comment.slice(0, 20) + "..." : comment) : "Izoh qo'shish"}
            </div>
          </button>
        </div>

        {/* OPTIONS BUTTON */}
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="w-full p-3 border rounded-xl bg-gray-50 text-left hover:border-yellow-500 transition flex justify-between items-center"
        >
          <div>
            <div className="text-sm text-gray-500">Qo'shimcha opsiyalar</div>
            <div className="font-semibold">⚙️ Sozlamalar</div>
          </div>
          <span className="text-gray-400">{showOptions ? "▲" : "▼"}</span>
        </button>

        {/* OPTIONS CONTENT */}
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

      {/* ========== BOTTOM BAR ========== */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 z-50 shadow-lg">
        <button
          onClick={handleOrder}
          disabled={loading || !from || !to || !price}
          className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition transform active:scale-95 shadow-md"
        >
          {loading ? "⏳ Yuborilmoqda..." : "🚕 Buyurtma berish"}
        </button>
      </div>

      {/* ========== PAYMENT MODAL ========== */}
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
                className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 transition ${
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
                className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 transition ${
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

              {payment === "card" && (
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="w-full bg-yellow-500 text-white p-2 rounded-lg font-semibold text-sm mt-3"
                >
                  Saqlash
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* ========== COMMENT MODAL ========== */}
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

      {/* ========== BURGER MENU ========== */}
      {menuOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <div
            ref={menuRef}
            className="absolute top-0 right-0 w-72 h-full bg-white p-4 text-black shadow-xl"
          >
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