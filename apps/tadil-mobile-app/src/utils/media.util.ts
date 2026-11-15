import { Capacitor } from "@capacitor/core";

export function resolveMediaSrc(url?: string) {
  if (!url) return undefined;
  return url.startsWith("file://") || url.startsWith("content://")
    ? Capacitor.convertFileSrc(url)
    : url;
}

/**
 * The stored file id in a file link from the API. Private files come as
 * signed links (`/api/files/<id>?token=...`), so the query is dropped.
 */
export function fileIdFromUrl(url?: string) {
  if (!url) return "";
  return url.split(/[?#]/)[0].split("/").pop() || "";
}
