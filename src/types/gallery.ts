export interface PhotoItem {
  id: string;
  url: string;
  caption: string | null;
  countsTowardMeals?: boolean;
  countedRecipients?: number;
  aiReason?: string;
  aiIsOriginal?: boolean;
  aiMealBeingServed?: boolean;
  driveLink?: string | null;
}

export interface MealDay {
  id: string;
  servedOn: string;
  mealsServed: number;
  notes: string | null;
  photos: PhotoItem[];
}

export interface GalleryData {
  days: MealDay[];
  totalMeals: number;
  totalPhotos: number;
}
