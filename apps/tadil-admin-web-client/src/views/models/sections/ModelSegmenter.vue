<template>
  <div
    class="relative w-full h-[600px] flex items-center justify-center bg-muted/5 border border-border rounded-lg overflow-hidden"
  >
    <img
      :src="imageBase64String"
      ref="imageRef"
      @load="initCanvas(sections)"
      class="hidden"
    />
    <div class="relative max-w-full max-h-full p-2">
      <canvas
        ref="canvasRef"
        class="max-w-full max-h-[580px] object-contain block mx-auto shadow-sm"
        :class="{
          'cursor-crosshair': isDrawing,
          'cursor-default': !isDrawing,
        }"
        :width="canvasWidth"
        :height="canvasHeight"
        @click="startPolygon"
        @mousemove="drawTrackingLine"
        tabindex="0"
        @focusin="onCanvasFocusChange(true)"
        @focusout="onCanvasFocusChange(false)"
        @keyup.esc="stopDrawing"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  type Point,
  useCanvasDrawing,
  type CanvasDrawingComposable,
} from "./useCanvasDrawing.composable";
import { watch } from "vue";

const props = defineProps<{
  imageBase64String: string;
  sections: Point[][];
  drawingState?: CanvasDrawingComposable;
}>();

const {
  canvasRef,
  imageRef,
  canvasWidth,
  canvasHeight,
  isDrawing,
  initCanvas,
  stopDrawing,
  startPolygon,
  drawTrackingLine,
  onCanvasFocusChange,
} = props.drawingState || useCanvasDrawing();

watch(
  () => [props.imageBase64String, props.sections],
  () => {
    initCanvas(props.sections);
  },
);
</script>
