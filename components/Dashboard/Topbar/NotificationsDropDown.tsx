"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import Link from "next/link";

interface StoredNotification {
  id: string;
  title: string;
  body?: string;
  url?: string;
  timestamp: string; // ISO
  read: boolean;
}

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ left: 0, top: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<StoredNotification[]>([]);

  function formatTimeAgo(iso: string) {
    const then = new Date(iso).getTime();
    const now = Date.now();
    const diffSec = Math.max(0, Math.floor((now - then) / 1000));
    if (diffSec < 60) return "Just now";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin === 1) return "a minute ago";
    if (diffMin < 60) return `${diffMin} minutes ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr === 1) return "an hour ago";
    if (diffHr < 24) return `${diffHr} hours ago`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay === 1) return "1 day ago";
    if (diffDay < 7) return `${diffDay} days ago`;
    const diffWk = Math.floor(diffDay / 7);
    if (diffWk === 1) return "1 week ago";
    if (diffWk < 4) return `${diffWk} weeks ago`;
    const diffMo = Math.floor(diffDay / 30);
    if (diffMo === 1) return "1 month ago";
    if (diffMo < 12) return `${diffMo} months ago`;
    const diffYr = Math.floor(diffDay / 365);
    if (diffYr === 1) return "1 year ago";
    return `${diffYr} years ago`;
  }

  // Load notifications from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("notifications");
      const list = raw ? (JSON.parse(raw) as StoredNotification[]) : [];
      setItems(list);
    } catch {
      setItems([]);
    }
  }, []);

  // Refresh when dropdown opens or when notifications are updated
  useEffect(() => {
    function refresh() {
      try {
        const raw = localStorage.getItem("notifications");
        const list = raw ? (JSON.parse(raw) as StoredNotification[]) : [];
        setItems(list);
      } catch {
        // ignore
      }
    }
    if (isOpen) refresh();
    const handler = () => refresh();
    window.addEventListener("notifications-updated", handler as EventListener);
    return () => {
      window.removeEventListener("notifications-updated", handler as EventListener);
    };
  }, [isOpen]);

  // Recompute unread count
  const unreadCount = items.filter((n) => !n.read).length;
  const sorted = [...items].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Calculate dropdown position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const left = rect.left + window.scrollX;
      const top = rect.bottom + window.scrollY;

      // For mobile, center the dropdown
      const windowWidth = window.innerWidth;

      if (windowWidth < 640) {
        // Mobile breakpoint
        // Center the dropdown (assuming dropdown width is 320px (w-80))
        setDropdownPosition({
          left: Math.max(
            10,
            Math.min(windowWidth - 330, windowWidth / 2 - 160)
          ),
          top: top,
        });
      } else {
        // For larger screens position to the right of the button
        setDropdownPosition({
          left: Math.max(10, left - 300 + rect.width),
          top: top,
        });
      }
    }
  }, [isOpen]);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        className="p-1.5 rounded-full hover:bg-gray-800 relative"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="fixed z-50 w-80 bg-[#1e2328]  rounded-md shadow-lg"
          style={{
            left: `${dropdownPosition.left}px`,
            top: `${dropdownPosition.top}px`,
          }}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="notifications-menu"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
            <h2 className="text-xs font-medium text-white">Notifications</h2>
            <button
              className="text-xs text-gray-400 hover:text-white"
              onClick={() => {
                try {
                  const next = items.map((n) => ({ ...n, read: true }));
                  setItems(next);
                  localStorage.setItem("notifications", JSON.stringify(next));
                } catch {
                  // ignore
                }
              }}
            >
              Mark as read
            </button>
          </div>

          <div className="py-2 max-h-[400px] overflow-y-auto">
            {items.length === 0 && (
              <div className="px-4 py-6 text-center text-gray-400 text-sm">
                No notifications yet
              </div>
            )}
            {sorted.map((notification) => (
              <div
                key={notification.id}
                className="px-4 py-3 hover:bg-gray-700 cursor-pointer"
                role="menuitem"
                onClick={() => {
                  try {
                    const next = items.map((n) =>
                      n.id === notification.id ? { ...n, read: true } : n
                    );
                    setItems(next);
                    localStorage.setItem(
                      "notifications",
                      JSON.stringify(next)
                    );
                  } catch {
                    // ignore
                  }
                }}
              >
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-white">
                    {notification.body || notification.title}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatTimeAgo(notification.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-gray-700">
            <button
              type="button"
              className="block w-full py-2 text-center text-sm text-white bg-[#587BF2] hover:bg-[#4665D1] rounded-md transition-colors"
              onClick={() => {
                try {
                  setItems([]);
                  localStorage.removeItem("notifications");
                  window.dispatchEvent(new CustomEvent("notifications-updated"));
                } catch {
                  // ignore
                }
              }}
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
