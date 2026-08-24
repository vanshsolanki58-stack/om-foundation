import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { notificationService } from '../../lib/notifications';
import { AppNotification } from '../../types/notification';

interface NotificationBellProps {
  onClick: () => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ onClick }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    setNotifications(notificationService.getNotifications());
    const unsubscribe = notificationService.subscribe(setNotifications);
    return () => unsubscribe();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <button
      onClick={onClick}
      className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-slate-300"
      aria-label="Open notifications"
    >
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-pulse-subtle">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
};
