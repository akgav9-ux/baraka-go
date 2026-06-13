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
  weight: number;
  urgent: boolean;
  payment: string;
  comment: string;
  changeAmount?: number;
  courierName?: string;
  acceptedAt?: string;
  createdAt: string;
}

export default function ActiveOrderPage() {
  const router = useRouter();
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const loadActiveOrder = async () => {
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      
      const data = await res.json();
      // Ищем заказ со статусом accepted ИЛИ delivering
      const active = data.find((o: Order) => o.status === "accepted" || o.status === "delivering");
      setActiveOrder(active || null);
    } catch (error) {
      console.error("Error loading active order:", error);
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
      const res = await fetch(`/api/orders/${activeOrder.id}/deliver`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to start delivery");
      }

      alert("🚚 Yetkazib berish boshlandi!");
      await loadActiveOrder(); // Обновляем после действия
      
    } catch (error) {
      console.error("Error starting delivery:", error);
      alert("Xatolik yuz berdi: " + (error instanceof Error ? error.message : ""));
    } finally {
      setProcessing(false);
    }
  };

  const completeDelivery = async () => {
    if (!activeOrder) return;
    
    if (!confirm("Buyurtma yetkazib berildi? Tasdiqlaysizmi?")) return;
    
    setProcessing(true);
    try {
      const res = await fetch(`/api/orders/${activeOrder.id}/complete`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to complete delivery");
      }

      alert("✅ Buyurtma yetkazib berildi! Tabriklaymiz!");
      router.push("/courier/orders");
      
    } catch (error) {
      console.error("Error completing delivery:", error);
      alert("Xatolik yuz berdi: " + (error instanceof Error ? error.message : ""));
    } finally {
      setProcessing(false);
    }
  };

  const cancelOrder = async () => {
    if (!confirm("Buyurtmani bekor qilmoqchimisiz?")) return;
    
    setProcessing(true);
    try {
      const res = await fetch(`/api/orders/${activeOrder?.id}/cancel`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to cancel order");
      }

      alert("❌ Buyurtma bekor qilindi");
      router.push("/courier/orders");
      
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Xatolik yuz berdi: " + (error instanceof Error ? error.message : ""));
    } finally {
      setProcessing(false);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("uz-UZ") + " so‘m";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("uz-UZ");
  };

  const getPaymentText = (payment: string) => {
    return payment === "cash" ? "💵 Naqd" : "💳 Karta";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-2xl mb-2">⏳</div>
          <div className="text-gray-600">Yuklanmoqda...</div>
        </div>
      </div>
    );
  }

  if (!activeOrder) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-4">
            <button
              onClick={() => router.push("/courier/orders")}
              className="text-green-600 text-xl"
            >
              ←
            </button>
            <h1 className="text-xl font-bold ml-4">🚚 Faol buyurtma</h1>
          </div>
          
          <div className="bg-white rounded-xl p-8 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-xl font-semibold mb-2">Faol buyurtma yo‘q</h2>
            <p className="text-gray-500">Hozircha sizda faol buyurtma mavjud emas</p>
            <button
              onClick={() => router.push("/courier/orders")}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-xl"
            >
              Yangi buyurtmalar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isDelivering = activeOrder.status === "delivering";
  const isAccepted = activeOrder.status === "accepted";

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.push("/courier/orders")}
            className="text-green-600 text-xl"
          >
            ←
          </button>
          <h1 className="text-xl font-bold">🚚 Faol buyurtma</h1>
          <div className="w-8" />
        </div>

        {/* Status Banner */}
        <div className={`rounded-xl p-4 mb-4 text-center text-white ${
          isDelivering ? "bg-purple-500" : "bg-blue-500"
        }`}>
          <div className="text-2xl mb-1">
            {isDelivering ? "📦" : "🚗"}
          </div>
          <div className="font-semibold">
            {isDelivering ? "Yetkazib berilmoqda" : "Yetkazib berish boshlanmagan"}
          </div>
          <div className="text-sm opacity-80">
            Buyurtma #{activeOrder.id}
          </div>
        </div>

        {/* Order Card */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          {/* Route */}
          <div className="space-y-3 mb-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm">A</div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Qayerdan</p>
                <p className="font-medium">{activeOrder.from}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-sm">B</div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Qayerga</p>
                <p className="font-medium">{activeOrder.to}</p>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-200 my-3" />

          {/* Details */}
          <div className="grid grid-cols-2 gap-3 text-sm mb-3">
            <div>
              <p className="text-gray-500 text-xs">📦 Turi</p>
              <p className="font-semibold capitalize">{activeOrder.packageType}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">⚖️ Og'irlik</p>
              <p className="font-semibold">{activeOrder.weight} kg</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">💳 To'lov</p>
              <p className="font-semibold">{getPaymentText(activeOrder.payment)}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">💰 Narxi</p>
              <p className="font-semibold text-green-600">{formatPrice(activeOrder.price)}</p>
            </div>
          </div>

          {/* Change amount for cash */}
          {activeOrder.payment === "cash" && activeOrder.changeAmount && (
            <div className="bg-yellow-50 p-3 rounded-lg mb-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">💵 Beriladigan pul:</span>
                <span className="font-bold">{activeOrder.changeAmount.toLocaleString()} so'm</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-600">🔄 Qaytim:</span>
                <span className="font-bold text-green-600">
                  {(activeOrder.changeAmount - activeOrder.price).toLocaleString()} so'm
                </span>
              </div>
            </div>
          )}

          {/* Comment */}
          {activeOrder.comment && (
            <div className="bg-gray-50 p-3 rounded-lg mb-3">
              <p className="text-xs text-gray-500">📝 Izoh</p>
              <p className="text-sm">{activeOrder.comment}</p>
            </div>
          )}

          {/* Time info */}
          <div className="text-xs text-gray-400 pt-2 border-t">
            <div>🕐 Yaratilgan: {formatDate(activeOrder.createdAt)}</div>
            {activeOrder.acceptedAt && (
              <div>✅ Qabul qilingan: {formatDate(activeOrder.acceptedAt)}</div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 space-y-2">
          {isAccepted && (
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
              {processing ? "⏳ Yuklanmoqda..." : "✅ Yetkazib berildi"}
            </button>
          )}

          <button
            onClick={cancelOrder}
            disabled={processing}
            className="w-full bg-red-600 text-white p-3 rounded-xl font-semibold disabled:opacity-50"
          >
            ❌ Buyurtmani bekor qilish
          </button>
        </div>
      </div>
    </main>
  );
}