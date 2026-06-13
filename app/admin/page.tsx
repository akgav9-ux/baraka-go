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

export default function AdminPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const loadApplications = async () => {
    try {
      const res = await fetch("/api/applications");
      const data = await res.json();
      setApplications(data);
    } catch (error) {
      console.error("Error loading applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch("/api/applications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      loadApplications();
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
      default: return "🚗";
    }
  };

  const getTransportName = (type: string) => {
    switch (type) {
      case "courier": return "Kuryer";
      case "gazel": return "Gazel yuk tashuvchi";
      case "intercity": return "Mejgorod haydovchi";
      case "taxi": return "Taksi haydovchi";
      default: return type;
    }
  };

  const filteredApplications = applications.filter(app => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return app.status === "pending";
    if (activeTab === "approved") return app.status === "approved";
    if (activeTab === "rejected") return app.status === "rejected";
    return app.transport === activeTab;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === "pending").length,
    approved: applications.filter(a => a.status === "approved").length,
    rejected: applications.filter(a => a.status === "rejected").length,
    courier: applications.filter(a => a.transport === "courier").length,
    gazel: applications.filter(a => a.transport === "gazel").length,
    intercity: applications.filter(a => a.transport === "intercity").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">⏳ Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4">
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
        </div>

        {/* Applications List */}
        <div className="space-y-3">
          {filteredApplications.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center text-gray-500">
              📭 Arizalar mavjud emas
            </div>
          ) : (
            filteredApplications.map((app) => (
              <div key={app.id} className="bg-white rounded-xl p-4 shadow">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getTransportIcon(app.transport)}</span>
                    <div>
                      <h3 className="font-bold">{app.name} {app.surname}</h3>
                      <p className="text-xs text-gray-500">{getTransportName(app.transport)}</p>
                    </div>
                  </div>
                  {getStatusBadge(app.status)}
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-2 text-sm mb-3 pb-3 border-b">
                  <div>
                    <p className="text-xs text-gray-500">📞 Telefon</p>
                    <p className="font-medium">{app.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">🆔 Passport</p>
                    <p className="font-medium">{app.passport}</p>
                  </div>
                </div>

                {/* Documents */}
                <div className="space-y-2 text-sm mb-3">
                  <p className="text-xs text-gray-500">📄 Hujjatlar:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-xs text-gray-500">🚗 Texnik pasport</p>
                      <p className="text-sm">{app.carPassport || "-"}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-xs text-gray-500">🪪 Haydovchilik guvohnomasi</p>
                      <p className="text-sm">{app.driverLicense || "-"}</p>
                    </div>
                  </div>
                  {app.carModel && (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-xs text-gray-500">🚘 Avtomobil modeli</p>
                        <p className="text-sm">{app.carModel}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-xs text-gray-500">🔢 Avtomobil raqami</p>
                        <p className="text-sm">{app.carNumber}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {app.status === "pending" && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => updateStatus(app.id, "approved")}
                      className="flex-1 bg-green-600 text-white py-2 rounded-xl font-semibold hover:bg-green-700 transition"
                    >
                      ✅ Tasdiqlash
                    </button>
                    <button
                      onClick={() => updateStatus(app.id, "rejected")}
                      className="flex-1 bg-red-500 text-white py-2 rounded-xl font-semibold hover:bg-red-600 transition"
                    >
                      ❌ Rad etish
                    </button>
                  </div>
                )}

                {/* Creation date */}
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