import React, { useRef, useState } from 'react';
import { Text3D, Center } from '@react-three/drei';
import { Mesh, BufferGeometry, BufferAttribute } from 'three';
import type { Object3DData, AnimalPart } from './types';
import { ELEMENT_COLORS, ELEMENT_RADII } from './types';

interface Object3DRendererProps {
  object: Object3DData;
  isSelected: boolean;
  onSelect: () => void;
}

const getMaterial = (material: Object3DData['material'], isHovered?: boolean) => {
  const commonProps = {
    color: material.color,
    opacity: material.opacity,
    transparent: material.opacity < 1,
    emissive: isHovered ? '#ffaa00' : material.emissive,
    emissiveIntensity: isHovered ? 0.3 : material.emissiveIntensity,
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

const createDrawingGeometryBuffer = (points: Array<{ x: number; y: number }> | undefined) => {
  if (!points || points.length < 2) {
    return null;
  }

  try {
    // Normalize points to canvas-like coordinates
    let minX = points[0].x, maxX = points[0].x;
    let minY = points[0].y, maxY = points[0].y;

    for (const p of points) {
      minX = Math.min(minX, p.x);
      maxX = Math.max(maxX, p.x);
      minY = Math.min(minY, p.y);
      maxY = Math.max(maxY, p.y);
    }

    const width = maxX - minX || 1;
    const height = maxY - minY || 1;
    const depth = 0.5;
    const tubeRadius = 0.15;
    const radialSegments = 6;
    const pointCount = points.length;

    // Create tube geometry around the drawn path
    const vertices: number[] = [];
    const indices: number[] = [];
    let vertexIndex = 0;

    // For each point along the path, create a circular cross-section
    for (let i = 0; i < pointCount; i++) {
      const normalizedX = (points[i].x - minX) / width - 0.5;
      const normalizedY = (points[i].y - minY) / height - 0.5;
      const z = (i / Math.max(1, pointCount - 1)) * depth - depth / 2;

      // Create circular vertices around the tube at this point
      for (let j = 0; j < radialSegments; j++) {
        const angle = (j / radialSegments) * Math.PI * 2;
        const x = normalizedX * 0.8 + Math.cos(angle) * tubeRadius;
        const y = normalizedY * 0.8 + Math.sin(angle) * tubeRadius;
        vertices.push(x, y, z);
        vertexIndex++;
      }
    }

    // Create faces connecting each ring of vertices
    for (let i = 0; i < pointCount - 1; i++) {
      const currentRingStart = i * radialSegments;
      const nextRingStart = (i + 1) * radialSegments;

      for (let j = 0; j < radialSegments; j++) {
        const j1 = (j + 1) % radialSegments;

        // Two triangles per segment to form the tube walls
        indices.push(currentRingStart + j, nextRingStart + j, currentRingStart + j1);
        indices.push(currentRingStart + j1, nextRingStart + j, nextRingStart + j1);
      }
    }

    // Create end caps
    // Front cap (first point)
    const frontCenterIdx = vertexIndex++;
    const frontX = (points[0].x - minX) / width - 0.5;
    const frontY = (points[0].y - minY) / height - 0.5;
    vertices.push(frontX * 0.8, frontY * 0.8, -depth / 2);

    for (let j = 0; j < radialSegments; j++) {
      const j1 = (j + 1) % radialSegments;
      indices.push(frontCenterIdx, j1, j);
    }

    // Back cap (last point)
    const backCenterIdx = vertexIndex++;
    const backX = (points[pointCount - 1].x - minX) / width - 0.5;
    const backY = (points[pointCount - 1].y - minY) / height - 0.5;
    vertices.push(backX * 0.8, backY * 0.8, depth / 2);

    const lastRingStart = (pointCount - 1) * radialSegments;
    for (let j = 0; j < radialSegments; j++) {
      const j1 = (j + 1) % radialSegments;
      indices.push(backCenterIdx, j + lastRingStart, j1 + lastRingStart);
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
    geometry.setIndex(new BufferAttribute(new Uint32Array(indices), 1));
    geometry.computeVertexNormals();

    return geometry;
  } catch (error) {
    console.error('Error creating drawing geometry:', error);
    return null;
  }
};

const renderAnimalPart = (part: AnimalPart) => {
   switch (part.type) {
     case 'sphere':
       return <sphereGeometry args={[0.5, 32, 32]} />;
     case 'cylinder':
       return <cylinderGeometry args={[0.5, 0.5, 1, 32]} />;
     case 'cone':
       return <coneGeometry args={[0.5, 1, 32]} />;
     case 'cube':
       return <boxGeometry args={[1, 1, 1]} />;
     default:
       return <sphereGeometry args={[0.5, 32, 32]} />;
   }
 };

export const Object3DRenderer: React.FC<Object3DRendererProps> = ({
  object,
  isSelected,
  onSelect,
}) => {
  const meshRef = useRef<Mesh>(null);
  const groupRef = useRef<any>(null);
  const [isHovered, setIsHovered] = useState(false);

  React.useEffect(() => {
    if (meshRef.current) {
      meshRef.current.userData.id = object.id;
    }
    if (groupRef.current) {
      groupRef.current.userData.id = object.id;
    }
  }, [object.id]);

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

      case 'atom': {
        const element = object.element || 'C';
        const atomColor = ELEMENT_COLORS[element] || '#808080';
        const atomRadius = ELEMENT_RADII[element] || 0.4;
        return (
          <>
            <sphereGeometry args={[atomRadius, 32, 32]} />
            <meshStandardMaterial color={atomColor} metalness={0.3} roughness={0.7} />
          </>
        );
      }

      case 'bond': {
        const bondRadius = object.bondType === 'single' ? 0.1 : object.bondType === 'double' ? 0.08 : 0.06;
        return (
          <>
            <cylinderGeometry args={[bondRadius, bondRadius, 1, 16]} />
            <meshStandardMaterial color="#808080" metalness={0.5} roughness={0.5} />
          </>
        );
      }

      case 'animal': {
        return null;
      }

      case 'custom_drawing': {
        const geom = createDrawingGeometryBuffer(object.drawingPoints);
        if (geom) {
          return <primitive object={geom} attach="geometry" />;
        }
        return <boxGeometry args={[1, 1, 1]} />;
      }

      default:
        return <boxGeometry args={[1, 1, 1]} />;
      }
      };

  if (object.type === 'animal') {
    return (
      <group
        ref={groupRef}
        position={object.position}
        rotation={object.rotation}
        scale={object.scale}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setIsHovered(true);
          document.body.style.cursor = 'grab';
        }}
        onPointerLeave={() => {
          setIsHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        {object.animalParts?.map((part) => (
          <mesh
            key={`${object.id}-${part.name}`}
            position={part.position}
            rotation={part.rotation}
            scale={part.scale}
            castShadow
            receiveShadow
          >
            {renderAnimalPart(part)}
            <meshStandardMaterial 
              color={part.color}
              metalness={0.3}
              roughness={0.7}
              emissive={isHovered ? '#ffaa00' : '#000000'}
              emissiveIntensity={isHovered ? 0.3 : 0}
            />
          </mesh>
        ))}
        {isSelected && (
          <mesh>
            <boxGeometry args={[2, 2, 2]} />
            <meshBasicMaterial color="#00ff00" wireframe />
          </mesh>
        )}
      </group>
    );
  }

  if (object.type === 'text3d') {
    return (
      <group
        ref={groupRef}
        position={object.position}
        rotation={object.rotation}
        scale={object.scale}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setIsHovered(true);
          document.body.style.cursor = 'grab';
        }}
        onPointerLeave={() => {
          setIsHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <Center>
          <Text3D
            font="/fonts/helvetiker_regular.typeface.json"
            size={object.fontSize || 0.5}
            height={object.fontDepth || 0.2}
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.01}
            bevelSize={0.01}
            bevelSegments={5}
          >
            {object.text || 'Text'}
            {getMaterial(object.material, isHovered)}
            {isSelected && (
              <meshBasicMaterial color="#00ff00" wireframe />
            )}
          </Text3D>
        </Center>
      </group>
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
      userData={{ id: object.id }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerEnter={(e) => {
        e.stopPropagation();
        setIsHovered(true);
        document.body.style.cursor = 'grab';
      }}
      onPointerLeave={() => {
        setIsHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {renderShape()}
      {object.type !== 'atom' && object.type !== 'bond' && getMaterial(object.material, isHovered)}
      
      {isSelected && (
        <lineSegments>
          <edgesGeometry args={[meshRef.current?.geometry]} />
          <lineBasicMaterial color="#00ff00" linewidth={2} />
        </lineSegments>
      )}
    </mesh>
  );
};
