import { AppNotification } from '../types/notification';

const STORAGE_KEY = 'om_foundation_notifications';

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Weekend Mega Meal Drive',
    message: 'Join us this Saturday at Sector 14 Community Center for our 500-meal distribution drive. Volunteers needed!',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    category: 'drives',
    read: false,
    actionUrl: '/volunteer',
    actionLabel: 'Join Drive',
    priority: 'high',
  },
  {
    id: 'notif-2',
    title: 'Milestone Achieved: 10,000 Meals!',
    message: 'Thanks to our dedicated volunteer network, we have officially served over 10,000 warm meals this month.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    category: 'system',
    read: false,
    actionUrl: '/gallery',
    actionLabel: 'View Gallery',
    priority: 'medium',
  },
  {
    id: 'notif-3',
    title: 'New Volunteer Orientation Call',
    message: 'Welcome to the Om Foundation family! Join our weekly 15-minute introductory orientation on Google Meet.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    category: 'volunteers',
    read: true,
    actionUrl: '/volunteer',
    actionLabel: 'Details',
    priority: 'low',
  },
];

class NotificationService {
  private listeners: ((notifications: AppNotification[]) => void)[] = [];

  public getNotifications(): AppNotification[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading notifications', e);
    }
    this.saveNotifications(DEFAULT_NOTIFICATIONS);
    return DEFAULT_NOTIFICATIONS;
  }

  public saveNotifications(notifications: AppNotification[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
      this.notifyListeners(notifications);
    } catch (e) {
      console.error('Error saving notifications', e);
    }
  }

  public addNotification(notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>): AppNotification {
    const current = this.getNotifications();
    const newNotif: AppNotification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    const updated = [newNotif, ...current];
    this.saveNotifications(updated);
    return newNotif;
  }

  public markAsRead(id: string): void {
    const current = this.getNotifications();
    const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n));
    this.saveNotifications(updated);
  }

  public markAllAsRead(): void {
    const current = this.getNotifications();
    const updated = current.map((n) => ({ ...n, read: true }));
    this.saveNotifications(updated);
  }

  public clearAll(): void {
    this.saveNotifications([]);
  }

  public subscribe(listener: (notifications: AppNotification[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(notifications: AppNotification[]) {
    for (const listener of this.listeners) {
      listener(notifications);
    }
  }
}

export const notificationService = new NotificationService();
