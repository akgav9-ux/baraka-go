"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function WorkWithUsPage() {
  const router = useRouter();
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState("");
  const [phone, setPhone] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const services = [
    {
      id: 1,
      title: "Haydovchi bo‘lish",
      description: "Taksi haydovchisi sifatida ishlash",
      icon: "🚕",
      bgColor: "from-yellow-500 to-orange-500",
      glowColor: "shadow-yellow-500/50",
      route: "/work-with-us/driver",
      badge: "🔥 Ommabop"
    },
    {
      id: 2,
      title: "Kuryer bo‘lish",
      description: "Yetkazib berish xizmatida ishlash",
      icon: "📦",
      bgColor: "from-green-500 to-emerald-500",
      glowColor: "shadow-green-500/50",
      route: "/work-with-us/courier",
      badge: "📈 Talab katta"
    },
    {
      id: 3,
      title: "Yuk tashuvchi bo‘lish",
      description: "Yuk tashish (Gazel) haydovchisi sifatida ishlash",
      icon: "🚚",
      bgColor: "from-blue-500 to-cyan-500",
      glowColor: "shadow-blue-500/50",
      route: "/work-with-us/gazel",
      badge: "💰 Yuqori daromad",
      hasLogin: true
    },
    {
      id: 4,
      title: "Shaharlararo haydovchi",
      description: "Shaharlararo yo‘nalishlarda ishlash",
      icon: "🌍",
      bgColor: "from-purple-500 to-pink-500",
      glowColor: "shadow-purple-500/50",
      route: "/work-with-us/intercity",
      badge: "🛣️ Uzoq yo‘l",
      hasLogin: true
    },
    {
      id: 5,
      title: "Restoran ulash",
      description: "Restoraningizni Baraka Go ga qo‘shing",
      icon: "🍔",
      bgColor: "from-red-500 to-rose-500",
      glowColor: "shadow-red-500/50",
      route: "/restaurant/login",
      badge: "🍽️ Hamkorlik"
    }
  ];

  const handleServiceClick = (service: any) => {
    // Для ресторана сразу переходим на страницу входа
    if (service.id === 5) {
      router.push("/restaurant/login");
      return;
    }
    // Для остальных с hasLogin - показываем модалку
    if (service.hasLogin) {
      setSelectedRoute(service.route);
      setShowChoiceModal(true);
    } else {
      router.push(service.route);
    }
  };

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
          setLoginError("⛔ Arizangiz hali tasdiqlanmagan yoki bloklangan!");
        } else {
          setLoginError("❌ Xatolik yuz berdi");
        }
        setLoading(false);
        return;
      }

      localStorage.setItem("driver", JSON.stringify(data));
      localStorage.setItem("driver_phone", phone);
      
      setShowLoginModal(false);
      setShowChoiceModal(false);
      setPhone("");
      setLoginError("");

      if (data.transport === "gazel") {
        router.push("/gazel/home");
      } else if (data.transport === "courier") {
        router.push("/courier/home");
      } else if (data.transport === "intercity") {
        router.push("/intercity/home");
      } else if (data.transport === "taxi") {
        router.push("/taxi/home");
      }
      
    } catch (error) {
      setLoginError("❌ Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      
      {/* REDUCED HEADER - 50% smaller */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white pt-6 pb-4 px-4 rounded-b-2xl shadow-lg">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-3xl">🚀</div>
            <div>
              <h1 className="text-xl font-bold">Baraka Go</h1>
              <p className="text-xs opacity-90">Bizning jamoamizga qo‘shiling</p>
            </div>
          </div>
          <p className="text-white/80 text-xs">
            O‘z vaqtingizni va moliyaviy imkoniyatlaringizni oshiring.
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => handleServiceClick(service)}
            className={`w-full group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:${service.glowColor} hover:shadow-xl`}
            style={{
              boxShadow: `0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.02)`
            }}
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${service.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className={`absolute -inset-1 bg-gradient-to-r ${service.bgColor} blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10`} />
            
            <div className="relative bg-white rounded-2xl m-0.5 p-4 text-left group-hover:bg-transparent transition-colors duration-300">
              <div className="flex items-start gap-3">
                <div className={`text-4xl bg-gradient-to-br ${service.bgColor} bg-clip-text text-transparent group-hover:text-white transition-all duration-300`}>
                  {service.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-bold text-base text-gray-800 group-hover:text-white transition-colors duration-300">
                      {service.title}
                    </h2>
                    {service.badge && (
                      <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${service.bgColor} text-white group-hover:bg-white/20 group-hover:text-white transition-colors duration-300`}>
                        {service.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 group-hover:text-white/80 transition-colors duration-300">
                    {service.description}
                  </p>
                </div>
                
                <div className="text-gray-400 group-hover:text-white transform group-hover:translate-x-1 transition-all duration-300">
                  →
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Footer Note */}
      <div className="text-center py-4">
        <p className="text-xs text-gray-400">
          Baraka Go bilan ishlash orqali siz qulay shartlar va yuqori daromadga ega bo‘lasiz
        </p>
      </div>

      {/* MODAL 1: ВЫБОР */}
      {showChoiceModal && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setShowChoiceModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-white rounded-2xl p-5 shadow-2xl z-50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                🚚 Yuk tashuvchi
              </h2>
              <button onClick={() => setShowChoiceModal(false)} className="text-2xl text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowChoiceModal(false);
                  router.push(selectedRoute);
                }}
                className="w-full p-4 rounded-xl border-2 border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 text-left flex items-center gap-3 hover:from-green-100 hover:to-emerald-100 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <span className="text-3xl">📝</span>
                <div>
                  <div className="font-semibold text-green-700">Ariza topshirish</div>
                  <div className="text-xs text-gray-500">Yangi haydovchi sifatida ro'yxatdan o'tish</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowChoiceModal(false);
                  setShowLoginModal(true);
                }}
                className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 text-left flex items-center gap-3 hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <span className="text-3xl">🔐</span>
                <div>
                  <div className="font-semibold text-gray-700">Kabinetga kirish</div>
                  <div className="text-xs text-gray-500">Ariza holatini tekshirish</div>
                </div>
              </button>
            </div>
          </div>
        </>
      )}

      {/* MODAL 2: ВХОД ПО ТЕЛЕФОНУ */}
      {showLoginModal && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setShowLoginModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-white rounded-2xl p-5 shadow-2xl z-50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                🔐 Kabinetga kirish
              </h2>
              <button onClick={() => setShowLoginModal(false)} className="text-2xl text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Telefon raqam</label>
                <input
                  type="tel"
                  placeholder="+998 XX XXX XX XX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"
                  autoFocus
                />
              </div>
              
              {loginError && (
                <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">{loginError}</p>
              )}
              
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3 rounded-xl font-semibold disabled:opacity-50 hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-md"
              >
                {loading ? "⏳ Tekshirilmoqda..." : "🔐 Kirish"}
              </button>

              <p className="text-center text-sm text-gray-500">
                Ro'yxatdan o'tmaganmisiz?{" "}
                <button
                  onClick={() => {
                    setShowLoginModal(false);
                    router.push(selectedRoute);
                  }}
                  className="text-green-600 font-semibold hover:text-green-700"
                >
                  Ariza topshirish
                </button>
              </p>
            </div>
          </div>
        </>
      )}
    </main>
  );
}