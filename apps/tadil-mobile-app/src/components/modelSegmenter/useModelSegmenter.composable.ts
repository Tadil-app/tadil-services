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
  highlightPolygons: (polygons: Point[][]) => void;
  unhighlightPolygons: () => void;
}

export function useModelSegmenter(): CanvasDrawingComposable {
  const canvasRef = ref<HTMLCanvasElement | null>(null);
  const imageRef = ref<HTMLImageElement | null>(null);
  const canvasWidth = ref<number>(0);
  const canvasHeight = ref<number>(0);
  const isDrawing = ref<boolean>(false);
  const highlightedPolygons = ref<Point[][]>([]);
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

  function highlightPolygons(polygons: Point[][]) {
    highlightedPolygons.value = polygons;
    redrawCanvas();
  }

  function unhighlightPolygons() {
    highlightedPolygons.value = [];
    redrawCanvas();
  }

  function drawPolygons() {
    if (!context) return;

    highlightedPolygons.value.forEach(polygon => {
      if (polygon.length < 2) return;
      
      context!.beginPath();
      context!.moveTo(
        polygon[0]!.x,
        polygon[0]!.y
      );
      for (let i = 1; i < polygon.length; i++) {
        context!.lineTo(
          polygon[i]!.x,
          polygon[i]!.y
        );
      }

      context!.closePath();
      context!.fillStyle = "rgba(188, 85, 54, 0.3)";
      context!.fill();
      context!.strokeStyle = "rgba(188, 85, 54, 1)";
      context!.lineWidth = 1;
      context!.stroke();
    });
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
    drawPolygons();
  }

  return {
    canvasRef,
    imageRef,
    canvasWidth,
    canvasHeight,
    initCanvas,
    highlightPolygons,
    unhighlightPolygons,
  };
}
