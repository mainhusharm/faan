import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Trash2, Check, Palette } from 'lucide-react';
import { recognizeShape, estimateSize, shapeToObject3D, getBoundingBox, type Point } from '../lib/shapeRecognition';

interface DrawingOverlayProps {
  isActive: boolean;
  selectedColor: string;
  onColorChange: (color: string) => void;
  onShapeRecognized: (objectType: string, color: string, size: number, shapeName: string, aspectRatio?: number, points?: Point[]) => void;
}

export const DrawingOverlay: React.FC<DrawingOverlayProps> = ({
  isActive,
  selectedColor,
  onColorChange,
  onShapeRecognized,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState<Point[]>([]);
  const [recognizedShape, setRecognizedShape] = useState<string | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const colors = [
    { name: 'Red', hex: '#FF0000' },
    { name: 'Blue', hex: '#0000FF' },
    { name: 'Green', hex: '#00FF00' },
    { name: 'Yellow', hex: '#FFFF00' },
    { name: 'Orange', hex: '#FFA500' },
    { name: 'Purple', hex: '#800080' },
    { name: 'Pink', hex: '#FFC0CB' },
    { name: 'Cyan', hex: '#00FFFF' },
    { name: 'Magenta', hex: '#FF00FF' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Black', hex: '#000000' },
    { name: 'Gray', hex: '#808080' },
  ];

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  // Clear canvas when not active
  useEffect(() => {
    if (!isActive) {
      clearCanvas();
    }
  }, [isActive]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setPoints([]);
    setRecognizedShape(null);
  }, []);

  const drawLine = useCallback((ctx: CanvasRenderingContext2D, from: Point, to: Point) => {
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }, [selectedColor]);

  const getCanvasPoint = (e: React.MouseEvent | React.TouchEvent): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isActive) return;

    const point = getCanvasPoint(e);
    if (!point) return;

    setIsDrawing(true);
    setPoints([point]);
    setRecognizedShape(null);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !isActive) return;

    const point = getCanvasPoint(e);
    if (!point) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw line from last point to current point
    if (points.length > 0) {
      const lastPoint = points[points.length - 1];
      drawLine(ctx, lastPoint, point);
    }

    setPoints((prev) => [...prev, point]);
  };

  const handleMouseUp = () => {
    if (!isDrawing || !isActive) return;

    setIsDrawing(false);

    // Show drawing ready to convert (without recognition)
    if (points.length > 5) {
      setRecognizedShape('drawing');
    }
  };

  const handleConvert = () => {
    if (points.length === 0) return;

    const objectType = 'custom_drawing';
    const size = estimateSize(points);
    const bbox = getBoundingBox(points);
    const aspectRatio = bbox.height > 0 ? bbox.width / bbox.height : 1;
    const shapeName = recognizedShape || 'custom drawing';

    onShapeRecognized(objectType, selectedColor, size, shapeName, aspectRatio, points);

    // Clear canvas after conversion
    setTimeout(() => {
      clearCanvas();
    }, 500);
  };

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Drawing Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        className="absolute inset-0 cursor-crosshair pointer-events-auto"
        style={{ 
          touchAction: 'none',
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
        }}
      />

      {/* UI Overlay */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between pointer-events-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 max-w-md">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              🖊️ Draw Mode Active
            </h3>
          </div>
          
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
            Draw any shape on the canvas. Your drawing will be converted to a 3D mesh that matches your input.
          </p>

          <div className="flex items-center space-x-2 mb-3">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Palette className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Color</span>
              <div
                className="w-6 h-6 rounded border-2 border-gray-300 dark:border-gray-600"
                style={{ backgroundColor: selectedColor }}
              />
            </button>
            
            <button
              onClick={clearCanvas}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span className="text-xs font-medium">Clear</span>
            </button>
          </div>

          {/* Color Picker */}
          {showColorPicker && (
            <div className="grid grid-cols-6 gap-2 mb-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              {colors.map((color) => (
                <button
                  key={color.hex}
                  onClick={() => {
                    onColorChange(color.hex);
                    setShowColorPicker(false);
                  }}
                  className={`w-8 h-8 rounded-lg border-2 transition-all ${
                    selectedColor === color.hex
                      ? 'border-indigo-600 scale-110 shadow-lg'
                      : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          )}

          {/* Drawing Ready to Convert */}
          {recognizedShape && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                    ✓ Drawing Ready
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Click to convert your drawing to a 3D mesh
                  </p>
                </div>
                <button
                  onClick={handleConvert}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                  <Check className="h-4 w-4" />
                  <span className="text-xs font-medium">Convert to 3D</span>
                </button>
              </div>
            </div>
          )}

          {/* Shape Guide */}
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              📝 How to Use:
            </p>
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <div>✏️ Draw any shape on the canvas</div>
              <div>🎯 Your drawing will be converted to a 3D mesh</div>
              <div>🖱️ Click "Convert to 3D" when ready</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
