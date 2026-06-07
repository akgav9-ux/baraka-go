"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";

export default function Header() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-black via-green-900 to-green-500 text-white px-5 py-3 shadow-md rounded-b-[28px]">

        <div className="flex items-center justify-between">

          {/* LOGO (КЛИКАБЕЛЬНЫЙ) */}
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2"
          >
            <img
              src="/logo.png"
              alt="Baraka GO"
              className="h-10 w-auto"
            />
            <p className="font-semibold tracking-wide">Baraka GO</p>
          </button>

          {/* BURGER */}
          <button
            onClick={() => setOpen(true)}
            className="w-10 h-10 flex items-center justify-center text-xl"
          >
            ☰
          </button>

        </div>

      </header>

      {/* чтобы контент не прятался под fixed header */}
      <div className="h-16" />

      <Sidebar open={open} onClose={() => setOpen(false)} />
    </>
  );
}