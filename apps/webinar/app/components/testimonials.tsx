"use client";

import { useState } from "react";
import { TESTIMONIALS } from "../content";

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < count ? "text-yellow-400" : "text-gray-200"}>
          ★
        </span>
      ))}
    </div>
  );
}

export function Testimonials() {
  const [active, setActive] = useState(0);

  return (
    <section id="testimonials" className="py-24 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-green-100 text-green-700 text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            SUCCESS STORIES
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
            Real People, Real Results
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Over 2,000 students have attended our webinar. Here&apos;s what they say.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {TESTIMONIALS.map((t, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`text-left rounded-2xl p-6 border-2 transition-all duration-300 cursor-pointer ${
                active === i
                  ? "border-green-500 bg-white shadow-xl shadow-green-100"
                  : "border-gray-100 bg-white hover:border-green-200 hover:shadow-md"
              }`}
            >
              {/* Avatar + name */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.location} · {t.crop}</p>
                </div>
              </div>

              <Stars count={t.rating} />

              <p className="mt-3 text-gray-600 text-sm leading-relaxed line-clamp-4">
                &ldquo;{t.text}&rdquo;
              </p>

              {active === i && (
                <div className="mt-4 pt-3 border-t border-green-100">
                  <span className="text-green-600 text-xs font-semibold">✓ Verified Attendee</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                active === i ? "bg-green-500 w-6" : "bg-gray-300 w-2"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
