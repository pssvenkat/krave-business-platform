"use client";

import { useState, useEffect } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(targetISO: string): TimeLeft {
  const diff = new Date(targetISO).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function Digit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="bg-white border border-[#d0e6d6] rounded-2xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shadow-md">
          <span className="text-2xl sm:text-3xl font-black text-[#143623] tabular-nums">
            {String(value).padStart(2, "0")}
          </span>
        </div>
      </div>
      <span className="text-[#4a6b57] text-xs mt-2 font-bold uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

export function Countdown({ targetISO }: { targetISO: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calcTimeLeft(targetISO));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(calcTimeLeft(targetISO));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetISO]);

  const isExpired =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  if (!mounted) {
    return <div className="h-24 opacity-0" />;
  }

  if (isExpired) {
    return (
      <div className="flex items-center gap-2 justify-center">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
        </span>
        <span className="text-red-600 font-bold text-lg">Registration Closed</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-[#1e5631] text-xs font-bold tracking-widest uppercase bg-white/80 px-3 py-1 rounded-full border border-[#e2efe6]">
        Webinar Starts In
      </p>
      <div className="flex items-start gap-3 sm:gap-4">
        <Digit value={timeLeft.days} label="Days" />
        <span className="text-[#1e5631] text-2xl font-black mt-4">:</span>
        <Digit value={timeLeft.hours} label="Hours" />
        <span className="text-[#1e5631] text-2xl font-black mt-4">:</span>
        <Digit value={timeLeft.minutes} label="Mins" />
        <span className="text-[#1e5631] text-2xl font-black mt-4">:</span>
        <Digit value={timeLeft.seconds} label="Secs" />
      </div>
    </div>
  );
}
