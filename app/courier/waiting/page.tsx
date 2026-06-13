"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function WaitingPage() {
  const router = useRouter();
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    const interval = setInterval(() => {
      const apps = JSON.parse(localStorage.getItem("applications") || "[]");

      const myApp = apps.find((a: any) => a.transport === "walk");

      if (myApp) {
        setStatus(myApp.status);

        if (myApp.status === "approved") {
          router.push("/courier/home");
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow text-center">
        <h1 className="text-xl font-bold">⏳ Ariza tekshirilmoqda</h1>
        <p className="text-gray-500 mt-2">
          Admin tasdiqlashini kuting...
        </p>

        <p className="mt-4 text-sm">
          Status: {status}
        </p>
      </div>
    </main>
  );
}