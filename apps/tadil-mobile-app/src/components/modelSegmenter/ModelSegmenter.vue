<template>
  <div
    class="aspect-3/4 h-full w-full flex items-center justify-center bg-primary/10 overflow-hidden"
  >
    <img
      ref="imageRef"
      :src="imageUrl"
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
import { onBeforeUnmount } from "vue";

defineProps<{
  imageUrl: string;
  section: Point[];
  alt?: string;
}>();

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
