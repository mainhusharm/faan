# 3D Whiteboard Guide

## Overview

The 3D Whiteboard is an interactive learning tool that allows students to create and manipulate 3D objects, molecules, and text in a fully-rendered 3D environment using Three.js and React Three Fiber.

## Features

### 🎯 Core Functionality

- **3D Scene**: Fully interactive 3D viewport with WebGL rendering
- **Camera Controls**: Orbit, zoom, and pan using mouse/trackpad
- **Grid & Axes**: Visual helpers for spatial orientation
- **Auto-rotate**: Optional automatic scene rotation
- **Dual Mode**: Switch between 2D canvas and 3D viewport

### 🔨 3D Object Creation

#### Basic Shapes
- **Cube**: Standard 3D box with adjustable dimensions
- **Sphere**: Perfect sphere with customizable radius
- **Cylinder**: Cylindrical shape with height and radius controls
- **Cone**: Conical shape for diagrams and models
- **Torus**: Donut shape for advanced geometry
- **Pyramid**: Tetrahedral shape

#### 3D Text
- Add extruded 3D text with customizable:
  - Text content
  - Font size
  - Extrusion depth
  - Material properties

#### Molecular Models
Pre-built molecules with accurate 3D structure:
- **Water (H₂O)**: V-shaped molecule
- **Methane (CH₄)**: Tetrahedral carbon compound
- **Ethanol (C₂H₅OH)**: Alcohol molecule
- **Benzene (C₆H₆)**: Aromatic ring structure

Each molecule displays:
- Color-coded atoms (H=white, C=black, O=red, N=blue)
- Accurate bond angles
- Single, double, and triple bonds

### 🎨 Customization

#### Material Properties
- **Material Type**: Standard, Phong, Basic, Wireframe, Glass, Metallic
- **Color**: Full color picker
- **Opacity**: Transparency control
- **Metalness**: Metallic appearance (0-1)
- **Roughness**: Surface roughness (0-1)
- **Emissive**: Self-illumination color and intensity

#### Transform Controls
- **Position**: Move objects in X, Y, Z space
- **Rotation**: Rotate around any axis (in radians)
- **Scale**: Resize objects uniformly or per-axis

### 🎮 Camera Controls

#### Mouse Controls
- **Left Click + Drag**: Rotate camera around scene
- **Right Click + Drag**: Pan camera
- **Scroll Wheel**: Zoom in/out
- **Click Object**: Select object for editing

#### View Options
- **Grid Toggle**: Show/hide floor grid
- **Axes Toggle**: Show/hide coordinate axes (X=red, Y=green, Z=blue)
- **Camera Mode**: Switch between perspective and orthographic
- **Auto-rotate**: Automatic scene rotation

### 💾 Scene Management

- **Save Scene**: Export scene as JSON file
- **Load Scene**: Import previously saved scenes
- **Export Image**: Capture current view as image
- **Clear Scene**: Delete all objects

## Usage Guide

### Getting Started

1. **Navigate to Diagram Page**
   - Access from main navigation menu

2. **Switch to 3D Mode**
   - Click "3D Viewport" toggle at top of page
   - Page defaults to 3D mode to showcase features

3. **Explore Demo Scene**
   - Three demo objects appear on load (cube, sphere, cylinder)
   - Drag to rotate camera around objects
   - Scroll to zoom in/out

### Creating Objects

#### Add Shapes
1. Click any shape button in toolbar (cube, sphere, etc.)
2. Object appears at origin (0, 0, 0)
3. Use properties panel to adjust position, rotation, scale

#### Add 3D Text
1. Click "3D Text" button (Type icon)
2. Default text "Hello" appears
3. Select text object and edit properties:
   - Change text content
   - Adjust font size
   - Modify extrusion depth

#### Add Molecules
1. Click "Molecule" button (Hexagon icon)
2. Molecule picker dialog opens
3. Select from pre-built molecules:
   - Water, Methane, Ethanol, or Benzene
