"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateTripPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
    price: "",
    seats: "4",
    car: "",
    comment: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.from || !formData.to || !formData.date || !formData.time || !formData.price || !formData.car) {
      alert("Iltimos, barcha maydonlarni to'ldiring!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: formData.from,
          to: formData.to,
          date: formData.date,
          time: formData.time,
          price: Number(formData.price),
          seats: Number(formData.seats),
          car: formData.car,
          driver: "Alisher Valiyev",
          driverId: 1,
          driverPhone: "+998901234567",
          rating: 4.8,
          comment: formData.comment,
        }),
      });

      if (res.ok) {
        alert(`✅ Reys muvaffaqiyatli yaratildi!\n\n📍 ${formData.from} → ${formData.to}\n💰 ${Number(formData.price).toLocaleString()} so'm/joy\n💺 ${formData.seats} ta joy\n📅 ${formData.date} ${formData.time}`);
        router.push("/intercity/home");
      } else {
        const error = await res.json();
        alert("❌ Xatolik: " + (error.error || "Noma'lum xato"));
      }
    } catch (error) {
      console.error(error);
      alert("❌ Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto">
        <button 
          onClick={() => router.back()} 
          className="text-purple-600 mb-4 flex items-center gap-1"
        >
          ← Orqaga
        </button>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-center mb-6">
            <div className="text-5xl mb-2">🚌</div>
            <h1 className="text-2xl font-bold text-gray-800">Yangi reys qo'shish</h1>
            <p className="text-gray-500 text-sm">Yo'lovchilar uchun yangi safar yarating</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Qayerdan */}
            <div>
              <label className="block text-sm font-semibold mb-1">📍 Qayerdan *</label>
              <input
                type="text"
                required
                placeholder="Masalan: Toshkent"
                className="w-full p-3 border rounded-xl focus:outline-none focus:border-purple-500"
                value={formData.from}
                onChange={(e) => setFormData({ ...formData, from: e.target.value })}
              />
            </div>

            {/* Qayerga */}
            <div>
              <label className="block text-sm font-semibold mb-1">📍 Qayerga *</label>
              <input
                type="text"
                required
                placeholder="Masalan: Samarqand"
                className="w-full p-3 border rounded-xl focus:outline-none focus:border-purple-500"
                value={formData.to}
                onChange={(e) => setFormData({ ...formData, to: e.target.value })}
              />
            </div>

            {/* Sana va vaqt */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-semibold mb-1">📅 Sana *</label>
                <input
                  type="date"
                  required
                  className="w-full p-3 border rounded-xl focus:outline-none focus:border-purple-500"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold mb-1">⏰ Vaqt *</label>
                <input
                  type="time"
                  required
                  className="w-full p-3 border rounded-xl focus:outline-none focus:border-purple-500"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
            </div>

            {/* Narx va joylar */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-semibold mb-1">💰 Narx (so'm) *</label>
                <input
                  type="number"
                  required
                  placeholder="50000"
                  className="w-full p-3 border rounded-xl focus:outline-none focus:border-purple-500"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold mb-1">💺 Bo'sh joylar *</label>
                <select
                  required
                  className="w-full p-3 border rounded-xl focus:outline-none focus:border-purple-500"
                  value={formData.seats}
                  onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <option key={n} value={n}>{n} ta joy</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Avtomobil */}
            <div>
              <label className="block text-sm font-semibold mb-1">🚗 Avtomobil modeli *</label>
              <input
                type="text"
                required
                placeholder="Masalan: Toyota Camry"
                className="w-full p-3 border rounded-xl focus:outline-none focus:border-purple-500"
                value={formData.car}
                onChange={(e) => setFormData({ ...formData, car: e.target.value })}
              />
            </div>

            {/* Izoh */}
            <div>
              <label className="block text-sm font-semibold mb-1">📝 Izoh (ixtiyoriy)</label>
              <textarea
                placeholder="Masalan: Bepul Wi-Fi, Konditsioner, Bagaj joyi..."
                className="w-full p-3 border rounded-xl focus:outline-none focus:border-purple-500 resize-none"
                rows={2}
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3 rounded-xl font-semibold disabled:opacity-50 transition transform active:scale-95 mt-2"
            >
              {loading ? "Yuborilmoqda..." : "🚌 Reysni e'lon qilish"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}