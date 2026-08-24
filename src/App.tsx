import React, { useState } from "react";
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
  const [currentPage, setCurrentPage] = useState<string>("home");

  const renderPage = () => {
    switch (currentPage) {
      case "volunteer":
        return <VolunteerPage />;
      case "gallery":
        return <GalleryPage />;
      case "programs":
        return <ProgramsPage onNavigate={setCurrentPage} />;
      case "donate":
        return <DonatePage />;
      case "faq":
        return <FaqPage />;
      case "contact":
        return <ContactPage />;
      case "about":
        return <AboutPage />;
      case "home":
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 relative">
      <CosmicBackground />
      <SiteHeader currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1">
        {renderPage()}
      </main>
      <SiteFooter onNavigate={setCurrentPage} />
    </div>
  );
};

export default App;
