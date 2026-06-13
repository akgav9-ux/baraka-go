"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function TrackingPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async () => {
    if (!confirm("Buyurtmani bekor qilmoqchimisiz?")) return;

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Buyurtma bekor qilindi");
        router.push("/courier");
      } else {
        alert("Buyurtmani bekor qilishda xatolik");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Xatolik yuz berdi");
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-xl">Yuklanmoqda...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-xl text-red-500">Buyurtma topilmadi</div>
        <button
          onClick={() => router.push("/courier")}
          className="bg-green-600 text-white px-6 py-2 rounded-xl"
        >
          Buyurtma berish
        </button>
      </div>
    );
  }

  const getStatusText = () => {
    switch (order.status) {
      case "pending": return "🔍 Kuryer qidirilmoqda...";
      case "accepted": return "🚗 Kuryer topildi";
      case "delivering": return "📦 Yetkazilmoqda";
      case "delivered": return "✅ Yetkazib berildi";
      case "cancelled": return "❌ Bekor qilindi";
      default: return "⏳ Kutilmoqda";
    }
  };

  const getStatusColor = () => {
    switch (order.status) {
      case "pending": return "bg-yellow-500";
      case "accepted": return "bg-blue-500";
      case "delivering": return "bg-purple-500";
      case "delivered": return "bg-green-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <main className="h-screen flex flex-col bg-gray-100">
      <div className="h-[50vh] w-full bg-gray-300 flex items-center justify-center relative">
        <div className="text-center">
          <div className="text-6xl mb-2">🗺️</div>
          <p className="text-gray-600">Xarita yuklanmoqda...</p>
        </div>
        
        <div className="absolute top-4 left-4 right-4 bg-white rounded-xl p-3 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
              <span className="font-semibold">{getStatusText()}</span>
            </div>
            <div className="text-lg font-bold text-green-600">
              {order.price} so‘m
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-t-3xl p-4 shadow-xl overflow-y-auto">
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-green-500 mt-1 flex items-center justify-center text-white text-xs">A</div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">QAYERDAN</p>
                <p className="font-medium">{order.from}</p>
              </div>
            </div>
            
            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-red-500 mt-1 flex items-center justify-center text-white text-xs">B</div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">QAYERGA</p>
                <p className="font-medium">{order.to}</p>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-200" />

          <div className="flex justify-between items-center">
            <span className="text-gray-500">Narxi</span>
            <span className="text-2xl font-bold text-green-600">{order.price} so‘m</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500">Holati</span>
            <span className="font-medium">{getStatusText()}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500">Buyurtma raqami</span>
            <span className="font-mono text-sm">#{order.id}</span>
          </div>

          <div className="h-px bg-gray-200" />

          {order.status === "pending" && (
            <button
              onClick={cancelOrder}
              className="w-full bg-red-600 text-white p-3 rounded-xl font-semibold"
            >
              ❌ Buyurtmani bekor qilish
            </button>
          )}

          <button
            onClick={() => router.push("/courier")}
            className="w-full border border-gray-300 p-3 rounded-xl font-semibold"
          >
            ← Yangi buyurtma
          </button>
        </div>
      </div>
    </main>
  );
}