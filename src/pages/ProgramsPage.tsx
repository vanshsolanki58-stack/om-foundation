import React from "react";
import { Link } from "react-router-dom";
import { Utensils, Heart, Sparkles, Sun, Users, Calendar, ArrowRight, MessageCircle } from "lucide-react";

export function ProgramsPage() {
  const programs = [
    {
      title: "Friday Meal (Women-led)",
      subtitle: "Nourishment with Maternal Care",
      desc: "Every Friday evening, dedicated women volunteers gather to prepare, pack, and distribute wholesome, hot meals to vulnerable families, elderly citizens, and children in Bhuj.",
      schedule: "Friday, 6:00 PM Evening",
      icon: "🍲",
      badgeType: "regular",
    },
    {
      title: "Sunday Milk & Biscuit Breakfast",
      subtitle: "Morning Hunger Relief",
      desc: "Fresh, warm milk and nutritious biscuit breakfast distribution for children, daily-wage workers, and shelter residents across our morning distribution routes.",
      schedule: "Sunday, 8:30 AM Morning",
      icon: "🥛",
      badgeType: "regular",
    },
    {
      title: "Sunday Shibir, Bhuj",
      subtitle: "Spiritual Sadhana & Community Gathering",
      desc: "A spiritual sanctuary for collective chanting, meditation, discourse on inner peace, and community seva at our Madhapar center in Bhuj.",
      schedule: "Will be told via WhatsApp group",
      icon: "☀️",
      badgeType: "whatsapp",
    },
    {
      title: "Female Only Shibir",
      subtitle: "Empowerment & Women's Spiritual Retreat",
      desc: "A dedicated sanctuary session exclusively for women to practice meditation, devotional chanting, spiritual bonding, and holistic wellness in a supportive, sacred space.",
      schedule: "Dates will be given in WhatsApp group",
      icon: "🌸",
      badgeType: "whatsapp",
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 max-w-6xl mx-auto space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase tracking-wider">
          Our Initiatives
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Seva & Sadhana Programs</h1>
        <p className="text-sm text-slate-600">
          Discover how Om Foundation serves the physical and spiritual well-being of our community in Madhapar, Bhuj.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {programs.map((p, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl border border-amber-100/90 p-6 sm:p-8 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-3xl">{p.icon}</span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                  p.badgeType === "whatsapp"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-amber-50 text-amber-800 border border-amber-200"
                }`}>
                  {p.badgeType === "whatsapp" ? (
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  )}
                  {p.schedule}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">{p.title}</h3>
              <p className="text-xs text-amber-700 font-semibold mb-3">{p.subtitle}</p>
              <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Link
                to="/volunteer"
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
              >
                Volunteer For This Program <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/donate"
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                Sponsor Seva
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
