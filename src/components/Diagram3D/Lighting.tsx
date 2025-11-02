import React from 'react';

export const Lighting: React.FC = () => {
  return (
    <>
      {/* Ambient light for base illumination - brighter for better visibility */}
      <ambientLight intensity={0.5} />
      
      {/* Main directional light with shadows */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Fill light from opposite side */}
      <directionalLight position={[-5, 5, -5]} intensity={0.4} />
      
      {/* Back/rim light for depth */}
      <directionalLight position={[0, 5, -10]} intensity={0.3} />
      
      {/* Additional side lights for molecule clarity */}
      <pointLight position={[5, 3, 5]} intensity={0.3} />
      <pointLight position={[-5, 3, -5]} intensity={0.2} />
      
      {/* Hemisphere light for natural sky/ground lighting */}
      <hemisphereLight args={['#ffffff', '#444444', 0.4]} />
    </>
  );
};
