"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

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
  },
  {
    id: 2,
    from: "Andijon",
    to: "Toshkent",
    price: 150000,
    time: "09:00",
    seats: 2,
  },
];

export default function IntercityPage() {
  const [selectedTrip, setSelectedTrip] = useState<any>(null);

  const [showTrips, setShowTrips] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showComment, setShowComment] = useState(false);

  const [payment, setPayment] = useState("cash");
  const [comment, setComment] = useState("");

  const [offerPrice, setOfferPrice] = useState("");

  return (
    <main className="h-screen flex flex-col bg-gray-100">

      {/* MAP */}
      <div className="h-[45vh] w-full">
        <Map />
      </div>

      {/* FORM */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-2 z-15 p-4 pb-32 space-y-3 shadow-xl overflow-y-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <p className="font-bold text-lg">Shaharlararo</p>

          <button
            onClick={() => setShowTrips(!showTrips)}
            className="px-3 py-1 bg-green-600 text-white rounded-xl text-sm"
          >
            Safarlarni ko‘rish
          </button>
        </div>

        {/* FROM / TO */}
        <input
          className="w-full p-3 border rounded-xl"
          placeholder="Qayerdan (A)"
        />

        <input
          className="w-full p-3 border rounded-xl"
          placeholder="Qayerga (B)"
        />

        {/* TRIP LIST */}
        {showTrips && (
          <div className="space-y-2">
            {mockTrips.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTrip(t)}
                className={`w-full p-3 rounded-xl border text-left ${
                  selectedTrip?.id === t.id
                    ? "bg-green-600 text-white"
                    : "bg-white"
                }`}
              >
                <div className="flex justify-between">
                  <span>{t.from} → {t.to}</span>
                  <span>{t.time}</span>
                </div>

                <div className="text-sm opacity-80">
                  Narx: {t.price.toLocaleString()} so‘m • Joy: {t.seats}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* OFFER PRICE (TORG) */}
        <div className="bg-white border rounded-2xl p-3 space-y-1">

          <p className="text-sm font-semibold text-gray-700">
            Narx taklif qiling (торг)
          </p>

          <input
            type="number"
            value={offerPrice}
            onChange={(e) => setOfferPrice(e.target.value)}
            placeholder="Masalan: 100 000"
            className="w-full p-3 border rounded-xl"
          />

          <p className="text-xs text-gray-500">
            Siz narx taklif qilasiz, haydovchi qabul qiladi yoki o‘zgartiradi
          </p>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-2 z-50">
        <div className="flex items-center gap-2">

          {/* MAP */}
          

          {/* PAYMENT */}
          <button
            onClick={() => setShowPayment(!showPayment)}
            className="w-12 h-12 rounded-xl bg-gray-100"
          >
            {payment === "cash" ? "💵" : "💳"}
          </button>

          {/* ORDER */}
          <button className="flex-1 h-12 rounded-xl bg-green-700 text-white font-bold">
            Buyurtma berish
          </button>

          {/* COMMENT */}
          <button
            onClick={() => setShowComment(!showComment)}
            className="w-12 h-12 rounded-xl bg-gray-100"
          >
            💬
          </button>

        </div>
      </div>

      {/* PAYMENT POPUP */}
      {showPayment && (
        <div className="fixed bottom-20 left-3 right-3 bg-white rounded-xl p-3 shadow-xl z-50">
          <p className="font-bold mb-2">To‘lov usuli</p>

          <button
            onClick={() => setPayment("cash")}
            className="w-full p-3 mb-2 border rounded-xl"
          >
            💵 Naqd pul
          </button>

          <button
            onClick={() => setPayment("card")}
            className="w-full p-3 border rounded-xl"
          >
            💳 Karta / O‘tkazma
          </button>
        </div>
      )}

      {/* COMMENT POPUP */}
      {showComment && (
        <div className="fixed bottom-20 left-3 right-3 bg-white rounded-xl p-3 shadow-xl z-50">
          <p className="font-bold mb-2">Izoh</p>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-3 border rounded-xl"
            placeholder="Qo‘shimcha izoh..."
          />
        </div>
      )}
    </main>
  );
}