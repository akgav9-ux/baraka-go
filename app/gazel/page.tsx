"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../../components/Map"), {
  ssr: false,
});

export default function GazelPage() {
  const [showStop, setShowStop] = useState(false);

  const [body, setBody] = useState("S");
  const [loader, setLoader] = useState(0);
  const [escort, setEscort] = useState(0);

  const [priceType, setPriceType] = useState("route");

  const [payment, setPayment] = useState("cash");
  const [showPayment, setShowPayment] = useState(false);

  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState("");

  const [price, setPrice] = useState("");

  return (
    <main className="h-screen flex flex-col bg-gray-100">

      {/* MAP */}
      <div className="h-[45vh] w-full relative">
        <Map />
      </div>

      {/* FORM */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-2 z-10 p-4 pb-32 space-y-3 shadow-xl overflow-y-auto">

        {/* FROM / TO */}
        <input className="w-full p-3 border rounded-xl" placeholder="Qayerdan (A)" />
        <input className="w-full p-3 border rounded-xl" placeholder="Qayerga (B)" />

        <button
          onClick={() => setShowStop(!showStop)}
          className="w-full p-2 bg-gray-100 rounded-xl text-sm"
        >
          ➕ To‘xtash joyi qo‘shish
        </button>

        {showStop && (
          <input className="w-full p-3 border rounded-xl" placeholder="Qo‘shimcha to‘xtash" />
        )}

        {/* KUZOV */}
        <div>
          <p className="text-sm font-semibold mb-2">Kuzov turi</p>
          <div className="grid grid-cols-5 gap-2">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <button
                key={size}
                onClick={() => setBody(size)}
                className={`p-2 rounded-xl border text-sm ${
                  body === size ? "bg-green-600 text-white" : ""
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* LOADER */}
        <div>
          <p className="text-sm font-semibold mb-2">Yuk tashuvchi</p>
          <div className="flex gap-2">
            {[0, 1, 2].map((v) => (
              <button
                key={v}
                onClick={() => setLoader(v)}
                className={`flex-1 p-2 rounded-xl border text-sm ${
                  loader === v ? "bg-green-600 text-white" : ""
                }`}
              >
                {v === 0 ? "Yo‘q" : v}
              </button>
            ))}
          </div>
        </div>

        {/* ESCORT */}
        <div>
          <p className="text-sm font-semibold mb-2">Hamroh</p>
          <div className="flex gap-2">
            {[0, 1, 2].map((v) => (
              <button
                key={v}
                onClick={() => setEscort(v)}
                className={`flex-1 p-2 rounded-xl border text-sm ${
                  escort === v ? "bg-green-600 text-white" : ""
                }`}
              >
                {v === 0 ? "Yo‘q" : v}
              </button>
            ))}
          </div>
        </div>

        {/* PRICE TYPE */}
        <div>
          <p className="text-sm font-semibold mb-2">Hisoblash turi</p>

          <div className="flex gap-2">
            <button
              onClick={() => setPriceType("route")}
              className={`flex-1 p-2 rounded-xl border text-sm ${
                priceType === "route" ? "bg-green-600 text-white" : ""
              }`}
            >
              Marshrut
            </button>

            <button
              onClick={() => setPriceType("hour")}
              className={`flex-1 p-2 rounded-xl border text-sm ${
                priceType === "hour" ? "bg-green-600 text-white" : ""
              }`}
            >
              Soat
            </button>
          </div>
        </div>

        {/* PRICE BID (TORG) - FIXED POSITION */}
        <div className="bg-white border rounded-2xl p-4 space-y-2">

          <p className="text-sm font-semibold text-gray-700">
            Narx taklif qiling (торg)
          </p>

          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Masalan: 50 000"
            className="w-full p-3 border rounded-xl"
          />

          <p className="text-xs text-gray-500">
            Haydovchi sizning narxingizni qabul qiladi yoki o‘z narxini taklif qiladi
          </p>

        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-2 z-50">
        <div className="flex items-center gap-2">

          {/* PAYMENT */}
          <button
            onClick={() => setShowPayment(!showPayment)}
            className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center"
          >
            {payment === "cash" ? "💵" : "💳"}
          </button>

          {/* ORDER */}
          <button className="flex-1 h-12 rounded-xl bg-green-900 text-white font-bold">
            Buyurtma berish
          </button>

          {/* COMMENT */}
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
          <p className="font-bold mb-2">To‘lov usuli</p>

          <button onClick={() => setPayment("cash")} className="w-full p-2 mb-2 border rounded-xl">
            💵 Naqd pul
          </button>

          <button onClick={() => setPayment("card")} className="w-full p-2 border rounded-xl">
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
            placeholder="Haydovchiga izoh yozing..."
          />
        </div>
      )}

    </main>
  );
}