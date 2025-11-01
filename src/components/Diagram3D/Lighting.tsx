import React from 'react';

export const Lighting: React.FC = () => {
  return (
    <>
      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.4} />
      
      {/* Main directional light with shadows */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Fill light */}
      <directionalLight position={[-5, 5, -5]} intensity={0.3} />
      
      {/* Rim/back light */}
      <directionalLight position={[0, 5, -10]} intensity={0.2} />
      
      {/* Hemisphere light for subtle sky/ground lighting */}
      <hemisphereLight args={['#ffffff', '#444444', 0.3]} />
    </>
  );
};
