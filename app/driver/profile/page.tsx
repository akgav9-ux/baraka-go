"use client";

export default function DriverProfilePage() {
  return (
    <main className="min-h-screen bg-gray-100 p-4">

      <h1 className="text-2xl font-bold mb-4">
        👤 Profil
      </h1>

      {/* Профиль */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">

        <div className="flex flex-col items-center">

          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-4xl">
            👤
          </div>

          <h2 className="mt-3 text-xl font-bold">
            Haydovchi
          </h2>

          <p className="text-gray-500">
            +998 90 123 45 67
          </p>

          <div className="mt-2 text-yellow-500 font-semibold">
            ⭐ 4.9
          </div>

        </div>

      </div>

      {/* Автомобиль */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mt-4">

        <h3 className="font-bold mb-3">
          🚕 Avtomobil
        </h3>

        <div className="space-y-2">

          <p>
            <strong>Model:</strong> Chevrolet Cobalt
          </p>

          <p>
            <strong>Rang:</strong> Oq
          </p>

          <p>
            <strong>Raqam:</strong> 01 A 777 AA
          </p>

        </div>

      </div>

      {/* Документы */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mt-4">

        <h3 className="font-bold mb-3">
          📄 Hujjatlar
        </h3>

        <div className="space-y-3">

          <div className="flex justify-between">
            <span>Haydovchilik guvohnomasi</span>
            <span className="text-green-600">✓</span>
          </div>

          <div className="flex justify-between">
            <span>Tex pasport</span>
            <span className="text-green-600">✓</span>
          </div>

          <div className="flex justify-between">
            <span>Sug‘urta</span>
            <span className="text-green-600">✓</span>
          </div>

        </div>

      </div>

    </main>
  );
}