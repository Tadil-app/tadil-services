import { Capacitor } from "@capacitor/core";

export function resolveMediaSrc(url?: string) {
  if (!url) return undefined;
  return url.startsWith("file://") || url.startsWith("content://")
    ? Capacitor.convertFileSrc(url)
    : url;
}
