"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function WalkCourier() {
  const router = useRouter();

  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    const application = {
      id: Date.now(),
      name: "",
      phone: "",
      passport: "",
      address: "",
      transport: "walk",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const old = JSON.parse(localStorage.getItem("applications") || "[]");

    localStorage.setItem(
      "applications",
      JSON.stringify([...old, application])
    );

    setSent(true);

    // 👉 ВАЖНО: ПЕРЕХОД НА СТРАНИЦУ ОЖИДАНИЯ
    setTimeout(() => {
      router.push("/courier/waiting");
    }, 500);
  };

  return (
    <main className="p-4 min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto bg-white p-5 rounded-3xl shadow">

        <h1 className="text-xl font-bold mb-4">
          🚶 Piyoda kuryer
        </h1>

        <input className="w-full p-3 border rounded-xl mb-3" placeholder="Ism" />
        <input className="w-full p-3 border rounded-xl mb-3" placeholder="Telefon" />

        <input className="w-full p-3 border rounded-xl mb-3" placeholder="Pasport" />
        <input className="w-full p-3 border rounded-xl mb-5" placeholder="Manzil" />

        <button
          onClick={handleSubmit}
          disabled={sent}
          className={`w-full py-3 rounded-xl font-bold text-white ${
            sent ? "bg-gray-400" : "bg-green-700"
          }`}
        >
          {sent ? "Ariza yuborildi ✅" : "Ariza yuborish"}
        </button>

      </div>
    </main>
  );
}