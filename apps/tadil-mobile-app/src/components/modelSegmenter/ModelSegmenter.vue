<template>
  <div
    class="aspect-3/4 h-full w-full flex items-center justify-center bg-primary/10 overflow-hidden"
  >
    <img
      ref="imageRef"
      :src="computedImageUrl"
      :alt="alt"
      @load="initCanvas(), highlightPolygon(section)"
      class="max-h-full hidden"
    />
    <canvas
      ref="canvasRef"
      class="max-h-full mx-auto"
      :width="canvasWidth"
      :height="canvasHeight"
    />
  </div>
</template>

<script setup lang="ts">
import { Point } from "@/integration/dtos";
import { useModelSegmenter } from "./useModelSegmenter.composable";
import { onBeforeUnmount, computed } from "vue";
import { Capacitor } from "@capacitor/core";

const props = defineProps<{
  imageUrl: string;
  section: Point[];
  alt?: string;
}>();

const computedImageUrl = computed(() => {
  if (!props.imageUrl) return "";
  if (
    props.imageUrl.startsWith("file://") ||
    props.imageUrl.startsWith("content://") ||
    props.imageUrl.startsWith("/")
  ) {
    return Capacitor.convertFileSrc(props.imageUrl);
  }
  return props.imageUrl;
});

const {
  canvasRef,
  imageRef,
  canvasWidth,
  canvasHeight,
  initCanvas,
  highlightPolygon,
  unhighlightPolygon,
} = useModelSegmenter();

onBeforeUnmount(() => {
  unhighlightPolygon();
});
</script>
