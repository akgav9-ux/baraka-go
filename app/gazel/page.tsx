"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const Map = dynamic(() => import("../../components/Map"), {
  ssr: false,
});

export default function GazelPage() {
  const router = useRouter();
  
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  
  const [payment, setPayment] = useState("cash");
  const [comment, setComment] = useState("");
  const [price, setPrice] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  
  // Специфичные для газели поля
  const [showStop, setShowStop] = useState(false);
  const [stops, setStops] = useState<string[]>([]);
  const [additionalStop, setAdditionalStop] = useState("");
  const [body, setBody] = useState("S");
  const [loader, setLoader] = useState(0);
  const [escort, setEscort] = useState(0);
  const [priceType, setPriceType] = useState("route");

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

  const handleAddStop = () => {
    if (additionalStop.trim()) {
      setStops([...stops, additionalStop]);
      setAdditionalStop("");
      setShowStop(false);
    }
  };

  const handleRemoveStop = (index: number) => {
    setStops(stops.filter((_, i) => i !== index));
  };

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
      const fullComment = `[Gazel] Kuzov:${body} | Yuk tashuvchi:${loader} | Hamroh:${escort} | Hisob:${priceType === "route" ? "Marshrut" : "Soat"} | ${comment}`;
      
      let fullFrom = from;
      if (stops.length > 0) {
        fullFrom = `${from} (→ ${stops.join(" → ")})`;
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fullFrom,
          to: to,
          price: Number(price),
          packageType: "gazel",
          weight: 0,
          urgent: false,
          payment: payment,
          comment: fullComment,
        }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || `Xato ${res.status}`);
      }

      const order = await res.json();
      alert("Buyurtma muvaffaqiyatli yuborildi!");
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

  const getBodyName = (size: string) => {
    switch (size) {
      case "S": return "Kichik (S)";
      case "M": return "O'rta (M)";
      case "L": return "Katta (L)";
      case "XL": return "Katta (XL)";
      case "XXL": return "Judayam katta (XXL)";
      default: return size;
    }
  };

  return (
    <main className="h-screen flex flex-col bg-gray-100 relative">
      {/* HEADER with MENU BUTTON */}
      <div className="bg-blue-700 text-white px-4 py-3 flex items-center justify-between rounded-b-3xl relative z-30">
        <div>
          <p className="text-xs opacity-80">🚚 Yuk tashish</p>
          <p className="text-sm font-semibold">Gazel xizmati</p>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl">
          ☰
        </button>
      </div>

      {/* MAP */}
      <div className="h-[40vh] w-full relative z-0">
        <Map />
      </div>

      {/* FORM */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-2 z-10 p-4 pb-32 space-y-4 shadow-xl overflow-y-auto relative">
        <input
          className="w-full p-3 border rounded-xl"
          placeholder="Qayerdan (A)"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />

        <input
          className="w-full p-3 border rounded-xl"
          placeholder="Qayerga (B)"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />

        {/* Дополнительные остановки */}
        <button
          onClick={() => setShowStop(!showStop)}
          className="w-full p-2 bg-gray-100 rounded-xl text-sm text-gray-600"
        >
          ➕ To‘xtash joyi qo‘shish
        </button>

        {showStop && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                className="flex-1 p-3 border rounded-xl"
                placeholder="Qo‘shimcha to‘xtash manzili"
                value={additionalStop}
                onChange={(e) => setAdditionalStop(e.target.value)}
              />
              <button
                onClick={handleAddStop}
                className="px-4 bg-green-600 text-white rounded-xl"
              >
                Qo‘shish
              </button>
            </div>
          </div>
        )}

        {stops.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 font-semibold">Qo‘shimcha to‘xtash joylari:</p>
            {stops.map((stop, index) => (
              <div key={index} className="flex gap-2 items-center">
                <span className="text-sm text-gray-600">📍 {stop}</span>
                <button
                  onClick={() => handleRemoveStop(index)}
                  className="text-red-500 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Kuzov turi */}
        <div>
          <p className="text-sm font-semibold mb-2">Kuzov turi</p>
          <div className="grid grid-cols-5 gap-2">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setBody(size)}
                className={`p-2 rounded-xl border text-sm transition ${
                  body === size ? "bg-green-600 text-white" : "bg-white"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">{getBodyName(body)}</p>
        </div>

        {/* Yuk tashuvchi */}
        <div>
          <p className="text-sm font-semibold mb-2">Yuk tashuvchi</p>
          <div className="flex gap-2">
            {[0, 1, 2].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setLoader(v)}
                className={`flex-1 p-2 rounded-xl border text-sm transition ${
                  loader === v ? "bg-green-600 text-white" : "bg-white"
                }`}
              >
                {v === 0 ? "Yo‘q" : `${v} kishi`}
              </button>
            ))}
          </div>
        </div>

        {/* Hamroh */}
        <div>
          <p className="text-sm font-semibold mb-2">Hamroh</p>
          <div className="flex gap-2">
            {[0, 1, 2].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setEscort(v)}
                className={`flex-1 p-2 rounded-xl border text-sm transition ${
                  escort === v ? "bg-green-600 text-white" : "bg-white"
                }`}
              >
                {v === 0 ? "Yo‘q" : `${v} kishi`}
              </button>
            ))}
          </div>
        </div>

        {/* Hisoblash turi */}
        <div>
          <p className="text-sm font-semibold mb-2">Hisoblash turi</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPriceType("route")}
              className={`flex-1 p-2 rounded-xl border text-sm transition ${
                priceType === "route" ? "bg-green-600 text-white" : "bg-white"
              }`}
            >
              🗺️ Marshrut
            </button>
            <button
              type="button"
              onClick={() => setPriceType("hour")}
              className={`flex-1 p-2 rounded-xl border text-sm transition ${
                priceType === "hour" ? "bg-green-600 text-white" : "bg-white"
              }`}
            >
              ⏱️ Soat
            </button>
          </div>
        </div>

        {/* Narx */}
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-3 border rounded-xl"
          placeholder={priceType === "route" ? "Marshrut narxi (so'm)" : "Soatbay narx (so'm)"}
          type="number"
        />

        {/* Кнопки оплаты и комментария */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setShowPaymentModal(true)}
            className="flex-1 p-3 border rounded-xl bg-gray-50 text-left"
          >
            <div className="text-sm text-gray-500">To'lov turi</div>
            <div className="font-semibold">{getPaymentText()}</div>
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
            className="flex-1 bg-blue-700 text-white p-3 rounded-xl disabled:opacity-50 font-semibold"
          >
            {loading ? "Yuborilmoqda..." : "🚚 Buyurtma berish"}
          </button>
        </div>
      </div>

      {/* PAYMENT MODAL */}
      {showPaymentModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[60]" onClick={() => setShowPaymentModal(false)} />
          <div className="fixed left-0 bottom-0 w-80 bg-white rounded-tr-2xl shadow-2xl z-[60] p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">💳 To'lov turi</h2>
              <button onClick={() => setShowPaymentModal(false)} className="text-xl">✕</button>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setPayment("card");
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
                onClick={() => {
                  setPayment("cash");
                  setShowPaymentModal(false);
                }}
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
            </div>
          </div>
        </>
      )}

      {/* COMMENT MODAL */}
      {showCommentModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[60]" onClick={() => setShowCommentModal(false)} />
          <div className="fixed right-0 bottom-0 w-80 bg-white rounded-tl-2xl shadow-2xl z-[60] p-4">
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

      {/* BURGER MENU - FIXED Z-INDEX */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <div
            ref={menuRef}
            className="absolute top-0 right-0 w-72 h-full bg-white p-4 text-black shadow-xl z-[100]"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-xl">🚚 Menyu</h2>
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
                localStorage.removeItem("driver");
                localStorage.removeItem("driver_phone");
                setMenuOpen(false);
                router.push("/");
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