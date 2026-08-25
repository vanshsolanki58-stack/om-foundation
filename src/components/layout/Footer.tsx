import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-xs">
                <Heart className="w-5 h-5 fill-white/20 stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">Om Foundation</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Serving the community in Bhuj with nourishing meals, spiritual retreats, and dedicated volunteer care.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Explore</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link to="/" className="hover:text-amber-700 transition">Home</Link>
              </li>
              <li>
                <Link to="/volunteer" className="hover:text-amber-700 transition">Volunteer With Us</Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-amber-700 transition">Meal Gallery</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-700 transition">About Our Mission</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-700 transition">Contact & Support</Link>
              </li>
            </ul>
          </div>

          {/* Service Hours */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Programs</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>• Friday Meal (Women-led) – 6 PM</li>
              <li>• Sunday Breakfast (Milk & Biscuit) – 8:30 AM</li>
              <li>• Shibir (Bhuj WhatsApp Group)</li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Location</h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Madhapar, Bhuj, Gujarat, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                <span>contact@omfoundation.org</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Om Foundation. All rights reserved.</p>
          <p className="flex items-center gap-1 text-slate-400 font-serif">
            तेज से तेजोमय • Dedicated to Seva
          </p>
        </div>
      </div>
    </footer>
  );
};
