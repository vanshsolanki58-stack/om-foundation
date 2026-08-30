import React from 'react';
import { Heart, Target, Sparkles } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <Heart className="w-3.5 h-3.5" />
          Our Spiritual Identity & Purpose
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Awakening Inner Power, Uplifting Spirits.
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Om Foundation is dedicated first and foremost to spiritual awakening, inner growth, and self-sufficiency through dhyan sadhna guided by Guruji and Guruma. From this deep foundation of inner peace and divine awareness arises our selfless food seva—a sacred, compassionate expression of our larger spiritual mission.
        </p>
      </div>

      {/* Vision & Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Primary Card - Spiritual Mission (Dominant Heart of Foundation) */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Our Spiritual Mission (Dhyan Sadhna & Shibirs)</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            At the heart of Om Foundation is the spiritual path of dhyan sadhna, inner self-realization, and holistic self-sufficiency. Under the enlightened guidance of Guruji and Guruma, we host regular Sunday shibirs open to all seekers for meditation and inner awakening, alongside transformative female-only shibirs led by Guruma to nurture spiritual strength, peace, and sacred harmony.
          </p>
        </div>

        {/* Secondary Card - Seva & Humanitarian Outreach */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Our Seva Expression (Nourishing Humanity)</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            As a natural extension of our spiritual sadhna, we practice selfless seva (तेजोमय) to serve our community. Through weekly Friday evening meals and Sunday morning breakfast drives, our volunteers distribute freshly prepared, wholesome nutrition to the elderly, children, and families in need with transparency and dignity.
          </p>
        </div>
      </div>

      {/* Core Pillars */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 max-w-5xl mx-auto">
        <h3 className="text-2xl font-bold mb-8 text-center">Core Pillars of Om Foundation</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {/* Pillar 1 - Spiritual (Dhyan Sadhna & Teachings) */}
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 mx-auto flex items-center justify-center font-bold">
              1
            </div>
            <h4 className="font-bold text-base">Dhyan Sadhna & Inner Power</h4>
            <p className="text-xs text-slate-400">Deepening meditation, chakra awareness, and inner stillness through Guruji and Guruma's sacred guidance.</p>
          </div>

          {/* Pillar 2 - Spiritual (Self-Sufficiency & Women's Shibirs) */}
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 mx-auto flex items-center justify-center font-bold">
              2
            </div>
            <h4 className="font-bold text-base">Self-Sufficiency & Shibirs</h4>
            <p className="text-xs text-slate-400">Empowering seekers and women through regular retreats, spiritual bonding, and practical life wisdom.</p>
          </div>

          {/* Pillar 3 - Seva & Nutrition (Secondary Expression) */}
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 mx-auto flex items-center justify-center font-bold">
              3
            </div>
            <h4 className="font-bold text-base">Selfless Seva & Nutrition</h4>
            <p className="text-xs text-slate-400">Channeling inner light into action through photo-verified, hygienic food distribution drives across Bhuj.</p>
          </div>
        </div>
      </div>
      {/* 🕉️ Sacred Shloka Inspiration */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-50 via-orange-50/80 to-amber-50 border border-amber-200/80 p-6 sm:p-8 max-w-5xl mx-auto text-center space-y-2 shadow-xs">
        <span className="text-xs font-bold text-amber-800 uppercase tracking-widest block">
          तैत्तिरीयोपनिषद् • Sacred Vedic Wisdom
        </span>
        <p className="text-base sm:text-lg font-serif font-extrabold text-slate-900">
          “अन्नं न निन्द्यात्। तद् व्रतम्। अन्नं बहु कुर्वीत। तद् व्रतम्।”
        </p>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          <em>“Let food never be disrespected; let that be our sacred vow. Let food be shared in abundance with all living beings; let that be our highest dharma.”</em>
        </p>
      </div>
    </div>
  );
};
