"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../../components/Map"), {
  ssr: false,
});

export default function TaxiPage() {
  const [showPayment, setShowPayment] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showStop, setShowStop] = useState(false);

  // 👥 OPTIONS
  const [passengers4, setPassengers4] = useState(false);
  const [childSeat0_3, setChildSeat0_3] = useState(false);
  const [childSeat3_6, setChildSeat3_6] = useState(false);
  const [booster6_12, setBooster6_12] = useState(false);

  const [price, setPrice] = useState("");

  return (
    <main className="h-screen flex flex-col bg-gray-100">

      {/* MAP */}
      <div className="h-[50vh] w-full">
        <Map />
      </div>

      {/* FORM */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-1 z-10 relative p-4 space-y-3 shadow-xl">

        {/* FROM */}
        <input
          type="text"
          placeholder="Qayerdan (A)"
          className="w-full p-3 rounded-xl border"
        />

        {/* TO */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Qayerga (B)"
            className="flex-1 p-3 rounded-xl border"
          />

          <button
            onClick={() => setShowStop(!showStop)}
            className="w-12 rounded-xl bg-green-600 text-white text-xl"
          >
            +
          </button>
        </div>

        {/* STOP */}
        {showStop && (
          <input
            type="text"
            placeholder="Qo'shimcha manzil"
            className="w-full p-3 rounded-xl border"
          />
        )}

        {/* PRICE BID (TORG) */}
        <div className="bg-white border rounded-2xl p-3 space-y-1">

          <p className="text-sm font-semibold text-gray-700">
            Narx taklif qiling (торg)
          </p>

          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Masalan: 25 000"
            className="w-full p-3 border rounded-xl"
          />

          <p className="text-xs text-gray-500">
            Haydovchi sizning narxingizni qabul qiladi yoki o‘z narxini taklif qiladi
          </p>

        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-2 z-50">

        <div className="flex gap-2">

          <button
            onClick={() => setShowPayment(!showPayment)}
            className="w-12 h-12 rounded-xl bg-gray-100"
          >
            💵
          </button>

          <button className="flex-1 h-12 rounded-xl bg-green-900 text-white font-semibold">
            Buyurtma berish
          </button>

          <button
            onClick={() => setShowOptions(!showOptions)}
            className="w-12 h-12 rounded-xl bg-gray-100"
          >
            ⚙️
          </button>

        </div>
      </div>

      {/* PAYMENT */}
      {showPayment && (
        <div className="fixed bottom-20 left-3 right-3 bg-white rounded-xl p-3 shadow-xl z-50">
          <p className="font-bold mb-2">To'lov</p>

          <label className="flex gap-2 items-center">
            <input type="radio" name="pay" />
            💵 Naqd
          </label>

          <label className="flex gap-2 items-center mt-2">
            <input type="radio" name="pay" />
            💳 Karta
          </label>
        </div>
      )}

      {/* OPTIONS */}
      {showOptions && (
        <div className="fixed bottom-20 left-3 right-3 bg-white rounded-xl p-3 shadow-xl z-50 space-y-3">

          <p className="font-bold">Qo'shimcha</p>

          {[
            ["👥 4+ yo'lovchi", passengers4, setPassengers4],
            ["👶 0–3 bolalar o'rindig'i", childSeat0_3, setChildSeat0_3],
            ["🧒 3–6 bolalar o'rindig'i", childSeat3_6, setChildSeat3_6],
            ["🪑 Buster 6–12", booster6_12, setBooster6_12],
          ].map(([label, state, setState]: any) => (
            <div key={label} className="flex justify-between items-center">
              <span>{label}</span>

              <button
                onClick={() => setState(!state)}
                className={`w-10 h-5 rounded-full p-1 transition ${
                  state ? "bg-green-600" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full transition ${
                    state ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
          ))}

          <textarea
            placeholder="Izoh (komment)"
            className="w-full border rounded-xl p-2"
          />
        </div>
      )}

    </main>
  );
}