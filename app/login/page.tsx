"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DriverLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/applications/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 404) {
          setError("❌ Siz ro'yxatdan o'tmagansiz!");
        } else if (res.status === 403) {
          setError("⛔ Siz bloklangansiz! Admin bilan bog'laning.");
        } else {
          setError("❌ Xatolik yuz berdi");
        }
        return;
      }

      // Сохраняем данные водителя
      localStorage.setItem("driver", JSON.stringify(data));
      localStorage.setItem("driver_phone", phone);
      
      // Переход по типу транспорта
      if (data.transport === "courier") {
        router.push("/courier/home");
      } else if (data.transport === "gazel") {
        router.push("/gazel/home");
      } else if (data.transport === "intercity") {
        router.push("/intercity/home");
      } else if (data.transport === "taxi") {
        router.push("/taxi/home");
      }
      
    } catch (error) {
      setError("❌ Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl p-6 shadow">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🚚</div>
          <h1 className="text-2xl font-bold">Haydovchi kabineti</h1>
          <p className="text-gray-500 text-sm">Telefon raqamingiz orqali kiring</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="tel"
            placeholder="+998 XX XXX XX XX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 border rounded-xl"
            required
          />
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white p-3 rounded-xl font-semibold disabled:opacity-50"
          >
            {loading ? "Tekshirilmoqda..." : "Kirish"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Ro'yxatdan o'tmaganmisiz?{" "}
          <button onClick={() => router.push("/work-with-us")} className="text-green-600">
            Ro'yxatdan o'tish
          </button>
        </p>
      </div>
    </main>
  );
}