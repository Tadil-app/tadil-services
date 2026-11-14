import { Capacitor } from "@capacitor/core";
import { Haptics, NotificationType } from "@capacitor/haptics";
import {
  FirebaseMessaging,
  Importance,
  Visibility,
  type Notification,
} from "@capacitor-firebase/messaging";
import { toastController } from "@ionic/vue";
import type { Router } from "vue-router";
import i18n from "@/i18n/i18n";
import { apiClient } from "@/integration/api";
import type { RegisterDeviceDto } from "@/integration/dtos";
import { getPushOrderPath, isPushRole } from "@/utils/pushRoute.util";

/** Must match ORDERS_CHANNEL_ID in libs/infra/tadil-notifications. */
const ORDERS_CHANNEL_ID = "orders";

type Session = { role: string };

let router: Router | undefined;
let waitForSession: () => Promise<Session> = async () => ({ role: "" });
let currentRole = "";
let registeredToken: string | null = null;
const orderPushListeners = new Set<() => void>();

const isNative = () => Capacitor.isNativePlatform();

/**
 * Called by the tailor and driver layouts: runs when an order alert arrives
 * while the app is open, so their lists show the new order at once.
 */
export function onOrderPush(listener: () => void): () => void {
  orderPushListeners.add(listener);
  return () => orderPushListeners.delete(listener);
}

/**
 * Hooks the push events once, at start. Taps are listened to before the app
 * mounts so the tap that launched the app is not lost.
 */
export async function initPushNotifications(
  appRouter: Router,
  sessionReady: () => Promise<Session>,
): Promise<void> {
  router = appRouter;
  waitForSession = sessionReady;
  if (!isNative()) return;

  await FirebaseMessaging.addListener("notificationActionPerformed", ({ notification }) => {
    void openOrderFromPush(notification);
  });
  await FirebaseMessaging.addListener("notificationReceived", ({ notification }) => {
    void showForegroundAlert(notification);
  });
  await FirebaseMessaging.addListener("tokenReceived", ({ token }) => {
    // FCM rotated the token: tell the server, if someone is signed in.
    if (isPushRole(currentRole)) void sendToken(token);
  });

  if (Capacitor.getPlatform() === "android") {
    await FirebaseMessaging.createChannel({
      id: ORDERS_CHANNEL_ID,
      name: i18n.global.t("common.push.channelName"),
      importance: Importance.High,
      vibration: true,
      visibility: Visibility.Public,
    }).catch((error) => console.error("[push] channel", error));
  }
}

/**
 * After sign-in (or app start with a saved session): asks the tailor or
 * driver for permission once, then links this phone to their account.
 * Customers are not asked; they get no pushes yet.
 */
export async function enablePushForSession(role: string): Promise<void> {
  currentRole = role;
  if (!isNative() || !isPushRole(role)) return;
  try {
    let { receive } = await FirebaseMessaging.checkPermissions();
    if (receive === "prompt" || receive === "prompt-with-rationale") {
      ({ receive } = await FirebaseMessaging.requestPermissions());
    }
    if (receive !== "granted") return;

    const { token } = await FirebaseMessaging.getToken();
    if (token) await sendToken(token);
  } catch (error) {
    console.error("[push] Could not enable push notifications", error);
  }
}

/** The language changed: alerts should follow it. */
export async function refreshPushLocale(): Promise<void> {
  if (registeredToken && isPushRole(currentRole)) await sendToken(registeredToken);
}

/**
 * Before the session is cleared: detaches this phone from the account, and
 * drops the token itself so even a forced sign-out (expired session, where
 * the server call fails) stops alerts on this phone.
 */
export async function disablePushForSession(): Promise<void> {
  const token = registeredToken;
  currentRole = "";
  registeredToken = null;
  if (!isNative() || !token) return;
  try {
    await apiClient.devicesControllerUnregister(token);
  } catch {
    /* the token is deleted below anyway */
  }
  try {
    await FirebaseMessaging.deleteToken();
  } catch (error) {
    console.error("[push] Could not delete the push token", error);
  }
}

async function sendToken(token: string): Promise<void> {
  const dto: RegisterDeviceDto = {
    token,
    platform: Capacitor.getPlatform() === "ios" ? "ios" : "android",
    locale: i18n.global.locale.value as RegisterDeviceDto["locale"],
  };
  try {
    await apiClient.devicesControllerRegister(dto);
    registeredToken = token;
  } catch (error) {
    console.error("[push] Could not register this phone", error);
  }
}

function pushData(notification: Notification): Record<string, unknown> {
  return (notification.data ?? {}) as Record<string, unknown>;
}

async function openOrderFromPush(notification: Notification): Promise<void> {
  if (!router) return;
  const { role } = await waitForSession();
  const path = getPushOrderPath(role, pushData(notification));
  if (!path) return;
  await router.isReady();
  await router.push(path);
}

async function showForegroundAlert(notification: Notification): Promise<void> {
  const path = getPushOrderPath(currentRole, pushData(notification));
  if (!path) return;

  orderPushListeners.forEach((listener) => listener());
  void Haptics.notification({ type: NotificationType.Success }).catch(() => undefined);

  const toast = await toastController.create({
    header: notification.title,
    message: notification.body,
    position: "top",
    color: "primary",
    duration: 8000,
    buttons: [
      {
        text: i18n.global.t("common.push.open"),
        handler: () => void router?.push(path),
      },
    ],
  });
  await toast.present();
}
