import { MealDay, PhotoItem } from '../types/gallery';

const GALLERY_STORAGE_KEY = 'om_foundation_meal_days';

class GalleryService {
  private days: MealDay[] = [];
  private listeners: ((days: MealDay[]) => void)[] = [];
  private initialized = false;

  constructor() {
    this.loadInitial();
    if (typeof window !== 'undefined') {
      setInterval(() => {
        this.fetchFromServer();
      }, 5000);
    }
  }

  private async loadInitial() {
    try {
      const stored = localStorage.getItem(GALLERY_STORAGE_KEY);
      if (stored) {
        this.days = JSON.parse(stored);
        this.notifyListeners(this.days);
      }
    } catch (e) {
      console.error('Error loading gallery meal days from localStorage', e);
    }

    await this.fetchFromServer();
  }

  private async fetchFromServer() {
    try {
      const res = await fetch('/api/meals');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const changed = JSON.stringify(this.days) !== JSON.stringify(data);
          this.days = data;
          try {
            localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(data));
          } catch (e) {}
          if (changed || !this.initialized) {
            this.initialized = true;
            this.notifyListeners(this.days);
          }
        }
      }
    } catch (e) {}
  }

  public getMealDays(): MealDay[] {
    return this.days;
  }

  public saveMealDays(days: MealDay[], passcode?: string): void {
    this.days = days;
    try {
      localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(days));
    } catch (e) {}
    this.notifyListeners(days);

    fetch('/api/meals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-passcode': passcode || '',
      },
      body: JSON.stringify(days),
    }).catch((e) => console.error('Failed to sync meals with server', e));
  }

  public getTotalMeals(): number {
    return this.days.reduce((sum, d) => sum + (d.mealsServed || 0), 0);
  }

  public getTotalPhotos(): number {
    return this.days.reduce((sum, d) => sum + (d.photos?.length || 0), 0);
  }

  public getPhotosForDate(dateStr: string): MealDay | undefined {
    return this.days.find((d) => d.servedOn === dateStr);
  }

  public getDatesWithPhotos(): string[] {
    return this.days.filter((d) => d.photos && d.photos.length > 0).map((d) => d.servedOn);
  }

  public addPhotos(
    servedOn: string,
    photos: { url: string; caption?: string; countedRecipients?: number; driveLink?: string }[],
    notes?: string,
    mealsCount?: number,
    passcode?: string,
  ): MealDay {
    const currentDays = [...this.days];
    const existingIndex = currentDays.findIndex((d) => d.servedOn === servedOn);

    const calculatedMeals = mealsCount && mealsCount > 0
      ? mealsCount
      : photos.reduce((sum, p) => sum + (p.countedRecipients || 1), 0);

    const newPhotos: PhotoItem[] = photos.map((p, idx) => ({
      id: `photo-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
      url: p.url,
      caption: p.caption || notes || null,
      countsTowardMeals: true,
      countedRecipients: p.countedRecipients || Math.max(1, Math.round(calculatedMeals / photos.length)),
    }));

    let updatedDay: MealDay;

    if (existingIndex >= 0) {
      const existing = currentDays[existingIndex];
      updatedDay = {
        ...existing,
        mealsServed: existing.mealsServed + calculatedMeals,
        notes: notes || existing.notes,
        photos: [...existing.photos, ...newPhotos],
      };
      currentDays[existingIndex] = updatedDay;
    } else {
      updatedDay = {
        id: `day-${Date.now()}`,
        servedOn,
        mealsServed: calculatedMeals,
        notes: notes || null,
        photos: newPhotos,
      };
      currentDays.unshift(updatedDay);
    }

    currentDays.sort((a, b) => new Date(b.servedOn).getTime() - new Date(a.servedOn).getTime());

    this.saveMealDays(currentDays, passcode);
    return updatedDay;
  }

  public subscribe(listener: (days: MealDay[]) => void): () => void {
    this.listeners.push(listener);
    listener(this.days);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(days: MealDay[]) {
    for (const listener of this.listeners) {
      listener(days);
    }
  }
}

export const galleryService = new GalleryService();
