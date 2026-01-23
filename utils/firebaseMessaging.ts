import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
  type Messaging,
} from "firebase/messaging";

type FirebaseClientConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
};

let firebaseApp: FirebaseApp | null = null;
let messaging: Messaging | null = null;
let swRegistration: ServiceWorkerRegistration | null = null;

function getEnvConfig(): FirebaseClientConfig | null {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId =
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
  const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

  if (
    !apiKey ||
    !authDomain ||
    !projectId ||
    !storageBucket ||
    !messagingSenderId ||
    !appId
  ) {
    return null;
  }

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId,
  };
}

export async function registerMessagingServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined") return null;
  if (!("serviceWorker" in navigator)) return null;

  // Register the SW
  swRegistration = await navigator.serviceWorker.register(
    "/firebase-messaging-sw.js"
  );

  // Ensure it's ready and has a controller to receive messages
  const readyReg = await navigator.serviceWorker.ready;

  // Post Firebase config to the SW to initialize messaging there
  const config = getEnvConfig();
  if (config) {
    // Prefer active controller; fall back to registration.active
    const target = navigator.serviceWorker.controller || readyReg.active;
    target?.postMessage({
      type: "INIT_FIREBASE",
      config,
    });
  }

  return readyReg;
}

export async function ensureFirebaseClient(): Promise<{
  app: FirebaseApp | null;
  messaging: Messaging | null;
}> {
  if (firebaseApp && messaging) {
    return { app: firebaseApp, messaging };
  }

  const supported = await isSupported().catch(() => false);
  if (!supported) {
    return { app: null, messaging: null };
  }

  const config = getEnvConfig();
  if (!config) {
    return { app: null, messaging: null };
  }

  firebaseApp = initializeApp(config);
  messaging = getMessaging(firebaseApp);
  return { app: firebaseApp, messaging };
}

export async function requestPermissionAndGetToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  if (!("Notification" in window)) return null;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    return null;
  }

  const { messaging: msg } = await ensureFirebaseClient();
  if (!msg) return null;

  // Ensure SW is registered for messaging if available
  if (!swRegistration) {
    await registerMessagingServiceWorker().catch(() => null);
  }

  const token = await getToken(msg, {
    serviceWorkerRegistration: swRegistration ?? undefined,
  }).catch(() => null);

  return token ?? null;
}

export function subscribeForegroundMessages(
  handler: (payload: import("firebase/messaging").MessagePayload) => void
) {
  if (typeof window === "undefined") return;
  ensureFirebaseClient().then(({ messaging: msg }) => {
    if (!msg) return;
    onMessage(msg, handler);
  });
}
