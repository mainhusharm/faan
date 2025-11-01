import React, { useRef } from 'react';
import { Text3D, Center } from '@react-three/drei';
import { Mesh } from 'three';
import type { Object3DData, MaterialType } from './types';
import { ELEMENT_COLORS, ELEMENT_RADII } from './types';

interface Object3DRendererProps {
  object: Object3DData;
  isSelected: boolean;
  onSelect: () => void;
}

const getMaterial = (material: Object3DData['material']) => {
  const commonProps = {
    color: material.color,
    opacity: material.opacity,
    transparent: material.opacity < 1,
    emissive: material.emissive,
    emissiveIntensity: material.emissiveIntensity,
    wireframe: material.wireframe,
  };

  switch (material.type) {
    case 'standard':
      return (
        <meshStandardMaterial
          {...commonProps}
          metalness={material.metalness}
          roughness={material.roughness}
        />
      );
    case 'phong':
      return <meshPhongMaterial {...commonProps} shininess={100} />;
    case 'metallic':
      return (
        <meshStandardMaterial {...commonProps} metalness={1} roughness={0.2} />
      );
    case 'glass':
      return (
        <meshPhysicalMaterial
          {...commonProps}
          transmission={0.9}
          thickness={0.5}
          roughness={0.1}
          metalness={0}
          transparent
        />
      );
    case 'basic':
      return <meshBasicMaterial {...commonProps} />;
    case 'wireframe':
      return <meshBasicMaterial {...commonProps} wireframe />;
    default:
      return <meshStandardMaterial {...commonProps} />;
  }
};

export const Object3DRenderer: React.FC<Object3DRendererProps> = ({
  object,
  isSelected,
  onSelect,
}) => {
  const meshRef = useRef<Mesh>(null);

  const renderShape = () => {
    const dims = object.dimensions || {};

    switch (object.type) {
      case 'cube':
        return (
          <boxGeometry
            args={[
              dims.width || 1,
              dims.height || 1,
              dims.depth || 1,
            ]}
          />
        );

      case 'sphere':
        return (
          <sphereGeometry
            args={[
              dims.radius || 0.5,
              dims.segments || 32,
              dims.segments || 32,
            ]}
          />
        );

      case 'cylinder':
        return (
          <cylinderGeometry
            args={[
              dims.radius || 0.5,
              dims.radius || 0.5,
              dims.height || 1,
              dims.segments || 32,
            ]}
          />
        );

      case 'cone':
        return (
          <coneGeometry
            args={[
              dims.radius || 0.5,
              dims.height || 1,
              dims.segments || 32,
            ]}
          />
        );

      case 'torus':
        return (
          <torusGeometry
            args={[
              dims.radius || 0.5,
              dims.tube || 0.2,
              16,
              dims.segments || 32,
            ]}
          />
        );

      case 'pyramid':
        return <tetrahedronGeometry args={[dims.radius || 0.5]} />;

      case 'plane':
        return (
          <planeGeometry
            args={[dims.width || 1, dims.height || 1]}
          />
        );

      case 'atom':
        const element = object.element || 'C';
        const atomColor = ELEMENT_COLORS[element] || '#808080';
        const atomRadius = ELEMENT_RADII[element] || 0.4;
        return (
          <>
            <sphereGeometry args={[atomRadius, 32, 32]} />
            <meshStandardMaterial color={atomColor} metalness={0.3} roughness={0.7} />
          </>
        );

      case 'bond':
        const bondRadius = object.bondType === 'single' ? 0.1 : object.bondType === 'double' ? 0.08 : 0.06;
        return (
          <>
            <cylinderGeometry args={[bondRadius, bondRadius, 1, 16]} />
          </>
        );

      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  if (object.type === 'text3d') {
    return (
      <Center position={object.position} rotation={object.rotation} scale={object.scale}>
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={object.fontSize || 0.5}
          height={object.fontDepth || 0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.01}
          bevelSize={0.01}
          bevelSegments={5}
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
        >
          {object.text || 'Text'}
          {getMaterial(object.material)}
          {isSelected && (
            <meshBasicMaterial color="#00ff00" wireframe />
          )}
        </Text3D>
      </Center>
    );
  }

  return (
    <mesh
      ref={meshRef}
      position={object.position}
      rotation={object.rotation}
      scale={object.scale}
      castShadow
      receiveShadow
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {renderShape()}
      {object.type !== 'atom' && getMaterial(object.material)}
      
      {isSelected && (
        <lineSegments>
          <edgesGeometry args={[meshRef.current?.geometry]} />
          <lineBasicMaterial color="#00ff00" linewidth={2} />
        </lineSegments>
      )}
    </mesh>
  );
};
