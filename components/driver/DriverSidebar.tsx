"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function DriverSidebar({ open, onClose }: Props) {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

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
        className={`fixed top-0 right-0 h-full w-72 z-50 shadow-xl transform transition-transform duration-300 flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        } ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}
      >

        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-bold">🚕 Haydovchi menyu</h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500"
          >
            ✕
          </button>
        </div>

        {/* MENU */}
        <div className="flex-1 p-4 space-y-2">

          <button
            onClick={() => router.push("/driver")}
            className="w-full text-left p-3 rounded-xl hover:bg-gray-100"
          >
            📊 Faol buyurtma
          </button>

          <button
            onClick={() => router.push("/driver/orders")}
            className="w-full text-left p-3 rounded-xl hover:bg-gray-100"
          >
            📦 Buyurtmalar tarixi
          </button>

          <button
            onClick={() => router.push("/driver/profile")}
            className="w-full text-left p-3 rounded-xl hover:bg-gray-100"
          >
            👤 Profil
          </button>

          {/* DARK MODE */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full text-left p-3 rounded-xl hover:bg-gray-100 flex justify-between"
          >
            🌙 Tungi rejim
            <span>{darkMode ? "ON" : "OFF"}</span>
          </button>
        </div>

        {/* BOTTOM BUTTON */}
        <div className="p-4 border-t space-y-2">

          <button
  onClick={() => router.push("/")}
  className="w-full bg-green-600 text-white p-3 rounded-xl font-semibold"
>
  👤 Buyurtmachi bo‘lish
</button>

        </div>

      </div>
    </>
  );
}