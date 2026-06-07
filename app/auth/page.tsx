"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AuthPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");

  const login = () => {
    if (!phone) return;

    localStorage.setItem(
      "user",
      JSON.stringify({
        phone,
      })
    );

    router.push("/");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-5">

      <div className="bg-white w-full max-w-sm p-5 rounded-2xl shadow">

        <h1 className="text-center font-bold text-lg">
          Telefon bilan kirish
        </h1>

        <input
          className="w-full border p-3 rounded-xl mt-5"
          placeholder="+998..."
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button
          onClick={login}
          className="w-full mt-5 bg-green-600 text-white py-3 rounded-xl"
        >
          Kirish
        </button>

      </div>
    </main>
  );
}