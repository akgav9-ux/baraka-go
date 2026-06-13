"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const Map = dynamic(() => import("../../components/Map"), {
  ssr: false,
});

export default function CourierPage() {
  const router = useRouter();
  
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  
  const [payment, setPayment] = useState("cash");
  const [changeAmount, setChangeAmount] = useState("");
  const [comment, setComment] = useState("");
  const [weight, setWeight] = useState("5");
  const [urgent, setUrgent] = useState(false);
  const [packageType, setPackageType] = useState("posilka");
  const [price, setPrice] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);

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

  const handleCreateOrder = async () => {
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to,
          price: Number(price),
          packageType,
          weight: Number(weight),
          urgent,
          payment,
          comment,
          changeAmount: payment === "cash" ? Number(changeAmount) : null,
        }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || `Xato ${res.status}`);
      }

      const order = await res.json();
      router.push(`/tracking/${order.id}`);
      
    } catch (e) {
      console.error("Error creating order:", e);
      alert("Buyurtma yaratishda xatolik");
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <main className="h-screen flex flex-col bg-gray-100">
      {/* HEADER with MENU BUTTON */}
      <div className="bg-green-700 text-white px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-xs opacity-80">🛵 Kuryer xizmati</p>
          <p className="text-sm font-semibold">Tez yetkazib berish</p>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl">
          ☰
        </button>
      </div>

      {/* MAP */}
      <div className="h-[40vh] w-full">
        <Map />
      </div>

      {/* FORM */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-2 z-10 p-4 pb-32 space-y-4 shadow-xl overflow-y-auto">
        <input
          className="w-full p-3 border rounded-xl"
          placeholder="Qayerdan olish"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />

        <input
          className="w-full p-3 border rounded-xl"
          placeholder="Qayerga yetkazish"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />

        <div>
          <p className="text-sm font-semibold mb-2">Nima yuboriladi?</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              ["hujjat", "📄"],
              ["posilka", "📦"],
              ["gullar", "🌹"],
              ["xarid", "🛒"],
            ].map(([key, icon]) => (
              <button
                key={key}
                type="button"
                onClick={() => setPackageType(key)}
                className={`p-4 rounded-2xl border ${
                  packageType === key ? "bg-green-600 text-white" : "bg-white"
                }`}
              >
                <div className="text-2xl">{icon}</div>
                <div className="text-sm">{key}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="font-semibold mb-2">Og'irligi</p>
          <div className="grid grid-cols-3 gap-2">
            {["5", "10", "20"].map((kg) => (
              <button
                key={kg}
                type="button"
                onClick={() => setWeight(kg)}
                className={`p-2 rounded-xl border ${
                  weight === kg ? "bg-green-600 text-white" : ""
                }`}
              >
                {kg} kg
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center border p-3 rounded-xl">
          <div>
            <p className="font-semibold">Shoshilinch</p>
            <p className="text-xs text-gray-500">Tez yetkazish</p>
          </div>
          <button
            type="button"
            onClick={() => setUrgent(!urgent)}
            className={`w-12 h-6 rounded-full transition ${
              urgent ? "bg-green-600" : "bg-gray-300"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full transition ${
                urgent ? "translate-x-6" : ""
              }`}
            />
          </button>
        </div>

        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-3 border rounded-xl"
          placeholder="Narx (so'm)"
          type="number"
        />

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setShowPaymentModal(true)}
            className="flex-1 p-3 border rounded-xl bg-gray-50 text-left"
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
            className="flex-1 p-3 border rounded-xl bg-gray-50 text-left"
          >
            <div className="text-sm text-gray-500">Izoh</div>
            <div className="font-semibold truncate">
              {comment ? (comment.length > 20 ? comment.slice(0, 20) + "..." : comment) : "Izoh qo'shish"}
            </div>
          </button>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-2 z-50">
        <div className="flex items-center gap-2">
          <button
            onClick={handleCreateOrder}
            disabled={loading}
            className="flex-1 bg-green-700 text-white p-3 rounded-xl disabled:opacity-50 font-semibold"
          >
            {loading ? "Yuborilmoqda..." : "🚚 Kuryer chaqirish"}
          </button>
        </div>
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
                  payment === "card" ? "border-green-600 bg-green-50" : "border-gray-200"
                }`}
              >
                <span className="text-2xl">💳</span>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-sm">Plastik karta</div>
                  <div className="text-xs text-gray-500">Karta orqali to'lov</div>
                </div>
                {payment === "card" && <span className="text-green-600 text-lg">✓</span>}
              </button>

              <button
                onClick={() => setPayment("cash")}
                className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 ${
                  payment === "cash" ? "border-green-600 bg-green-50" : "border-gray-200"
                }`}
              >
                <span className="text-2xl">💵</span>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-sm">Naqd pul</div>
                  <div className="text-xs text-gray-500">Yetkazib berishda naqd to'lov</div>
                </div>
                {payment === "cash" && <span className="text-green-600 text-lg">✓</span>}
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
                    <div className="mt-2 p-2 bg-green-50 rounded-lg text-sm">
                      <div className="flex justify-between">
                        <span>To'lov:</span>
                        <span className="font-bold">{Number(price).toLocaleString()} so'm</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Berildi:</span>
                        <span className="font-bold">{Number(changeAmount).toLocaleString()} so'm</span>
                      </div>
                      <div className="flex justify-between text-green-700 font-bold">
                        <span>Qaytim:</span>
                        <span>{calculateChange().toLocaleString()} so'm</span>
                      </div>
                    </div>
                  )}

                  {changeAmount && Number(price) && Number(changeAmount) < Number(price) && (
                    <div className="mt-2 p-2 bg-red-50 rounded-lg text-xs text-red-600">
                      ⚠️ Berilgan pul {Number(price).toLocaleString()} so'mdan kam!
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
                    className="w-full bg-green-600 text-white p-2 rounded-lg font-semibold text-sm mt-2"
                  >
                    Tasdiqlash
                  </button>
                </div>
              )}

              {payment === "card" && (
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="w-full bg-green-600 text-white p-2 rounded-lg font-semibold text-sm mt-3"
                >
                  Saqlash
                </button>
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
              className="w-full p-3 border rounded-xl h-28 resize-none text-sm"
              maxLength={200}
            />

            <div className="text-xs text-gray-500 text-right mt-1">
              {comment.length}/200
            </div>

            <button
              onClick={() => setShowCommentModal(false)}
              className="w-full bg-green-600 text-white p-2 rounded-lg font-semibold mt-3 text-sm"
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
          <div
            ref={menuRef}
            className="absolute top-0 right-0 w-72 h-full bg-white p-4 text-black shadow-xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-xl">🛵 Menyu</h2>
              <button onClick={() => setMenuOpen(false)} className="text-2xl">✕</button>
            </div>

            <button
              onClick={() => {
                setMenuOpen(false);
                router.push("/");
              }}
              className="w-full text-left p-3 rounded-xl hover:bg-gray-100"
            >
              🏠 Bosh sahifa
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                router.push("/courier/orders");
              }}
              className="w-full text-left p-3 rounded-xl hover:bg-gray-100"
            >
              📦 Yangi buyurtmalar
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                router.push("/courier/active");
              }}
              className="w-full text-left p-3 rounded-xl hover:bg-gray-100"
            >
              🚚 Faol buyurtma
            </button>

            <hr className="my-3" />

            <button
              onClick={() => {
                setMenuOpen(false);
                router.push("/login");
              }}
              className="w-full text-left p-3 rounded-xl text-blue-600 hover:bg-blue-50"
            >
              🔐 Kirish
            </button>
          </div>
        </div>
      )}
    </main>
  );
}