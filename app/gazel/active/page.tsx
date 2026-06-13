"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Order {
  id: number;
  from: string;
  to: string;
  price: number;
  status: string;
  packageType: string;
  comment: string;
  payment: string;
  clientPhone?: string;
  clientName?: string;
  createdAt: string;
  acceptedAt?: string;
}

export default function GazelActivePage() {
  const router = useRouter();
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const [actionType, setActionType] = useState<"call" | "message" | null>(null);

  const loadActiveOrder = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      const active = data.find((o: Order) => 
        o.packageType === "gazel" && (o.status === "accepted" || o.status === "delivering")
      );
      setActiveOrder(active || null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActiveOrder();
    const interval = setInterval(loadActiveOrder, 3000);
    return () => clearInterval(interval);
  }, []);

  const startDelivery = async () => {
    if (!activeOrder) return;
    setProcessing(true);
    try {
      await fetch(`/api/orders/${activeOrder.id}/deliver`, { method: "PATCH" });
      alert("🚚 Yetkazib berish boshlandi!");
      await loadActiveOrder();
    } catch (error) {
      alert("Xatolik yuz berdi");
    } finally {
      setProcessing(false);
    }
  };

  const completeDelivery = async () => {
    if (!activeOrder) return;
    if (!confirm("Yuk yetkazib berildi?")) return;
    setProcessing(true);
    try {
      await fetch(`/api/orders/${activeOrder.id}/complete`, { method: "PATCH" });
      alert("✅ Yuk yetkazib berildi!");
      router.push("/gazel/orders");
    } catch (error) {
      alert("Xatolik yuz berdi");
    } finally {
      setProcessing(false);
    }
  };

  const handleCallClick = () => {
    setActionType("call");
    setShowPhoneDialog(true);
  };

  const handleMessageClick = () => {
    setActionType("message");
    setShowPhoneDialog(true);
  };

  const confirmAction = () => {
    const phone = activeOrder?.clientPhone || "+998901234567";
    
    if (actionType === "call") {
      window.location.href = `tel:${phone}`;
    } else if (actionType === "message") {
      window.location.href = `sms:${phone}`;
    }
    
    setShowPhoneDialog(false);
    setActionType(null);
  };

  const formatPrice = (price: number) => price.toLocaleString("uz-UZ") + " so‘m";

  if (loading) return <div className="p-8 text-center">⏳ Yuklanmoqda...</div>;
  if (!activeOrder) return <div className="p-8 text-center">📭 Faol buyurtma yo‘q</div>;

  const isDelivering = activeOrder.status === "delivering";
  const clientPhone = activeOrder.clientPhone || "+998 XX XXX XX XX";
  const clientName = activeOrder.clientName || "Mijoz";

  return (
    <main className="h-screen flex flex-col bg-gray-100">
      {/* FIXED HEADER */}
      <div className="bg-blue-700 text-white px-4 py-3 flex items-center shrink-0">
        <button onClick={() => router.push("/gazel/home")} className="text-xl mr-3">
          ←
        </button>
        <div>
          <p className="text-xs opacity-80">🚚 Yuk tashish</p>
          <p className="text-sm font-semibold">Faol buyurtma</p>
        </div>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto">
        {/* MAP Placeholder */}
        <div className="h-[40vh] w-full relative bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="text-6xl mb-3">🗺️</div>
            <p className="text-lg font-semibold">{activeOrder.from} → {activeOrder.to}</p>
            <p className="text-sm opacity-80 mt-2">Marshrut xaritada ko‘rsatilgan</p>
          </div>
          
          {/* Status overlay */}
          <div className={`absolute top-4 left-4 right-4 rounded-xl p-2 text-center text-white text-sm ${isDelivering ? "bg-purple-500" : "bg-blue-500"}`}>
            <div className="font-semibold">
              {isDelivering ? "📦 Yetkazilmoqda" : "🚚 Yuk olingan"}
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-t-3xl -mt-4 relative z-10 p-4 space-y-3">
          {/* Client Info with Call and Message Buttons */}
          <div className="bg-blue-50 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">👤 Mijoz</p>
                <p className="font-semibold text-lg">{clientName}</p>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handleCallClick}
                  className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
                >
                  <span>📞</span>
                  <span className="text-sm">Qo‘ng‘iroq</span>
                </button>
                <button
                  onClick={handleMessageClick}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
                >
                  <span>✉️</span>
                  <span className="text-sm">Xabar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Order ID */}
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Buyurtma raqami</span>
            <span className="font-mono font-bold">#{activeOrder.id}</span>
          </div>

          {/* Route */}
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">A</div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Qayerdan</p>
                <p className="font-medium">{activeOrder.from}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-sm font-bold">B</div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Qayerga</p>
                <p className="font-medium">{activeOrder.to}</p>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-200" />

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-500 text-xs">💳 To'lov</p>
              <p className="font-semibold">{activeOrder.payment === "cash" ? "Naqd pul" : "Plastik karta"}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">💰 Narxi</p>
              <p className="font-semibold text-green-600">{formatPrice(activeOrder.price)}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">📅 Yaratilgan</p>
              <p className="font-semibold text-sm">{new Date(activeOrder.createdAt).toLocaleString()}</p>
            </div>
            {activeOrder.acceptedAt && (
              <div>
                <p className="text-gray-500 text-xs">✅ Qabul qilingan</p>
                <p className="font-semibold text-sm">{new Date(activeOrder.acceptedAt).toLocaleString()}</p>
              </div>
            )}
          </div>

          {/* Comment */}
          {activeOrder.comment && (
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">📝 Izoh</p>
              <p className="text-sm">{activeOrder.comment}</p>
            </div>
          )}
        </div>
      </div>

      {/* FIXED BOTTOM BUTTON */}
      <div className="bg-white border-t p-3 shrink-0">
        {!isDelivering && (
          <button
            onClick={startDelivery}
            disabled={processing}
            className="w-full bg-blue-600 text-white p-3 rounded-xl font-semibold disabled:opacity-50"
          >
            {processing ? "⏳ Yuklanmoqda..." : "🚚 Yetkazib berishni boshlash"}
          </button>
        )}
        {isDelivering && (
          <button
            onClick={completeDelivery}
            disabled={processing}
            className="w-full bg-green-600 text-white p-3 rounded-xl font-semibold disabled:opacity-50"
          >
            {processing ? "⏳ Yuklanmoqda..." : "✅ Yuk yetkazib berildi"}
          </button>
        )}
      </div>

      {/* Phone Number Dialog */}
      {showPhoneDialog && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowPhoneDialog(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-white rounded-2xl p-5 shadow-2xl z-50">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">
                {actionType === "call" ? "📞" : "✉️"}
              </div>
              <h3 className="text-lg font-bold">
                {actionType === "call" ? "Qo‘ng‘iroq qilish" : "Xabar yozish"}
              </h3>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 text-center mb-4">
              <p className="text-sm text-gray-500">Mijoz nomi</p>
              <p className="font-semibold text-lg">{clientName}</p>
              <p className="text-sm text-gray-500 mt-2">Telefon raqam</p>
              <p className="font-mono text-lg font-bold text-blue-600">{clientPhone}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPhoneDialog(false)}
                className="flex-1 bg-gray-200 text-gray-700 p-2 rounded-xl font-semibold"
              >
                Bekor qilish
              </button>
              <button
                onClick={confirmAction}
                className="flex-1 bg-green-600 text-white p-2 rounded-xl font-semibold"
              >
                {actionType === "call" ? "📞 Qo‘ng‘iroq qilish" : "✉️ Xabar yozish"}
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}