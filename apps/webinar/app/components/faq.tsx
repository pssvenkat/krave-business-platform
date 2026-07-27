"use client";

import { useState } from "react";
import { FAQ } from "../content";

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-green-100 text-green-700 text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500 text-lg">
            Still on the fence? Here are answers to the most common questions.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <div
              key={i}
              className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                open === i
                  ? "border-green-300 shadow-sm"
                  : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <span
                  className={`font-semibold text-base pr-4 ${
                    open === i ? "text-green-700" : "text-gray-800"
                  }`}
                >
                  {item.question}
                </span>
                <span
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                    open === i
                      ? "bg-green-500 text-white rotate-45"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  +
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  open === i ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="px-6 pb-5 text-gray-500 text-sm leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
