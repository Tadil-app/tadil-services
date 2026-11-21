<template>
  <IonHeader>
    <IonToolbar>
      <IonButtons slot="start">
        <IonButton @click="emit('cancel')">{{ $t("common.buttons.cancel") }}</IonButton>
      </IonButtons>
      <IonTitle>{{ $t("profileSettings.profile.pickOnMap") }}</IonTitle>
      <IonButtons slot="end">
        <IonButton :strong="true" :disabled="!ready" @click="confirm">
          {{ $t("common.buttons.save") }}
        </IonButton>
      </IonButtons>
    </IonToolbar>
  </IonHeader>
  <IonContent :scroll-y="false">
    <div class="map-wrap">
      <div ref="mapEl" class="map-container"></div>
      <!-- Fixed crosshair pin: the chosen point is whatever sits under it. -->
      <div class="center-pin">📍</div>
      <button
        type="button"
        class="locate-btn"
        :disabled="!ready || locating"
        :aria-label="$t('profileSettings.profile.locateMe')"
        @click="locateMe"
      >
        <IonSpinner v-if="locating" name="crescent" />
        <IonIcon v-else :icon="locateOutline" />
      </button>
      <div class="map-hint">
        {{ loadError ? $t("profileSettings.profile.mapLoadError") : $t("profileSettings.profile.mapHint") }}
      </div>
      <div v-if="ready" class="place-label">
        {{ labelLoading ? $t("profileSettings.profile.locating") : label || `${picked.lat.toFixed(5)}, ${picked.lng.toFixed(5)}` }}
      </div>
    </div>
  </IonContent>
</template>

<script setup lang="ts">
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonSpinner,
} from "@ionic/vue";
import { Geolocation } from "@capacitor/geolocation";
import { locateOutline } from "ionicons/icons";
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "@/composables/useToast.composable";
import { useLocationsStore } from "@/stores";
import {
  isInsideBoundary,
  loadGoogleMaps,
  snapInsideBoundary,
  type BoundaryGeometry,
} from "@/utils";

const props = defineProps<{
  center: { lat: number; lng: number };
  initial?: { lat: number; lng: number } | null;
  boundary?: BoundaryGeometry | null;
  zoom?: number;
}>();

const emit = defineEmits<{
  (e: "confirm", value: { lat: number; lng: number }): void;
  (e: "cancel"): void;
}>();

const { t, locale } = useI18n();
const { showToast } = useToast();
const locationsStore = useLocationsStore();

const mapEl = ref<HTMLDivElement | null>(null);
const ready = ref(false);
const loadError = ref(false);
const locating = ref(false);
const label = ref("");
const labelLoading = ref(false);
let map: google.maps.Map | null = null;
let boundaryBounds: google.maps.LatLngBounds | null = null;
let resizeObserver: ResizeObserver | null = null;
let labelTimer: ReturnType<typeof setTimeout> | undefined;
// Drops answers from older lookups that finish after a newer one started.
let labelRequest = 0;
// Guards against the programmatic snap pan re-triggering another snap.
let snapping = false;
const start = props.initial ?? props.center;
const picked = reactive({ lat: start.lat, lng: start.lng });

/** Centres the map on the pin, the boundary, or the city, in that order. */
function resetView() {
  if (!map) return;
  if (props.initial) {
    map.setCenter(props.initial);
    map.setZoom(props.zoom ?? 13);
  } else if (boundaryBounds) {
    map.fitBounds(boundaryBounds, 24);
  } else {
    map.setCenter(props.center);
    map.setZoom(props.zoom ?? 13);
  }
}

/** Shows the street and neighbourhood under the pin once the map settles. */
function scheduleLabel() {
  clearTimeout(labelTimer);
  labelLoading.value = true;
  // Debounced so a pan only costs one geocode request when it stops.
  labelTimer = setTimeout(async () => {
    const id = ++labelRequest;
    let text = "";
    try {
      text = await locationsStore.reverseGeocodeOne(picked.lat, picked.lng, locale.value);
    } catch {
      // No label: the readout falls back to coordinates.
    }
    if (id !== labelRequest) return;
    label.value = text;
    labelLoading.value = false;
  }, 600);
}

