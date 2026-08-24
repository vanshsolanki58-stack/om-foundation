import React from 'react';
import { Heart, Target, Sparkles, Users, Award, ShieldCheck } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <Heart className="w-3.5 h-3.5" />
          Our Mission & Vision
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Nourishing Bodies, Uplifting Spirits.
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Om Foundation was established with a singular, resolute conviction: food is a fundamental human right, not a privilege.
        </p>
      </div>

      {/* Vision & Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Our Mission</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            To eliminate daily hunger in vulnerable communities by distributing hygienic, freshly cooked, and nutritionally rich meals while maintaining complete digital transparency.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Our Vision</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            A resilient community where every child, worker, and senior citizen has access to warm nutrition and where every citizen is empowered to volunteer and give back.
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 max-w-5xl mx-auto">
        <h3 className="text-2xl font-bold mb-8 text-center">Core Pillars of Om Foundation</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 mx-auto flex items-center justify-center font-bold">
              1
            </div>
            <h4 className="font-bold text-base">Hygienic Nutrition</h4>
            <p className="text-xs text-slate-400">Strict hygiene protocols in food preparation and contactless serving.</p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 mx-auto flex items-center justify-center font-bold">
              2
            </div>
            <h4 className="font-bold text-base">Uncompromising Integrity</h4>
            <p className="text-xs text-slate-400">AI-verified photography and cloud audit logs for every meal served.</p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 mx-auto flex items-center justify-center font-bold">
              3
            </div>
            <h4 className="font-bold text-base">Community Inclusivity</h4>
            <p className="text-xs text-slate-400">Empowering local youth and volunteers to lead on-ground drives.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
