import React from 'react';
import { Heart, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: About */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                <Heart className="w-4 h-4 fill-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Om Foundation</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Om Foundation is a non-profit initiative dedicated to fighting hunger, providing wholesome daily meals, and fostering dignity across underserved communities.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-emerald-400 font-medium">
                Registered Non-Profit NGO
              </span>
              <span>•</span>
              <span>100% Volunteer Driven</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition"
                >
                  Home & Impact
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('volunteer')}
                  className="hover:text-emerald-400 text-emerald-300 font-medium transition"
                >
                  Volunteer Sign Up
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gallery')}
                  className="hover:text-white transition"
                >
                  Meal Distribution Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition"
                >
                  Our Mission
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition"
                >
                  Contact & Support
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Details */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Get in Touch
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Sector 14 & 31, Gurugram / Delhi NCR, India</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>contact@omfoundation.org</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Om Foundation. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with care for a hunger-free tomorrow.
          </p>
        </div>
      </div>
    </footer>
  );
};
