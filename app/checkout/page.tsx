"use client";

import { useCart } from "@/app/lib/cart";  // <-- поменял импорт
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCart();  // <-- вызываем хук

  const createOrder = () => {
    alert("Buyurtma yuborildi 🚀");
    
    cart.clear();
    router.push("/");
  };

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-xl font-bold">🛒 Korzina</h1>

      {cart.items.length === 0 && (
        <p className="text-gray-500">Korzina bo‘sh</p>
      )}

      {cart.items.map((item) => (
        <div key={item.id} className="border p-3 rounded-xl flex justify-between">
          <span>{item.name}</span>
          <span>{item.price} so‘m</span>
        </div>
      ))}

      <div className="text-lg font-bold">
        Jami: {cart.total()} so‘m
      </div>

      <button
        onClick={createOrder}
        className="w-full p-3 bg-green-600 text-white rounded-xl"
      >
        Buyurtma berish
      </button>
    </main>
  );
}