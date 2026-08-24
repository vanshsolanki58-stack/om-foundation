import React, { useState } from 'react';
import { Heart, Menu, X, Sparkles, Utensils, HandHeart, PhoneCall, Info } from 'lucide-react';
import { NotificationBell } from '../notifications/NotificationBell';
import { NotificationDrawer } from '../notifications/NotificationDrawer';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'volunteer', label: 'Volunteer Sign Up', highlight: true },
    { id: 'gallery', label: 'Meal Gallery' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <Heart className="w-5 h-5 fill-white/20 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-slate-900 tracking-tight block leading-tight">
                  Om Foundation
                </span>
                <span className="text-[10px] uppercase font-semibold text-emerald-700 tracking-widest block">
                  Feeding Hope & Nourishing Lives
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1.5">
              {navItems.map((item) => {
                const isActive = currentPage === item.id;
                if (item.highlight) {
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className="ml-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition shadow-sm hover:shadow flex items-center gap-1.5"
                    >
                      <HandHeart className="w-4 h-4" />
                      {item.label}
                    </button>
                  );
                }
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? 'text-emerald-700 bg-emerald-50/80 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Actions: Notification Bell + Mobile Hamburger */}
            <div className="flex items-center gap-2">
              <NotificationBell onClick={() => setNotificationDrawerOpen(true)} />

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                  currentPage === item.id
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={notificationDrawerOpen}
        onClose={() => setNotificationDrawerOpen(false)}
        onNavigate={onNavigate}
      />
    </>
  );
};
