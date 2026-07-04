const handleOrder = async () => {
  if (!from || !to) {
    alert("Iltimos, jo'natish va qabul qilish manzillarini to'ldiring");
    return;
  }

  if (!price || Number(price) <= 0) {
    alert("Iltimos, to'g'ri narxni kiriting");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to,
        price: Number(price),
        packageType: "taxi",
        payment: payment,
        comment: comment,
        passengers: passengers4 ? 4 : 1,
        childSeat0_3,
        childSeat3_6,
        booster6_12,
        stop: stop || null,
      }),
    });

    if (!res.ok) throw new Error("Ошибка");

    const order = await res.json();
    alert(`✅ Buyurtma qabul qilindi! №${order.id}\n\n📍 ${from} → ${to}\n💰 ${price} so'm`);
    router.push("/");
  } catch (error) {
    console.error(error);
    alert("❌ Xatolik yuz berdi");
  } finally {
    setLoading(false);
  }
};