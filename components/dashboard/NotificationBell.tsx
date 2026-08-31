"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FiBell } from "react-icons/fi";
import {
  fetchNotifications,
  fetchUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/lib/queries/NotificationQueries";
import { NotificationModel } from "@/lib/models/NotificationModels";

const POLL_INTERVAL_MS = 30000;

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationModel[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const loadCount = () => {
      fetchUnreadNotificationCount().then(setUnreadCount).catch(() => {});
    };
    loadCount();
    const interval = setInterval(loadCount, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOpen = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (next) {
      fetchNotifications().then(setNotifications).catch(() => {});
    }
  };

  const handleNotificationClick = async (notification: NotificationModel) => {
    if (!notification.isRead) {
      try {
        await markNotificationAsRead(notification.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n)),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch {
        // best-effort : la notification reste affichée comme non lue
      }
    }
    setIsOpen(false);
    if (notification.link) router.push(notification.link);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      // best-effort
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={toggleOpen}
        className="relative p-2 rounded-lg hover:bg-sunken transition-colors focus:outline-none"
        aria-label="Notifications"
      >
        <FiBell className="w-5 h-5 text-ink-soft" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-accent text-ink-invert text-[10px] font-bold rounded-full ring-2 ring-raised">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-raised border border-line rounded-xl shadow-md z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-line">
            <span className="text-sm font-sans uppercase tracking-[0.14em] text-ink-soft">
              Notifications
            </span>
            {notifications.some((n) => !n.isRead) && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-accent hover:text-accent-hover"
              >
                Tout marquer comme lu
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="text-center text-ink-muted text-sm py-8">Aucune notification.</p>
          ) : (
            notifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`w-full text-left px-4 py-3 border-b border-line/60 hover:bg-sunken transition-colors flex gap-2 items-start ${
                  notification.isRead ? "opacity-60" : ""
                }`}
              >
                {!notification.isRead && (
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-ink leading-relaxed">{notification.message}</p>
                  <p className="text-[10px] text-ink-muted mt-1">{formatDate(notification.createdAt)}</p>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
