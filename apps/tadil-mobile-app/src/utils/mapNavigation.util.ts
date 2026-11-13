export type MapsApp = "google" | "waze" | "apple";

export interface NavigationTarget {
  latitude?: number | null;
  longitude?: number | null;
  /** Readable address, used when the pin has no coordinates. */
  query?: string;
}

function hasCoordinates(target: NavigationTarget): boolean {
  return (
    typeof target.latitude === "number" &&
    typeof target.longitude === "number" &&
    Number.isFinite(target.latitude) &&
    Number.isFinite(target.longitude)
  );
}

/** True when the target holds enough to start navigation. */
export function canNavigateTo(target: NavigationTarget): boolean {
  return hasCoordinates(target) || !!target.query?.trim();
}

/**
 * Builds a driving-directions link for a maps app. These are universal links:
 * the phone opens the installed app, or its website when the app is missing.
 * Coordinates win over the text address since they point at the exact pin.
 */
export function buildNavigationUrl(app: MapsApp, target: NavigationTarget): string | null {
  if (!canNavigateTo(target)) return null;

  const coords = hasCoordinates(target) ? `${target.latitude},${target.longitude}` : null;
  const destination = encodeURIComponent(coords ?? target.query!.trim());

  switch (app) {
    case "google":
      return `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
    case "waze":
      return coords
        ? `https://waze.com/ul?ll=${destination}&navigate=yes`
        : `https://waze.com/ul?q=${destination}&navigate=yes`;
    case "apple":
      return `https://maps.apple.com/?daddr=${destination}&dirflg=d`;
  }
}
