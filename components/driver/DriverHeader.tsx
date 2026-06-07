"use client";

import { useRouter } from "next/navigation";

export default function DriverHeader() {
  const router = useRouter();

  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Driver Dashboard</h1>
        <button 
          onClick={() => router.push("/")}
          className="bg-white text-blue-600 px-4 py-2 rounded-lg"
        >
          Выйти
        </button>
      </div>
    </header>
  );
}