import React, { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { Object3DRenderer } from './Object3DRenderer';
import type { Object3DData } from './types';

interface Scene3DObjectsProps {
  objects: Object3DData[];
  selectedObjectId: string | null;
  onObjectSelect: (id: string | null) => void;
  onObjectDrag: (id: string, newPosition: [number, number, number]) => void;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  orbitControlsRef: React.RefObject<any>;
}

export const Scene3DObjects: React.FC<Scene3DObjectsProps> = ({
  objects,
  selectedObjectId,
  onObjectSelect,
  onObjectDrag,
  isDragging,
  setIsDragging,
  orbitControlsRef,
}) => {
  const { camera, raycaster, mouse } = useThree();
  const dragStateRef = useRef<{
    isDragging: boolean;
    draggedObjectId: string | null;
    dragPlane: any;
    startMousePos: { x: number; y: number };
    startObjectPos: [number, number, number];
  }>({
    isDragging: false,
    draggedObjectId: null,
    dragPlane: null,
    startMousePos: { x: 0, y: 0 },
    startObjectPos: [0, 0, 0],
  });

  const meshRefsRef = useRef<Map<string, any>>(new Map());

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      // Only allow drag if we have a selected object
      if (!selectedObjectId) return;

      // Check if clicking on the selected object
      const canvas = document.querySelector('canvas');
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      mouse.x = x;
      mouse.y = y;

      raycaster.setFromCamera(mouse, camera);

      const selectedMesh = meshRefsRef.current.get(selectedObjectId);
      if (!selectedMesh) return;

      const intersects = raycaster.intersectObject(selectedMesh, true);

      if (intersects.length > 0) {
        dragStateRef.current.isDragging = true;
        dragStateRef.current.draggedObjectId = selectedObjectId;
        dragStateRef.current.startMousePos = { x: event.clientX, y: event.clientY };

        const selectedObject = objects.find((obj) => obj.id === selectedObjectId);
        if (selectedObject) {
          dragStateRef.current.startObjectPos = [...selectedObject.position];
        }

        setIsDragging(true);
        if (orbitControlsRef.current) {
          orbitControlsRef.current.enabled = false;
        }
        document.body.style.cursor = 'grabbing';
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!dragStateRef.current.isDragging) return;

      const canvas = document.querySelector('canvas');
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const currentX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const currentY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Use a plane at the object's Z position for better 3D movement
      const objectZ = dragStateRef.current.startObjectPos[2];
      
      // Calculate world coordinates on a plane at objectZ
      // Get the distance from camera to the object
      const cameraDistance = camera.position.z - objectZ;
      
      // Calculate the world coordinates based on normalized device coordinates
      const vFOV = (camera as any).fov * Math.PI / 180;
      const height = 2 * Math.tan(vFOV / 2) * cameraDistance;
      const width = height * camera.aspect;
      
      const worldX = (currentX * width) / 2;
      const worldY = (currentY * height) / 2;

      const startWorldX = (mouse.x * width) / 2;
      const startWorldY = (mouse.y * height) / 2;

      const newPosition: [number, number, number] = [
        dragStateRef.current.startObjectPos[0] + (worldX - startWorldX),
        dragStateRef.current.startObjectPos[1] + (worldY - startWorldY),
        dragStateRef.current.startObjectPos[2],
      ];

      if (dragStateRef.current.draggedObjectId) {
        onObjectDrag(dragStateRef.current.draggedObjectId, newPosition);
      }
    };

    const handleMouseUp = () => {
      if (dragStateRef.current.isDragging) {
        dragStateRef.current.isDragging = false;
        dragStateRef.current.draggedObjectId = null;
        setIsDragging(false);
        if (orbitControlsRef.current) {
          orbitControlsRef.current.enabled = true;
        }
        document.body.style.cursor = 'auto';
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [selectedObjectId, objects, onObjectDrag, setIsDragging, camera, raycaster, mouse, orbitControlsRef]);

  return (
    <>
      {objects.map((obj) => (
        <Object3DRenderer
          key={obj.id}
          object={obj}
          isSelected={obj.id === selectedObjectId}
          onSelect={() => onObjectSelect(obj.id)}
          meshRefsRef={meshRefsRef}
        />
      ))}
    </>
  );
};
