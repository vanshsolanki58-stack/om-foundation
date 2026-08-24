import React from 'react';
import { VolunteerForm } from '../components/volunteer/VolunteerForm';
import { HandHeart, Users, Award, ShieldCheck, Heart } from 'lucide-react';

export const VolunteerPage: React.FC = () => {
  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <HandHeart className="w-3.5 h-3.5" />
          Join The Movement
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Volunteer Sign-Up
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Be the hands that prepare meals, the wheels that deliver hope, and the voice that builds community. Fill out the application below to get started.
        </p>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Flexible Shifts</h4>
            <p className="text-[11px] text-slate-500">Weekends or weekdays based on your schedule</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-50 text-blue-700">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Digital Volunteer ID</h4>
            <p className="text-[11px] text-slate-500">Official pass & certificate of appreciation</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-teal-50 text-teal-700">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Drive Notifications</h4>
            <p className="text-[11px] text-slate-500">Instant in-app and WhatsApp updates</p>
          </div>
        </div>
      </div>

      {/* Main Volunteer Form */}
      <VolunteerForm />
    </div>
  );
};
