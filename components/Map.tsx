"use client";

import { useState, useEffect, useRef } from "react";

interface MapProps {
  onLocationSelect?: (lat: number, lng: number, address: string) => void;
  fromCoords?: {lat: number, lng: number} | null;
  toCoords?: {lat: number, lng: number} | null;
}

export default function Map({ onLocationSelect, from, to }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [pointA, setPointA] = useState<any>(null);
  const [pointB, setPointB] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<any>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

  // Инициализация карты
  useEffect(() => {
    const checkYandexMaps = () => {
      if (typeof window !== "undefined" && (window as any).ymaps) {
        (window as any).ymaps.ready(() => {
          initMap();
        });
      } else {
        setTimeout(checkYandexMaps, 500);
      }
    };
    checkYandexMaps();
  }, []);

  const initMap = () => {
    if (!mapRef.current) return;
    
    const ymaps = (window as any).ymaps;
    
    const newMap = new ymaps.Map(mapRef.current, {
      center: [41.3111, 69.2797],
      zoom: 13,
      controls: ["zoomControl"],
    });
    
    // Обработчик клика по карте
    newMap.events.add("click", async (e: any) => {
      const coords = e.get("coords");
      const lat = coords[0];
      const lng = coords[1];
      
      try {
        const apiKey = "9b4396dd-d203-4394-afba-2e826a3dbc29";
        const res = await fetch(
          `https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&format=json&geocode=${lng},${lat}`
        );
        const data = await res.json();
        const geoObject = data.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject;
        const address = geoObject?.name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        
        if (!pointA) {
          setPointA({ lat, lng });
          onLocationSelect?.(lat, lng, address);
          const placemark = new ymaps.Placemark([lat, lng], {
            balloonContent: "Точка A",
          }, {
            preset: "islands#greenDotIcon",
          });
          newMap.geoObjects.add(placemark);
          newMap.setCenter([lat, lng], 15); // 🔥 ПРИБЛИЖАЕМ К ТОЧКЕ
        } else if (!pointB) {
          setPointB({ lat, lng });
          onLocationSelect?.(lat, lng, address);
          const placemark = new ymaps.Placemark([lat, lng], {
            balloonContent: "Точка B",
          }, {
            preset: "islands#redDotIcon",
          });
          newMap.geoObjects.add(placemark);
          
          const multiRoute = new ymaps.multiRouter.MultiRoute({
            referencePoints: [
              [pointA.lat, pointA.lng],
              [lat, lng]
            ],
            params: {
              routingMode: "auto"
            }
          }, {
            boundsAutoApply: true,
            wayPointVisible: false,
          });
          newMap.geoObjects.add(multiRoute);
        } else {
          setPointA({ lat, lng });
          setPointB(null);
          newMap.geoObjects.removeAll();
          onLocationSelect?.(lat, lng, address);
          const placemark = new ymaps.Placemark([lat, lng], {
            balloonContent: "Точка A",
          }, {
            preset: "islands#greenDotIcon",
          });
          newMap.geoObjects.add(placemark);
          newMap.setCenter([lat, lng], 15);
        }
      } catch (error) {
        console.error("Ошибка:", error);
      }
    });
    
    setMap(newMap);
    setIsMapReady(true);
  };

  // 🔥 ГЕОЛОКАЦИЯ С ПРИБЛИЖЕНИЕМ
  const locateUser = () => {
    setIsLocating(true);
    
    if (!navigator.geolocation) {
      alert("Ваш браузер не поддерживает геолокацию");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const loc = { lat: latitude, lng: longitude };
        
        setUserLocation(loc);
        setPointA(loc);
        
        try {
          const apiKey = "9b4396dd-d203-4394-afba-2e826a3dbc29";
          const res = await fetch(
            `https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&format=json&geocode=${longitude},${latitude}`
          );
          const data = await res.json();
          const geoObject = data.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject;
          const address = geoObject?.name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          onLocationSelect?.(latitude, longitude, address);
        } catch (error) {
          console.error(error);
        }
        
        // 🔥 ДВИГАЕМ КАРТУ К ПОЛЬЗОВАТЕЛЮ
        if (map) {
          const ymaps = (window as any).ymaps;
          map.geoObjects.removeAll();
          const placemark = new ymaps.Placemark([latitude, longitude], {
            balloonContent: "Вы здесь",
          }, {
            preset: "islands#blueDotIcon",
          });
          map.geoObjects.add(placemark);
          map.setCenter([latitude, longitude], 16, { duration: 1000 });
        }
        
        setIsLocating(false);
        alert("📍 Ваше местоположение определено!");
      },
      (error) => {
        console.error("Ошибка геолокации:", error);
        alert("❌ Не удалось определить местоположение.");
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // 🔥 КНОПКА СБРОСА
  const resetMap = () => {
    if (map) {
      map.geoObjects.removeAll();
      map.setCenter([41.3111, 69.2797], 13);
    }
    setPointA(null);
    setPointB(null);
    setUserLocation(null);
  };

  return (
    <div className="relative h-full w-full">
      
      {/* Кнопка геолокации */}
      <button
        onClick={locateUser}
        disabled={isLocating}
        className="absolute bottom-4 right-3 z-[1000] bg-white rounded-full shadow-lg w-11 h-11 flex items-center justify-center hover:bg-gray-50 transition disabled:opacity-50 border border-gray-200 hover:border-blue-500 hover:shadow-xl"
        title="Определить мое местоположение"
      >
        {isLocating ? (
          <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="22" 
            height="22" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#2196F3" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="hover:scale-110 transition-transform"
          >
            <circle cx="12" cy="12" r="3" fill="#2196F3" stroke="#2196F3"/>
            <circle cx="12" cy="12" r="8" stroke="#2196F3" strokeDasharray="2 4"/>
            <line x1="12" y1="2" x2="12" y2="6"/>
            <line x1="12" y1="18" x2="12" y2="22"/>
            <line x1="2" y1="12" x2="6" y2="12"/>
            <line x1="18" y1="12" x2="22" y2="12"/>
          </svg>
        )}
      </button>

      {/* Кнопка сброса */}
      <button
        onClick={resetMap}
        className="absolute bottom-16 right-3 z-[1000] bg-white rounded-full shadow-lg w-11 h-11 flex items-center justify-center hover:bg-gray-50 transition border border-gray-200 hover:border-red-500"
        title="Сбросить карту"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9m0 0v6m0-6h-6"/>
        </svg>
      </button>

      {/* Контейнер карты */}
      <div 
        ref={mapRef} 
        className="h-full w-full"
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
}