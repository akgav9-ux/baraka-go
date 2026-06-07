"use client";

import { useEffect, useState } from "react";

export default function DriverBalancePage() {
  const [today, setToday] = useState(0);
  const [week, setWeek] = useState(0);
  const [month, setMonth] = useState(0);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    // demo data (потом подключим заказы)
    const data = [
      { amount: 25000, date: "2026-06-07", status: "done" },
      { amount: 18000, date: "2026-06-06", status: "done" },
      { amount: 32000, date: "2026-06-05", status: "done" },
    ];

    setHistory(data);

    const t = data.filter((x) => x.date === "2026-06-07")
      .reduce((a, b) => a + b.amount, 0);

    const w = data.reduce((a, b) => a + b.amount, 0);

    const m = data.reduce((a, b) => a + b.amount, 0);

    setToday(t);
    setWeek(w);
    setMonth(m);
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-4">

      <h1 className="text-2xl font-bold mb-4">
        💰 Balans
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-3">

        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <p className="text-gray-500 text-sm">Bugun</p>
          <p className="font-bold text-lg">{today} so‘m</p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <p className="text-gray-500 text-sm">Hafta</p>
          <p className="font-bold text-lg">{week} so‘m</p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <p className="text-gray-500 text-sm">Oy</p>
          <p className="font-bold text-lg">{month} so‘m</p>
        </div>

      </div>

      {/* INFO NOTE */}
<div className="mt-4 bg-yellow-50 p-4 rounded-2xl">
  <p className="text-sm text-gray-700">
    💡 To‘lovlar to‘g‘ridan-to‘g‘ri mijoz va haydovchi o‘rtasida amalga oshiriladi.
    Ilovada hozircha ichki balans yo‘q.
  </p>
</div>

      {/* HISTORY */}
      <div className="mt-4">
        <h2 className="font-bold mb-2">📋 Tarix</h2>

        <div className="space-y-2">
          {history.map((item, i) => (
            <div
              key={i}
              className="bg-white p-3 rounded-xl flex justify-between"
            >
              <div>
                <p className="font-semibold">Buyurtma</p>
                <p className="text-gray-500 text-sm">{item.date}</p>
              </div>

              <p className="font-bold text-green-600">
                +{item.amount} so‘m
              </p>
            </div>
          ))}
        </div>
      </div>

    </main>
  );
}