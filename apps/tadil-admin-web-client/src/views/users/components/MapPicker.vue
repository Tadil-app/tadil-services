<template>
  <div class="fixed inset-0 z-[60] flex flex-col bg-background">
    <div class="flex items-center justify-between gap-3 border-b px-4 py-3">
      <div>
        <h2 class="text-lg font-semibold">
          {{ $t("users.address.pickOnMap") }}
        </h2>
        <p class="text-sm text-muted-foreground">
          {{ $t("users.address.mapHint") }}
        </p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" @click="emit('cancel')">
          {{ $t("common.buttons.cancel") }}
        </Button>
        <Button @click="confirm">
          {{ $t("common.buttons.save") }}
        </Button>
      </div>
    </div>

    <div class="relative flex-1">
      <div ref="mapEl" class="absolute inset-0"></div>
      <div class="center-pin">📍</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "@/components/ui/Button.vue";
import {
  isInsideBoundary,
  snapInsideBoundary,
  type BoundaryGeometry,
} from "@/utils/geofence.util";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";

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
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  if (props.boundary) {
    boundaryLayer = L.geoJSON(
      { type: "Feature", geometry: props.boundary, properties: {} } as never,
      {
        style: {
          color: "#2563eb",
          weight: 2,
          fillColor: "#2563eb",
          fillOpacity: 0.08,
        },
        interactive: false,
      },
    ).addTo(map);
  }

  resetView();

  const sync = () => {
    if (!map) return;
    const c = map.getCenter();
    picked.lat = c.lat;
    picked.lng = c.lng;
  };
  map.on("move", sync);

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

  map.on("click", (e: L.LeafletMouseEvent) => {
    map?.panTo(e.latlng);
  });

  // The map starts hidden/0-sized for a tick while the overlay mounts, so
  // Leaflet measures the wrong size and renders gray tiles. Recompute size
  // once the container has real dimensions.
  resizeObserver = new ResizeObserver(() => {
    if (!map) return;
    map.invalidateSize();
    resetView();
    sync();
    if (mapEl.value && mapEl.value.clientHeight > 0) {
      resizeObserver?.disconnect();
      resizeObserver = null;
    }
  });
  resizeObserver.observe(mapEl.value);

  // Belt-and-braces: also force a resize on the next frame in case the
  // observer doesn't fire (container already sized at mount).
  requestAnimationFrame(() => {
    map?.invalidateSize();
    resetView();
    sync();
  });
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
.center-pin {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1000;
  font-size: 2rem;
  line-height: 1;
  pointer-events: none;
  transform: translate(-50%, -100%);
}
</style>
