"use client";

import { useState } from "react";

export default function DriverIntercity() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [price, setPrice] = useState("");
  const [time, setTime] = useState("");
  const [seats, setSeats] = useState("3");

  const [trips, setTrips] = useState<any[]>([]);

  const addTrip = () => {
    const newTrip = {
      id: Date.now(),
      from,
      to,
      price,
      time,
      seats,
    };

    setTrips([newTrip, ...trips]);
  };

  return (
    <main className="h-screen bg-gray-100 p-4 space-y-3">

      <div className="bg-white p-4 rounded-2xl space-y-3">

        <input
          className="w-full p-3 border rounded-xl"
          placeholder="Qayerdan"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />

        <input
          className="w-full p-3 border rounded-xl"
          placeholder="Qayerga"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />

        <input
          className="w-full p-3 border rounded-xl"
          placeholder="Narx (so‘m)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          className="w-full p-3 border rounded-xl"
          placeholder="Vaqt (14:00)"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <input
          className="w-full p-3 border rounded-xl"
          placeholder="Joylar soni"
          value={seats}
          onChange={(e) => setSeats(e.target.value)}
        />

        <button
          onClick={addTrip}
          className="w-full p-3 bg-green-600 text-white rounded-xl"
        >
          ➕ Yo‘nalish qo‘shish
        </button>

      </div>

      {/* LIST */}
      <div className="space-y-3">

        {trips.map((t) => (
          <div key={t.id} className="bg-white p-4 rounded-2xl">

            <p className="font-bold">
              {t.from} → {t.to}
            </p>

            <p className="text-sm text-gray-500">
              🕐 {t.time}
            </p>

            <p className="text-green-600 font-bold">
              {t.price} so‘m
            </p>

            <p className="text-sm">
              💺 Joylar: {t.seats}
            </p>

          </div>
        ))}

      </div>

    </main>
  );
}