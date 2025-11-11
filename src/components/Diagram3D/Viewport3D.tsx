import React, { Suspense, useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, PerspectiveCamera, OrthographicCamera } from '@react-three/drei';
import { Loader2 } from 'lucide-react';
import { Scene3DObjects } from './Scene3DObjects';
import { Lighting } from './Lighting';
import type { Object3DData } from './types';

interface Viewport3DProps {
  objects: Object3DData[];
  selectedObjectId: string | null;
  onObjectSelect: (id: string | null) => void;
  onObjectDrag: (id: string, newPosition: [number, number, number]) => void;
  showGrid: boolean;
  showAxes: boolean;
  cameraMode: 'perspective' | 'orthographic';
  autoRotate: boolean;
  backgroundColor: string;
}

const CanvasResizer: React.FC = () => {
  const { camera, gl } = useThree();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      if ('aspect' in camera) {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
      gl.setSize(width, height);
    };

    const handleFullscreenChange = () => {
      setTimeout(() => {
        handleResize();
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, [camera, gl]);

  return null;
};

export const Viewport3D: React.FC<Viewport3DProps> = ({
  objects,
  selectedObjectId,
  onObjectSelect,
  onObjectDrag,
  showGrid,
  showAxes,
  cameraMode,
  autoRotate,
  backgroundColor,
  onDragStateChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbitControlsRef = useRef<any>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Notify parent when drag state changes
  const handleDragStateChange = useCallback((dragging: boolean) => {
    setIsDragging(dragging);
    onDragStateChange?.(dragging);
  }, [onDragStateChange]);

  return (
    <div className="w-full h-full relative" style={{ backgroundColor }}>
      <Canvas
        ref={canvasRef}
        shadows
        gl={{ 
          preserveDrawingBuffer: true,
          antialias: true,
          alpha: false
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          {/* Canvas Resizer - handles fullscreen and window resize */}
          <CanvasResizer />
          
          {/* Scene Background */}
          <color attach="background" args={[backgroundColor]} />

          {/* Camera */}
          {cameraMode === 'perspective' ? (
            <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={50} />
          ) : (
            <OrthographicCamera makeDefault position={[5, 5, 5]} zoom={50} />
          )}

          {/* Lighting */}
          <Lighting />

          {/* Grid and Axes */}

          {showAxes && (
            <axesHelper args={[5]} />
          )}

          {/* Scene Objects */}
          <Scene3DObjects
            objects={objects}
            selectedObjectId={selectedObjectId}
            onObjectSelect={onObjectSelect}
            onObjectDrag={onObjectDrag}
            isDragging={isDragging}
            setIsDragging={handleDragStateChange}
            orbitControlsRef={orbitControlsRef}
          />

          {/* Controls */}
          <OrbitControls
            ref={orbitControlsRef}
            makeDefault
            autoRotate={autoRotate}
            autoRotateSpeed={1}
            enableDamping
            dampingFactor={0.05}
            minDistance={2}
            maxDistance={50}
            maxPolarAngle={Math.PI / 2}
            enabled={!isDragging}
          />
        </Suspense>
      </Canvas>

      {/* Loading Overlay */}
      <Suspense
        fallback={
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
            <div className="flex flex-col items-center space-y-3">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
              <p className="text-white text-sm">Loading 3D Scene...</p>
            </div>
          </div>
        }
      >
        <></>
      </Suspense>
    </div>
  );
};
