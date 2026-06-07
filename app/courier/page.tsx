"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../../components/Map"), {
  ssr: false,
});

export default function CourierPage() {
  const [showPayment, setShowPayment] = useState(false);
  const [showComment, setShowComment] = useState(false);

  const [payment, setPayment] = useState("cash");
  const [comment, setComment] = useState("");

  const [weight, setWeight] = useState("5");
  const [urgent, setUrgent] = useState(false);

  const [price, setPrice] = useState("");

  return (
    <main className="h-screen flex flex-col bg-gray-100">

      {/* MAP */}
      <div className="h-[45vh] w-full">
        <Map />
      </div>

      {/* FORM */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-2 z-10 p-4 pb-32 space-y-3 shadow-xl overflow-y-auto">

        <input className="w-full p-3 border rounded-xl" placeholder="Qayerdan olish" />
        <input className="w-full p-3 border rounded-xl" placeholder="Qayerga yetkazish" />
        <input className="w-full p-3 border rounded-xl" placeholder="Nima yuboriladi?" />

        {/* WEIGHT */}
        <div>
          <p className="text-sm font-semibold mb-2">Og'irligi</p>

          <div className="grid grid-cols-3 gap-2">
            {["5", "10", "20"].map((kg) => (
              <button
                key={kg}
                onClick={() => setWeight(kg)}
                className={`p-2 rounded-xl border text-sm ${
                  weight === kg ? "bg-green-600 text-white" : "bg-white"
                }`}
              >
                {kg} kg
              </button>
            ))}
          </div>
        </div>

        {/* URGENT */}
        <div className="flex items-center justify-between border rounded-xl p-3">
          <div>
            <p className="font-semibold">Shoshilinch yetkazish</p>
            <p className="text-xs text-gray-500">Eng yaqin kuryer yuboriladi</p>
          </div>

          <button
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

        {/* PRICE BID (FIXED) */}
        <div className="bg-white border rounded-2xl p-3 space-y-1">

          <p className="text-sm font-semibold text-gray-700">
            Narx taklif qiling (торг)
          </p>

          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Masalan: 25 000"
            className="w-full p-3 border rounded-xl"
          />

          <p className="text-xs text-gray-500">
            Haydovchi yoki kuryer sizning narxingizni qabul qilishi yoki taklif berishi mumkin
          </p>

        </div> {/* ✅ ВОТ ЭТОГО НЕ ХВАТАЛО */}

      </div>

      {/* BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-2 z-50">
        <div className="flex items-center gap-2">

          <button
            onClick={() => setShowPayment(!showPayment)}
            className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center"
          >
            {payment === "cash" ? "💵" : "💳"}
          </button>

          <button className="flex-1 h-12 rounded-xl bg-green-700 text-white font-bold">
            Kuryer chaqirish
          </button>

          <button
            onClick={() => setShowComment(!showComment)}
            className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center"
          >
            💬
          </button>

        </div>
      </div>

      {/* PAYMENT POPUP */}
      {showPayment && (
        <div className="fixed bottom-20 left-3 right-3 bg-white rounded-xl p-3 shadow-xl z-50">
          <p className="font-bold mb-2">To'lov usuli</p>

          <button onClick={() => setPayment("cash")} className="w-full p-3 mb-2 border rounded-xl">
            💵 Naqd pul
          </button>

          <button onClick={() => setPayment("card")} className="w-full p-3 border rounded-xl">
            💳 Karta
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
            placeholder="Kuryer uchun izoh..."
          />
        </div>
      )}

    </main>
  );
}