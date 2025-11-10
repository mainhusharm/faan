import React from 'react';
import {
  Box,
  Circle,
  Cylinder,
  Triangle,
  Hexagon,
  Type,
  Atom,
  Move3d,
  RotateCw,
  Maximize2,
  Camera,
  Grid3x3,
  Eye,
  Zap,
} from 'lucide-react';

interface Toolbar3DProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
  onResetCamera: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  showAxes: boolean;
  onToggleAxes: () => void;
  cameraMode: 'perspective' | 'orthographic';
  onToggleCameraMode: () => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
}

export const Toolbar3D: React.FC<Toolbar3DProps> = ({
  selectedTool,
  onToolSelect,
  onResetCamera,
  showGrid,
  onToggleGrid,
  showAxes,
  onToggleAxes,
  cameraMode,
  onToggleCameraMode,
  autoRotate,
  onToggleAutoRotate,
}) => {
  const shapeTools = [
    { id: 'cube', icon: Box, label: 'Cube' },
    { id: 'sphere', icon: Circle, label: 'Sphere' },
    { id: 'cylinder', icon: Cylinder, label: 'Cylinder' },
    { id: 'cone', icon: Triangle, label: 'Cone' },
    { id: 'torus', icon: Hexagon, label: 'Torus' },
    { id: 'pyramid', icon: Triangle, label: 'Pyramid' },
  ];

  const creationTools = [
    { id: 'text3d', icon: Type, label: '3D Text' },
    { id: 'atom', icon: Atom, label: 'Atom' },
    { id: 'molecule', icon: Hexagon, label: 'Molecule' },
    { id: 'animal', icon: Zap, label: 'Animal' },
  ];

  const transformTools = [
    { id: 'move', icon: Move3d, label: 'Move' },
    { id: 'rotate', icon: RotateCw, label: 'Rotate' },
    { id: 'scale', icon: Maximize2, label: 'Scale' },
  ];

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 p-4">
      <div className="flex flex-wrap items-center gap-2">
        {/* Shape Tools */}
        <div className="flex items-center space-x-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
          {shapeTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => onToolSelect(tool.id)}
                className={`p-2 rounded-lg transition-all ${
                  selectedTool === tool.id
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                title={tool.label}
              >
                <Icon className="h-5 w-5" />
              </button>
            );
          })}
        </div>

        {/* Creation Tools */}
        <div className="flex items-center space-x-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
          {creationTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => onToolSelect(tool.id)}
                className={`p-2 rounded-lg transition-all ${
                  selectedTool === tool.id
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                title={tool.label}
              >
                <Icon className="h-5 w-5" />
              </button>
            );
          })}
        </div>

        {/* Transform Tools */}
        <div className="flex items-center space-x-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
          {transformTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => onToolSelect(tool.id)}
                className={`p-2 rounded-lg transition-all ${
                  selectedTool === tool.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                title={tool.label}
              >
                <Icon className="h-5 w-5" />
              </button>
            );
          })}
        </div>

        {/* View Controls */}
        <div className="flex items-center space-x-1 ml-auto">
          <button
            onClick={onToggleGrid}
            className={`p-2 rounded-lg transition-all ${
              showGrid
                ? 'bg-emerald-600 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title="Toggle Grid"
          >
            <Grid3x3 className="h-5 w-5" />
          </button>

          <button
            onClick={onToggleAxes}
            className={`p-2 rounded-lg transition-all ${
              showAxes
                ? 'bg-emerald-600 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title="Toggle Axes"
          >
            <Eye className="h-5 w-5" />
          </button>

          <button
            onClick={onToggleCameraMode}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            title={`Camera: ${cameraMode}`}
          >
            <Camera className="h-5 w-5" />
          </button>

          <button
            onClick={onToggleAutoRotate}
            className={`p-2 rounded-lg transition-all ${
              autoRotate
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title="Auto Rotate"
          >
            <RotateCw className="h-5 w-5" />
          </button>

          <button
            onClick={onResetCamera}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            title="Reset Camera"
          >
            <Camera className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
