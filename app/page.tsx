"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function Page() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const user = localStorage.getItem("user");

    if (!user) {
      router.push("/auth");
    }
  }, [router]);

  if (!isClient) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-100">

      {/* HEADER ТОЛЬКО ТУТ */}
      <Header />

      <div className="p-3">
        <div className="grid grid-cols-2 gap-3 mt-3">

          <button onClick={() => router.push("/taxi")} className="rounded-2xl overflow-hidden">
            <img src="/icons/taxi.png" className="w-full" alt="Taksi" />
          </button>

          <button onClick={() => router.push("/courier")} className="rounded-2xl overflow-hidden">
            <img src="/icons/courier.png" className="w-full" alt="Kuryer" />
          </button>

          <button onClick={() => router.push("/gazel")} className="rounded-2xl overflow-hidden">
            <img src="/icons/truck.png" className="w-full" alt="Yuk tashish" />
          </button>

          <button onClick={() => router.push("/food")} className="rounded-2xl overflow-hidden">
            <img src="/icons/food.png" className="w-full" alt="Ovqat" />
          </button>

          <button
            onClick={() => router.push("/intercity")}
            className="col-span-2 rounded-2xl overflow-hidden"
          >
            <img src="/icons/intercity.png" className="w-full h-24 object-cover" alt="Mejgorod" />
          </button>

        </div>
      </div>

    </main>
  );
}