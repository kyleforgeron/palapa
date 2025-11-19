"use client";

import { useEffect, useState } from "react";

export const CurrentTime: React.FC = () => {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // Set initial time on mount to avoid SSR/client mismatch
    setNow(new Date());

    const id = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(id);
  }, []);

  if (!now) return null;

  const formatted = now.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    // hour12: false, // uncomment if you want 24-hour time
  });

  return <span className="text-3xl font-semibold my-4">{formatted}</span>;
};
