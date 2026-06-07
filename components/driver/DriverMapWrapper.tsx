"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("./DriverMap"), {
  ssr: false,
});

type Props = {
  from: [number, number];
  to: [number, number];
  live?: boolean;
};

export default function DriverMapWrapper({ from, to, live }: Props) {
  const [position, setPosition] = useState(from);

  useEffect(() => {
    if (!live) return;

    let step = 0;
    const steps = 100;

    const interval = setInterval(() => {
      step++;

      const lat = from[0] + (to[0] - from[0]) * (step / steps);
      const lng = from[1] + (to[1] - from[1]) * (step / steps);

      setPosition([lat, lng]);

      if (step >= steps) {
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [live, from, to]);

  return (
    <Map
      from={from}
      to={to}
      current={position}
    />
  );
}