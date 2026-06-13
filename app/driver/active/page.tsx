"use client";

import { useEffect, useState } from "react";

export default function ActiveDriversPage() {
  const [drivers, setDrivers] = useState<any[]>([]);

  useEffect(() => {
    const apps = JSON.parse(localStorage.getItem("applications") || "[]");

    const approved = apps.filter(
      (a: any) => a.status === "approved"
    );

    setDrivers(approved);
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-4">

      <div className="max-w-md mx-auto space-y-4">

        <h1 className="text-2xl font-bold">
          🚗 Active Drivers
        </h1>

        {drivers.length === 0 ? (
          <p className="text-gray-500">No active drivers</p>
        ) : (
          drivers.map((d) => (
            <div
              key={d.id}
              className="bg-white p-4 rounded-2xl shadow"
            >
              <p><b>👤 Name:</b> {d.name}</p>
              <p><b>🚶 Type:</b> {d.transport}</p>
              <p className="text-green-600 font-bold">
                ACTIVE
              </p>
            </div>
          ))
        )}

      </div>

    </main>
  );
}