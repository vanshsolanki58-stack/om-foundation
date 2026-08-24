import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export function FaqPage() {
  const faqs = [
    {
      q: "Where is Om Foundation located?",
      a: "Our primary center is located at SHRI STUTI, Plot No - 351/4, Hillview Residency, MES Road, Madhapar, Bhuj, Gujarat, India.",
    },
    {
      q: "How does the AI meal verification work?",
      a: "Every photograph taken during our food distribution drives is processed by Gemini AI to authenticate that food was genuinely handed over and count individual recipients without duplicate entries.",
    },
    {
      q: "How can I volunteer for Friday or Sunday meal drives?",
      a: "Simply head over to our Volunteer Sign-Up page, select your preferred roles (e.g., cooking, packaging, or serving), pick your available days, and you will immediately receive your volunteer pass and drive alerts.",
    },
    {
      q: "Are donations eligible for tax exemption?",
      a: "Yes, Om Foundation is a registered non-profit organization, and contributions are eligible for tax deductions under applicable non-profit regulations.",
    },
    {
      q: "Can I sponsor meals for a birthday, anniversary, or memorial?",
      a: "Yes! We organize special dedicated meal drives on your requested date with custom prayer dedications and full photo documentation.",
    },
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="py-12 px-4 sm:px-6 max-w-3xl mx-auto space-y-10">
      <div className="text-center space-y-3">
        <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase tracking-wider">
          Got Questions?
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Frequently Asked Questions</h1>
        <p className="text-sm text-slate-600">Everything you need to know about our seva, volunteering, and drives.</p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, i) => {
          const isOpen = openIdx === i;
          return (
            <div
              key={i}
              className="bg-white rounded-2xl border border-amber-100/80 overflow-hidden shadow-xs transition"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:bg-amber-50/30 transition"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-amber-700 transition-transform duration-200 shrink-0 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-50">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
