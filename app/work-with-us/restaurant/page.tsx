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
    password: "",
    confirmPassword: "",
    restaurantName: "",
    restaurantCategory: "",
    address: "",
    description: "",
    website: "",
    instagram: "",
  });

  // ТОЛЬКО ЭТИ КАТЕГОРИИ
  const categories = [
    "Fast Food",
    "Sushi",
    "Pizza",
    "Pishiriqlar",
    "Milliy taomlari",
    "Sog‘lom taom",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("❗ Parollar mos kelmadi");
      return;
    }
    
    if (formData.password.length < 4) {
      alert("❗ Parol kamida 4 ta belgidan iborat bo'lishi kerak");
      return;
    }
    
    setLoading(true);

    try {
      const res = await fetch("/api/partners/restaurant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
          restaurantName: formData.restaurantName,
          restaurantCategory: formData.restaurantCategory,
          address: formData.address,
          description: formData.description,
          website: formData.website,
          instagram: formData.instagram,
        }),
      });

      if (res.ok) {
        alert("✅ Ariza yuborildi! Administrator tekshirgandan so'ng sizga tasdiqlash keladi.");
        router.push("/");
      } else {
        alert("❌ Xatolik yuz berdi");
      }
    } catch (error) {
      alert("❌ Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4 pt-20">
      <div className="max-w-md mx-auto">
        <button onClick={() => router.back()} className="text-orange-600 mb-4 flex items-center gap-1">
          ← Orqaga
        </button>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-center mb-6">
            <div className="text-5xl mb-2">🍕</div>
            <h1 className="text-2xl font-bold text-gray-800">Restoran hamkorlik</h1>
            <p className="text-gray-500 text-sm">Biz bilan ishlashni boshlang</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 max-h-[60vh] overflow-y-auto px-1">
            <input
              type="text"
              required
              placeholder="Ismingiz *"
              className="w-full p-2 border rounded-xl text-sm"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            
            <input
              type="tel"
              required
              placeholder="Telefon raqam *"
              className="w-full p-2 border rounded-xl text-sm"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            
            <input
              type="email"
              required
              placeholder="Email *"
              className="w-full p-2 border rounded-xl text-sm"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            
            <input
              type="password"
              required
              placeholder="Parol * (kamida 4 belgi)"
              className="w-full p-2 border rounded-xl text-sm"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            
            <input
              type="password"
              required
              placeholder="Parolni takrorlang *"
              className="w-full p-2 border rounded-xl text-sm"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
            
            <input
              type="text"
              required
              placeholder="Restoran nomi *"
              className="w-full p-2 border rounded-xl text-sm"
              value={formData.restaurantName}
              onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
            />
            
            {/* ТОЛЬКО ЭТИ КАТЕГОРИИ В ВЫПАДАЮЩЕМ СПИСКЕ */}
            <select
              required
              className="w-full p-2 border rounded-xl text-sm"
              value={formData.restaurantCategory}
              onChange={(e) => setFormData({ ...formData, restaurantCategory: e.target.value })}
            >
              <option value="">Kategoriya tanlang *</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            
            <input
              type="text"
              required
              placeholder="Manzil *"
              className="w-full p-2 border rounded-xl text-sm"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            
            <textarea
              placeholder="Restoran haqida (ixtiyoriy)"
              className="w-full p-2 border rounded-xl text-sm resize-none"
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            
            <input
              type="url"
              placeholder="Website (ixtiyoriy)"
              className="w-full p-2 border rounded-xl text-sm"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
            
            <input
              type="text"
              placeholder="Instagram (ixtiyoriy)"
              className="w-full p-2 border rounded-xl text-sm"
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
            />
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white p-2 rounded-xl font-semibold disabled:opacity-50 mt-2"
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