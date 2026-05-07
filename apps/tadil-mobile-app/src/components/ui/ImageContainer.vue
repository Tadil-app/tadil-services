<template>
  <div
    class="aspect-3/4 h-full w-full flex items-center justify-center bg-primary/10 overflow-hidden"
  >
    <span
      v-if="!imageUrl"
      class="w-full h-full flex flex-col items-center justify-center opacity-60"
    >
      <p class="text-xl font-semibold">{{ alt }}</p>
      <Image class="w-12 h-12" />
    </span>
    <img
      v-else
      ref="imageRef"
      :src="imageUrl"
      :alt="alt"
      class="max-h-full"
      loading="lazy"
      @click="getOriginalImageCoords"
    />
  </div>
</template>

<script setup lang="ts">
import { Point } from "@/integration/dtos";
import { Image } from "lucide-vue-next";
import { ref } from "vue";

const imageRef = ref<HTMLImageElement | null>(null);
const emit = defineEmits<{
  (e: "segmenter:clicked", clickPosition: Point): void;
}>();

const props = defineProps<{
  imageUrl?: string;
  alt?: string;
  isSegmenter?: boolean;
}>();

function getOriginalImageCoords(event: MouseEvent) {
  if (!props.isSegmenter) return;
  const img = imageRef.value;
  if (!img) return;

  const rect = img.getBoundingClientRect();

  // 1. Calculate the click position relative to the displayed image element
  const xClient = event.clientX - rect.left;
  const yClient = event.clientY - rect.top;

  // 2. Calculate the scaling factor
  const scaleX = img.naturalWidth / rect.width;
  const scaleY = img.naturalHeight / rect.height;

  // 3. Convert to original image coordinates
  const xOriginal = xClient * scaleX;
  const yOriginal = yClient * scaleY;

  const clickPoint = { x: Math.round(xOriginal), y: Math.round(yOriginal) };
  emit("segmenter:clicked", clickPoint);
}
</script>
