import { Capacitor } from "@capacitor/core";
import { AppLauncher } from "@capacitor/app-launcher";

/**
 * Opens a link outside the app: in the phone's browser, or in the app that
 * handles it (Google Maps, Waze...).
 *
 * window.open is not enough in the native app: capacitor.config allows
 * navigation to every host, so Android would load the page inside the app
 * itself, where it cannot print and leaves the user stranded.
 */
export async function openExternalUrl(url: string): Promise<boolean> {
  if (Capacitor.isNativePlatform()) {
    try {
      const { completed } = await AppLauncher.openUrl({ url });
      return completed;
    } catch (error) {
      console.error("Failed to open link outside the app", error);
      return false;
    }
  }
  // No "noopener" feature: with it, window.open always returns null.
  const opened = window.open(url, "_blank");
  if (opened) opened.opener = null;
  return !!opened;
}
