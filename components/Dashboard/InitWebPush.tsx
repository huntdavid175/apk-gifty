"use client";

import { useEffect } from "react";
import {
  registerMessagingServiceWorker,
  requestPermissionAndGetToken,
} from "@/utils/firebaseMessaging";
import { subscribeForegroundMessages } from "@/utils/firebaseMessaging";

export default function InitWebPush() {
  function playNotificationSound() {
    try {
      const audio = new Audio("/audio/notification.ogg");
      audio.volume = 1.0;
      audio.play().catch(() => {});
    } catch {
      // ignore audio errors
    }
  }

  function appendNotificationToLocalStorage(entry: {
    id: string;
    title: string;
    body?: string;
    url?: string;
    timestamp: string;
    read: boolean;
  }) {
    try {
      const raw = localStorage.getItem("notifications");
      const list = raw ? JSON.parse(raw) : [];
      list.push(entry);
      localStorage.setItem("notifications", JSON.stringify(list));
      // notify UI listeners
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("notifications-updated"));
      }
    } catch {
      // ignore storage errors
    }
  }

  useEffect(() => {
    (async () => {
      try {
        await registerMessagingServiceWorker();
        const token = await requestPermissionAndGetToken();
        if (token) {
          try {
            localStorage.setItem("fcm_token", token);
          } catch {
            // ignore storage errors
          }
          // Send token to local API to persist on backend and log response
          try {
            const res = await fetch("/api/notifications/store-token", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({ token }),
            });
            await res.json().catch(() => ({}));
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error("[Notifications] Store-token API error", err);
          }
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("[Notifications] Initialization failed", err);
      }
    })();
  }, []);

  // Subscribe to foreground messages and SW messages for logging
  useEffect(() => {
    try {
      subscribeForegroundMessages((payload) => {
        try {
          const title =
            (payload as any)?.notification?.title ||
            (payload as any)?.data?.title ||
            "New notification";
          const body =
            (payload as any)?.notification?.body ||
            (payload as any)?.data?.body ||
            "";
          const url = (payload as any)?.data?.url;
          appendNotificationToLocalStorage({
            id: `${Date.now()}`,
            title,
            body,
            url,
            timestamp: new Date().toISOString(),
            read: false,
          });
          playNotificationSound();
          if (
            typeof window !== "undefined" &&
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            const data = (payload as any)?.data || {};

            const notification = new Notification(title, {
              body,
              // Use favicon as a safe default icon
              icon: "/favicon.ico",
              data,
            });

            notification.onclick = (event) => {
              event?.preventDefault?.();
              if (data?.url) {
                window.open(data.url, "_blank");
              }
              notification.close?.();
            };
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error("[Notifications] Foreground notification error", err);
        }
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[Notifications] Failed to subscribe to messages", err);
    }

    const onSWMessage = (event: MessageEvent) => {
      try {
        const m = event?.data;
        if (!m || typeof m !== "object") return;
        if (m.type === "PUSH_MESSAGE" && m.payload) {
          const title =
            m.payload?.notification?.title ||
            m.payload?.data?.title ||
            "New notification";
          const body =
            m.payload?.notification?.body || m.payload?.data?.body || "";
          const url = m.payload?.data?.url;
          appendNotificationToLocalStorage({
            id: `${Date.now()}`,
            title,
            body,
            url,
            timestamp: new Date().toISOString(),
            read: false,
          });
          playNotificationSound();
        }
      } catch {
        // ignore
      }
    };

    if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", onSWMessage);
    }

    return () => {
      if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener("message", onSWMessage);
      }
    };
  }, []);

  return null;
}


