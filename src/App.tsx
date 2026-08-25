import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";
import { CosmicBackground } from "./components/CosmicBackground";
import { HomePage } from "./pages/HomePage";
import { VolunteerPage } from "./pages/VolunteerPage";
import { GalleryPage } from "./pages/GalleryPage";
import { ContactPage } from "./pages/ContactPage";
import { AboutPage } from "./pages/AboutPage";
import { ProgramsPage } from "./pages/ProgramsPage";
import { DonatePage } from "./pages/DonatePage";
import { FaqPage } from "./pages/FaqPage";

export const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 relative">
        <CosmicBackground />
        <SiteHeader />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/volunteer" element={<VolunteerPage />} />
            <Route path="/donate" element={<DonatePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <SiteFooter />
      </div>
    </HashRouter>
  );
};

export default App;
