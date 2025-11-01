# 3D Interactive Whiteboard

This directory contains the complete implementation of the 3D interactive whiteboard feature for Fusioned EdTech, enabling immersive learning experiences for chemistry, physics, geometry, and other subjects.

## Features

### 🎨 3D Creation Tools

#### Basic Shapes
- **Cube/Box**: Adjustable width, height, depth
- **Sphere**: Configurable radius and segments
- **Cylinder**: Customizable radius and height
- **Cone**: Variable base radius and height
- **Torus**: Donut shape with radius and tube thickness
- **Pyramid**: Tetrahedral geometry
- **Plane**: Flat surface for annotations

#### 3D Text
- Extruded 3D text with adjustable depth
- Customizable font size
- Editable text content
- Material properties (color, metalness, roughness)

#### Molecular Structures
- **Individual Atoms**: Place atoms with element selection
  - CPK color scheme (C=black, H=white, O=red, N=blue, etc.)
  - Accurate atomic radii
  - 18 elements supported (H, C, N, O, F, Cl, Br, I, P, S, B, Li, Na, K, Mg, Ca, Fe, Zn)

- **Bonds**: Single, double, and triple bonds between atoms
  - Visual distinction between bond types
  - Automatic positioning between connected atoms

- **Pre-built Molecules**:
  - Water (H₂O)
  - Methane (CH₄)
  - Ethanol (C₂H₅OH)
  - Benzene (C₆H₆)

### 📷 Camera Controls

- **Orbit Controls**: Left-click + drag to rotate camera around scene
- **Pan**: Right-click + drag to move camera
- **Zoom**: Scroll wheel to zoom in/out
- **Camera Modes**: Toggle between perspective and orthographic
- **Auto-rotate**: Automatic rotation for presentations
- **Reset Camera**: Return to default position

### 🎭 Materials & Appearance

Material types available:
- **Standard**: PBR material with metalness and roughness
- **Phong**: Classic shiny material
- **Basic**: Simple flat color
- **Metallic**: High metalness for metal objects
- **Glass**: Transparent with transmission
- **Wireframe**: See-through mesh view

Material properties:
- Color picker
- Opacity/transparency slider (0-1)
- Metalness control (0-1)
- Roughness control (0-1)
- Emissive color and intensity
- Wireframe toggle

### 🔧 Transform Tools

- **Move**: Translate objects in X, Y, Z axes
- **Rotate**: Rotate objects around axes (in radians)
- **Scale**: Resize uniformly or per axis
- **Properties Panel**: Precise numeric input for all transforms

### 💡 Lighting

Three-point lighting setup:
- Ambient light for base illumination
- Main directional light with shadows
- Fill light for softer shadows
- Rim/back light for depth
- Hemisphere light for sky/ground effect

### 🎬 Scene Management

- **Save Scene**: Export entire scene as JSON file
- **Load Scene**: Import previously saved scenes
- **Export Image**: Capture scene from current camera angle
- **Grid Helper**: Optional grid overlay
- **Axes Helper**: XYZ axes visualization (X=red, Y=green, Z=blue)

### 🎯 Object Manipulation

- **Click to Select**: Click any object to select it
- **Selection Highlight**: Green edge highlight on selected objects
- **Duplicate**: Copy selected object with one click
- **Delete**: Remove selected object
- **Properties Panel**: Edit all object properties in real-time

## File Structure

```
Diagram3D/
├── README.md                    # This file
├── index.ts                     # Export barrel
├── types.ts                     # TypeScript definitions
├── Diagram3DContainer.tsx       # Main container component
├── Viewport3D.tsx               # 3D canvas viewport
├── Scene3DObjects.tsx           # Scene object manager
├── Object3DRenderer.tsx         # Individual object renderer
├── Toolbar3D.tsx                # Tool selection toolbar
├── PropertiesPanel.tsx          # Object properties editor
├── MoleculePicker.tsx           # Molecule template selector
└── Lighting.tsx                 # Scene lighting setup
```

## Component Architecture

### Diagram3DContainer
Main orchestrator component that manages:
- Scene state (objects array)
- Selected object tracking
- Tool selection
- View settings (grid, axes, camera mode)
- Object CRUD operations
- Save/load functionality

### Viewport3D
Wraps React Three Fiber Canvas:
- Camera setup (perspective/orthographic)
- Lighting
- Grid and axes helpers
- Orbit controls
- Background color

### Object3DRenderer
Renders individual 3D objects:
- Geometry generation based on object type
- Material application
- Selection highlighting
- Click handling

### PropertiesPanel
Real-time property editor:
- Transform controls (position, rotation, scale)
- Material properties
- Type-specific properties (text content, element type, etc.)
- Duplicate and delete actions

### MoleculePicker
Dialog for selecting pre-built molecules:
- Visual molecule cards
- Formula display
- Automatic atom and bond creation

## Usage Example

```tsx
import { Diagram3DContainer } from '../components/Diagram3D';

function MyPage() {
  return (
    <div style={{ height: '600px' }}>
      <Diagram3DContainer />
    </div>
  );
}
```

## Data Structures

### Object3DData
```typescript
interface Object3DData {
  id: string;
  type: Object3DType;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  material: MaterialProperties;
  dimensions?: { width?, height?, depth?, radius?, ... };
  text?: string;                    // For text3d
  fontSize?: number;                // For text3d
  fontDepth?: number;               // For text3d
  element?: string;                 // For atoms
  bondType?: 'single' | 'double' | 'triple';  // For bonds
}
```

### Scene Save Format
```json
{
  "objects": [/* array of Object3DData */],
  "settings": {
    "backgroundColor": "#f0f0f0",
    "showGrid": true,
    "showAxes": true,
    "cameraMode": "perspective"
  }
}
```

## Performance Considerations

- **Lazy Loading**: 3D components are lazy-loaded to optimize initial bundle
- **Instancing**: Repeated objects use geometry instancing where possible
- **Shadow Optimization**: Shadows configurable for performance
- **WebGL Context**: Canvas configured with `preserveDrawingBuffer` for screenshots

## Browser Support

- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 15+ ✅
- Edge 90+ ✅

Requires WebGL 2.0 support.

## Dependencies

- `three`: 3D rendering library
- `@react-three/fiber`: React renderer for Three.js
- `@react-three/drei`: Helper components and abstractions
- `@types/three`: TypeScript definitions

## Future Enhancements

Potential additions:
- SMILES string import for molecular structures
- Transform gizmo (interactive handles)
- More molecule templates (DNA, amino acids, glucose)
- Physics simulation
- VR/AR support
- Collaborative editing
- Animation timeline
- Custom polyhedra builder
- Measurement tools (distance, angles)
- Electron cloud visualization
- 3D function graphing

## Troubleshooting

### Font Not Loading
Ensure `/public/fonts/helvetiker_regular.typeface.json` exists. Download from:
```
https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_regular.typeface.json
```

### Performance Issues
- Reduce shadow quality
- Lower segment count for spheres/cylinders
- Disable auto-rotate
- Use wireframe materials for complex scenes

### Objects Not Appearing
- Check if objects are at origin (0, 0, 0)
- Verify scale is not zero
- Check if camera is too far or too close
- Ensure opacity is not 0
