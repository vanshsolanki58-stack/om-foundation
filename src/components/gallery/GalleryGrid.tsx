import React, { useState, useEffect } from 'react';
import { MealDay } from '../../types/gallery';
import { PhotoCard } from './PhotoCard';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Utensils, Image as ImageIcon, PlusCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { formatDate } from '../../lib/utils';

interface GalleryGridProps {
  days: MealDay[];
  onOpenUploadForDate?: (dateStr: string) => void;
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({ days, onOpenUploadForDate }) => {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return days.length > 0 ? days[0].servedOn : new Date().toISOString().split('T')[0];
  });

  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    return days.length > 0 ? new Date(days[0].servedOn + 'T00:00:00') : new Date();
  });

  // When days data loads or updates, ensure selectedDate and month are aligned if user hasn't actively picked
  useEffect(() => {
    if (days.length > 0) {
      const exists = days.some((d) => d.servedOn === selectedDate);
      if (!exists) {
        setSelectedDate(days[0].servedOn);
        setCurrentMonth(new Date(days[0].servedOn + 'T00:00:00'));
      }
    }
  }, [days]);

  // Dates with photos map
  const daysMap = new Map<string, MealDay>();
  days.forEach((d) => {
    if (d.photos && d.photos.length > 0) {
      daysMap.set(d.servedOn, d);
    }
  });

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // Calendar calculations
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today.toISOString().split('T')[0]);
  };

  // Helper format date key YYYY-MM-DD
  const formatDateKey = (dayNum: number): string => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(dayNum).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const selectedDayData = daysMap.get(selectedDate);
  const activeDatesList = days.filter((d) => d.photos && d.photos.length > 0);

  const handleSelectActiveDate = (dateStr: string) => {
    setSelectedDate(dateStr);
    setCurrentMonth(new Date(dateStr + 'T00:00:00'));
  };

  return (
    <div className="space-y-10">
      {/* Quick Jump Bar if there are active distribution dates */}
      {activeDatesList.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900 shrink-0">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Active Distribution Dates:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeDatesList.map((d) => {
              const isSelected = selectedDate === d.servedOn;
              return (
                <button
                  key={d.servedOn}
                  onClick={() => handleSelectActiveDate(d.servedOn)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-amber-400'
                  }`}
                >
                  <Utensils className="w-3 h-3 text-amber-600" />
                  <span>{d.servedOn}</span>
                  <span className="opacity-80">({d.mealsServed} meals)</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Calendar Section */}
      <div className="bg-white rounded-3xl border border-amber-100/90 p-6 sm:p-8 shadow-sm">
        {/* Calendar Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {monthNames[month]} {year}
              </h3>
              <p className="text-xs text-slate-500">
                Highlighted dates indicate days when meal photos were recorded
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={goToToday}
              className="px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg transition"
            >
              Today
            </button>
            <div className="flex items-center gap-1 border border-slate-200 rounded-xl p-1 bg-slate-50">
              <button
                onClick={prevMonth}
                className="p-1.5 hover:bg-white rounded-lg text-slate-600 transition"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                className="p-1.5 hover:bg-white rounded-lg text-slate-600 transition"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Calendar Days Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {/* Empty cells before month starts */}
          {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-14 sm:h-20 rounded-2xl bg-slate-50/50" />
          ))}

          {/* Actual days in month */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateStr = formatDateKey(dayNum);
            const hasMeals = daysMap.has(dateStr);
            const dayData = daysMap.get(dateStr);
            const isSelected = selectedDate === dateStr;

            return (
              <button
                key={dateStr}
                type="button"
                onClick={() => setSelectedDate(dateStr)}
                className={`h-14 sm:h-20 rounded-2xl p-1.5 sm:p-2.5 flex flex-col justify-between text-left transition-all relative border ${
                  isSelected
                    ? 'ring-2 ring-amber-500 border-amber-500 bg-amber-50/80 shadow-sm'
                    : hasMeals
                    ? 'border-amber-300 bg-gradient-to-br from-amber-50 via-orange-50 to-white hover:border-amber-400 hover:shadow-xs'
                    : 'border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50/70 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs sm:text-sm font-bold ${
                      isSelected
                        ? 'text-amber-900 font-extrabold'
                        : hasMeals
                        ? 'text-amber-800'
                        : 'text-slate-700'
                    }`}
                  >
                    {dayNum}
                  </span>
                  {hasMeals && (
                    <span className="flex h-2 w-2 rounded-full bg-amber-500 ring-2 ring-amber-200 sm:hidden" />
                  )}
                </div>

                {hasMeals && (
                  <div className="hidden sm:flex flex-col items-start gap-0.5">
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold shadow-2xs">
                      <Utensils className="w-2.5 h-2.5" />
                      {dayData?.mealsServed}
                    </span>
                    <span className="text-[10px] text-amber-800 font-medium truncate max-w-full">
                      {dayData?.photos.length} photo{dayData?.photos.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded-md bg-amber-100 border border-amber-300" />
              <span>Meals Uploaded</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded-md ring-2 ring-amber-500 bg-amber-50" />
              <span>Selected Date</span>
            </div>
          </div>
          <span className="text-slate-400">Click any date to view meal photos</span>
        </div>
      </div>

      {/* Selected Date Photo Display Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200/80 gap-2">
          <div>
            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <CalendarIcon className="w-5 h-5 text-amber-600" />
              Distribution on {formatDate(selectedDate)}
            </h3>
            {selectedDayData?.notes ? (
              <p className="text-xs text-slate-600 mt-1">{selectedDayData.notes}</p>
            ) : (
              <p className="text-xs text-slate-400 mt-1">Viewing records for {selectedDate}</p>
            )}
          </div>

          {selectedDayData && (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-50 text-amber-800 rounded-full text-xs font-extrabold border border-amber-200">
                <Utensils className="w-3.5 h-3.5" />
                {selectedDayData.mealsServed} Meals Counted
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">
                <ImageIcon className="w-3.5 h-3.5" />
                {selectedDayData.photos.length} Photos
              </span>
            </div>
          )}
        </div>

        {/* Photos Grid for Selected Date */}
        {selectedDayData && selectedDayData.photos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedDayData.photos.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} servedOn={selectedDate} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto text-2xl">
              📸
            </div>
            <div className="max-w-md mx-auto space-y-1.5">
              <h4 className="text-lg font-bold text-slate-900">
                No Photos Recorded for {formatDate(selectedDate)}
              </h4>
              <p className="text-xs text-slate-500">
                There are no meal distribution photos uploaded for this specific date yet. Select any highlighted date in the calendar above or upload photos now.
              </p>
            </div>
            {onOpenUploadForDate && (
              <button
                type="button"
                onClick={() => onOpenUploadForDate(selectedDate)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                <PlusCircle className="w-4 h-4" />
                Upload Meal Photos for {formatDate(selectedDate)}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
