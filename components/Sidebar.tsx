"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [dark, setDark] = useState(false);
  const [userAvatar, setUserAvatar] = useState("");

  // load user
  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));

    const avatar = localStorage.getItem("avatar");
    if (avatar) setUserAvatar(avatar);
  }, []);

  const goProfile = () => {
    onClose();
    router.push("/profile");
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("avatar");
    router.push("/auth");
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
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-[9999] p-5 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >

        {/* PROFILE BUTTON */}
        <button
          onClick={goProfile}
          className="w-full bg-gray-50 rounded-2xl p-4 flex items-center justify-between hover:bg-gray-100 transition"
        >
          <div className="flex items-center gap-3">

            <img
              src={userAvatar || "/avatar.png"}
              alt="avatar"
              className="w-14 h-14 rounded-full object-cover border"
            />

            <div className="text-left">
              <p className="font-bold">
                {user?.phone || "Foydalanuvchi"}
              </p>

              <p className="text-yellow-500 text-sm">
                ⭐⭐⭐⭐⭐
              </p>

              <p className="text-xs text-gray-500">
                Safarlar: 12
              </p>
            </div>

          </div>

          <span className="text-xl text-gray-400">›</span>
        </button>

        {/* ACTIVE ORDERS */}
        <button
  onClick={() => {
    onClose();
    router.push("/");
  }}
  className="w-full mt-5 text-left p-3 rounded-xl bg-gray-100"
>
        🏠 Bosh saxifa
      </button>
        <button className="w-full mt-5 text-left p-3 rounded-xl bg-gray-100">
          🚕 Aktiv buyurtmalar
        </button>

        {/* HISTORY */}
        <button className="w-full mt-2 text-left p-3 rounded-xl bg-gray-100">
          📦 Buyurtmalar tarixi
        </button>

        {/* NIGHT MODE */}
        <div className="flex items-center justify-between mt-4 p-3 bg-gray-100 rounded-xl">
          <span>🌙 Tungi rejim</span>

          <button
            onClick={() => setDark(!dark)}
            className={`w-10 h-5 flex items-center rounded-full p-1 transition ${
              dark ? "bg-green-600" : "bg-gray-300"
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full transition ${
                dark ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="w-full mt-4 p-3 rounded-xl bg-gray-100"
        >
          🚪 Chiqish
        </button>

        {/* BOTTOM BUTTON */}
        <div className="absolute bottom-5 left-5 right-5">
          <button
  onClick={() => {
    onClose();
    router.push("/work-with-us");
  }}
  className="w-full mt-3 p-3 rounded-xl bg-green-600 text-left active:scale-95 transition"
>
  🤝 Biz bilan ishlash
</button>
        </div>

      </div>
    </>
  );
}