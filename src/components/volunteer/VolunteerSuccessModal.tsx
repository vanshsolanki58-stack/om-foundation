import React from 'react';
import { CheckCircle2, Award, Calendar, HeartHandshake, ArrowRight, Share2, Copy } from 'lucide-react';

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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5" />
            Registration Confirmed
          </span>

          <h3 className="text-2xl font-bold text-slate-900 mb-1">
            Welcome, {volunteerName}!
          </h3>
          <p className="text-sm text-slate-600 mb-6">
            Thank you for stepping up to nourish our community. Your volunteer profile is now active.
          </p>
        </div>

        {/* Digital ID Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-5 mb-6 shadow-md relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10">
            <HeartHandshake className="w-36 h-36" />
          </div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-emerald-400 font-semibold">
                Om Foundation Volunteer Pass
              </p>
              <p className="text-lg font-bold">{volunteerName}</p>
            </div>
            <div className="text-right">
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-xs font-medium border border-emerald-500/30">
                Verified
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-700/60 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Volunteer ID</span>
              <span className="font-mono font-bold tracking-wider text-sm text-slate-100">
                {volunteerId}
              </span>
            </div>
            <button
              onClick={handleCopyId}
              className="p-1.5 hover:bg-slate-700 rounded-md text-slate-300 hover:text-white transition flex items-center gap-1 text-xs"
              title="Copy ID"
            >
              <Copy className="w-3.5 h-3.5" />
              Copy
            </button>
          </div>
        </div>

        {/* Next Steps */}
        <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-xl text-xs text-slate-700">
          <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-emerald-600" />
            What Happens Next?
          </h4>
          <ul className="space-y-2 list-disc list-inside text-slate-600">
            <li>Our volunteer coordination team will review your preferred shifts.</li>
            <li>You will receive drive location alerts in your <strong>Notification Center</strong>.</li>
            <li>Save your <strong>Volunteer ID ({volunteerId})</strong> for on-site attendance marking.</li>
          </ul>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition shadow-sm hover:shadow text-sm flex items-center justify-center gap-2"
          >
            Explore Next Drives
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
