import { VolunteerFormData } from '../types/volunteer';

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
    // Poll for real-time synchronization across all devices
    if (typeof window !== 'undefined') {
      setInterval(() => {
        this.fetchFromServer();
      }, 4000);
    }
  }

  private async loadInitial() {
    // 1. Load from localStorage cache first
    try {
      const stored = localStorage.getItem(VOLUNTEER_STORAGE_KEY);
      if (stored) {
        this.volunteers = JSON.parse(stored);
        this.notifyListeners(this.volunteers.length);
      }
    } catch (e) {
      console.error('Error reading localStorage', e);
    }

    // 2. Fetch latest from shared backend server
    await this.fetchFromServer();
  }

  private async fetchFromServer() {
    try {
      const res = await fetch('/api/volunteers');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const countChanged = this.volunteers.length !== data.length;
          this.volunteers = data;
          try {
            localStorage.setItem(VOLUNTEER_STORAGE_KEY, JSON.stringify(data));
          } catch (e) {}
          if (countChanged || !this.initialized) {
            this.initialized = true;
            this.notifyListeners(this.volunteers.length);
          }
        }
      }
    } catch (e) {
      // Backend unavailable, continue with local cache
    }
  }

  public getVolunteers(): RegisteredVolunteer[] {
    return this.volunteers;
  }

  public getVolunteerCount(): number {
    return this.volunteers.length;
  }

  public async registerVolunteer(data: VolunteerFormData): Promise<{ id: string; success: boolean }> {
    const volunteerId = `OM-VOL-${Math.floor(100000 + Math.random() * 900000)}`;

    const newVolunteer: RegisteredVolunteer = {
      ...data,
      id: volunteerId,
      registeredAt: new Date().toISOString(),
    };

    // Optimistic local update
    this.volunteers = [newVolunteer, ...this.volunteers];
    try {
      localStorage.setItem(VOLUNTEER_STORAGE_KEY, JSON.stringify(this.volunteers));
    } catch (e) {}
    this.notifyListeners(this.volunteers.length);

    // Sync with shared server API
    try {
      await fetch('/api/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVolunteer),
      });
    } catch (e) {
      console.error('Failed to sync volunteer with server', e);
    }

    return { id: volunteerId, success: true };
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