onMounted(async () => {
  if (!mapEl.value) return;
  try {
    await loadGoogleMaps(locale.value);
  } catch (error) {
    console.error(error);
    loadError.value = true;
    return;
  }
  // The modal may have closed while the script was loading.
  if (!mapEl.value) return;
  const { Map } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;

  map = new Map(mapEl.value, {
    center: start,
    zoom: props.zoom ?? 13,
    // One-finger pan inside the modal instead of the "use two fingers" overlay.
    gestureHandling: "greedy",
    clickableIcons: false,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
  });

  // Draw the allowed area so the user can see where they may drop the pin.
  if (props.boundary) {
    map.data.addGeoJson({ type: "Feature", geometry: props.boundary, properties: {} });
    map.data.setStyle({
      strokeColor: "#3880ff",
      strokeWeight: 2,
      fillColor: "#3880ff",
      fillOpacity: 0.08,
      clickable: false,
    });
    boundaryBounds = new google.maps.LatLngBounds();
    map.data.forEach((f) =>
      f.getGeometry()?.forEachLatLng((ll) => boundaryBounds?.extend(ll))
    );
  }

  resetView();

  // The selected point is always the map center under the fixed pin.
  map.addListener("center_changed", () => {
    const c = map?.getCenter();
    if (!c) return;
    picked.lat = c.lat();
    picked.lng = c.lng();
  });

  // When a gesture settles, snap the centre back inside the boundary if it
  // drifted out, then look up the street name. The `snapping` guard stops the
  // snap pan from looping.
  map.addListener("idle", () => {
    if (!map) return;
    if (props.boundary && !snapping) {
      const c = { lat: picked.lat, lng: picked.lng };
      if (!isInsideBoundary(c, props.boundary)) {
        snapping = true;
        map.panTo(snapInsideBoundary(c, props.boundary));
        return;
      }
    }
    snapping = false;
    scheduleLabel();
  });

  // Tap anywhere to drop the pin there: pan the tapped point under the pin.
  map.addListener("click", (e: google.maps.MapMouseEvent) => {
    if (e.latLng) map?.panTo(e.latLng);
  });

  // Inside an Ionic modal the container is 0x0 while the present animation
  // runs, so the first fit uses the wrong size. Re-fit once it has a real size.
  resizeObserver = new ResizeObserver(() => {
    if (!mapEl.value || mapEl.value.clientHeight === 0) return;
    resetView();
    resizeObserver?.disconnect();
    resizeObserver = null;
  });
  resizeObserver.observe(mapEl.value);
  ready.value = true;
});

onBeforeUnmount(() => {
  clearTimeout(labelTimer);
  resizeObserver?.disconnect();
  resizeObserver = null;
  if (map) google.maps.event.clearInstanceListeners(map);
  map = null;
});

/** Moves the pin to the device's position, if it is inside the allowed area. */
async function locateMe() {
  if (!map) return;
  locating.value = true;
  try {
    const { coords } = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
    });
    const here = { lat: coords.latitude, lng: coords.longitude };
    if (props.boundary && !isInsideBoundary(here, props.boundary)) {
      await showToast({ message: t("profileSettings.profile.outsideServiceArea"), color: "warning" });
      return;
    }
    map.panTo(here);
    map.setZoom(17);
  } catch (error) {
    // Capacitor reports a denied permission as a message, not a code.
    const denied = /denied|permission/i.test(String((error as Error)?.message ?? error));
    await showToast({
      message: t(denied ? "profileSettings.profile.locateDenied" : "profileSettings.profile.locateFailed"),
      color: "warning",
    });
  } finally {
    locating.value = false;
  }
}

function confirm() {
  let { lat, lng } = picked;
  // Final guard: never emit a point outside the allowed area.
  if (props.boundary) ({ lat, lng } = snapInsideBoundary({ lat, lng }, props.boundary));
  emit("confirm", {
    lat: Number(lat.toFixed(6)),
    lng: Number(lng.toFixed(6)),
  });
}
</script>

<style scoped>
.map-wrap {
  position: relative;
  width: 100%;
  height: 100%;
}
.map-container {
  position: absolute;
  inset: 0;
}
/* Pin sits dead-center; its tip marks the chosen coordinate. */
.center-pin {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -100%);
  font-size: 2rem;
  line-height: 1;
  z-index: 1000;
  pointer-events: none;
}
.locate-btn {
  position: absolute;
  top: 12px;
  inset-inline-start: 12px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  background: var(--ion-color-light);
  color: var(--ion-color-primary);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}
.locate-btn:disabled {
  opacity: 0.6;
}
.map-hint {
  position: absolute;
  bottom: 84px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--ion-color-light);
  color: var(--ion-color-dark);
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.8rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  pointer-events: none;
  white-space: nowrap;
}
/* Street and neighbourhood under the pin, large enough to read at a glance.
   Kept above the bottom edge so Google's logo stays visible (required). */
.place-label {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  max-width: calc(100% - 32px);
  background: var(--ion-color-primary);
  color: #fff;
  padding: 8px 16px;
  border-radius: 16px;
  font-size: 0.95rem;
  font-weight: 600;
  text-align: center;
  z-index: 1000;
  pointer-events: none;
}
</style>
