const CALLBACK = "__tadilGoogleMapsReady";
let loading: Promise<void> | null = null;

/**
 * Loads the Google Maps JS API once. `language` sets the map's label language
 * and only applies to the first load (Google cannot switch it afterwards).
 */
export function loadGoogleMaps(language = "ar"): Promise<void> {
  loading ??= new Promise<void>((resolve, reject) => {
    const key = import.meta.env.VITE_GOOGLE_MAPS_KEY;
    if (!key) return reject(new Error("VITE_GOOGLE_MAPS_KEY is not set"));
    (window as unknown as Record<string, () => void>)[CALLBACK] = () => resolve();
    const script = document.createElement("script");
    script.src =
      "https://maps.googleapis.com/maps/api/js" +
      `?key=${encodeURIComponent(key)}&language=${encodeURIComponent(language)}` +
      `&region=SA&loading=async&callback=${CALLBACK}`;
    script.async = true;
    script.onerror = () => {
      // Allow a retry next time the picker opens (e.g. after going online).
      loading = null;
      script.remove();
      reject(new Error("Google Maps failed to load"));
    };
    document.head.appendChild(script);
  });
  return loading;
}
