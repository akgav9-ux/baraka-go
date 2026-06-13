"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Application {
  id: number;
  name: string;
  surname: string;
  fatherName: string;
  phone: string;
  passport: string;
  driverLicense: string;
  carPassport: string;
  carModel?: string;
  carNumber?: string;
  transport: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

interface PartnerRequest {
  id: number;
  name: string;
  phone: string;
  email?: string;
  restaurantName: string;
  restaurantCategory: string;
  address: string;
  description?: string;
  website?: string;
  instagram?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [partnerRequests, setPartnerRequests] = useState<PartnerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const loadApplications = async () => {
    try {
      const res = await fetch("/api/applications");
      const data = await res.json();
      setApplications(data);
    } catch (error) {
      console.error("Error loading applications:", error);
    }
  };

  const loadPartnerRequests = async () => {
    try {
      const res = await fetch("/api/partners/restaurant");
      const data = await res.json();
      setPartnerRequests(data);
    } catch (error) {
      console.error("Error loading partner requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
    loadPartnerRequests();
  }, []);

  const updateStatus = async (id: number, status: string, type: "driver" | "restaurant") => {
    try {
      const endpoint = type === "driver" ? "/api/applications" : "/api/partners/restaurant";
      await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      
      if (type === "driver") {
        loadApplications();
      } else {
        loadPartnerRequests();
      }
      
      alert(status === "approved" ? "✅ Tasdiqlandi!" : "❌ Rad etildi");
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">⏳ Kutilmoqda</span>;
      case "approved":
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">✅ Tasdiqlangan</span>;
      case "rejected":
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">❌ Rad etilgan</span>;
      default:
        return null;
    }
  };

  const getTransportIcon = (type: string) => {
    switch (type) {
      case "courier": return "🛵";
      case "gazel": return "🚚";
      case "intercity": return "🌍";
      case "taxi": return "🚕";
      case "restaurant": return "🍕";
      default: return "🚗";
    }
  };

  const getTransportName = (type: string) => {
    switch (type) {
      case "courier": return "Kuryer";
      case "gazel": return "Gazel yuk tashuvchi";
      case "intercity": return "Mejgorod haydovchi";
      case "taxi": return "Taksi haydovchi";
      case "restaurant": return "Restoran";
      default: return type;
    }
  };

  // Объединяем все заявки в один массив
  const allApplications = [
    ...applications.map(app => ({
      ...app,
      type: "driver" as const,
      displayName: `${app.name} ${app.surname}`,
      displayInfo: getTransportName(app.transport),
      icon: getTransportIcon(app.transport),
    })),
    ...partnerRequests.map(req => ({
      id: req.id,
      name: req.name,
      surname: "",
      fatherName: "",
      phone: req.phone,
      passport: "",
      driverLicense: "",
      carPassport: "",
      transport: "restaurant",
      status: req.status,
      createdAt: req.createdAt,
      type: "restaurant" as const,
      displayName: req.restaurantName,
      displayInfo: req.restaurantCategory,
      icon: "🍕",
      email: req.email,
      address: req.address,
      description: req.description,
      website: req.website,
      instagram: req.instagram,
    })),
  ];

  const filteredApplications = allApplications.filter(app => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return app.status === "pending";
    if (activeTab === "approved") return app.status === "approved";
    if (activeTab === "rejected") return app.status === "rejected";
    if (activeTab === "restaurant") return app.transport === "restaurant";
    return app.transport === activeTab;
  });

