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
  createdAt: string;
}

export default function GazelOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const loadOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      // Только заказы газели со статусом pending
      const gazelOrders = data.filter((o: Order) => o.packageType === "gazel" && o.status === "pending");
      setOrders(gazelOrders);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const acceptOrder = async (id: number) => {
    try {
      const res = await fetch(`/api/orders/${id}/accept`, {
        method: "PATCH",
      });
      if (res.ok) {
        alert("Buyurtma qabul qilindi!");
        router.push("/gazel/active");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const formatPrice = (price: number) => price.toLocaleString("uz-UZ") + " so‘m";

  if (loading) return <div className="p-8 text-center">⏳ Yuklanmoqda...</div>;

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => router.push("/gazel/home")} className="text-green-600 text-xl">←</button>
          <h1 className="text-xl font-bold">🚚 Yuk buyurtmalari</h1>
          <button onClick={loadOrders} className="text-blue-600 text-sm px-3 py-1 bg-white rounded-xl">🔄</button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500">Yangi yuk buyurtmalari yo‘q</p>
          </div>
        ) : (
          <div className="space-y-2">
            {orders.map((order) => (
              <div key={order.id} onClick={() => setSelectedOrder(order)} className="bg-white rounded-xl p-3 shadow-sm cursor-pointer">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">#{order.id}</span>
                  <span className="text-lg">🚚</span>
                </div>
                <div className="mt-2">
                  <div className="text-sm truncate">{order.from} → {order.to}</div>
                  <div className="text-green-600 font-bold mt-1">{formatPrice(order.price)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedOrder && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedOrder(null)} />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold">Buyurtma #{selectedOrder.id}</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-2xl">✕</button>
            </div>
            <div className="space-y-2">
              <p><span className="text-green-600">📍 A:</span> {selectedOrder.from}</p>
              <p><span className="text-red-600">📍 B:</span> {selectedOrder.to}</p>
              <p>💰 {formatPrice(selectedOrder.price)}</p>
              <p>💳 {selectedOrder.payment === "cash" ? "Naqd" : "Karta"}</p>
              {selectedOrder.comment && <p className="text-gray-500 text-sm">📝 {selectedOrder.comment}</p>}
              <button onClick={() => acceptOrder(selectedOrder.id)} className="w-full bg-green-600 text-white p-3 rounded-xl mt-3">
                🚚 Yukni olish
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}