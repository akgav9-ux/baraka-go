"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useRef, useEffect } from "react";
import L from "leaflet";

// fix icons
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Компонент для приближения и постановки метки
function FlyTo({ position, setMarker }: { position: any; setMarker: any }) {
  const map = useMapEvents({});
  
  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], 16, {
        duration: 1.5,
      });
      // Ставим метку
      setMarker({
        lat: position.lat,
        lng: position.lng
      });
    }
  }, [position, map, setMarker]);

  return null;
}

export default function TaxiMap() {
  const [pointA, setPointA] = useState<any>(null);
  const [searchAddress, setSearchAddress] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [mapKey, setMapKey] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // ПОИСК АДРЕСА
  const handleSearch = async () => {
    const address = searchAddress.trim();
    if (!address) {
      alert("Iltimos, manzilni kiriting");
      return;
    }

    setIsSearching(true);
    try {
      // Пытаемся найти адрес
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}&accept-language=uz&limit=1`
      );
      const data = await res.json();

      console.log("Ответ сервера:", data);

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        const displayName = data[0].display_name;
        
        setSearchResult({ lat, lng });
        setMapKey(prev => prev + 1);
        alert(`✅ Manzil topildi: ${displayName}`);
      } else {
        // Если адрес не найден — попробуем поставить метку на центр Ташкента (чтобы не падало)
        alert(`❌ Manzil topilmadi. Карта показана в центре Ташкента.`);
        setSearchResult({ lat: 41.3111, lng: 69.2797 });
        setMapKey(prev => prev + 1);
      }
    } catch (error) {
      console.error("Xatolik:", error);
      alert("❌ Xatolik yuz berdi. Kartani markazga o'tkazamiz.");
      setSearchResult({ lat: 41.3111, lng: 69.2797 });
      setMapKey(prev => prev + 1);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="relative h-full w-full">
      
      {/* ПОЛЕ ПОИСКА */}
      <div className="absolute top-3 left-3 z-[1000] bg-white rounded-xl shadow-lg p-2 flex gap-2">
        <input
          ref={inputRef}
          type="text"
          placeholder="🔍 Manzilni kiriting..."
          value={searchAddress}
          onChange={(e) => setSearchAddress(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSearch();
            }
          }}
          className="w-72 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-sm"
          autoFocus
        />
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {isSearching ? "⏳" : "🔍"}
        </button>
      </div>

      {/* КАРТА */}
      <MapContainer
        key={mapKey}
        center={[41.3111, 69.2797]}
        zoom={13}
        className="h-full w-full"
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {searchResult && <FlyTo position={searchResult} setMarker={setPointA} />}

        {pointA && <Marker position={pointA} />}

      </MapContainer>

      {/* КНОПКА СБРОСА */}
      <div className="absolute bottom-3 right-3 z-[1000] flex flex-col gap-2">
        <button
          onClick={() => {
            setPointA(null);
            setSearchResult(null);
            setSearchAddress("");
            setMapKey(prev => prev + 1);
            inputRef.current?.focus();
          }}
          className="bg-white px-4 py-2 rounded-xl shadow text-sm font-medium hover:bg-gray-50"
        >
          🔄 Сбросить
        </button>
      </div>
    </div>
  );
}