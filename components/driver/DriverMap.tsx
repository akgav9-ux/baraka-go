"use client";

import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

type Props = {
  from: [number, number];
  to: [number, number];
  current?: [number, number];
};

const icon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854894.png",
  iconSize: [25, 25],
});

export default function DriverMap({ from, to, current }: Props) {
  const route = [from, to];

  return (
    <MapContainer
      center={from}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* маршрут линия */}
      <Polyline positions={route} color="blue" />

      {/* старт */}
      <Marker position={from} />

      {/* финиш */}
      <Marker position={to} />

      {/* 🚗 live позиция */}
      {current && (
        <Marker position={current} icon={icon} />
      )}
    </MapContainer>
  );
}