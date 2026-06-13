"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RestaurantLoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Форма входа
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Форма регистрации (с паролем!)
  const [registerData, setRegisterData] = useState({
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

  // Вход в систему
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/restaurant/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("restaurantUser", JSON.stringify(data));
        alert("✅ Xush kelibsiz!");
        router.push("/restaurant/dashboard");
      } else {
        setError(data.error || "Email yoki parol noto'g'ri");
      }
    } catch (error) {
      setError("Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  // Подача заявки (регистрация с паролем)
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Проверка пароля
    if (registerData.password !== registerData.confirmPassword) {
      setError("❗ Parollar mos kelmadi");
      setLoading(false);
      return;
    }

    if (registerData.password.length < 4) {
      setError("❗ Parol kamida 4 ta belgidan iborat bo'lishi kerak");
      setLoading(false);
      return;
    }

    try {
      // Сначала отправляем заявку на партнерство
      const res = await fetch("/api/partners/restaurant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: registerData.name,
          phone: registerData.phone,
          email: registerData.email,
          restaurantName: registerData.restaurantName,
          restaurantCategory: registerData.restaurantCategory,
          address: registerData.address,
          description: registerData.description,
          website: registerData.website,
          instagram: registerData.instagram,
          password: registerData.password, // Сохраняем пароль
        }),
      });

      if (res.ok) {
        alert("✅ Ariza yuborildi! Administrator tekshirgandan so'ng sizga tasdiqlash keladi.\n\nKeyin email va parol bilan kira olasiz.");
        setRegisterData({
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
        setIsLogin(true);
      } else {
        const err = await res.json();
        alert("❌ Xatolik: " + (err.error || "Qaytadan urinib ko'ring"));
      }
    } catch (error) {
      console.error(error);
      alert("❌ Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          
          {/* Toggle Buttons */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => {
                setIsLogin(true);
                setError("");
              }}
              className={`flex-1 py-2 rounded-xl font-semibold transition ${
                isLogin ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              🔐 Kirish
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError("");
              }}
              className={`flex-1 py-2 rounded-xl font-semibold transition ${
                !isLogin ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              📝 Ro'yxatdan o'tish
            </button>
          </div>

          {/* Форма ВХОДА */}
          {isLogin ? (
            <>
              <div className="text-center mb-6">
                <div className="text-5xl mb-2">🍕</div>
                <h2 className="text-xl font-bold text-gray-800">Restoran kabinetiga kirish</h2>
                <p className="text-gray-500 text-sm">Email va parolingiz bilan kiring</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="email"
                  required
                  placeholder="Email"
                  className="w-full p-3 border rounded-xl focus:outline-none focus:border-orange-500"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                />
                <input
                  type="password"
                  required
                  placeholder="Parol"
                  className="w-full p-3 border rounded-xl focus:outline-none focus:border-orange-500"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                />
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-xl font-semibold disabled:opacity-50"
                >
                  {loading ? "Kutilmoqda..." : "🔐 Kirish"}
                </button>
              </form>
            </>
          ) : (
            // Форма РЕГИСТРАЦИИ (с паролем)
            <>
              <div className="text-center mb-6">
                <div className="text-5xl mb-2">📝</div>
                <h2 className="text-xl font-bold text-gray-800">Restoran hamkorlik</h2>
                <p className="text-gray-500 text-sm">Ma'lumotlarni to'ldiring va parol yarating</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-3 max-h-[60vh] overflow-y-auto px-1">
                <input
                  type="text"
                  required
                  placeholder="Ismingiz *"
                  className="w-full p-2 border rounded-xl text-sm"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                />
                <input
                  type="tel"
                  required
                  placeholder="Telefon raqam *"
                  className="w-full p-2 border rounded-xl text-sm"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                />
                <input
                  type="email"
                  required
                  placeholder="Email *"
                  className="w-full p-2 border rounded-xl text-sm"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                />
                <input
                  type="password"
                  required
                  placeholder="Parol * (kamida 4 belgi)"
                  className="w-full p-2 border rounded-xl text-sm"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                />
                <input
                  type="password"
                  required
                  placeholder="Parolni takrorlang *"
                  className="w-full p-2 border rounded-xl text-sm"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                />
                <input
                  type="text"
                  required
                  placeholder="Restoran nomi *"
                  className="w-full p-2 border rounded-xl text-sm"
                  value={registerData.restaurantName}
                  onChange={(e) => setRegisterData({ ...registerData, restaurantName: e.target.value })}
                />
                <select
                  required
                  className="w-full p-2 border rounded-xl text-sm"
                  value={registerData.restaurantCategory}
                  onChange={(e) => setRegisterData({ ...registerData, restaurantCategory: e.target.value })}
                >
                  <option value="">Kategoriya tanlang *</option>
                  <option value="Pizza">Pizza</option>
                  <option value="Burger">Burger</option>
                  <option value="Sushi">Sushi</option>
                  <option value="Uzbek">O‘zbek taomlari</option>
                  <option value="European">Yevropa taomlari</option>
                  <option value="FastFood">Fast Food</option>
                </select>
                <input
                  type="text"
                  required
                  placeholder="Manzil *"
                  className="w-full p-2 border rounded-xl text-sm"
                  value={registerData.address}
                  onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })}
                />
                <textarea
                  placeholder="Restoran haqida (ixtiyoriy)"
                  className="w-full p-2 border rounded-xl text-sm resize-none"
                  rows={2}
                  value={registerData.description}
                  onChange={(e) => setRegisterData({ ...registerData, description: e.target.value })}
                />
                <input
                  type="url"
                  placeholder="Website (ixtiyoriy)"
                  className="w-full p-2 border rounded-xl text-sm"
                  value={registerData.website}
                  onChange={(e) => setRegisterData({ ...registerData, website: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Instagram (ixtiyoriy)"
                  className="w-full p-2 border rounded-xl text-sm"
                  value={registerData.instagram}
                  onChange={(e) => setRegisterData({ ...registerData, instagram: e.target.value })}
                />
                {error && (
                  <div className="bg-red-50 text-red-600 p-2 rounded-xl text-sm">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white p-2 rounded-xl font-semibold disabled:opacity-50 mt-2"
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