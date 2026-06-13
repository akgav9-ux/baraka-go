"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function IntercityRegistrationPage() {
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
    carYear: "",
    carColor: "",
    seats: "4",
    transport: "intercity",
    experience: "",
    regions: [] as string[],
    otherRegion: "",
  });

  const [showRegions, setShowRegions] = useState(false);
  
  const popularRegions = [
    "Toshkent", "Samarqand", "Buxoro", "Andijon", "Namangan", 
    "Farg'ona", "Qashqadaryo", "Navoiy", "Xorazm", "Surxandaryo", 
    "Jizzax", "Sirdaryo"
  ];

  const toggleRegion = (region: string) => {
    if (formData.regions.includes(region)) {
      setFormData({ ...formData, regions: formData.regions.filter(r => r !== region) });
    } else {
      setFormData({ ...formData, regions: [...formData.regions, region] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.regions.length === 0) {
      alert("Iltimos, kamida bitta yo'nalishni tanlang");
      return;
    }
    
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
        <button onClick={() => router.back()} className="text-purple-600 mb-4">← Orqaga</button>
        
        <div className="bg-white rounded-2xl p-6 shadow">
          <div className="text-center mb-6">
            <div className="text-5xl mb-2">🚌</div>
            <h1 className="text-2xl font-bold">Shaharlararo Haydovchi</h1>
            <p className="text-gray-500 text-sm">Ro‘yxatdan o‘ting va ishlashni boshlang</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Ism */}
            <div>
              <label className="block text-sm font-semibold mb-1">Ism *</label>
              <input
                type="text"
                required
                className="w-full p-3 border rounded-xl focus:outline-none focus:border-purple-500"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Familiya */}
            <div>
              <label className="block text-sm font-semibold mb-1">Familiya *</label>
              <input
                type="text"
                required
                className="w-full p-3 border rounded-xl focus:outline-none focus:border-purple-500"
                value={formData.surname}
                onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
              />
            </div>

            {/* Otasining ismi */}
            <div>
              <label className="block text-sm font-semibold mb-1">Otasining ismi</label>
              <input
                type="text"
                className="w-full p-3 border rounded-xl focus:outline-none focus:border-purple-500"
                value={formData.fatherName}
                onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
              />
            </div>

            {/* Telefon */}
            <div>
              <label className="block text-sm font-semibold mb-1">Telefon raqam *</label>
              <input
                type="tel"
                required
                placeholder="+998 XX XXX XX XX"
                className="w-full p-3 border rounded-xl focus:outline-none focus:border-purple-500"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            {/* Passport */}
            <div>
              <label className="block text-sm font-semibold mb-1">Passport seriya va raqam *</label>
              <input
                type="text"
                required
                placeholder="AA 1234567"
                className="w-full p-3 border rounded-xl focus:outline-none focus:border-purple-500"
                value={formData.passport}
                onChange={(e) => setFormData({ ...formData, passport: e.target.value })}
              />
            </div>

            {/* Haydovchilik guvohnomasi */}
            <div>
              <label className="block text-sm font-semibold mb-1">Haydovchilik guvohnomasi *</label>
              <input
                type="text"
                required
                placeholder="1234567"
                className="w-full p-3 border rounded-xl focus:outline-none focus:border-purple-500"
                value={formData.driverLicense}
                onChange={(e) => setFormData({ ...formData, driverLicense: e.target.value })}
              />
            </div>

            {/* Texnik pasport */}
            <div>
              <label className="block text-sm font-semibold mb-1">Texnik pasport (STS) *</label>
              <input
                type="text"
                required
                placeholder="ABC 123456"
                className="w-full p-3 border rounded-xl focus:outline-none focus:border-purple-500"
                value={formData.carPassport}
                onChange={(e) => setFormData({ ...formData, carPassport: e.target.value })}
              />
            </div>

            {/* Avtomobil modeli */}
            <div>
              <label className="block text-sm font-semibold mb-1">Avtomobil modeli *</label>
              <input
                type="text"
                required
                placeholder="Hyundai County, Toyota Hiace, GAZelle Next"
                className="w-full p-3 border rounded-xl focus:outline-none focus:border-purple-500"
                value={formData.carModel}
                onChange={(e) => setFormData({ ...formData, carModel: e.target.value })}
              />
            </div>

            {/* Avtomobil raqami */}
            <div>
              <label className="block text-sm font-semibold mb-1">Avtomobil raqami *</label>
              <input
                type="text"
                required
                placeholder="01 A 123 AA"
                className="w-full p-3 border rounded-xl focus:outline-none focus:border-purple-500"
                value={formData.carNumber}
                onChange={(e) => setFormData({ ...formData, carNumber: e.target.value })}
              />
            </div>

            {/* Yili */}
            <div>
              <label className="block text-sm font-semibold mb-1">Avtomobil yili *</label>
              <input
                type="number"
                required
                placeholder="2020"
                className="w-full p-3 border rounded-xl focus:outline-none focus:border-purple-500"
                value={formData.carYear}
                onChange={(e) => setFormData({ ...formData, carYear: e.target.value })}
              />
            </div>

            {/* Rangi */}
            <div>
              <label className="block text-sm font-semibold mb-1">Avtomobil rangi *</label>
              <input
                type="text"
                required
                placeholder="Oq, Qora, Kulrang"
                className="w-full p-3 border rounded-xl focus:outline-none focus:border-purple-500"
                value={formData.carColor}
                onChange={(e) => setFormData({ ...formData, carColor: e.target.value })}
              />
            </div>

            {/* O'rindiqlar soni */}
            <div>
              <label className="block text-sm font-semibold mb-1">Yo'lovchilar soni *</label>
              <div className="grid grid-cols-4 gap-2">
                {["4", "7", "10", "14", "16", "20"].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setFormData({ ...formData, seats: num })}
                    className={`p-2 rounded-xl border transition ${
                      formData.seats === num 
                        ? "bg-purple-500 text-white border-purple-600" 
                        : "bg-white border-gray-200"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Tajriba */}
            <div>
              <label className="block text-sm font-semibold mb-1">Haydovchilik tajribasi (yil) *</label>
              <input
                type="number"
                required
                placeholder="5"
                className="w-full p-3 border rounded-xl focus:outline-none focus:border-purple-500"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              />
            </div>

            {/* Yo'nalishlar */}
            <div>
              <label className="block text-sm font-semibold mb-1">Yo'nalishlar *</label>
              <button
                type="button"
                onClick={() => setShowRegions(!showRegions)}
                className="w-full p-3 border rounded-xl bg-gray-50 text-left flex justify-between items-center"
              >
                <span>
                  {formData.regions.length > 0 
                    ? `${formData.regions.length} ta yo'nalish tanlangan` 
                    : "Yo'nalishlarni tanlang"}
                </span>
                <span>{showRegions ? "▲" : "▼"}</span>
              </button>

              {showRegions && (
                <div className="mt-2 p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-2">Qaysi shaharlarga qatnaysiz?</p>
                  <div className="grid grid-cols-2 gap-2">
                    {popularRegions.map((region) => (
                      <button
                        key={region}
                        type="button"
                        onClick={() => toggleRegion(region)}
                        className={`p-2 rounded-lg text-sm transition ${
                          formData.regions.includes(region)
                            ? "bg-purple-500 text-white"
                            : "bg-white border border-gray-200"
                        }`}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-3">
                    <input
                      type="text"
                      placeholder="Boshqa shahar (kiriting)"
                      className="w-full p-2 border rounded-lg text-sm"
                      value={formData.otherRegion}
                      onChange={(e) => setFormData({ ...formData, otherRegion: e.target.value })}
                    />
                    {formData.otherRegion && (
                      <button
                        type="button"
                        onClick={() => {
                          if (formData.otherRegion && !formData.regions.includes(formData.otherRegion)) {
                            toggleRegion(formData.otherRegion);
                            setFormData({ ...formData, otherRegion: "" });
                          }
                        }}
                        className="mt-2 w-full p-2 bg-purple-500 text-white rounded-lg text-sm"
                      >
                        Qo'shish: {formData.otherRegion}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {formData.regions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {formData.regions.map((region) => (
                    <span key={region} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                      {region} ✕
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3 rounded-xl font-semibold disabled:opacity-50 transition transform active:scale-95"
            >
              {loading ? "Yuborilmoqda..." : "🚌 Ariza yuborish"}
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