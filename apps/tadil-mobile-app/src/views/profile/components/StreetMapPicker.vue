<template>
  <IonHeader>
    <IonToolbar>
      <IonButtons slot="start">
        <IonButton @click="emit('cancel')">{{ $t("common.buttons.cancel") }}</IonButton>
      </IonButtons>
      <IonTitle>{{ $t("profileSettings.profile.pickOnMap") }}</IonTitle>
      <IonButtons slot="end">
        <IonButton :strong="true" @click="confirm">{{ $t("common.buttons.save") }}</IonButton>
      </IonButtons>
    </IonToolbar>
  </IonHeader>
  <IonContent :scroll-y="false">
    <div class="map-wrap">
      <div ref="mapEl" class="map-container"></div>
      <!-- Fixed crosshair pin: the chosen point is whatever sits under it. -->
      <div class="center-pin">📍</div>
      <div class="map-hint">{{ $t("profileSettings.profile.mapHint") }}</div>
      <div class="coord-readout">{{ picked.lat.toFixed(5) }}, {{ picked.lng.toFixed(5) }}</div>
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
} from "@ionic/vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import {
  isInsideBoundary,
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

const TILE_URL =
  (import.meta.env.VITE_MAP_TILE_URL as string | undefined) ||
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

const mapEl = ref<HTMLDivElement | null>(null);
let map: L.Map | null = null;
let resizeObserver: ResizeObserver | null = null;
let boundaryLayer: L.GeoJSON | null = null;
// Guards against the programmatic snap pan re-triggering another snap.
let snapping = false;
const start = props.initial ?? props.center;
const picked = reactive({ lat: start.lat, lng: start.lng });

/** Centres the map on the pin, the boundary, or the city, in that order. */
function resetView() {
  if (!map) return;
  if (props.initial) {
    map.setView([props.initial.lat, props.initial.lng], props.zoom ?? 13);
  } else if (boundaryLayer) {
    map.fitBounds(boundaryLayer.getBounds(), { padding: [24, 24] });
  } else {
    map.setView([props.center.lat, props.center.lng], props.zoom ?? 13);
  }
}

onMounted(() => {
  if (!mapEl.value) return;

  map = L.map(mapEl.value, { zoomControl: true });

  L.tileLayer(TILE_URL, {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  // Draw the allowed area so the user can see where they may drop the pin.
  if (props.boundary) {
    boundaryLayer = L.geoJSON(
      { type: "Feature", geometry: props.boundary, properties: {} } as never,
      {
        style: {
          color: "#3880ff",
          weight: 2,
          fillColor: "#3880ff",
          fillOpacity: 0.08,
        },
        interactive: false,
      }
    ).addTo(map);
  }

  resetView();

  // The selected point is always the map center under the fixed pin.
  const sync = () => {
    if (!map) return;
    const c = map.getCenter();
    picked.lat = c.lat;
    picked.lng = c.lng;
  };
  map.on("move", sync);

  // When a gesture settles, snap the centre back inside the boundary if it
  // drifted out. The `snapping` guard stops the snap pan from looping.
  map.on("moveend", () => {
    if (!map || !props.boundary) return;
    if (snapping) {
      snapping = false;
      return;
    }
    const c = map.getCenter();
    if (!isInsideBoundary({ lat: c.lat, lng: c.lng }, props.boundary)) {
      const s = snapInsideBoundary({ lat: c.lat, lng: c.lng }, props.boundary);
      snapping = true;
      map.panTo([s.lat, s.lng]);
    }
  });

  // Tap anywhere to drop the pin there: pan the tapped point to the center
  // (under the fixed pin), which fires move/moveend and snaps if needed.
  map.on("click", (e: L.LeafletMouseEvent) => {
    map?.panTo(e.latlng);
  });

  // Inside an Ionic modal the container is 0x0 while the present animation
  // runs, so Leaflet measures the wrong size and renders gray tiles / maps
  // taps to wrong coordinates. Recompute size whenever the container resizes,
  // which reliably fires once the modal is laid out (more robust than a fixed
  // timeout on real devices).
  resizeObserver = new ResizeObserver(() => {
    if (!map) return;
    map.invalidateSize();
    resetView();
    sync();
    // Only the initial sizing needs the re-fit; stop after first real size.
    if (mapEl.value && mapEl.value.clientHeight > 0) {
      resizeObserver?.disconnect();
      resizeObserver = null;
    }
  });
  resizeObserver.observe(mapEl.value);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
  map?.remove();
  map = null;
});

function confirm() {
  const c = map ? map.getCenter() : picked;
  let lat = c.lat;
  let lng = c.lng;
  // Final guard: never emit a point outside the allowed area.
  if (props.boundary) {
    const s = snapInsideBoundary({ lat, lng }, props.boundary);
    lat = s.lat;
    lng = s.lng;
  }
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
.map-hint {
  position: absolute;
  bottom: 56px;
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
.coord-readout {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--ion-color-primary);
  color: #fff;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  z-index: 1000;
  pointer-events: none;
}
</style>
