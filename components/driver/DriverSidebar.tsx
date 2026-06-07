"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function DriverSidebar({ open, onClose }: Props) {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  // 🔥 сохраняем тему
  useEffect(() => {
    const saved = localStorage.getItem("driver_dark");
    if (saved) setDarkMode(saved === "1");
  }, []);

  useEffect(() => {
    localStorage.setItem("driver_dark", darkMode ? "1" : "0");
  }, [darkMode]);

  const go = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <>
      {/* BACKDROP */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 right-0 h-full w-72 z-50 shadow-xl transform transition-transform duration-300 flex flex-col
        ${open ? "translate-x-0" : "translate-x-full"}
        ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}
      >

        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-bold">🚕 Haydovchi</h2>

          <button onClick={onClose} className="text-red-500">
            ✕
          </button>
        </div>

        {/* MENU */}
        <div className="flex-1 p-3 space-y-2">

          <button onClick={() => go("/driver")} className="menu-btn">
            📦 Faol buyurtma
          </button>

          <button onClick={() => go("/driver/orders")} className="menu-btn">
            📋 Buyurtmalar tarixi
          </button>

          <button onClick={() => go("/driver/profile")} className="menu-btn">
            👤 Profil
          </button>

          <button onClick={() => go("/driver/balance")} className="menu-btn">
            💰 Balans
          </button>

          <button onClick={() => setDarkMode(!darkMode)} className="menu-btn flex justify-between">
            🌙 Tungi rejim
            <span>{darkMode ? "ON" : "OFF"}</span>
          </button>

        </div>

        {/* BOTTOM */}
        <div className="p-4 border-t">

          <button
            onClick={() => go("/")}
            className="w-full bg-green-600 text-white p-3 rounded-xl font-semibold"
          >
            👤 Buyurtmachi bo‘lish
          </button>

        </div>

        {/* styles */}
        <style jsx>{`
          .menu-btn {
            width: 100%;
            text-align: left;
            padding: 12px;
            border-radius: 12px;
            transition: 0.2s;
          }
          .menu-btn:hover {
            background: rgba(128, 128, 128, 0.15);
          }
        `}</style>

      </div>
    </>
  );
}