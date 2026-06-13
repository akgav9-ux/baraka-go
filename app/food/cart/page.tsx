"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [address, setAddress] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [payment, setPayment] = useState("cash");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("foodCart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const updateQuantity = (id: number, delta: number) => {
    const newCart = cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        if (newQuantity <= 0) return null;
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean) as CartItem[];
    
    setCart(newCart);
    localStorage.setItem("foodCart", JSON.stringify(newCart));
  };

  const removeItem = (id: number) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    localStorage.setItem("foodCart", JSON.stringify(newCart));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 10000;
  const finalPrice = totalPrice + deliveryFee;

  const handleOrder = async () => {
    if (!address) {
      alert("Введите адрес доставки");
      return;
    }
    if (!clientName) {
      alert("Введите ваше имя");
      return;
    }
    if (!clientPhone) {
      alert("Введите телефон");
      return;
    }

    setLoading(true);
    
    try {
      const res = await fetch("/api/food-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: cart[0]?.restaurantId || 1,
          items: cart,
          totalPrice,
          deliveryFee,
          finalPrice,
          address,
          clientName,
          clientPhone,
          comment,
          payment,
        }),
      });
      
      if (res.ok) {
        localStorage.removeItem("foodCart");
        alert("✅ Заказ оформлен! Ожидайте доставку.");
        router.push("/food/orders");
      } else {
        alert("❌ Ошибка при оформлении заказа");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Ошибка");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-3">🛒</div>
          <p className="text-gray-500">Корзина пуста</p>
          <button 
            onClick={() => router.push("/food")}
            className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg"
          >
            В меню
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-3">
        <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100">
          ←
        </button>
        <h1 className="text-center font-bold text-lg -mt-6">Корзина</h1>
      </div>

      <div className="p-4 space-y-4">
        {cart.map(item => (
          <div key={item.id} className="bg-white rounded-xl p-3 flex gap-3">
            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-semibold">{item.name}</h4>
                <span>{(item.price * item.quantity).toLocaleString()} сум</span>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="w-7 h-7 rounded-full bg-gray-200"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="w-7 h-7 rounded-full bg-gray-200"
                >
                  +
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="ml-auto text-red-500 text-sm"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="bg-white rounded-xl p-4 space-y-2">
          <div className="flex justify-between">
            <span>Товары:</span>
            <span>{totalPrice.toLocaleString()} сум</span>
          </div>
          <div className="flex justify-between">
            <span>Доставка:</span>
            <span>{deliveryFee.toLocaleString()} сум</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Итого:</span>
            <span className="text-orange-600">{finalPrice.toLocaleString()} сум</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 space-y-3">
          <input
            type="text"
            placeholder="Ваше имя *"
            className="w-full p-3 border rounded-lg"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Телефон *"
            className="w-full p-3 border rounded-lg"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
          />
          <input
            type="text"
            placeholder="Адрес доставки *"
            className="w-full p-3 border rounded-lg"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <textarea
            placeholder="Комментарий к заказу"
            className="w-full p-3 border rounded-lg"
            rows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex gap-3">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="cash"
                checked={payment === "cash"}
                onChange={() => setPayment("cash")}
              />
              Наличные
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="card"
                checked={payment === "card"}
                onChange={() => setPayment("card")}
              />
              Карта
            </label>
          </div>
        </div>

        <button
          onClick={handleOrder}
          disabled={loading}
          className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
        >
          {loading ? "Оформление..." : "✅ Оформить заказ"}
        </button>
      </div>
    </div>
  );
}