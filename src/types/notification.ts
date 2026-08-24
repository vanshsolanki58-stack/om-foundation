export type NotificationCategory = 'all' | 'drives' | 'volunteers' | 'system' | 'alerts';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string; // ISO string
  category: 'drives' | 'volunteers' | 'system' | 'alerts';
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  priority?: 'low' | 'medium' | 'high';
}
