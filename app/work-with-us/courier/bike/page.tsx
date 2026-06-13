export default function BikeCourier() {
  return (
    <main className="p-4 min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto bg-white p-5 rounded-3xl shadow">

        <h1 className="text-xl font-bold mb-4">
          🛵 Skuter / Velosiped kuryer
        </h1>

        <input className="w-full p-3 border rounded-xl mb-3" placeholder="Ism" />
        <input className="w-full p-3 border rounded-xl mb-3" placeholder="Telefon" />

        <input className="w-full p-3 border rounded-xl mb-3" placeholder="Pasport" />
        <input className="w-full p-3 border rounded-xl mb-5" placeholder="Manzil" />

        <button className="w-full bg-green-700 text-white py-3 rounded-xl">
          Ariza yuborish
        </button>

      </div>
    </main>
  );
}