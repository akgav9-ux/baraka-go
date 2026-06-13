"use client";

import { useRouter } from "next/navigation";

export default function CourierChoosePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-3xl p-5 shadow">

        <h1 className="text-2xl font-bold mb-5">
          📦 Kuryer turi tanlang
        </h1>

        <div className="space-y-3">

          <button
            onClick={() => router.push("/work-with-us/courier/walk")}
            className="w-full p-4 rounded-2xl border text-left bg-white"
          >
            🚶 Piyoda kuryer
          </button>

          <button
            onClick={() => router.push("/work-with-us/courier/bike")}
            className="w-full p-4 rounded-2xl border text-left bg-white"
          >
            🛵 Skuter / Velosiped kuryer
          </button>

          <button
            onClick={() => router.push("/work-with-us/courier/car")}
            className="w-full p-4 rounded-2xl border text-left bg-white"
          >
            🚗 Avtomobil kuryer
          </button>

        </div>

      </div>
    </main>
  );
}