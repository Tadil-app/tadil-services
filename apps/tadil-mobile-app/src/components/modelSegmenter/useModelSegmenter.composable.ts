import { ref, nextTick, type Ref } from 'vue';

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
  highlightPoints: (points: Point[]) => void;
  unhighlightPolygons: () => void;
}

export function scalePercentPoint(point: Point, width: number, height: number): Point {
  return { x: (point.x * width) / 100, y: (point.y * height) / 100 };
}

export function useModelSegmenter(): CanvasDrawingComposable {
  const canvasRef = ref<HTMLCanvasElement | null>(null);
  const imageRef = ref<HTMLImageElement | null>(null);
  const canvasWidth = ref(0);
  const canvasHeight = ref(0);
  const highlightedPolygons = ref<Point[][]>([]);
  const highlightedPoints = ref<Point[]>([]);
  let context: CanvasRenderingContext2D | null = null;

  function initCanvas() {
    const img = imageRef.value;
    const canvas = canvasRef.value;
    if (!img || !canvas) return;

    canvasWidth.value = img.naturalWidth;
    canvasHeight.value = img.naturalHeight;

    nextTick(() => {
      context = canvas.getContext('2d');
      redrawCanvas();
    });
  }

  function highlightPolygons(polygons: Point[][]) {
    highlightedPolygons.value = polygons;
    redrawCanvas();
  }

  function highlightPoints(points: Point[]) {
    highlightedPoints.value = points;
    redrawCanvas();
  }

  function unhighlightPolygons() {
    highlightedPolygons.value = [];
    highlightedPoints.value = [];
    redrawCanvas();
  }

  function drawAnnotations() {
    if (!context) return;

    highlightedPolygons.value.forEach((polygon) => {
      if (polygon.length < 2) return;

      context!.beginPath();
      context!.moveTo(polygon[0]!.x, polygon[0]!.y);
      for (let i = 1; i < polygon.length; i++) {
        context!.lineTo(polygon[i]!.x, polygon[i]!.y);
      }
      context!.closePath();
      context!.fillStyle = '#5f14284d';
      context!.fill();
      context!.strokeStyle = '#5f1428';
      context!.lineWidth = 1;
      context!.stroke();
    });

    highlightedPoints.value.forEach((point) => {
      const scaledPoint = scalePercentPoint(point, canvasWidth.value, canvasHeight.value);
      context!.beginPath();
      context!.arc(scaledPoint.x, scaledPoint.y, Math.max(8, canvasWidth.value * 0.015), 0, Math.PI * 2);
      context!.fillStyle = '#5f1428e6';
      context!.fill();
      context!.strokeStyle = 'white';
      context!.lineWidth = Math.max(2, canvasWidth.value * 0.003);
      context!.stroke();
    });
  }

  function redrawCanvas() {
    if (!context || !imageRef.value) return;
    context.clearRect(0, 0, canvasWidth.value, canvasHeight.value);
    context.drawImage(imageRef.value, 0, 0, canvasWidth.value, canvasHeight.value);
    drawAnnotations();
  }

  return {
    canvasRef,
    imageRef,
    canvasWidth,
    canvasHeight,
    initCanvas,
    highlightPolygons,
    highlightPoints,
    unhighlightPolygons,
  };
}
