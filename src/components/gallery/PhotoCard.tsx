import React from 'react';
import { PhotoItem } from '../../types/gallery';
import { Utensils, HardDrive, ExternalLink } from 'lucide-react';

const DRIVE_FOLDER_LINK = "https://drive.google.com/drive/folders/1jIbOz5tqnmTCdAOHDg_Ozu_O3MoMSEZO?usp=drive_link";

interface PhotoCardProps {
  photo: PhotoItem;
  servedOn: string;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ photo, servedOn }) => {
  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden border border-amber-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      <div className="aspect-4/3 overflow-hidden bg-slate-100 relative">
        <img
          src={photo.url}
          alt={photo.caption || `Meal distribution on ${servedOn}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-slate-700">{servedOn}</span>
          {photo.countedRecipients ? (
            <span className="font-extrabold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/80 flex items-center gap-1">
              <Utensils className="w-3 h-3 text-amber-600" />
              {photo.countedRecipients} Meals
            </span>
          ) : null}
        </div>

        {photo.caption && (
          <p className="text-xs text-slate-800 font-semibold line-clamp-2 leading-relaxed">
            {photo.caption}
          </p>
        )}

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Drive: om foundation meals served</span>
          <a
            href={DRIVE_FOLDER_LINK}
            target="_blank"
            rel="noreferrer"
            className="text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 hover:underline"
          >
            <HardDrive className="w-3 h-3" />
            View Drive <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
