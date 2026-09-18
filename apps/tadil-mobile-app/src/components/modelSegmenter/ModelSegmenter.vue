<template>
  <div
    class="aspect-3/4 h-full w-full flex items-center justify-center bg-primary/10 overflow-hidden"
  >
    <img
      ref="imageRef"
      :src="computedImageUrl"
      :alt="alt"
      @load="drawAnnotations"
      class="max-h-full hidden"
    />
    <canvas
      ref="canvasRef"
      class="max-h-full mx-auto"
      :width="canvasWidth"
      :height="canvasHeight"
      @click="getOriginalImageCoords"
    />
  </div>
</template>

<script setup lang="ts">
import { Point } from '@/integration/dtos';
import { useModelSegmenter } from './useModelSegmenter.composable';
import { onBeforeUnmount, onMounted, computed, nextTick, watch } from 'vue';
import { resolveMediaSrc } from '@/utils';

const props = withDefaults(
  defineProps<{
    imageUrl: string;
    sections: Point[][];
    points?: Point[];
    alt?: string;
  }>(),
  {
    points: () => [],
  }
);

const emit = defineEmits<{
  (e: 'segmenter:clicked', clickPosition: Point): void;
}>();

const computedImageUrl = computed(() => resolveMediaSrc(props.imageUrl) || '');

const {
  canvasRef,
  imageRef,
  canvasWidth,
  canvasHeight,
  initCanvas,
  highlightPolygons,
  highlightPoints,
  unhighlightPolygons,
} = useModelSegmenter();

function drawAnnotations() {
  initCanvas();
  nextTick(() => {
    highlightPolygons(props.sections);
    highlightPoints(props.points);
  });
}

function tryDrawFromCache() {
  const img = imageRef.value;
  if (img && img.complete && img.naturalWidth > 0) {
    drawAnnotations();
  }
}

onMounted(tryDrawFromCache);

watch(computedImageUrl, async () => {
  await nextTick();
  tryDrawFromCache();
});

watch(
  [() => props.sections, () => props.points],
  () => {
    highlightPolygons(props.sections);
    highlightPoints(props.points);
  },
  { deep: true }
);

function getOriginalImageCoords(event: MouseEvent) {
  const canvas = canvasRef.value;
  const img = imageRef.value;
  if (!canvas || !img) return;

  const rect = canvas.getBoundingClientRect();

  // 1. Calculate the click position relative to the displayed canvas element
  const xClient = event.clientX - rect.left;
  const yClient = event.clientY - rect.top;

  // 2. Calculate the scaling factor
  const scaleX = img.naturalWidth / rect.width;
  const scaleY = img.naturalHeight / rect.height;

  // 3. Convert to original image coordinates
  const xOriginal = xClient * scaleX;
  const yOriginal = yClient * scaleY;

  const clickPoint = { x: Math.round(xOriginal), y: Math.round(yOriginal) };
  emit('segmenter:clicked', clickPoint);
}

onBeforeUnmount(() => {
  unhighlightPolygons();
});
</script>
