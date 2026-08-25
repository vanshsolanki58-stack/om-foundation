import { VolunteerFormData } from '../types/volunteer';
import { supabase, isSupabaseConfigured, submitVolunteerApplication } from './supabase';

const VOLUNTEER_STORAGE_KEY = 'om_foundation_registered_volunteers';

export interface RegisteredVolunteer extends VolunteerFormData {
  id: string;
  registeredAt: string;
}

class VolunteerService {
  private volunteers: RegisteredVolunteer[] = [];
  private listeners: ((count: number) => void)[] = [];
  private initialized = false;

  constructor() {
    this.loadInitial();
  }

  private async loadInitial() {
    // 1. Load from localStorage cache for instant UI rendering
    try {
      const stored = localStorage.getItem(VOLUNTEER_STORAGE_KEY);
      if (stored) {
        this.volunteers = JSON.parse(stored);
        this.notifyListeners(this.volunteers.length);
      }
    } catch (e) {
      console.error('Error reading volunteer localStorage', e);
    }

    // 2. Fetch latest volunteer count from Supabase (Single Source of Truth)
    await this.fetchFromDatabase();
  }

  private async fetchFromDatabase() {
    if (!isSupabaseConfigured) return;

    try {
      const { data, count, error } = await supabase
        .from('volunteer_submissions')
        .select('*', { count: 'exact' });

      if (!error && data) {
        const formatted: RegisteredVolunteer[] = data.map((item: any) => ({
          fullName: item.name || '',
          email: item.email || '',
          phone: item.phone || '',
          city: item.city || 'Bhuj, Gujarat',
          ageGroup: '18-25',
          roles: item.interest ? item.interest.split(', ') : ['meal_distribution'],
          availability: Array.isArray(item.availability) ? item.availability : ['Weekends'],
          preferredShift: item.preferred_shift || 'Morning',
          emergencyReliefOptIn: Boolean(item.emergency_relief),
          priorExperience: item.prior_experience || '',
          message: item.message || '',
          id: item.id || `VOL-${Math.random().toString(36).substring(2, 7)}`,
          registeredAt: item.created_at || new Date().toISOString(),
        }));

        this.volunteers = formatted;
        try {
          localStorage.setItem(VOLUNTEER_STORAGE_KEY, JSON.stringify(formatted));
        } catch (e) {}
        this.notifyListeners(this.volunteers.length);
      }
    } catch (e) {
      // Offline / Network error - maintain cached count
      console.warn('Could not sync volunteers with Supabase, using local cache.', e);
    }
  }

  public getVolunteers(): RegisteredVolunteer[] {
    return this.volunteers;
  }

  public getVolunteerCount(): number {
    return this.volunteers.length;
  }

  public async registerVolunteer(data: VolunteerFormData): Promise<{ id: string; success: boolean }> {
    // 1. Submit to Supabase as single source of truth
    const result = await submitVolunteerApplication(data);

    const newVolunteer: RegisteredVolunteer = {
      ...data,
      id: result.volunteerId,
      registeredAt: new Date().toISOString(),
    };

    // 2. Update local state & storage
    this.volunteers = [newVolunteer, ...this.volunteers];
    try {
      localStorage.setItem(VOLUNTEER_STORAGE_KEY, JSON.stringify(this.volunteers));
    } catch (e) {}
    this.notifyListeners(this.volunteers.length);

    return { id: result.volunteerId, success: true };
  }

  public subscribe(listener: (count: number) => void): () => void {
    this.listeners.push(listener);
    listener(this.volunteers.length);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(count: number) {
    for (const listener of this.listeners) {
      listener(count);
    }
  }
}

export const volunteerService = new VolunteerService();
