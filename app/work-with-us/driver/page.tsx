"use client";

import { useRouter } from "next/navigation";

export default function DriverRegister() {
  const router = useRouter();

  const goDriver = () => {
    localStorage.setItem("mode", "driver");
    router.push("/driver");
  };

  return (
    <main className="p-4 pt-24">

      <h1 className="text-2xl font-bold mb-4">
        🚕 Haydovchi bo‘lish
      </h1>

      <button
        onClick={goDriver}
        className="w-full bg-black text-white p-4 rounded-xl"
      >
        Driver rejimni yoqish
      </button>

    </main>
  );
}