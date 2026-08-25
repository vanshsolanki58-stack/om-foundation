import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Utensils, Users, Award, ArrowRight, CheckCircle2, Sparkles, Sun, Calendar } from 'lucide-react';
import { galleryService } from '../lib/gallery-store';
import { volunteerService } from '../lib/volunteer-store';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [totalMeals, setTotalMeals] = useState<number>(0);
  const [totalDrives, setTotalDrives] = useState<number>(0);
  const [volunteerCount, setVolunteerCount] = useState<number>(0);

  useEffect(() => {
    const updateStats = () => {
      setTotalMeals(galleryService.getTotalMeals());
      setTotalDrives(galleryService.getDatesWithPhotos().length);
      setVolunteerCount(volunteerService.getVolunteerCount());
    };

    updateStats();
    const unsubGallery = galleryService.subscribe(() => updateStats());
    const unsubVolunteers = volunteerService.subscribe((count) => setVolunteerCount(count));

    return () => {
      unsubGallery();
      unsubVolunteers();
    };
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* 🌟 Clean Centered Hero Section with Radiant Sunburst Rays & "तेज से तेजोमय" Watermark */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/90 via-orange-50/40 to-slate-50 pt-16 pb-20 sm:pb-28 border-b border-amber-200/70">
        {/* ☀️ Radiant Sunburst Rays Emitter */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none overflow-hidden flex items-center justify-center w-[900px] h-[900px] sm:w-[1300px] sm:h-[1300px] z-0"
          aria-hidden="true"
        >
          {/* Rotating Sun Rays SVG */}
          <svg
            viewBox="0 0 1000 1000"
            className="w-full h-full animate-spin-very-slow opacity-30"
          >
            <defs>
              <radialGradient id="sunRayGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="40%" stopColor="#fbbf24" stopOpacity="0.4" />
                <stop offset="85%" stopColor="#fef3c7" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* 36 Radiant Sunburst Beams */}
            {Array.from({ length: 36 }).map((_, i) => {
              const angle = i * 10;
              return (
                <polygon
                  key={i}
                  points="500,500 480,0 520,0"
                  transform={`rotate(${angle} 500 500)`}
                  fill="url(#sunRayGrad)"
                />
              );
            })}
          </svg>

          {/* Central Sun Glow Halo */}
          <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-r from-amber-300/40 via-orange-300/30 to-amber-100/10 blur-3xl animate-pulse-subtle" />
        </div>

        {/* 📜 Prominent "तेज से तेजोमय" Spiritual Watermark */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0"
          aria-hidden="true"
        >
          <span className="text-[14vw] sm:text-[11vw] font-serif font-black tracking-widest text-amber-900/10 sm:text-amber-900/12 whitespace-nowrap scale-105 drop-shadow-xs">
            तेज से तेजोमय
          </span>
        </div>

        {/* Hero Foreground Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-6">
          {/* Elegant Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 text-amber-900 text-xs font-bold tracking-wide border border-amber-300/80 shadow-2xs backdrop-blur-xs">
            <span className="font-serif font-bold text-amber-900">तेज से तेजोमय</span>
            <span className="text-amber-400">•</span>
            <span>Om Charitable Trust, Bhuj</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Nourishing Communities. <br />
            <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 bg-clip-text text-transparent">
              Awakening Inner Light.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Om Foundation brings together passionate volunteers and sacred community kitchens in Madhapar, Bhuj to serve warm, wholesome meals with motherly love, dignity, and spiritual grace.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/volunteer"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-amber-200 transition-all flex items-center justify-center gap-2 group text-sm"
            >
              <span>Become a Volunteer</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/gallery"
              className="w-full sm:w-auto px-7 py-4 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-2xl border border-slate-200 shadow-2xs transition flex items-center justify-center gap-2 text-sm"
            >
              <Utensils className="w-4 h-4 text-amber-600" />
              <span>View Meal Calendar</span>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
              <span>Real Photo-Verified Distribution</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
              <span>Friday Meals (6 PM)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
              <span>Sunday Breakfast (8:30 AM)</span>
            </div>
          </div>
        </div>
      </section>

      {/* ✨ Guruji & Guruma Spiritual Mentors Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Guruji Card */}
          <div className="bg-white rounded-3xl border border-amber-100/90 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6">
            {/* Portrait Frame with <img> Tag */}
            <div className="aspect-[4/3] sm:h-80 w-full rounded-2xl bg-gradient-to-b from-[#f7f1e7] to-[#ede3d2] border border-amber-200/50 flex flex-col items-center justify-center relative overflow-hidden group">
              <img
                src="/src/assets/guruji.jpg"
                alt="Guruji - Spiritual Guide & Mentor"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  // If image not added yet, show peaceful icon fallback
                  (e.target as HTMLImageElement).style.display = 'none';
                  const fallback = (e.target as HTMLElement).nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div className="hidden flex-col items-center justify-center w-full h-full absolute inset-0">
                <div className="w-24 h-24 rounded-full bg-amber-200/40 flex items-center justify-center text-amber-700/60 group-hover:scale-105 transition-transform duration-300">
                  <Sun className="w-12 h-12 stroke-[1.5]" />
                </div>
                <span className="text-[11px] font-bold text-amber-800/60 uppercase tracking-widest mt-3">
                  Spiritual Guide & Mentor
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif">
                Guruji
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Spiritual guide and mentor rooted in ancient Vedic wisdom and meditation practices. His serene teachings focus on self-realization, inner chakra alignment, and practical problem-solving through personal spiritual talks.
              </p>
            </div>
          </div>

          {/* Guruma Card */}
          <div className="bg-white rounded-3xl border border-amber-100/90 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6">
            {/* Portrait Frame with <img> Tag */}
            <div className="aspect-[4/3] sm:h-80 w-full rounded-2xl bg-gradient-to-b from-[#f7f1e7] to-[#ede3d2] border border-amber-200/50 flex flex-col items-center justify-center relative overflow-hidden group">
              <img
                src="/src/assets/guruma.jpg"
                alt="Guruma - Motherly Love & Seva"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  // If image not added yet, show peaceful icon fallback
                  (e.target as HTMLImageElement).style.display = 'none';
                  const fallback = (e.target as HTMLElement).nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div className="hidden flex-col items-center justify-center w-full h-full absolute inset-0">
                <div className="w-24 h-24 rounded-full bg-orange-200/40 flex items-center justify-center text-orange-700/60 group-hover:scale-105 transition-transform duration-300">
                  <Sparkles className="w-12 h-12 stroke-[1.5]" />
                </div>
                <span className="text-[11px] font-bold text-orange-800/60 uppercase tracking-widest mt-3">
                  Motherly Love & Seva
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif">
                Guruma
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                A beacon of motherly compassion, unconditional love, and dedicated service. She leads our sacred female-only shibirs and inspires community nourishment, infusing every meal drive and gathering with uplifting devotional energy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 📊 Dedicated Live Impact & Seva Milestones Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-amber-200/70 p-6 sm:p-10 shadow-md space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
                <Sun className="w-3.5 h-3.5 text-amber-600" />
                Real-Time Foundation Impact
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Our Seva Impact & Milestones
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Live statistics dynamically updated and synchronized with every photo-verified food drive.
              </p>
            </div>
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition self-start sm:self-auto shrink-0 border border-amber-200"
            >
              <Calendar className="w-4 h-4 text-amber-600" />
              View Distribution Records
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stat 1 */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50/90 to-amber-100/40 border border-amber-200 flex items-center justify-between shadow-xs hover:border-amber-400 transition">
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-800 block uppercase tracking-wider">
                  Total Meals Served
                </span>
                <span className="text-4xl font-black text-slate-900 block">
                  {totalMeals.toLocaleString()}
                </span>
                <span className="text-[11px] text-slate-500 block">Photo-verified distributions</span>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shrink-0">
                <Utensils className="w-7 h-7" />
              </div>
            </div>

            {/* Stat 2 */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/80 border border-slate-200 flex items-center justify-between shadow-xs hover:border-slate-300 transition">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                  Distribution Drives
                </span>
                <span className="text-4xl font-black text-slate-900 block">
                  {totalDrives}
                </span>
                <span className="text-[11px] text-slate-500 block">Active dates recorded</span>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-slate-800 text-white flex items-center justify-center shadow-md shrink-0">
                <Award className="w-7 h-7" />
              </div>
            </div>

            {/* Stat 3 */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-50/90 to-orange-100/40 border border-orange-200 flex items-center justify-between shadow-xs hover:border-orange-400 transition">
              <div className="space-y-1">
                <span className="text-xs font-bold text-orange-800 block uppercase tracking-wider">
                  Registered Volunteers
                </span>
                <span className="text-4xl font-black text-slate-900 block">
                  {volunteerCount}
                </span>
                <span className="text-[11px] text-slate-500 block">Passionate souls in Bhuj</span>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md shrink-0">
                <Users className="w-7 h-7" />
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 border-t border-slate-100">
            <span>Center Location: <strong>SHRI STUTI, MES Road, Madhapar, Bhuj, Gujarat</strong></span>
            <Link
              to="/volunteer"
              className="text-amber-800 font-bold hover:underline flex items-center gap-1"
            >
              Join our seva family today <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 🌿 Three Pillars of Sadhana & Seva */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-extrabold text-amber-700 font-serif uppercase tracking-widest block mb-1">
            तेज से तेजोमय
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Our Spiritual & Humanitarian Pillars
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            The guiding principles of Om Charitable Trust, connecting inner awakening with outward compassion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-100 shadow-xs hover:border-amber-300 transition">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-4 text-xl">
              🧘
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">1. तेज (Inner Light & Sadhana)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cultivating inner peace, meditation, and spiritual clarity through shibirs and devotional sessions guided by Guruji and Guruma.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-100 shadow-xs hover:border-amber-300 transition">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-800 flex items-center justify-center font-bold mb-4 text-xl">
              🍲
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">2. तेजोमय (Selfless Seva)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Transforming spiritual devotion into real-world action by serving fresh, hot meals to the elderly, laborers, and children in Bhuj.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-100 shadow-xs hover:border-amber-300 transition">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold mb-4 text-xl">
              🤝
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">3. ॐ चैरीटेबल ट्रस्ट (Community)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              A united family of passionate volunteers and donors working together with transparency, photo verification, and motherly love.
            </p>
          </div>
        </div>
      </section>

      {/* Programs Overview */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Our Regular Seva & Programs
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Weekly meal drives and sacred spiritual shibirs held in Madhapar, Bhuj.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Program Card 1 */}
          <Link
            to="/programs"
            className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-100 shadow-xs hover:shadow-lg hover:border-amber-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-4 text-2xl group-hover:scale-110 transition-transform">
                🍲
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-amber-800 transition-colors">
                Friday Meal (Women-led)
              </h3>
              <span className="text-[11px] font-bold text-amber-700 block mb-2">Every Friday, 6:00 PM Evening</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Wholesome dinner prepared and served by our women volunteers to elderly citizens and families in need.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700 group-hover:text-amber-800">
              <span>View Program Details</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </Link>

          {/* Program Card 2 */}
          <Link
            to="/programs"
            className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-100 shadow-xs hover:shadow-lg hover:border-amber-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-800 flex items-center justify-center font-bold mb-4 text-2xl group-hover:scale-110 transition-transform">
                🥛
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-amber-800 transition-colors">
                Sunday Milk & Biscuit Breakfast
              </h3>
              <span className="text-[11px] font-bold text-orange-700 block mb-2">Every Sunday, 8:30 AM Morning</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Warm milk and healthy biscuit breakfast distribution for children, laborers, and shelter residents.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-orange-700 group-hover:text-orange-800">
              <span>View Program Details</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </Link>

          {/* Program Card 3 */}
          <Link
            to="/programs"
            className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-100 shadow-xs hover:shadow-lg hover:border-amber-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold mb-4 text-2xl group-hover:scale-110 transition-transform">
                ☀️
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-teal-800 transition-colors">
                Sunday & Female Only Shibirs
              </h3>
              <span className="text-[11px] font-bold text-teal-700 block mb-2">Dates via WhatsApp Group</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Spiritual chanting, meditation, and inner peace retreats held at our Madhapar center.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700 group-hover:text-teal-800">
              <span>View Program Details</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};
