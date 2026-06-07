"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import DriverMapWrapper from "@/components/driver/DriverMapWrapper";

type Order = {
  id: number;
  from: string;
  to: string;
  fromCoords: [number, number];
  toCoords: [number, number];
  price: number;
  payment: "Naqd" | "Karta";
  passengers: "1 kishi" | "Bolali";
  clientPhone: string;
  clientName: string;
  comment?: string;
};

const ORDERS: Order[] = [
  {
    id: 1,
    from: "Chilonzor",
    to: "Toshkent Markaz",
    fromCoords: [41.2995, 69.2401],
    toCoords: [41.3123, 69.2787],
    price: 25000,
    payment: "Naqd",
    passengers: "1 kishi",
    clientName: "Ali",
    clientPhone: "+998901234567",
    comment: "Kiraverishda kutib turing",
  },
];

export default function DriverOrderPage() {
  const router = useRouter();
  const params = useParams();

  const orderId = Number(params.id);
  const order = ORDERS.find((o) => o.id === orderId);

  const [live, setLive] = useState(false);

  // 🆕 STATUS CONTROL
  const [status, setStatus] = useState<
    "waiting" | "started" | "arrived" | "finished"
  >("waiting");

  if (!order) {
    return <div className="p-4">❌ Buyurtma topilmadi</div>;
  }

  const cleanPhone = order.clientPhone.replace("+", "");

  return (
    <main className="min-h-screen flex flex-col bg-gray-100">

      {/* 🗺 MAP */}
      <div className="h-[55vh] w-full">
        <DriverMapWrapper
          from={order.fromCoords}
          to={order.toCoords}
          live={live}
        />
      </div>

      {/* 📦 INFO */}
      <div className="flex-1 bg-white p-4 rounded-t-2xl shadow-xl space-y-3">

        {/* CLIENT ACTIONS */}
        <div className="flex gap-2">

          <a
            href={`tel:${order.clientPhone}`}
            className="flex-1 bg-green-600 text-white p-3 rounded-xl text-center"
          >
            📞 Qo‘ng‘iroq
          </a>

          <a
            href={`https://wa.me/${cleanPhone}`}
            target="_blank"
            className="flex-1 bg-blue-600 text-white p-3 rounded-xl text-center"
          >
            💬 Yozish
          </a>
        </div>

        {/* COMMENT */}
        {order.comment && (
          <div className="bg-gray-100 p-3 rounded-xl">
            <p className="text-sm text-gray-500">📝 Izoh:</p>
            <p className="font-medium">{order.comment}</p>
          </div>
        )}

        {/* INFO */}
        <h2 className="font-bold text-lg">
          📍 {order.from} → {order.to}
        </h2>

        <p className="text-green-600 font-bold text-lg">
          💰 {order.price} so‘m
        </p>

        <p>💳 To‘lov: {order.payment}</p>
        <p>👤 Yo‘lovchi: {order.passengers}</p>

        {/* 🚗 ACTION FLOW */}
        <div className="flex flex-col gap-2 mt-4">

          {/* START */}
          {status === "waiting" && (
            <button
              onClick={() => {
                setLive(true);
                setStatus("started");
              }}
              className="bg-green-600 text-white p-3 rounded-xl"
            >
              🚗 Start Trip
            </button>
          )}

          {/* ARRIVED */}
          {status === "started" && (
            <button
              onClick={() => setStatus("arrived")}
              className="bg-yellow-500 text-white p-3 rounded-xl"
            >
              📍 Men yetib bordim
            </button>
          )}

          {/* FINISH */}
          {status === "arrived" && (
            <button
              onClick={() => {
                setStatus("finished");
                setLive(false);
              }}
              className="bg-blue-600 text-white p-3 rounded-xl"
            >
              🏁 Tugatish
            </button>
          )}

          {/* DONE */}
          {status === "finished" && (
            <div className="text-center text-green-600 font-bold p-3">
              ✔ Buyurtma yakunlandi
            </div>
          )}

          {/* BACK */}
          <button
            onClick={() => router.push("/driver")}
            className="bg-gray-200 p-3 rounded-xl"
          >
            ⬅ Orqaga
          </button>
        </div>
      </div>
    </main>
  );
}