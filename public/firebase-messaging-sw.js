/* eslint-disable no-undef */
/* Firebase Messaging Service Worker
 * Initializes Firebase Messaging inside the service worker after receiving
 * config from the client. This avoids hard-coding config in a static file.
 */

let firebaseInitialized = false;
let messaging = null;

// Lazy-load Firebase compat SDKs when needed
function loadFirebaseCompat() {
  return new Promise((resolve, reject) => {
    try {
      importScripts(
        "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js",
        "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
      );
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

async function initializeFirebaseInSW(config) {
  if (firebaseInitialized) return;

  await loadFirebaseCompat();
  // Initialize the Firebase app in the service worker by passing in the messagingSenderId and config
  firebase.initializeApp(config);
  messaging = firebase.messaging();
  firebaseInitialized = true;

  // Handle background messages
  messaging.onBackgroundMessage((payload) => {
    // Fallback title/body if not provided
    const notificationTitle =
      (payload && payload.notification && payload.notification.title) ||
      "New notification";
    const notificationOptions = {
      body:
        (payload && payload.notification && payload.notification.body) || "",
      icon:
        (payload && payload.notification && payload.notification.icon) ||
        "/icons/icon-192x192.png",
      data: (payload && payload.data) || {},
      // Actions can be added later if needed
    };

    self.registration.showNotification(notificationTitle, notificationOptions);

    // Post message to all open clients so the app can persist to localStorage
    try {
      self.clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then((clientList) => {
          clientList.forEach((client) => {
            client.postMessage({ type: "PUSH_MESSAGE", payload });
          });
        });
    } catch (e) {
      // ignore
    }
  });
}

// Receive config from the client to initialize Firebase in SW
self.addEventListener("message", (event) => {
  const data = event && event.data;
  if (!data || typeof data !== "object") return;

  if (data.type === "INIT_FIREBASE" && data.config) {
    initializeFirebaseInSW(data.config).catch((err) => {
      // eslint-disable-next-line no-console
      console.error("Failed to initialize Firebase in SW", err);
    });
  }
});

// Handle notification clicks to focus/open the app and navigate to a URL if provided
self.addEventListener("notificationclick", (event) => {
  const notification = event.notification;
  const data = (notification && notification.data) || {};
  const targetUrl = data && data.url ? data.url : "/";

  event.notification.close();

  event.waitUntil(
    (async () => {
      const allClients = await clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      let appClient = allClients.find((client) => {
        return (
          new URL(client.url).pathname ===
          new URL(targetUrl, self.location.origin).pathname
        );
      });

      if (appClient) {
        appClient.focus();
        appClient.postMessage({ type: "NOTIFICATION_CLICKED", data });
      } else {
        appClient = await clients.openWindow(targetUrl);
      }
    })()
  );
});
