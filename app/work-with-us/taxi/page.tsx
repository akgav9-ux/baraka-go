"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TaxiDriverRegister() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false); // true = вход, false = регистрация
  const [phone, setPhone] = useState("");
  const [loginError, setLoginError] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    phone: "",
    passport: "",
    driverLicense: "",
    carPassport: "",
    carModel: "",
    carNumber: "",
  });

  // Вход для уже зарегистрированных
  const handleLogin = async () => {
    if (!phone) {
      setLoginError("Telefon raqamni kiriting");
      return;
    }

    setLoading(true);
    setLoginError("");

    try {
      const res = await fetch("/api/applications/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 404) {
          setLoginError("❌ Siz ro'yxatdan o'tmagansiz! Avval ariza topshiring.");
        } else if (res.status === 403) {
          setLoginError("⛔ Arizangiz hali tasdiqlanmagan!");
        } else {
          setLoginError("❌ Xatolik yuz berdi");
        }
        setLoading(false);
        return;
      }

      localStorage.setItem("driver", JSON.stringify(data));
      localStorage.setItem("driver_phone", phone);
      router.push("/taxi/home");
      
    } catch (error) {
      setLoginError("❌ Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  // Регистрация нового водителя
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          transport: "taxi",
        }),
      });

      if (res.ok) {
        alert("✅ Ariza yuborildi! Admin tasdiqlaydi.");
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
        <button onClick={() => router.back()} className="text-yellow-600 mb-4">
          ← Orqaga
        </button>
        <div className="bg-white rounded-2xl p-6 shadow">
          
          {/* Кнопки переключения */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-xl font-semibold ${
                !isLogin ? "bg-yellow-500 text-white" : "bg-gray-100"
              }`}
            >
              📝 Ro'yxatdan o'tish
            </button>
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-xl font-semibold ${
                isLogin ? "bg-yellow-500 text-white" : "bg-gray-100"
              }`}
            >
              🔐 Kirish
            </button>
          </div>

          {/* ФОРМА ВХОДА */}
          {isLogin ? (
            <>
              <h1 className="text-2xl font-bold text-center">🚕 Taksi haydovchi</h1>
              <p className="text-center text-gray-500 text-sm">Kabinetga kirish</p>
              <div className="space-y-4 mt-4">
                <input
                  type="tel"
                  placeholder="Telefon raqam *"
                  className="w-full p-3 border rounded-xl"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                {loginError && (
                  <p className="text-red-500 text-sm text-center">{loginError}</p>
                )}
                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full bg-yellow-500 text-white p-3 rounded-xl font-semibold disabled:opacity-50"
                >
                  {loading ? "Kutilmoqda..." : "🔐 Kirish"}
                </button>
              </div>
            </>
          ) : (
            /* ФОРМА РЕГИСТРАЦИИ */
            <>
              <h1 className="text-2xl font-bold text-center">🚕 Taksi haydovchi</h1>
              <p className="text-center text-gray-500 text-sm">Ro‘yxatdan o‘ting va ishlashni boshlang</p>
              <form onSubmit={handleSubmit} className="space-y-3 mt-4">
                <input
                  type="text"
                  required
                  placeholder="Ism *"
                  className="w-full p-3 border rounded-xl"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <input
                  type="text"
                  required
                  placeholder="Familiya *"
                  className="w-full p-3 border rounded-xl"
                  value={formData.surname}
                  onChange={(e) => setFormData({...formData, surname: e.target.value})}
                />
                <input
                  type="tel"
                  required
                  placeholder="Telefon *"
                  className="w-full p-3 border rounded-xl"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
                <input
                  type="text"
                  required
                  placeholder="Passport seriya raqam *"
                  className="w-full p-3 border rounded-xl"
                  value={formData.passport}
                  onChange={(e) => setFormData({...formData, passport: e.target.value})}
                />
                <input
                  type="text"
                  required
                  placeholder="Haydovchilik guvohnomasi *"
                  className="w-full p-3 border rounded-xl"
                  value={formData.driverLicense}
                  onChange={(e) => setFormData({...formData, driverLicense: e.target.value})}
                />
                <input
                  type="text"
                  required
                  placeholder="Texnik pasport (STS) *"
                  className="w-full p-3 border rounded-xl"
                  value={formData.carPassport}
                  onChange={(e) => setFormData({...formData, carPassport: e.target.value})}
                />
                <input
                  type="text"
                  required
                  placeholder="Avtomobil modeli *"
                  className="w-full p-3 border rounded-xl"
                  value={formData.carModel}
                  onChange={(e) => setFormData({...formData, carModel: e.target.value})}
                />
                <input
                  type="text"
                  required
                  placeholder="Avtomobil raqami *"
                  className="w-full p-3 border rounded-xl"
                  value={formData.carNumber}
                  onChange={(e) => setFormData({...formData, carNumber: e.target.value})}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-500 text-white p-3 rounded-xl font-semibold disabled:opacity-50"
                >
                  {loading ? "Yuborilmoqda..." : "📝 Ariza yuborish"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}