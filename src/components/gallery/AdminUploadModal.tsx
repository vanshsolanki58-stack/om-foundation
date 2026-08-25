import React, { useState, useEffect } from 'react';
import { X, UploadCloud, Utensils, HardDrive, Eye, EyeOff, Trash2, CheckCircle2, AlertCircle, ExternalLink, Lock } from 'lucide-react';
import { galleryService } from '../../lib/gallery-store';
import { notificationService } from '../../lib/notifications';
import { compressImage } from '../../lib/image-utils';

const DRIVE_FOLDER_LINK = "https://drive.google.com/drive/folders/1jIbOz5tqnmTCdAOHDg_Ozu_O3MoMSEZO?usp=drive_link";
// Default Admin Passcode (can also be configured via process.env.GALLERY_ADMIN_PASSCODE)
export const DEFAULT_ADMIN_PASSCODE = "vanshsolanki16";

interface AdminUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: string;
  onSuccess?: (date: string) => void;
}

export const AdminUploadModal: React.FC<AdminUploadModalProps> = ({
  isOpen,
  onClose,
  defaultDate,
  onSuccess,
}) => {
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [servedOn, setServedOn] = useState(defaultDate || new Date().toISOString().split('T')[0]);
  const [mealsCount, setMealsCount] = useState<number>(40);
  const [caption, setCaption] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<{ name: string; url: string; size?: string }[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (defaultDate) {
      setServedOn(defaultDate);
    }
  }, [defaultDate]);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);

    try {
      setCompressing(true);
      setError(null);

      const processed = await Promise.all(
        files.map(async (file) => {
          const compressedDataUrl = await compressImage(file);
          const formattedSize = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
          return {
            name: file.name,
            url: compressedDataUrl,
            size: formattedSize,
          };
        })
      );

      setSelectedFiles((prev) => [...prev, ...processed].slice(0, 12));
    } catch (err: any) {
      setError('Error processing image files. Please try another image.');
    } finally {
      setCompressing(false);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 🔒 Security Check: Validate Passcode
    if (!passcode || passcode.trim() !== DEFAULT_ADMIN_PASSCODE) {
      setError('❌ Incorrect Admin Passcode. Please enter the valid authorization password to record meals and upload photos.');
      return;
    }

    if (selectedFiles.length === 0) {
      setError('Please choose at least one meal photo to upload.');
      return;
    }

    try {
      setLoading(true);

      const mealsToAdd = Number(mealsCount) || 1;
      const mealsPerPhoto = Math.max(1, Math.round(mealsToAdd / selectedFiles.length));
      
      const photosToSave = selectedFiles.map((f, i) => {
        const sanitizedFileName = `om foundation meals served - ${servedOn} - ${f.name}`;
        return {
          url: f.url,
          caption: caption ? `${caption} (${sanitizedFileName})` : sanitizedFileName,
          countedRecipients: mealsPerPhoto,
          driveLink: DRIVE_FOLDER_LINK,
        };
      });

      galleryService.addPhotos(servedOn, photosToSave, caption, mealsToAdd, passcode);

      // Trigger In-App Notification
      notificationService.addNotification({
        title: 'Meal Photos Recorded & Synced 📸',
        message: `${selectedFiles.length} photo(s) and ${mealsToAdd} meals recorded for ${servedOn}. Synced across all devices and Google Drive folder.`,
        category: 'drives',
        actionUrl: '/gallery',
        actionLabel: 'View in Calendar',
        priority: 'high',
      });

      if (onSuccess) onSuccess(servedOn);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 text-amber-800 rounded-2xl">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Upload Meal Distribution Photos</h3>
                <p className="text-xs text-slate-500">
                  Password protected • Syncs to calendar, meal count, and Google Drive
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drive Destination Info Banner */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-900">
              <HardDrive className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Drive Folder: <strong>om foundation meals served</strong>
              </span>
            </div>
            <a
              href={DRIVE_FOLDER_LINK}
              target="_blank"
              rel="noreferrer"
              className="text-amber-800 hover:underline font-bold flex items-center gap-1 shrink-0"
            >
              Open Drive <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleUpload} className="space-y-4">
            {/* 🔒 Security Passcode Layer */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-900">
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  Admin Upload Passcode <span className="text-red-500">*</span>
                </span>
                <span className="text-[11px] text-slate-400 font-normal">Required for authorization</span>
              </label>
              <div className="relative">
                <input
                  type={showPasscode ? "text" : "password"}
                  required
                  placeholder="Enter admin password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none text-sm font-mono tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  title={showPasscode ? "Hide password" : "Show password"}
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Distribution Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={servedOn}
                  onChange={(e) => setServedOn(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Meals Served in this Drive <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={mealsCount}
                  onChange={(e) => setMealsCount(Number(e.target.value))}
                  placeholder="e.g. 50"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Location & Seva Notes (Optional)
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="e.g. Madhapar Community Center, Bhuj"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none text-sm"
              />
            </div>

            {/* Photo Dropzone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Select Photo(s) of Meal Served <span className="text-red-500">*</span>
              </label>
              <label className="border-2 border-dashed border-amber-200 hover:border-amber-500 rounded-3xl p-6 flex flex-col items-center justify-center cursor-pointer transition bg-amber-50/30 group">
                <UploadCloud className="w-9 h-9 text-amber-500 group-hover:scale-110 transition-transform mb-2" />
                <span className="text-xs font-bold text-slate-800">
                  {compressing ? 'Optimizing photos...' : 'Click or Drag & Drop photos here'}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5">JPG, PNG, WebP up to 12 photos</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={compressing}
                  className="hidden"
                />
              </label>
            </div>

            {/* Interactive Thumbnail Previews with Fullscreen & Remove */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">
                    {selectedFiles.length} Photo{selectedFiles.length !== 1 ? 's' : ''} Ready:
                  </span>
                  <span className="text-slate-400">Click photo for full preview</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-48 overflow-y-auto p-1">
                  {selectedFiles.map((file, i) => (
                    <div
                      key={i}
                      className="group relative aspect-4/3 rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-100"
                    >
                      <img src={file.url} alt={file.name} className="w-full h-full object-cover" />

                      {/* Action overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPreviewImage(file.url)}
                          className="p-1.5 bg-white text-slate-800 rounded-lg shadow-xs hover:bg-slate-100 transition"
                          title="Preview full image"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(i)}
                          className="p-1.5 bg-red-500 text-white rounded-lg shadow-xs hover:bg-red-600 transition"
                          title="Remove photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Lock className="w-3 h-3 text-slate-400" /> Authorized Admin Only
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || compressing}
                  className="px-7 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-bold transition shadow-md flex items-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Syncing & Recording...
                    </>
                  ) : (
                    <>
                      <Utensils className="w-3.5 h-3.5" />
                      Authorize & Upload
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Lightbox Fullscreen Preview */}
      {previewImage && (
        <div
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl">
            <img src={previewImage} alt="Full Preview" className="w-full h-full object-contain" />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full hover:bg-black/80"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
