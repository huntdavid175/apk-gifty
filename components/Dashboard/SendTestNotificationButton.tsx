"use client";

import { useEffect, useState } from "react";

export default function SendTestNotificationButton() {
  const [userId, setUserId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("userInfo");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.id) setUserId(Number(parsed.id));
      }
      const t = localStorage.getItem("fcm_token");
      if (t) setFcmToken(t);
    } catch {
      // ignore
    }
  }, []);

  const handleSend = async () => {
    if (!userId) {
      // no-op
      return;
    }

    const title = window.prompt("Notification title:");
    if (title === null || title.trim() === "") return;
    const messageBody = window.prompt("Notification body:");
    if (messageBody === null || messageBody.trim() === "") return;

    setBusy(true);
    try {
      const res = await fetch("/api/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          user_id: userId,
          title,
          messageBody,
          device_token: fcmToken ?? undefined,
          data: { url: "/dashboard" },
        }),
      });
      const text = await res.text();
      let parsed: any = null;
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = { raw: text };
      }
      // no-op

      // Show a local confirmation notification on successful send
      try {
        if (res.ok && typeof window !== "undefined" && "Notification" in window) {
          if (Notification.permission === "granted") {
            const n = new Notification(title, {
              body: messageBody,
              icon: "/favicon.ico",
              data: { url: "/dashboard" },
            });
            n.onclick = (e) => {
              e?.preventDefault?.();
              if (n?.data?.url) window.open(n.data.url, "_blank");
              n.close?.();
            };
            // Also persist a local entry so dropdown updates immediately
            try {
              const raw = localStorage.getItem("notifications");
              const list = raw ? JSON.parse(raw) : [];
              list.push({
                id: `${Date.now()}`,
                title,
                body: messageBody,
                url: "/dashboard",
                timestamp: new Date().toISOString(),
                read: false,
              });
              localStorage.setItem("notifications", JSON.stringify(list));
              window.dispatchEvent(new CustomEvent("notifications-updated"));
            } catch {
              // ignore
            }
          } else {
            // no-op
          }
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("[Notifications] Local confirmation notification error", e);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[Notifications] Send-notification API error", err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={handleSend}
      disabled={busy || !userId}
      className="px-3 py-1 rounded bg-blue-600 text-white disabled:bg-gray-400"
      title={!userId ? "No user detected" : "Send a test notification"}
      style={{ marginLeft: 8 }}
    >
      {busy ? "Sending..." : "Send Test Notification"}
    </button>
  );
}


