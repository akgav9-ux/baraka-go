"use client";

import { useState } from "react";

export default function CreateOrder() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [price, setPrice] = useState("");

  const createOrder = () => {
    const newOrder = {
      id: Date.now(),
      from,
      to,
      price,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const old = JSON.parse(localStorage.getItem("orders") || "[]");

    localStorage.setItem(
      "orders",
      JSON.stringify([...old, newOrder])
    );

    alert("Order created 🚀");
  };

  return (
    <main className="p-4 min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto bg-white p-5 rounded-3xl shadow space-y-3">

        <h1 className="text-xl font-bold">📦 Create Order</h1>

        <input
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="w-full p-3 border rounded-xl"
          placeholder="From"
        />

        <input
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="w-full p-3 border rounded-xl"
          placeholder="To"
        />

        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-3 border rounded-xl"
          placeholder="Price"
        />

        <button
          onClick={createOrder}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-bold"
        >
          Send Order
        </button>

      </div>
    </main>
  );
}