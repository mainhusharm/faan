import React from 'react';
import { DragControls } from '@react-three/drei';
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
  const findObjectWithId = (obj: any): any => {
    if (obj?.userData?.id) {
      return obj;
    }
    if (obj?.children && Array.isArray(obj.children)) {
      for (const child of obj.children) {
        const found = findObjectWithId(child);
        if (found) return found;
      }
    }
    return null;
  };

  return (
    <DragControls
      autoTransform={true}
      onDragStart={(e) => {
        e.stopPropagation();
        setIsDragging(true);
        if (orbitControlsRef.current) {
          orbitControlsRef.current.enabled = false;
        }
        document.body.style.cursor = 'grabbing';
      }}
      onDrag={(worldMatrix, deltaWorldMatrix, object) => {
        const newPosition: [number, number, number] = [
          worldMatrix.elements[12],
          worldMatrix.elements[13],
          worldMatrix.elements[14],
        ];

        let objectId = object?.userData?.id;
        if (!objectId) {
          const found = findObjectWithId(object);
          objectId = found?.userData?.id;
        }

        if (objectId) {
          onObjectDrag(objectId, newPosition);
        }
      }}
      onDragEnd={() => {
        setIsDragging(false);
        if (orbitControlsRef.current) {
          orbitControlsRef.current.enabled = true;
        }
        document.body.style.cursor = 'auto';
      }}
    >
      {objects.map((obj) => (
        <Object3DRenderer
          key={obj.id}
          object={obj}
          isSelected={obj.id === selectedObjectId}
          onSelect={() => onObjectSelect(obj.id)}
        />
      ))}
    </DragControls>
  );
};
