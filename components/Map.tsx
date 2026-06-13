"use client";

import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";
import L from "leaflet";

// fix icons
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function ClickHandler({
  setA,
  setB,
}: {
  setA: any;
  setB: any;
}) {
  useMapEvents({
    click(e) {
      const latlng = e.latlng;

      setA((prev: any) => {
        if (!prev) return latlng;

        setB((b: any) => {
          if (!b) return latlng;

          // если уже есть A и B → перезапуск
          setA(latlng);
          setB(null);
          return null;
        });

        return prev;
      });
    },
  });

  return null;
}

// Добавьте пропсы для from и to
interface MapProps {
  from?: string;
  to?: string;
  driverPosition?: any;
}

export default function Map({ from, to, driverPosition }: MapProps) {
  const [pointA, setPointA] = useState<any>(null);
  const [pointB, setPointB] = useState<any>(null);

  const route = pointA && pointB ? [pointA, pointB] : [];

  // Геокодирование адресов (если переданы from и to)
  useEffect(() => {
    async function geocodeAddress(address: string) {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
        const data = await res.json();
        if (data && data[0]) {
          return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        }
      } catch (error) {
        console.error("Geocoding error:", error);
      }
      return null;
    }

    if (from && to) {
      Promise.all([geocodeAddress(from), geocodeAddress(to)]).then(([a, b]) => {
        if (a) setPointA(a);
        if (b) setPointB(b);
      });
    }
  }, [from, to]);

  return (
    <div className="relative h-full w-full" style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={[41.3, 69.2]}
        zoom={12}
        className="h-full w-full"
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <ClickHandler setA={setPointA} setB={setPointB} />

        {pointA && <Marker position={pointA} />}
        {pointB && <Marker position={pointB} />}

        {/* Маркер курьера */}
        {driverPosition && (
          <Marker 
            position={[driverPosition.lat, driverPosition.lng]} 
            icon={L.divIcon({ 
              className: "custom-div-icon",
              html: "🚗",
              iconSize: [30, 30],
              popupAnchor: [0, 0]
            })}
          />
        )}

        {route.length === 2 && (
          <Polyline positions={route} color="blue" />
        )}
      </MapContainer>

      {/* RESET BUTTON */}
      <button
        onClick={() => {
          setPointA(null);
          setPointB(null);
        }}
        className="absolute top-3 right-3 bg-white px-3 py-2 rounded-xl shadow z-[1000]"
      >
        🔄 Reset
      </button>
    </div>
  );
}