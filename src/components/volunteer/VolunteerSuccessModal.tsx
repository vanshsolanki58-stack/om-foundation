import React from 'react';
import { CheckCircle2, Award, Calendar, HeartHandshake, ArrowRight, MessageCircle, Copy, Mail } from 'lucide-react';

interface VolunteerSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  volunteerId: string;
  volunteerName: string;
  roles: string[];
}

export const VolunteerSuccessModal: React.FC<VolunteerSuccessModalProps> = ({
  isOpen,
  onClose,
  volunteerId,
  volunteerName,
  roles,
}) => {
  if (!isOpen) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(volunteerId);
    alert('Volunteer ID copied to clipboard!');
  };

  const roleLabels: Record<string, string> = {
    meal_distribution: 'Meal Serving',
    food_prep: 'Food Prep',
    admin: 'Admin',
  };

  const whatsappMessage = encodeURIComponent(
    `Hare Krishna 🙏! I have registered as a volunteer with Om Foundation (Name: ${volunteerName}, ID: ${volunteerId}). Please add me to the Seva WhatsApp group.`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-amber-100 animate-in zoom-in-95 duration-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-amber-50">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-200">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            Registration Confirmed
          </span>

          <h3 className="text-2xl font-black text-slate-900 mb-1">
            Dhanyawaad, {volunteerName}! 🙏
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
            Thank you for your devotion to our community. Your volunteer registration is active, and a thank-you email has been sent.
          </p>
        </div>

        {/* Digital ID Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 text-white rounded-2xl p-5 mb-5 shadow-lg relative overflow-hidden border border-amber-500/20">
          <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10">
            <HeartHandshake className="w-36 h-36" />
          </div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-amber-400 font-bold">
                Om Foundation Volunteer Pass
              </p>
              <p className="text-lg font-bold text-white mt-0.5">{volunteerName}</p>
            </div>
            <div className="text-right">
              <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 rounded-full text-[10px] font-bold border border-amber-500/30">
                Verified Seva
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-700/60 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-medium">Volunteer ID</span>
              <span className="font-mono font-bold tracking-wider text-sm text-amber-300">
                {volunteerId}
              </span>
            </div>
            <button
              onClick={handleCopyId}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-slate-200 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold"
              title="Copy ID"
            >
              <Copy className="w-3.5 h-3.5" />
              Copy ID
            </button>
          </div>
        </div>

        {/* Next Steps */}
        <div className="space-y-3 mb-6 bg-amber-50/50 p-4 rounded-2xl border border-amber-100 text-xs text-slate-700">
          <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-amber-600" />
            What Happens Next?
          </h4>
          <ul className="space-y-2 list-disc list-inside text-slate-600 leading-relaxed">
            <li>A personalized welcome and thank-you email has been dispatched to your email.</li>
            <li>You will receive seva location reminders and shibir updates on WhatsApp.</li>
            <li>Save your <strong>Volunteer ID ({volunteerId})</strong> for future drives.</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <a
            href={`https://wa.me/919876543210?text=${whatsappMessage}`}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-1/2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow-sm hover:shadow text-xs flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Connect on WhatsApp
          </a>

          <button
            onClick={onClose}
            className="w-full sm:w-1/2 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition shadow-sm hover:shadow text-xs flex items-center justify-center gap-2"
          >
            Close & View Calendar
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