  const stats = {
    total: allApplications.length,
    pending: allApplications.filter(a => a.status === "pending").length,
    approved: allApplications.filter(a => a.status === "approved").length,
    rejected: allApplications.filter(a => a.status === "rejected").length,
    courier: applications.filter(a => a.transport === "courier").length,
    gazel: applications.filter(a => a.transport === "gazel").length,
    intercity: applications.filter(a => a.transport === "intercity").length,
    taxi: applications.filter(a => a.transport === "taxi").length,
    restaurant: partnerRequests.length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">⏳ Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 pb-24">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-2xl p-5 shadow mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">👨‍💼 Admin Panel</h1>
              <p className="text-gray-500 text-sm">Ariza va so'rovlarni boshqarish</p>
            </div>
            <button
              onClick={() => router.push("/")}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-white rounded-xl p-3 text-center shadow">
            <div className="text-2xl">📋</div>
            <div className="text-xl font-bold">{stats.total}</div>
            <div className="text-xs text-gray-500">Jami arizalar</div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-3 text-center shadow">
            <div className="text-2xl">⏳</div>
            <div className="text-xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-xs text-gray-500">Kutilmoqda</div>
          </div>
          <div className="bg-green-50 rounded-xl p-3 text-center shadow">
            <div className="text-2xl">✅</div>
            <div className="text-xl font-bold text-green-600">{stats.approved}</div>
            <div className="text-xs text-gray-500">Tasdiqlangan</div>
          </div>
          <div className="bg-red-50 rounded-xl p-3 text-center shadow">
            <div className="text-2xl">❌</div>
            <div className="text-xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-xs text-gray-500">Rad etilgan</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              activeTab === "all" ? "bg-gray-800 text-white" : "bg-white text-gray-700"
            }`}
          >
            📋 Barchasi ({stats.total})
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              activeTab === "pending" ? "bg-yellow-500 text-white" : "bg-white text-gray-700"
            }`}
          >
            ⏳ Kutilmoqda ({stats.pending})
          </button>
          <button
            onClick={() => setActiveTab("courier")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              activeTab === "courier" ? "bg-green-600 text-white" : "bg-white text-gray-700"
            }`}
          >
            🛵 Kuryer ({stats.courier})
          </button>
          <button
            onClick={() => setActiveTab("gazel")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              activeTab === "gazel" ? "bg-blue-600 text-white" : "bg-white text-gray-700"
            }`}
          >
            🚚 Gazel ({stats.gazel})
          </button>
          <button
            onClick={() => setActiveTab("intercity")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              activeTab === "intercity" ? "bg-purple-600 text-white" : "bg-white text-gray-700"
            }`}
          >
            🌍 Mejgorod ({stats.intercity})
          </button>
          <button
            onClick={() => setActiveTab("restaurant")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              activeTab === "restaurant" ? "bg-orange-500 text-white" : "bg-white text-gray-700"
            }`}
          >
            🍕 Restoran ({stats.restaurant})
          </button>
        </div>

        {/* Applications List */}
        <div className="space-y-3">
          {filteredApplications.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center text-gray-500">
              📭 Arizalar mavjud emas
            </div>
          ) : (
            filteredApplications.map((app) => (
              <div key={`${app.type}-${app.id}`} className="bg-white rounded-xl p-4 shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{app.icon}</span>
                    <div>
                      <h3 className="font-bold">{app.displayName}</h3>
                      <p className="text-xs text-gray-500">{app.displayInfo}</p>
                    </div>
                  </div>
                  {getStatusBadge(app.status)}
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm mb-3 pb-3 border-b">
                  <div>
                    <p className="text-xs text-gray-500">📞 Telefon</p>
                    <p className="font-medium">{app.phone}</p>
                  </div>
                  {app.type === "driver" ? (
                    <div>
                      <p className="text-xs text-gray-500">🆔 Passport</p>
                      <p className="font-medium">{(app as any).passport || "-"}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-gray-500">📍 Manzil</p>
                      <p className="font-medium truncate">{(app as any).address || "-"}</p>
                    </div>
                  )}
                </div>

                {/* Driver specific fields */}
                {app.type === "driver" && (
                  <div className="space-y-2 text-sm mb-3">
                    <p className="text-xs text-gray-500">📄 Hujjatlar:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-xs text-gray-500">🚗 Texnik pasport</p>
                        <p className="text-sm">{(app as any).carPassport || "-"}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-xs text-gray-500">🪪 Haydovchilik guvohnomasi</p>
                        <p className="text-sm">{(app as any).driverLicense || "-"}</p>
                      </div>
                    </div>
                    {(app as any).carModel && (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-xs text-gray-500">🚘 Avtomobil modeli</p>
                          <p className="text-sm">{(app as any).carModel}</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-xs text-gray-500">🔢 Avtomobil raqami</p>
                          <p className="text-sm">{(app as any).carNumber}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Restaurant specific fields */}
                {app.type === "restaurant" && (
                  <div className="space-y-2 text-sm mb-3">
                    {(app as any).description && (
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-xs text-gray-500">📝 Tavsif</p>
                        <p className="text-sm">{(app as any).description}</p>
                      </div>
                    )}
                    {(app as any).email && (
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-xs text-gray-500">📧 Email</p>
                        <p className="text-sm">{(app as any).email}</p>
                      </div>
                    )}
                    {((app as any).website || (app as any).instagram) && (
                      <div className="grid grid-cols-2 gap-2">
                        {(app as any).website && (
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-xs text-gray-500">🌐 Website</p>
                            <p className="text-sm truncate">{(app as any).website}</p>
                          </div>
                        )}
                        {(app as any).instagram && (
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-xs text-gray-500">📷 Instagram</p>
                            <p className="text-sm">{(app as any).instagram}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {app.status === "pending" && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => updateStatus(app.id, "approved", app.type)}
                      className="flex-1 bg-green-600 text-white py-2 rounded-xl font-semibold hover:bg-green-700 transition"
                    >
                      ✅ Tasdiqlash
                    </button>
                    <button
                      onClick={() => updateStatus(app.id, "rejected", app.type)}
                      className="flex-1 bg-red-500 text-white py-2 rounded-xl font-semibold hover:bg-red-600 transition"
                    >
                      ❌ Rad etish
                    </button>
                  </div>
                )}

                <p className="text-xs text-gray-400 mt-3">
                  📅 {new Date(app.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}