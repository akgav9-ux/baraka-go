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
  createdAt: string;
}

export default function CourierOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      
      const data = await res.json();
      // Только обычные заказы (НЕ газель)
      const pendingOrders = data.filter((o: Order) => 
        o.status === "pending" && 
        o.packageType !== "gazel"
      );
      setOrders(pendingOrders);
    } catch (error) {
      console.error("Error loading orders:", error);
      setError("Buyurtmalarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const acceptOrder = async (id: number) => {
    setAcceptingId(id);
    setError(null);
    
    try {
      const res = await fetch(`/api/orders/${id}/accept`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to accept order");
      }

      alert(`Buyurtma #${id} qabul qilindi!`);
      setSelectedOrder(null);
      await loadOrders();
      router.push("/courier/active");
      
    } catch (error) {
      console.error("Error accepting order:", error);
      setError(error instanceof Error ? error.message : "Buyurtmani qabul qilishda xatolik");
    } finally {
      setAcceptingId(null);
    }
  };

  const getPackageIcon = (type: string) => {
    switch (type) {
      case "hujjat": return "📄";
      case "posilka": return "📦";
      case "gullar": return "🌹";
      case "xarid": return "🛒";
      default: return "📦";
    }
  };

  const getPackageName = (type: string) => {
    switch (type) {
      case "hujjat": return "Hujjat";
      case "posilka": return "Posilka";
      case "gullar": return "Gullar";
      case "xarid": return "Xarid";
      default: return type;
    }
  };

  const getPaymentText = (payment: string) => {
    return payment === "cash" ? "💵 Naqd" : "💳 Karta";
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("uz-UZ") + " so‘m";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" });
  };

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-2xl mb-2">⏳</div>
          <div className="text-gray-600">Yuklanmoqda...</div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.push("/courier/home")}
            className="text-green-600 text-xl"
          >
            ←
          </button>
          <h1 className="text-xl font-bold">📦 Yangi buyurtmalar</h1>
          <button
            onClick={loadOrders}
            className="text-blue-600 text-sm px-3 py-1 bg-white rounded-xl"
          >
            🔄 Yangilash
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-xl mb-4">
            ❌ {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-xl font-semibold mb-2">Yangi buyurtmalar yo‘q</h2>
            <p className="text-gray-500">Hozircha yangi buyurtmalar mavjud emas</p>
            <button
              onClick={loadOrders}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-xl"
            >
              Yangilash
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className="bg-white rounded-xl p-3 shadow-sm active:bg-gray-50 cursor-pointer transition"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      #{order.id}
                    </span>
                    {order.urgent && (
                      <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                        ⚡
                      </span>
                    )}
                  </div>
                  <span className="text-lg">{getPackageIcon(order.packageType)}</span>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-green-600">📍</span>
                      <span className="font-medium truncate max-w-[120px]">{order.from}</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-red-600">📍</span>
                      <span className="font-medium truncate max-w-[120px]">{order.to}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-600">
                      {formatPrice(order.price)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedOrder && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedOrder(null)} />
          <div className="fixed bottom-0 left-0 right-0 h-[75vh] bg-white rounded-t-3xl shadow-2xl z-50 flex flex-col overflow-hidden">
            
            <div className="flex justify-between items-center p-4 border-b shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  #{selectedOrder.id}
                </span>
                {selectedOrder.urgent && (
                  <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                    🔴 Shoshilinch
                  </span>
                )}
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-2xl">
                ✕
              </button>
            </div>

            {/* Map Placeholder */}
            <div className="h-[35%] bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center relative shrink-0">
              <div className="text-center text-white">
                <div className="text-5xl mb-2">🗺️</div>
                <p className="text-sm opacity-90">Xarita</p>
              </div>
              <div className="absolute bottom-2 left-2 right-2 bg-white/90 rounded-lg p-2 text-sm">
                <div className="flex justify-between">
                  <span className="truncate">📍 {selectedOrder.from}</span>
                  <span className="text-green-600 mx-1">→</span>
                  <span className="truncate">📍 {selectedOrder.to}</span>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="space-y-2">
                <div className="flex gap-2 text-sm">
                  <span className="text-green-600 font-bold min-w-[24px]">A:</span>
                  <span className="font-medium flex-1">{selectedOrder.from}</span>
                </div>
                <div className="flex gap-2 text-sm">
                  <span className="text-red-600 font-bold min-w-[24px]">B:</span>
                  <span className="font-medium flex-1">{selectedOrder.to}</span>
                </div>
              </div>

              <div className="h-px bg-gray-200" />

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 p-2 rounded-lg">
                  <div className="text-gray-500 text-xs">📦 Turi</div>
                  <div className="font-semibold">{getPackageName(selectedOrder.packageType)}</div>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg">
                  <div className="text-gray-500 text-xs">⚖️ Og'irlik</div>
                  <div className="font-semibold">{selectedOrder.weight} kg</div>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg">
                  <div className="text-gray-500 text-xs">💳 To'lov</div>
                  <div className="font-semibold">{getPaymentText(selectedOrder.payment)}</div>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg">
                  <div className="text-gray-500 text-xs">🕐 Vaqt</div>
                  <div className="font-semibold">{formatDate(selectedOrder.createdAt)}</div>
                </div>
              </div>

              {selectedOrder.payment === "cash" && selectedOrder.changeAmount && (
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">💵 Beriladigan pul:</span>
                    <span className="font-bold">{selectedOrder.changeAmount.toLocaleString()} so'm</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-600">🔄 Qaytim:</span>
                    <span className="font-bold text-green-600">
                      {(selectedOrder.changeAmount - selectedOrder.price).toLocaleString()} so'm
                    </span>
                  </div>
                </div>
              )}

              {selectedOrder.comment && (
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">📝 Izoh</div>
                  <div className="text-sm">{selectedOrder.comment}</div>
                </div>
              )}

              <div className="border-t pt-3 mt-2 pb-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-500">Narxi</span>
                  <span className="text-2xl font-bold text-green-600">
                    {formatPrice(selectedOrder.price)}
                  </span>
                </div>
                
                <button
                  onClick={() => acceptOrder(selectedOrder.id)}
                  disabled={acceptingId === selectedOrder.id}
                  className="w-full bg-green-600 text-white p-3 rounded-xl font-semibold disabled:opacity-50 transition hover:bg-green-700"
                >
                  {acceptingId === selectedOrder.id ? (
                    <span className="flex items-center justify-center gap-1">
                      <span className="animate-spin">⏳</span> Yuklanmoqda...
                    </span>
                  ) : (
                    "🚗 Qabul qilish"
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}