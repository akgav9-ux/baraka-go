"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DriverSidebar from "@/components/driver/DriverSidebar";

export default function DriverPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <main className="min-h-screen bg-gray-100">

      {/* DRIVER HEADER */}
      <header className="bg-black text-white px-4 py-3 flex items-center justify-between">
      <h1 className="font-bold text-lg">🚕 Driver Mode</h1>

        <button onClick={() => setOpen(true)}>
          ☰
        </button>
      </header>

      <div className="p-4">
        <p>Driver dashboard</p>
      </div>

      <DriverSidebar open={open} onClose={() => setOpen(false)} />

    </main>
  );
}