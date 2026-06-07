"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapView() {
  return (
    <div className="w-full h-64 rounded-2xl overflow-hidden shadow">
      <MapContainer
        center={[42.5048, 27.4698]}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[42.5048, 27.4698]} />
      </MapContainer>
    </div>
  );
}