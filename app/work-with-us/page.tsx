"use client";

import { useRouter } from "next/navigation";

export default function WorkWithUsPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gray-100 p-4 pt-24">

      <h1 className="text-2xl font-bold mb-6">
        Baraka Go bilan ishlang
      </h1>

      <div className="space-y-4">

        <button
          onClick={() => router.push("/work-with-us/driver")}
          className="w-full bg-white rounded-2xl p-5 shadow text-left"
        >
          <h2 className="font-bold text-lg">🚕 Haydovchi bo‘lish</h2>
          <p className="text-sm text-gray-500 mt-1">
            Taksi haydovchisi sifatida ishlash
          </p>
        </button>

        <button
          onClick={() => router.push("/work-with-us/courier")}
          className="w-full bg-white rounded-2xl p-5 shadow text-left"
        >
          <h2 className="font-bold text-lg">📦 Kuryer bo‘lish</h2>
          <p className="text-sm text-gray-500 mt-1">
            Yetkazib berish xizmatida ishlash
          </p>
        </button>

        <button
          onClick={() => router.push("/work-with-us/restaurant")}
          className="w-full bg-white rounded-2xl p-5 shadow text-left"
        >
          <h2 className="font-bold text-lg">🍔 Restoran ulash</h2>
          <p className="text-sm text-gray-500 mt-1">
            Restoraningizni Baraka Go ga qo‘shing
          </p>
        </button>

      </div>
    </main>
  );
}