4. Molecule appears with all atoms and bonds
5. Individual atoms can be selected and moved

### Editing Objects

1. **Select Object**: Click on any object in 3D view
2. **Properties Panel**: Right sidebar shows editable properties
3. **Modify Properties**:
   - Position: Numeric inputs for X, Y, Z
   - Rotation: Adjust angles in radians
   - Scale: Resize per axis
   - Material: Change appearance
   - Text: Edit text content (text objects only)
   - Element: Change atom type (atom objects only)

4. **Object Actions**:
   - **Duplicate**: Create copy of selected object
   - **Delete**: Remove selected object

### Camera Navigation

#### Basic Navigation
- **Orbit**: Click and drag anywhere to rotate view
- **Zoom**: Scroll wheel to zoom in/out
- **Pan**: Right-click and drag to pan
- **Reset**: Click reset camera button in toolbar

#### View Controls
- **Grid**: Toggle floor grid for depth perception
- **Axes**: Toggle coordinate axes (X/Y/Z helpers)
- **Auto-rotate**: Enable smooth automatic rotation
- **Camera Mode**: Switch perspective/orthographic view

## Technical Details

### Technology Stack
- **Three.js**: 3D graphics library
- **@react-three/fiber**: React renderer for Three.js
- **@react-three/drei**: Helper components (OrbitControls, Grid, Text3D)
- **TypeScript**: Type-safe component architecture

### Performance
- Optimized rendering with React suspense
- Efficient object management with functional state updates
- Shadow mapping for realistic lighting
- Responsive controls with damping

### Browser Support
- Modern browsers with WebGL support
- Chrome, Firefox, Safari, Edge (latest versions)
- Hardware acceleration recommended

## Educational Use Cases

### Science Education
- **Chemistry**: Visualize molecular structures and bond angles
- **Physics**: Demonstrate 3D motion and vectors
- **Biology**: Model cellular structures

### Mathematics
- **Geometry**: Explore 3D shapes and transformations
- **Vectors**: Visualize vector spaces and operations
- **Calculus**: Surface plots and 3D functions

### Engineering
- **CAD Basics**: Simple 3D modeling concepts
- **Spatial Reasoning**: Develop 3D visualization skills
- **Design Thinking**: Prototype simple structures

## Tips & Best Practices

### Creating Clear Diagrams
1. Use grid and axes for alignment
2. Color-code objects by category
3. Space objects appropriately for clarity
4. Use text labels for annotations

### Organizing Complex Scenes
1. Create objects in logical groups
2. Use consistent naming/coloring scheme
3. Save work frequently
4. Keep properties panel open while editing

### Performance Optimization
1. Limit total object count (< 100 objects)
2. Use simpler materials when possible
3. Reduce segment count for complex shapes
4. Disable auto-rotate for better control

## Troubleshooting

### Objects Not Visible
- Check object position (might be far from origin)
- Verify scale is not too small
- Ensure opacity is not set to 0
- Try resetting camera view

### Camera Issues
- Click reset camera button
- Check if auto-rotate is interfering
- Verify OrbitControls are enabled
- Refresh page if controls stop responding

### Performance Issues
- Reduce number of objects
- Lower segment counts on spheres/cylinders
- Disable shadows if needed
- Close properties panel when not in use

## Keyboard Shortcuts

Currently, all controls are mouse-based. Future versions may include:
- Delete key for removing selected object
- Ctrl+D for duplicate
- Ctrl+S for save scene
- ESC to deselect object

## Future Enhancements

Potential features for future versions:
- Transform gizmos for visual manipulation
- Multi-object selection
- Object grouping
- Animation timeline
- Custom molecule builder
- AR/VR support
- Collaborative editing
- Physics simulation
- More material types
- Texture mapping

## Support

For issues or questions:
1. Check browser console for errors
2. Verify WebGL is enabled
3. Update to latest browser version
4. Clear browser cache
5. Contact support with scene JSON and error details
