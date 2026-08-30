import React from "react";
import { Link } from "react-router-dom";
import { Sun, MapPin, Phone, Mail, Heart } from "lucide-react";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-amber-200/70 bg-white/95 text-slate-600">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Col 1 */}
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-base text-slate-900 block leading-tight">
                  Om Foundation
                </span>
                <span className="text-[11px] font-semibold text-amber-700 block font-serif">
                  ॐ चैरीटेबल ट्रस्ट
                </span>
              </div>
            </Link>
            <p className="text-xs text-amber-800 font-bold tracking-wide font-serif">
              तेज से तेजोमय
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Feeding bodies, nurturing souls, and guiding seekers toward inner peace through sadhana, seva, and community nourishment in Bhuj.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Quick Links</h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link to="/about" className="text-slate-600 hover:text-amber-700 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/programs" className="text-slate-600 hover:text-amber-700 transition">
                  Our Programs
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-slate-600 hover:text-amber-700 transition">
                  Meal Distribution Calendar
                </Link>
              </li>
              <li>
                <Link to="/volunteer" className="text-amber-700 font-semibold hover:underline transition">
                  Volunteer Sign Up
                </Link>
              </li>
              <li>
                <Link to="/donate" className="text-slate-600 hover:text-amber-700 transition">
                  Donate & Sponsor
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-slate-600 hover:text-amber-700 transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Programs */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Programs</h3>
            <ul className="mt-3 space-y-2 text-xs text-slate-600">
              <li>• Friday Meal (Women-led) – 6 PM</li>
              <li>• Sunday Breakfast (Milk & Biscuit) – 8:30 AM</li>
              <li>• Shibir (Bhuj WhatsApp Group)</li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Contact</h3>
            <ul className="mt-3 space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
                <span>SHRI STUTI, Plot No - 351/4, Hillview Residency, MES Road, Madhapar, Bhuj, Gujarat, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                <span>info@omfoundation.org</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                <span>+91 98765 43210</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {currentYear} Om Charitable Trust (ॐ चैरीटेबल ट्रस्ट). All rights reserved.</p>
          <p className="flex items-center gap-1 text-slate-400 font-serif">
            Dedicated to Seva & Spiritual Upliftment • तेज से तेजोमय
          </p>
        </div>
      </div>
    </footer>
  );
}
