import { ref, nextTick, type Ref } from "vue";
interface Point {
  x: number;
  y: number;
}

interface CanvasDrawingComposable {
  previewCanvasRef: Ref<HTMLCanvasElement | null>;
  previewImageRef: Ref<HTMLImageElement | null>;
  previewCanvasWidth: Ref<number>;
  previewCanvasHeight: Ref<number>;
  isCanvasFocused: Ref<boolean>;
  isDrawing: Ref<boolean>;
  completedPolygons: Ref<Point[][]>;
  currentPolygon: Ref<Point[]>;
  initCanvas: (polygons: Point[][]) => void;
  loadSavedPolygons: (polygons: Point[][]) => void;
  highlightPolygon: (polygon: Point[]) => void;
  unhighlightPolygon: () => void;
  startDrawing: () => void;
  stopDrawing: () => void;
  redrawCanvas: () => void;
  startPolygon: (event: MouseEvent) => void;
  drawTrackingLine: (event: MouseEvent) => void;
  completePolygon: () => Point[];
  removeLastPolygon: () => void;
  onCanvasFocusChange: (isFocused: boolean) => void;
}

const previewCanvasRef = ref<HTMLCanvasElement | null>(null);
const previewImageRef = ref<HTMLImageElement | null>(null);
const previewCanvasWidth = ref<number>(0);
const previewCanvasHeight = ref<number>(0);
const isCanvasFocused = ref<boolean>(false);
export function usePreviewCanvasDrawing(): CanvasDrawingComposable {
  const isDrawing = ref<boolean>(false);
  const currentPolygon = ref<Point[]>([]);
  const completedPolygons = ref<Point[][]>([]);
  const highlightedPolygon = ref<Point[]>([]);
  let context: CanvasRenderingContext2D | null = null;
  function initCanvas(polygons: Point[][]) {
    completedPolygons.value = [];
    currentPolygon.value = [];
    isDrawing.value = false;

    const img = previewImageRef.value;
    const previewCanvas = previewCanvasRef.value;

    if (!img || !previewCanvas) return;

    previewCanvasWidth.value = img.naturalWidth;
    previewCanvasHeight.value = img.naturalHeight;

    nextTick(() => {
      context = previewCanvas.getContext("2d");
      if (context) {
        context.drawImage(img, 0, 0, previewCanvasWidth.value, previewCanvasHeight.value);
        completedPolygons.value = polygons;
        redrawCanvas();
      }
    });
  }

  function loadSavedPolygons(polygons: Point[][]) {
    completedPolygons.value = polygons;
    redrawCanvas();
  }

  function highlightPolygon(polygon: Point[]) {
    highlightedPolygon.value = polygon;
    redrawCanvas();
  }

  function unhighlightPolygon() {
    highlightedPolygon.value = [];
    redrawCanvas();
  }

  function startDrawing() {
    isDrawing.value = true;
  }

  function stopDrawing() {
    currentPolygon.value = [];
    isDrawing.value = false;
    redrawCanvas();
  }

  function drawPolygon(
    points: Point[],
    fillStyle: string = "green",
    strokeStyle: string = "green",
    isClosed: boolean = true
  ) {
    if (points.length < 2 || !context) return;

    context.beginPath();
    context.moveTo(points[0]!.x, points[0]!.y);
    for (let i = 1; i < points.length; i++) {
      context.lineTo(points[i]!.x, points[i]!.y);
    }

    // Close the shape if it's a completed polygon
    if (isClosed) {
      context.closePath();
    }

    context.fillStyle = fillStyle;
    context.fill();
    context.strokeStyle = strokeStyle;
    context.lineWidth = 1;
    context.stroke();
  }

  function redrawCanvas() {
    if (!context || !previewImageRef.value) return;

    // 1. Clear the previewCanvas
    context.clearRect(0, 0, previewCanvasWidth.value, previewCanvasHeight.value);

    // 2. Redraw the image
    context.drawImage(
      previewImageRef.value,
      0,
      0,
      previewCanvasWidth.value,
      previewCanvasHeight.value
    );

    // 3. Redraw all completed polygons
    completedPolygons.value.forEach((p) =>
      drawPolygon(p, "rgba(0, 255, 0, 0.3)", "green", true)
    );

    // 4. Redraw the current polygon in progress (not closed)
    drawPolygon(currentPolygon.value, "rgba(0, 150, 255, 0.3)", "blue", false);

    // 5. Highlight hovered polygon
    if (highlightedPolygon.value.length > 0) {
      drawPolygon(
        highlightedPolygon.value,
        "rgba(255, 0, 0, 0.3)",
        "red",
        true
      );
    }
  }

  function getCanvasCoords(event: MouseEvent): Point {
    const previewCanvas = previewCanvasRef.value;
    if (!previewCanvas) return { x: 0, y: 0 };

    const rect = previewCanvas.getBoundingClientRect();
    const scaleX = previewCanvas.width / rect.width;
    const scaleY = previewCanvas.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    return { x: Math.round(x), y: Math.round(y) };
  }

  function startPolygon(event: MouseEvent) {
    if (!isDrawing.value) return;

    const { x, y } = getCanvasCoords(event);
    currentPolygon.value.push({ x, y });
    redrawCanvas();
  }

  function drawTrackingLine(event: MouseEvent) {
    if (!isDrawing.value || currentPolygon.value.length < 1 || !context) return;

    const { x, y } = getCanvasCoords(event);

    redrawCanvas();

    // Draw temporary line
    context.beginPath();
    const lastPoint = currentPolygon.value[currentPolygon.value.length - 1];
    context.moveTo(lastPoint!.x, lastPoint!.y);
    context.lineTo(x, y);
    context.strokeStyle = "rgba(0, 0, 0, 1)";
    context.setLineDash([]);
    context.lineWidth = 1;
    context.stroke();
    context.setLineDash([]);
  }

  function completePolygon(): Point[] {
    if (currentPolygon.value.length < 3) {
      currentPolygon.value = [];
      isDrawing.value = false;
      redrawCanvas();
      return [];
    }

    // Clone the polygon and store it
    const newPolygon = [...currentPolygon.value];
    completedPolygons.value.push(newPolygon);

    // Reset state for the next polygon
    currentPolygon.value = [];
    isDrawing.value = false;

    redrawCanvas();
    return newPolygon;
  }

  function removeLastPolygon() {
    completedPolygons.value.pop();
    redrawCanvas();
  }

  function onCanvasFocusChange(isFocused: boolean) {
    isCanvasFocused.value = isFocused;
  }

  return {
    previewCanvasRef,
    previewImageRef,
    previewCanvasWidth,
    previewCanvasHeight,
    isCanvasFocused,
    isDrawing,
    completedPolygons,
    currentPolygon,
    initCanvas,
    loadSavedPolygons,
    highlightPolygon,
    unhighlightPolygon,
    startDrawing,
    stopDrawing,
    startPolygon,
    drawTrackingLine,
    redrawCanvas,
    completePolygon,
    removeLastPolygon,
    onCanvasFocusChange,
  };
}
