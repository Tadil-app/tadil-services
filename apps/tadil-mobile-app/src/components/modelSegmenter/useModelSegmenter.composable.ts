import { ref, nextTick, type Ref } from "vue";
interface Point {
  x: number;
  y: number;
}

interface CanvasDrawingComposable {
  canvasRef: Ref<HTMLCanvasElement | null>;
  imageRef: Ref<HTMLImageElement | null>;
  canvasWidth: Ref<number>;
  canvasHeight: Ref<number>;
  initCanvas: () => void;
  highlightPolygon: (polygon: Point[]) => void;
  unhighlightPolygon: () => void;
}

export function useModelSegmenter(): CanvasDrawingComposable {
  const canvasRef = ref<HTMLCanvasElement | null>(null);
  const imageRef = ref<HTMLImageElement | null>(null);
  const canvasWidth = ref<number>(0);
  const canvasHeight = ref<number>(0);
  const isDrawing = ref<boolean>(false);
  const highlightedPolygon = ref<Point[]>([]);
  let context: CanvasRenderingContext2D | null = null;
  function initCanvas() {
    isDrawing.value = false;

    const img = imageRef.value;
    const Canvas = canvasRef.value;

    if (!img || !Canvas) return;

    canvasWidth.value = img.naturalWidth;
    canvasHeight.value = img.naturalHeight;

    nextTick(() => {
      context = Canvas.getContext("2d");
      if (context) {
        context.drawImage(img, 0, 0, canvasWidth.value, canvasHeight.value);
        redrawCanvas();
      }
    });
  }

  function highlightPolygon(polygon: Point[]) {
    highlightedPolygon.value = polygon;
    redrawCanvas();
  }

  function unhighlightPolygon() {
    highlightedPolygon.value = [];
    redrawCanvas();
  }

  function drawPolygon() {
    if (highlightedPolygon.value.length < 2 || !context) return;

    context.beginPath();
    context.moveTo(
      highlightedPolygon.value[0]!.x,
      highlightedPolygon.value[0]!.y
    );
    for (let i = 1; i < highlightedPolygon.value.length; i++) {
      context.lineTo(
        highlightedPolygon.value[i]!.x,
        highlightedPolygon.value[i]!.y
      );
    }

    context.closePath();
    context.fillStyle = "rgba(188, 85, 54, 0.3)";
    context.fill();
    context.strokeStyle = "rgba(188, 85, 54, 1)";
    context.lineWidth = 1;
    context.stroke();
  }

  function redrawCanvas() {
    if (!context || !imageRef.value) return;
    context.clearRect(0, 0, canvasWidth.value, canvasHeight.value);
    context.drawImage(
      imageRef.value,
      0,
      0,
      canvasWidth.value,
      canvasHeight.value
    );
    drawPolygon();
  }

  return {
    canvasRef,
    imageRef,
    canvasWidth,
    canvasHeight,
    initCanvas,
    highlightPolygon,
    unhighlightPolygon,
  };
}
