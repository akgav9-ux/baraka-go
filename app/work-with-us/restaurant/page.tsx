"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RestaurantPartnershipPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    restaurantName: "",
    restaurantCategory: "",
    address: "",
    description: "",
    website: "",
    instagram: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Правильный API endpoint
      const res = await fetch("/api/partners/restaurant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("✅ Ariza yuborildi! Administrator bilan bog'lanamiz.");
        router.push("/");
      } else {
        const error = await res.json();
        alert("❌ Xatolik: " + (error.error || "Qaytadan urinib ko'ring"));
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
        <button 
          onClick={() => router.back()} 
          className="text-orange-600 mb-4 flex items-center gap-1"
        >
          ← Orqaga
        </button>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-center mb-6">
            <div className="text-5xl mb-2">🍕</div>
            <h1 className="text-2xl font-bold text-gray-800">Restoran hamkorlik</h1>
            <p className="text-gray-500 text-sm">Biz bilan ishlashni boshlang</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Ism */}
            <div>
              <label className="block text-sm font-semibold mb-1">Ismingiz *</label>
              <input
                type="text"
                required
                className="w-full p-3 border rounded-xl focus:outline-none focus:border-orange-500"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Telefon */}
            <div>
              <label className="block text-sm font-semibold mb-1">Telefon raqam *</label>
              <input
                type="tel"
                required
                placeholder="+998 XX XXX XX XX"
                className="w-full p-3 border rounded-xl focus:outline-none focus:border-orange-500"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-1">Email</label>
              <input
                type="email"
                placeholder="restoran@mail.com"
                className="w-full p-3 border rounded-xl focus:outline-none focus:border-orange-500"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            {/* Restoran nomi */}
            <div>
              <label className="block text-sm font-semibold mb-1">Restoran nomi *</label>
              <input
                type="text"
                required
                placeholder="Masalan: Pizza House"
                className="w-full p-3 border rounded-xl focus:outline-none focus:border-orange-500"
                value={formData.restaurantName}
                onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
              />
            </div>

            {/* Kategoriya */}
            <div>
              <label className="block text-sm font-semibold mb-1">Restoran kategoriyasi *</label>
              <select
                required
                className="w-full p-3 border rounded-xl focus:outline-none focus:border-orange-500"
                value={formData.restaurantCategory}
                onChange={(e) => setFormData({ ...formData, restaurantCategory: e.target.value })}
              >
                <option value="">Tanlang</option>
                <option value="Pizza">Pizza</option>
                <option value="Burger">Burger</option>
                <option value="Sushi">Sushi</option>
                <option value="Uzbek">O‘zbek taomlari</option>
                <option value="European">Yevropa taomlari</option>
                <option value="FastFood">Fast Food</option>
                <option value="Cafe">Kafe</option>
              </select>
            </div>

            {/* Manzil */}
            <div>
              <label className="block text-sm font-semibold mb-1">Restoran manzili *</label>
              <input
                type="text"
                required
                placeholder="Toshkent shahar, ..."
                className="w-full p-3 border rounded-xl focus:outline-none focus:border-orange-500"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            {/* Tavsif */}
            <div>
              <label className="block text-sm font-semibold mb-1">Restoran haqida qisqacha</label>
              <textarea
                placeholder="Restoraningiz haqida ma'lumot..."
                className="w-full p-3 border rounded-xl focus:outline-none focus:border-orange-500 resize-none"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-semibold mb-1">Website (agar bor bo'lsa)</label>
              <input
                type="url"
                placeholder="https://..."
                className="w-full p-3 border rounded-xl focus:outline-none focus:border-orange-500"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>

            {/* Instagram */}
            <div>
              <label className="block text-sm font-semibold mb-1">Instagram</label>
              <input
                type="text"
                placeholder="@restoran_nomi"
                className="w-full p-3 border rounded-xl focus:outline-none focus:border-orange-500"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-xl font-semibold disabled:opacity-50 transition transform active:scale-95 mt-2"
            >
              {loading ? "Yuborilmoqda..." : "📝 Ariza yuborish"}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-4">
            Ariza yuborilgandan so'ng, administrator tez orada siz bilan bog'lanadi
          </p>
        </div>
      </div>
    </main>
  );
}