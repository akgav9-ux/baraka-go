"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GazelRegistrationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    fatherName: "",
    phone: "",
    passport: "",
    driverLicense: "",
    carPassport: "",
    carModel: "",
    carNumber: "",
    transport: "gazel",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("✅ Ariza yuborildi! Admin tasdig'ini kuting.");
        router.push("/");
      } else {
        alert("❌ Xatolik yuz berdi");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4 pt-20">
      <div className="max-w-md mx-auto">
        <button onClick={() => router.back()} className="text-green-600 mb-4">← Orqaga</button>
        
        <div className="bg-white rounded-2xl p-6 shadow">
          <div className="text-center mb-6">
            <div className="text-5xl mb-2">🚚</div>
            <h1 className="text-2xl font-bold">Yuk tashuvchi (Gazel)</h1>
            <p className="text-gray-500 text-sm">Ro‘yxatdan o‘ting va ishlashni boshlang</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Ism</label>
              <input
                type="text"
                required
                className="w-full p-3 border rounded-xl"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Familiya</label>
              <input
                type="text"
                required
                className="w-full p-3 border rounded-xl"
                value={formData.surname}
                onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Otasining ismi</label>
              <input
                type="text"
                required
                className="w-full p-3 border rounded-xl"
                value={formData.fatherName}
                onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Telefon raqam</label>
              <input
                type="tel"
                required
                placeholder="+998 XX XXX XX XX"
                className="w-full p-3 border rounded-xl"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Passport seriya va raqam</label>
              <input
                type="text"
                required
                placeholder="AA 1234567"
                className="w-full p-3 border rounded-xl"
                value={formData.passport}
                onChange={(e) => setFormData({ ...formData, passport: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Haydovchilik guvohnomasi</label>
              <input
                type="text"
                required
                placeholder="1234567"
                className="w-full p-3 border rounded-xl"
                value={formData.driverLicense}
                onChange={(e) => setFormData({ ...formData, driverLicense: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Texnik pasport (STS)</label>
              <input
                type="text"
                required
                placeholder="ABC 123456"
                className="w-full p-3 border rounded-xl"
                value={formData.carPassport}
                onChange={(e) => setFormData({ ...formData, carPassport: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Avtomobil modeli</label>
              <input
                type="text"
                required
                placeholder="GAZelle Next"
                className="w-full p-3 border rounded-xl"
                value={formData.carModel}
                onChange={(e) => setFormData({ ...formData, carModel: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Avtomobil raqami</label>
              <input
                type="text"
                required
                placeholder="01 A 123 AA"
                className="w-full p-3 border rounded-xl"
                value={formData.carNumber}
                onChange={(e) => setFormData({ ...formData, carNumber: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white p-3 rounded-xl font-semibold disabled:opacity-50"
            >
              {loading ? "Yuborilmoqda..." : "🚚 Ariza yuborish"}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-4">
            Ariza yuborilgandan so'ng, admin tomonidan tekshiriladi
          </p>
        </div>
      </div>
    </main>
  );
}