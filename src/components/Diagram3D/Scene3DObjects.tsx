import React from 'react';
import { Object3DRenderer } from './Object3DRenderer';
import type { Object3DData } from './types';

interface Scene3DObjectsProps {
  objects: Object3DData[];
  selectedObjectId: string | null;
  onObjectSelect: (id: string | null) => void;
}

export const Scene3DObjects: React.FC<Scene3DObjectsProps> = ({
  objects,
  selectedObjectId,
  onObjectSelect,
}) => {
  return (
    <>
      {objects.map((obj) => (
        <Object3DRenderer
          key={obj.id}
          object={obj}
          isSelected={obj.id === selectedObjectId}
          onSelect={() => onObjectSelect(obj.id)}
        />
      ))}
    </>
  );
};
