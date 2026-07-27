"use client";

import { useState, useEffect } from "react";

interface Props {
  dateISO: string;
  format?: "full" | "chip" | "short";
}

export function LocalizedTime({ dateISO, format = "full" }: Props) {
  const [formatted, setFormatted] = useState<string | null>(null);

  useEffect(() => {
    try {
      const date = new Date(dateISO);
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      if (format === "chip") {
        const timeStr = new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          timeZoneName: "short",
          timeZone: userTimeZone,
        }).format(date);
        setFormatted(timeStr);
      } else if (format === "short") {
        const timeStr = new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          minute: "2-digit",
          timeZoneName: "short",
          timeZone: userTimeZone,
        }).format(date);
        setFormatted(timeStr);
      } else {
        const timeStr = new Intl.DateTimeFormat("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          timeZoneName: "short",
          timeZone: userTimeZone,
        }).format(date);
        setFormatted(timeStr);
      }
    } catch {
      // Fallback
    }
  }, [dateISO, format]);

  // Initial SSR / Hydration fallback in IST (+05:30)
  if (!formatted) {
    const date = new Date(dateISO);
    if (format === "chip") {
      const timeStr = new Intl.DateTimeFormat("en-IN", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZone: "Asia/Kolkata",
      }).format(date);
      return <span>{timeStr} IST</span>;
    }

    if (format === "short") {
      const timeStr = new Intl.DateTimeFormat("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        timeZone: "Asia/Kolkata",
      }).format(date);
      return <span>{timeStr} IST</span>;
    }

    const timeStr = new Intl.DateTimeFormat("en-IN", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
    }).format(date);
    return <span>{timeStr} IST</span>;
  }

  return <span>{formatted}</span>;
}
