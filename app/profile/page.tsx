"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const router = useRouter();

  const [name, setName] = useState("Foydalanuvchi");
  const [surname, setSurname] = useState("");
  const [city, setCity] = useState("");
  const [avatar, setAvatar] = useState<string>("");

  // 📦 загрузка из localStorage
  useEffect(() => {
    const saved = localStorage.getItem("profile");

    if (saved) {
      const data = JSON.parse(saved);
      setName(data.name || "Foydalanuvchi");
      setSurname(data.surname || "");
      setCity(data.city || "");
      setAvatar(data.avatar || "");
    }
  }, []);

  // 📸 загрузка фото
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setAvatar(url);
  };

  // 💾 сохранение
  const handleSave = () => {
    localStorage.setItem(
      "profile",
      JSON.stringify({
        name,
        surname,
        city,
        avatar,
      })
    );

    alert("Saqlandi ✅");
  };

  return (
    <main className="min-h-screen bg-gray-100 p-5">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => router.back()} className="text-xl font-bold">
          ←
        </button>

        <h1 className="text-lg font-bold">Profilni tahrirlash</h1>
      </div>

      {/* CARD */}
      <div className="bg-white rounded-2xl p-5 shadow">

        {/* AVATAR */}
        <div className="flex flex-col items-center">

          <img
            src={
              avatar ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            className="w-24 h-24 rounded-full object-cover border"
          />

          {/* upload */}
          <label className="mt-2 text-green-600 text-sm cursor-pointer">
            Rasmni o‘zgartirish
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImage}
            />
          </label>

          <p className="mt-2 font-bold">{name}</p>

          <p className="text-yellow-500 text-sm mt-1">⭐⭐⭐⭐⭐</p>

          <p className="text-gray-500 text-sm mt-1">
            Safarlar: 12
          </p>
        </div>

        {/* INPUTS */}
        <div className="mt-5 space-y-2 text-sm">

          <input
            className="w-full border rounded-xl p-3"
            placeholder="Ism"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full border rounded-xl p-3"
            placeholder="Familiya"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
          />

          <input
            className="w-full border rounded-xl p-3"
            placeholder="Shahar"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        {/* SAVE */}
        <button
          onClick={handleSave}
          className="w-full mt-5 bg-green-600 text-white py-3 rounded-xl font-bold"
        >
          Saqlash
        </button>

      </div>
    </main>
  );
}