import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Heart, Bell, Sun } from "lucide-react";
import { NotificationBell } from "./notifications/NotificationBell";
import { NotificationDrawer } from "./notifications/NotificationDrawer";

const navLinks = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/programs", label: "Programs" },
  { path: "/gallery", label: "Meal Calendar" },
  { path: "/donate", label: "Donate" },
  { path: "/volunteer", label: "Volunteer" },
  { path: "/contact", label: "Contact" },
  { path: "/faq", label: "FAQ" },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isCurrentActive = (path: string) => {
    if (path === "/") return location.pathname === "/" || location.pathname === "";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-amber-200/60 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Clean Logo */}
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform shrink-0">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight block leading-tight">
                Om Foundation
              </span>
              <span className="text-[11px] font-semibold text-amber-700 tracking-wider block">
                Madhapar, Bhuj
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 lg:gap-1.5 md:flex">
            {navLinks.map((link) => {
              const active = isCurrentActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    active
                      ? "text-amber-800 bg-amber-50/90"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2.5">
            <NotificationBell onClick={() => setNotificationOpen(true)} />

            <Link
              to="/donate"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:shadow-md"
            >
              <Heart className="w-3.5 h-3.5 fill-white/20" />
              Donate
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileOpen && (
          <div className="border-t border-amber-100 bg-white/95 px-4 py-4 md:hidden shadow-lg space-y-1">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isCurrentActive(link.path)
                      ? "bg-amber-50 text-amber-800 font-bold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/donate"
                onClick={() => setMobileOpen(false)}
                className="mt-2 w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-2.5 text-center text-xs font-bold text-white shadow-sm block"
              >
                Donate Now
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={notificationOpen}
        onClose={() => setNotificationOpen(false)}
      />
    </>
  );
}
