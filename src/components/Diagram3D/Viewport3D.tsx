import React, { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
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
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbitControlsRef = useRef<any>(null);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="w-full h-full relative" style={{ backgroundColor }}>
      <Canvas
        ref={canvasRef}
        shadows
        gl={{ preserveDrawingBuffer: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          {/* Camera */}
          {cameraMode === 'perspective' ? (
            <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={50} />
          ) : (
            <OrthographicCamera makeDefault position={[5, 5, 5]} zoom={50} />
          )}

          {/* Lighting */}
          <Lighting />

          {/* Grid and Axes */}
          {showGrid && (
            <Grid
              args={[20, 20]}
              cellSize={1}
              cellThickness={0.5}
              cellColor="#6b7280"
              sectionSize={5}
              sectionThickness={1}
              sectionColor="#374151"
              fadeDistance={30}
              fadeStrength={1}
              followCamera={false}
              infiniteGrid={false}
            />
          )}

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
            setIsDragging={setIsDragging}
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
