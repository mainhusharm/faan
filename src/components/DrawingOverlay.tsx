import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Trash2, Check, Palette } from 'lucide-react';
import { estimateSize, getBoundingBox, type Point } from '../lib/shapeRecognition';
import { DRAWING_PRESETS, type DrawingPreset } from '../lib/drawingPresets';

interface DrawingOverlayProps {
  isActive: boolean;
  selectedColor: string;
  onColorChange: (color: string) => void;
  onShapeRecognized: (objectType: string, color: string, size: number, shapeName: string, aspectRatio?: number, points?: Point[]) => void;
  isDragging3D?: boolean;
}

export const DrawingOverlay: React.FC<DrawingOverlayProps> = ({
  isActive,
  selectedColor,
  onColorChange,
  onShapeRecognized,
  isDragging3D = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState<Point[]>([]);
  const [recognizedShape, setRecognizedShape] = useState<string | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<DrawingPreset | null>(null);

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

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setPoints([]);
    setRecognizedShape(null);
  }, []);

  // Clear canvas when not active
  useEffect(() => {
    if (!isActive) {
      clearCanvas();
    }
  }, [isActive, clearCanvas]);

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
    if (!isActive || isDragging3D) return;

    // Require preset selection before drawing
    if (!selectedPreset) return;

    const point = getCanvasPoint(e);
    if (!point) return;

    setIsDrawing(true);
    setPoints([point]);
    setRecognizedShape(null);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !isActive || isDragging3D) return;

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
     if (!isActive) return;

     // If 3D dragging started, cancel drawing
     if (isDragging3D) {
       setIsDrawing(false);
       clearCanvas();
       return;
     }

     if (!isDrawing) return;

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
    
    // Use preset name if available, otherwise use generic name
    let shapeName = selectedPreset?.name || 'custom drawing';
    if (recognizedShape && recognizedShape !== 'unknown') {
      shapeName = `${selectedPreset?.name || 'drawing'} (${recognizedShape})`;
    }

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
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between pointer-events-auto flex-wrap gap-4">
        {/* Preset Selector or Active Drawing Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 max-w-2xl">
          {!selectedPreset ? (
            // Preset Selection View
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  📋 Select a Drawing Preset
                </h3>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                Choose what you want to draw, then sketch it on the canvas
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {DRAWING_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setSelectedPreset(preset);
                      onColorChange(preset.defaultColor);
                    }}
                    className="flex flex-col items-center justify-center p-3 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 hover:shadow-lg hover:scale-105 transition-all border-2 border-transparent hover:border-indigo-400 dark:hover:border-indigo-500"
                    title={preset.description}
                  >
                    <span className="text-2xl mb-1">{preset.icon}</span>
                    <span className="text-xs font-medium text-gray-900 dark:text-white text-center">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Active Drawing View
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    🖊️ Drawing: {selectedPreset.icon} {selectedPreset.name}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setSelectedPreset(null);
                    clearCanvas();
                  }}
                  className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
                >
                  Change Preset
                </button>
              </div>

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
                  {selectedPreset.suggestedColors?.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        onColorChange(color);
                        setShowColorPicker(false);
                      }}
                      className={`w-8 h-8 rounded-lg border-2 transition-all ${
                        selectedColor === color
                          ? 'border-indigo-600 scale-110 shadow-lg'
                          : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
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
                        ✓ Drawing Ready!
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        Convert your {selectedPreset.name.toLowerCase()} to a 3D mesh
                      </p>
                    </div>
                    <button
                      onClick={handleConvert}
                      className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors whitespace-nowrap"
                    >
                      <Check className="h-4 w-4" />
                      <span className="text-xs font-medium">Convert to 3D</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
