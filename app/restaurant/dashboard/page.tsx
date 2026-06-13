"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
}

interface FoodOrder {
  id: number;
  orderNumber: string;
  clientName: string;
  clientPhone: string;
  address: string;
  items: string;
  totalPrice: number;
  deliveryFee: number;
  finalPrice: number;
  status: string;
  createdAt: string;
}

export default function RestaurantDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [orders, setOrders] = useState<FoodOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [showDishModal, setShowDishModal] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [dishForm, setDishForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "Горячее",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const dishCategories = ["Горячее", "Салаты", "Закуски", "Супы", "Пицца", "Бургеры", "Роллы", "Напитки", "Десерты"];

  const [stats, setStats] = useState({
    today: 0,
    month: 0,
    year: 0,
    total: 0,
  });

  useEffect(() => {
    function handleClickOutside(e: any) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("restaurantUser");
    if (!storedUser) {
      router.push("/restaurant/login");
      return;
    }
    setUser(JSON.parse(storedUser));
    loadDishes();
    loadOrders();
  }, []);

  const loadDishes = async () => {
    try {
      const storedUser = localStorage.getItem("restaurantUser");
      if (!storedUser) return;
      const userData = JSON.parse(storedUser);
      
      const res = await fetch(`/api/dishes?restaurantId=${userData.id}`);
      const data = await res.json();
      setDishes(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadOrders = async () => {
    try {
      const storedUser = localStorage.getItem("restaurantUser");
      if (!storedUser) return;
      const userData = JSON.parse(storedUser);
      
      const res = await fetch(`/api/food-orders?restaurantId=${userData.id}`);
      const data = await res.json();
      setOrders(data);
      calculateStats(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ordersList: FoodOrder[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisYear = new Date(now.getFullYear(), 0, 1);

    let todayTotal = 0, monthTotal = 0, yearTotal = 0, allTotal = 0;

    ordersList.forEach(order => {
      const orderDate = new Date(order.createdAt);
      if (order.status === "delivered") {
        allTotal += order.finalPrice;
        if (orderDate >= today) todayTotal += order.finalPrice;
        if (orderDate >= thisMonth) monthTotal += order.finalPrice;
        if (orderDate >= thisYear) yearTotal += order.finalPrice;
      }
    });

    setStats({ today: todayTotal, month: monthTotal, year: yearTotal, total: allTotal });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addDish = async () => {
    if (!dishForm.name || !dishForm.price) {
      alert("Taom nomi va narxini kiriting!");
      return;
    }

    try {
      const storedUser = localStorage.getItem("restaurantUser");
      const userData = JSON.parse(storedUser!);
      
      const formData = new FormData();
      formData.append("name", dishForm.name);
      formData.append("description", dishForm.description);
      formData.append("price", dishForm.price);
      formData.append("category", dishForm.category);
      formData.append("restaurantId", userData.id);
      if (selectedFile) {
        formData.append("image", selectedFile);
      }
      
      const res = await fetch("/api/dishes", {
        method: "POST",
        body: formData,
      });
      
      if (res.ok) {
        alert(editingDish ? "✅ Taom yangilandi!" : "✅ Taom qo'shildi!");
        setShowDishModal(false);
        setEditingDish(null);
        setSelectedFile(null);
        setImagePreview("");
        setDishForm({ name: "", description: "", price: "", category: "Горячее" });
        loadDishes();
      } else {
        alert("❌ Xatolik");
      }
    } catch (error) {
      alert("❌ Xatolik");
    }
  };

  const updateDish = async () => {
    if (!editingDish) return;
    
    try {
      const formData = new FormData();
      formData.append("id", String(editingDish.id));
      formData.append("name", dishForm.name);
      formData.append("description", dishForm.description);
      formData.append("price", dishForm.price);
      formData.append("category", dishForm.category);
      formData.append("existingImage", editingDish.image);
      if (selectedFile) {
        formData.append("image", selectedFile);
      }
      
      const res = await fetch("/api/dishes", {
        method: "PUT",
        body: formData,
      });
      
      if (res.ok) {
        alert("✅ Taom yangilandi!");
        setShowDishModal(false);
        setEditingDish(null);
        setSelectedFile(null);
        setImagePreview("");
        setDishForm({ name: "", description: "", price: "", category: "Горячее" });
        loadDishes();
      } else {
        alert("❌ Xatolik");
      }
    } catch (error) {
      alert("❌ Xatolik");
    }
  };

  const deleteDish = async (id: number) => {
    if (confirm("Bu taomni o'chirish?")) {
      try {
        await fetch(`/api/dishes?id=${id}`, { method: "DELETE" });
        loadDishes();
      } catch (error) {
        alert("❌ Xatolik");
      }
    }
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      await fetch("/api/food-orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status }),
      });
      loadOrders();
    } catch (error) {
      alert("❌ Xatolik");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">⏳ Yangi</span>;
      case "confirmed": return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">✅ Tasdiqlangan</span>;
      case "cooking": return <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">🍳 Tayyorlanmoqda</span>;
      case "delivering": return <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">🚚 Yetkazilmoqda</span>;
      case "delivered": return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">✅ Yetkazilgan</span>;
      case "cancelled": return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">❌ Bekor</span>;
      default: return <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">{status}</span>;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("restaurantUser");
    router.push("/restaurant/login");
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gray-100 pb-24">
      
      {/* ШАПКА с бургер-меню */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 flex justify-between items-center shadow-lg">
        <div>
          <p className="text-xs opacity-80">🍕 Restoran panel</p>
          <h1 className="text-lg font-bold">{user.restaurantName || user.name}</h1>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl">☰</button>
      </div>

      {/* БУРГЕР МЕНЮ */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <div ref={menuRef} className="absolute top-0 right-0 w-72 h-full bg-white p-4 text-black shadow-xl z-[100] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-xl">🍕 Menyu</h2>
              <button onClick={() => setMenuOpen(false)} className="text-2xl">✕</button>
            </div>
            <div className="p-3 bg-orange-50 rounded-xl mb-4">
              <p className="text-xs text-gray-500">{user.restaurantName}</p>
              <p className="text-sm font-semibold">{user.email}</p>
            </div>
            <button onClick={() => { setActiveTab("orders"); setMenuOpen(false); }} className="w-full text-left p-3 rounded-xl hover:bg-gray-100 transition flex items-center gap-2">
              <span>📋</span> Buyurtmalar
            </button>
            <button onClick={() => { setActiveTab("menu"); setMenuOpen(false); }} className="w-full text-left p-3 rounded-xl hover:bg-gray-100 transition flex items-center gap-2">
              <span>🍽️</span> Mening taomlarim
            </button>
            <button onClick={() => { setActiveTab("stats"); setMenuOpen(false); }} className="w-full text-left p-3 rounded-xl hover:bg-gray-100 transition flex items-center gap-2">
              <span>💰</span> Statistika
            </button>
            <hr className="my-3" />
            <button onClick={handleLogout} className="w-full text-left p-3 rounded-xl text-red-600 hover:bg-red-50 transition flex items-center gap-2">
              <span>🚪</span> Chiqish
            </button>
          </div>
        </div>
      )}

      <div className="p-4">
        
        {/* BUYURTMALAR */}
        {activeTab === "orders" && (
          <>
            <h2 className="text-lg font-bold mb-4">📋 Yangi buyurtmalar</h2>
            <div className="space-y-3">
              {loading ? <div className="text-center py-10">⏳ Yuklanmoqda...</div> : orders.length === 0 ? (
                <div className="bg-white rounded-xl p-10 text-center"><div className="text-5xl mb-3">📭</div><p className="text-gray-500">Hozircha buyurtmalar yo'q</p></div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-xl p-4 shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div><h3 className="font-bold">№{order.orderNumber}</h3><p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</p></div>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="space-y-2 text-sm mb-3">
                      <div className="bg-gray-50 p-2 rounded"><p className="text-xs text-gray-500">👤 Mijoz</p><p className="font-medium">{order.clientName}</p><p className="text-xs">{order.clientPhone}</p></div>
                      <div className="bg-gray-50 p-2 rounded"><p className="text-xs text-gray-500">📍 Manzil</p><p className="text-sm">{order.address}</p></div>
                      <div className="bg-gray-50 p-2 rounded"><p className="text-xs text-gray-500">💰 Summa</p><p className="font-bold text-orange-600">{order.finalPrice.toLocaleString()} so'm</p></div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {order.status === "pending" && (<><button onClick={() => updateOrderStatus(order.id, "confirmed")} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold">✅ Tasdiqlash</button><button onClick={() => updateOrderStatus(order.id, "cancelled")} className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-semibold">❌ Bekor qilish</button></>)}
                      {order.status === "confirmed" && <button onClick={() => updateOrderStatus(order.id, "cooking")} className="flex-1 bg-purple-600 text-white py-2 rounded-lg text-sm font-semibold">🍳 Tayyorlash</button>}
                      {order.status === "cooking" && <button onClick={() => updateOrderStatus(order.id, "delivering")} className="flex-1 bg-orange-600 text-white py-2 rounded-lg text-sm font-semibold">🚚 Yetkazishga topshirish</button>}
                      {order.status === "delivering" && <button onClick={() => updateOrderStatus(order.id, "delivered")} className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-semibold">✅ Yetkazildi</button>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* MENYU */}
        {activeTab === "menu" && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">🍽️ Mening taomlarim</h2>
              <button onClick={() => { setEditingDish(null); setSelectedFile(null); setImagePreview(""); setDishForm({ name: "", description: "", price: "", category: "Горячее" }); setShowDishModal(true); }} className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold">+ Yangi taom</button>
            </div>
            {loading ? <div className="text-center py-10">⏳ Yuklanmoqda...</div> : dishes.length === 0 ? (
              <div className="bg-white rounded-xl p-10 text-center"><div className="text-5xl mb-3">🍽️</div><p className="text-gray-500">Hozircha taomlar yo'q</p><button onClick={() => setShowDishModal(true)} className="mt-3 text-orange-600 font-semibold">+ Birinchi taomni qo'shing</button></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dishes.map((dish) => (
                  <div key={dish.id} className="bg-white rounded-xl shadow overflow-hidden">
                    <div className="flex gap-3 p-3">
                      {dish.image && <img src={dish.image} className="w-20 h-20 rounded-lg object-cover" />}
                      <div className="flex-1">
                        <div className="flex justify-between"><h3 className="font-semibold">{dish.name}</h3><span className="font-bold text-orange-600">{dish.price.toLocaleString()} сум</span></div>
                        <p className="text-xs text-gray-500 mt-1">{dish.description}</p>
                        <p className="text-xs text-gray-400 mt-1">📂 {dish.category}</p>
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => { setEditingDish(dish); setDishForm({ name: dish.name, description: dish.description, price: String(dish.price), category: dish.category }); setSelectedFile(null); setImagePreview(""); setShowDishModal(true); }} className="text-blue-600 text-sm">✏️ Tahrirlash</button>
                          <button onClick={() => deleteDish(dish.id)} className="text-red-500 text-sm">🗑️ O'chirish</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* STATISTIKA */}
        {activeTab === "stats" && (
          <>
            <h2 className="text-lg font-bold mb-4">💰 Daromad statistikasi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4 text-center"><p className="text-sm opacity-80">Bugungi daromad</p><p className="text-2xl font-bold">{stats.today.toLocaleString()} so'm</p></div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 text-center"><p className="text-sm opacity-80">Oy davomida</p><p className="text-2xl font-bold">{stats.month.toLocaleString()} so'm</p></div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-4 text-center"><p className="text-sm opacity-80">Yil davomida</p><p className="text-2xl font-bold">{stats.year.toLocaleString()} so'm</p></div>
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-4 text-center"><p className="text-sm opacity-80">Jami daromad</p><p className="text-2xl font-bold">{stats.total.toLocaleString()} so'm</p></div>
            </div>
          </>
        )}
      </div>

      {/* МОДАЛКА ДОБАВЛЕНИЯ/РЕДАКТИРОВАНИЯ ТАОМА */}
      {showDishModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editingDish ? "✏️ Taomni tahrirlash" : "➕ Yangi taom"}</h2>
              <button onClick={() => setShowDishModal(false)} className="text-2xl">✕</button>
            </div>
            <div className="space-y-3">
              <input placeholder="Taom nomi *" className="w-full p-3 border rounded-xl" value={dishForm.name} onChange={(e) => setDishForm({...dishForm, name: e.target.value})} />
              <textarea placeholder="Taom haqida" className="w-full p-3 border rounded-xl resize-none" rows={2} value={dishForm.description} onChange={(e) => setDishForm({...dishForm, description: e.target.value})} />
              <input type="number" placeholder="Narxi (so'm) *" className="w-full p-3 border rounded-xl" value={dishForm.price} onChange={(e) => setDishForm({...dishForm, price: e.target.value})} />
              <select className="w-full p-3 border rounded-xl" value={dishForm.category} onChange={(e) => setDishForm({...dishForm, category: e.target.value})}>
                {dishCategories.map(cat => <option key={cat}>{cat}</option>)}
              </select>
              
              {/* Загрузка фото */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} className="hidden" />
                {imagePreview || (editingDish?.image) ? (
                  <div>
                    <img src={imagePreview || editingDish?.image} className="w-32 h-32 object-cover rounded-lg mx-auto mb-2" />
                    <button onClick={() => fileInputRef.current?.click()} className="text-blue-600 text-sm">📷 Rasmni o'zgartirish</button>
                  </div>
                ) : (
                  <button onClick={() => fileInputRef.current?.click()} className="text-gray-500">📷 Rasm yuklash</button>
                )}
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={editingDish ? updateDish : addDish} className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold">{editingDish ? "💾 Saqlash" : "➕ Qo'shish"}</button>
              <button onClick={() => setShowDishModal(false)} className="flex-1 bg-gray-300 py-3 rounded-xl font-semibold">Bekor qilish</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}