import React, { useState, useEffect } from 'react';
import { GalleryGrid } from '../components/gallery/GalleryGrid';
import { AdminUploadModal } from '../components/gallery/AdminUploadModal';
import { MealDay } from '../types/gallery';
import { galleryService } from '../lib/gallery-store';
import { Utensils, UploadCloud, Heart, Calendar } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const [days, setDays] = useState<MealDay[]>([]);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [selectedDateForUpload, setSelectedDateForUpload] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Load initial meal days
    setDays(galleryService.getMealDays());

    // Subscribe to reactive updates when new photos are uploaded
    const unsubscribe = galleryService.subscribe((updatedDays) => {
      setDays(updatedDays);
    });

    return () => unsubscribe();
  }, []);

  const totalMeals = days.reduce((sum, d) => sum + (d.mealsServed || 0), 0);
  const totalPhotos = days.reduce((sum, d) => sum + (d.photos?.length || 0), 0);
  const activeDatesCount = days.filter((d) => d.photos && d.photos.length > 0).length;

  const handleOpenUploadForDate = (dateStr: string) => {
    setSelectedDateForUpload(dateStr);
    setAdminModalOpen(true);
  };

  const handleOpenUpload = () => {
    setSelectedDateForUpload(new Date().toISOString().split('T')[0]);
    setAdminModalOpen(true);
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-amber-200/60">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Heart className="w-3.5 h-3.5 fill-amber-700/20" />
            Sacred Nutrition Seva
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Meal Distribution Gallery
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-xl">
            Select any highlighted date on the calendar below to view the verified photographs and records of meals served on that day.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenUpload}
            className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md transition"
          >
            <UploadCloud className="w-4 h-4" />
            Upload Meal Photos
          </button>
        </div>
      </div>

      {/* Stats Summary Bar (AI Verification Rate Removed) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-xs">
          <span className="text-xs text-slate-500 block">Total Meals Served</span>
          <span className="text-2xl font-black text-slate-900">{totalMeals.toLocaleString()}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-xs">
          <span className="text-xs text-slate-500 block">Uploaded Meal Photos</span>
          <span className="text-2xl font-black text-slate-900">{totalPhotos}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-xs">
          <span className="text-xs text-slate-500 block">Active Distribution Dates</span>
          <span className="text-2xl font-black text-amber-700">{activeDatesCount} Day{activeDatesCount !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Interactive Calendar & Filtered Photo Grid */}
      <GalleryGrid
        days={days}
        onOpenUploadForDate={handleOpenUploadForDate}
      />

      {/* Upload Modal */}
      <AdminUploadModal
        isOpen={adminModalOpen}
        defaultDate={selectedDateForUpload}
        onClose={() => setAdminModalOpen(false)}
      />
    </div>
  );
};
