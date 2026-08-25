import React from 'react';
import { VolunteerForm } from '../components/volunteer/VolunteerForm';
import { HandHeart } from 'lucide-react';

export const VolunteerPage: React.FC = () => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Clean Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider border border-amber-200">
          <HandHeart className="w-3.5 h-3.5 text-amber-600" />
          Join Our Seva Family
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
          Volunteer Sign-Up
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Be the hands that prepare meals, the compassion that serves humanity, and the light that touches lives in Gujarat. Fill out the application below to join our seva community.
        </p>
      </div>

      {/* Main Volunteer Form */}
      <VolunteerForm />
    </div>
  );
};
