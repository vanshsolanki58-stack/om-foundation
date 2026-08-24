import React, { useState, useEffect } from 'react';
import { X, Check, Bell, Calendar, Users, Info, AlertTriangle, ExternalLink } from 'lucide-react';
import { notificationService } from '../../lib/notifications';
import { AppNotification, NotificationCategory } from '../../types/notification';
import { formatDate } from '../../lib/utils';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (page: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory>('all');

  useEffect(() => {
    setNotifications(notificationService.getNotifications());
    const unsubscribe = notificationService.subscribe(setNotifications);
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const filtered = notifications.filter((n) => {
    if (selectedCategory === 'all') return true;
    return n.category === selectedCategory;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    notificationService.markAllAsRead();
  };

  const handleNotificationClick = (n: AppNotification) => {
    notificationService.markAsRead(n.id);
    if (n.actionUrl && onNavigate) {
      const page = n.actionUrl.replace('/', '') || 'home';
      onNavigate(page);
      onClose();
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'drives':
        return <Calendar className="w-4 h-4 text-emerald-600" />;
      case 'volunteers':
        return <Users className="w-4 h-4 text-blue-600" />;
      case 'alerts':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      default:
        return <Info className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
          {/* Drawer Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900">Notifications</h2>
                <p className="text-xs text-slate-500">
                  {unreadCount > 0 ? `${unreadCount} unread update(s)` : 'All caught up'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1 px-2 py-1 bg-emerald-50 hover:bg-emerald-100 rounded-md transition"
                  title="Mark all as read"
                >
                  <Check className="w-3.5 h-3.5" />
                  Mark read
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-md transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-3 border-b border-slate-100 bg-white overflow-x-auto">
            {(
              [
                { id: 'all', label: 'All' },
                { id: 'drives', label: 'Drives' },
                { id: 'volunteers', label: 'Volunteers' },
                { id: 'system', label: 'News' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-all whitespace-nowrap ${
                  selectedCategory === tab.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-medium">No notifications in this category</p>
              </div>
            ) : (
              filtered.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer relative ${
                    !n.read
                      ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300'
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-2xs mt-0.5">
                      {getCategoryIcon(n.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4
                          className={`text-sm font-semibold truncate ${
                            !n.read ? 'text-slate-900' : 'text-slate-700'
                          }`}
                        >
                          {n.title}
                        </h4>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed mb-2.5">
                        {n.message}
                      </p>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100/80 text-[11px] text-slate-400">
                        <span>{formatDate(n.timestamp)}</span>
                        {n.actionLabel && (
                          <span className="text-emerald-700 font-medium flex items-center gap-1 hover:underline">
                            {n.actionLabel}
                            <ExternalLink className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Om Foundation Community Alerts</span>
            <button
              onClick={() => notificationService.clearAll()}
              className="text-slate-400 hover:text-slate-600"
            >
              Clear history
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
