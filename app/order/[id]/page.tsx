"use client";

import { useParams } from "next/navigation";
import { orders } from "@/app/lib/orders";

export default function OrderPage() {
  const { id } = useParams();
  const order = orders.get(id as string);

  if (!order) return <p>Order not found</p>;

  return (
    <main className="p-4 space-y-3">

      <h1 className="text-xl font-bold">📦 Buyurtma</h1>

      <p>Status: {order.status}</p>

      {order.items.map((i: any) => (
        <div key={i.id} className="border p-3 rounded-xl">
          {i.name}
        </div>
      ))}

      <p className="font-bold">
        Jami: {order.total} so‘m
      </p>

    </main>
  );
}