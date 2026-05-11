<template>
  <div class="h-auto w-full mx-auto max-w-[800px]">
    <img
      ref="previewImageRef"
      :src="imageBase64String"
      @load="initCanvas(sections)"
      class="hidden"
    />
    <div class="w-full">
      <canvas
        ref="previewCanvasRef"
        class="max-w-[300px] max-h-[400px] mx-auto"
        :class="{
          'cursor-crosshair': isDrawing,
          'cursor-default': !isDrawing,
        }"
        :width="previewCanvasWidth"
        :height="previewCanvasHeight"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Point } from "@/integration";
import { usePreviewCanvasDrawing } from "./useMobilePreviewCanvasDrawing.composable";
import { watch } from "vue";

const props = defineProps<{
  imageBase64String: string;
  sections: Point[][];
}>();

const {
  // @ts-ignore
  previewCanvasRef,
  // @ts-ignore
  previewImageRef,
  previewCanvasWidth,
  previewCanvasHeight,
  isDrawing,
  initCanvas,
} = usePreviewCanvasDrawing();

watch(
  () => [props.imageBase64String, props.sections],
  () => {
    initCanvas(props.sections);
  }
);
</script>
