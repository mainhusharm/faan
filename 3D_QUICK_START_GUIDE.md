# 3D Interactive Whiteboard - Quick Start Guide

## Getting Started in 5 Minutes

### Step 1: Access the 3D Whiteboard
1. Navigate to the Diagram page in your Fusioned EdTech platform
2. Look for the mode toggle buttons in the header
3. Click **"3D Viewport"** button (with the cube icon)
4. Wait for the 3D environment to load (~1 second)

### Step 2: Navigate the 3D Space
**Camera Controls:**
- 🖱️ **Left-click + drag** → Rotate camera around scene
- 🖱️ **Right-click + drag** → Pan camera (move side to side)
- 🖱️ **Scroll wheel** → Zoom in/out
- 📱 **Touch**: Two-finger drag to rotate, pinch to zoom

**View Options:**
- Click the **Grid** button to toggle floor grid
- Click the **Axes** button to show/hide X/Y/Z axes
- Click the **Camera** button to switch perspective/orthographic
- Click the **Rotate** button to enable auto-rotation

### Step 3: Create Your First 3D Object

**Create a Cube:**
1. Click the **Cube** button in the toolbar (top left)
2. A blue cube appears at the center of the scene
3. The cube is automatically selected (green outline)
4. See its properties in the panel on the right

**Create a Sphere:**
1. Click the **Circle** button in the toolbar
2. A sphere appears at the center
3. Click the sphere to select it
4. Edit its properties in the properties panel

### Step 4: Customize Your Object

**Change Color:**
1. Select an object by clicking it
2. Find "Material" section in properties panel
3. Click the color picker
4. Choose a new color

**Move Object:**
1. Select the object
2. Find "Position" section
3. Change X, Y, or Z values
4. Object moves in real-time

**Make it Transparent:**
1. Select the object
2. Find "Opacity" slider
3. Drag slider left (0 = invisible, 1 = solid)

### Step 5: Create a Molecule

**Add a Pre-built Molecule:**
1. Click the **Molecule** button (hexagon icon)
2. Molecule picker dialog appears
3. Click **"Water"** (H₂O)
4. Water molecule appears with 3 atoms and 2 bonds

**Build Custom Molecule:**
1. Click the **Atom** button
2. An atom appears at center
3. In properties panel, select element (H, C, N, O, etc.)
4. Click "Duplicate" to add more atoms
5. Move atoms to desired positions

### Step 6: Add 3D Text

1. Click the **Type** (3D Text) button
2. Default text "Hello" appears
3. Select the text object
4. In "Text Properties" section, change the text
5. Adjust "Font Size" slider to resize
6. Adjust "Depth" slider to change extrusion

### Step 7: Save Your Work

1. Click **"Save Scene"** button at bottom
2. JSON file downloads to your computer
3. Filename: `3d-scene-[timestamp].json`
4. Keep this file safe!

**Load Previously Saved Scene:**
1. Click **"Load Scene"** button
2. Select your saved JSON file
3. Scene restores exactly as saved

## Common Tasks

### Duplicate an Object
1. Select the object
2. Scroll to bottom of properties panel
3. Click **"Duplicate"** button
4. Copy appears slightly offset

### Delete an Object
1. Select the object
2. Scroll to bottom of properties panel
3. Click **"Delete"** button (red)
4. Object is removed

### Change Material Type
1. Select object
2. Find "Material Type" dropdown
3. Choose from:
   - **Standard** - Realistic PBR material
   - **Metallic** - Shiny metal look
   - **Glass** - Transparent material
   - **Wireframe** - See-through mesh
   - **Phong** - Classic shiny material
   - **Basic** - Simple flat color

### Rotate an Object
1. Select object
2. Find "Rotation" section
3. Change X, Y, or Z rotation values
4. Values are in radians (π ≈ 3.14)
5. Tip: π/2 ≈ 1.57 = 90 degrees

### Scale an Object
1. Select object
2. Find "Scale" section
3. Change X, Y, or Z scale values
4. 1.0 = normal size
5. 2.0 = double size
6. 0.5 = half size

## Pro Tips

### 🎯 Selection
- Click empty space to deselect all objects
- Green edges show which object is selected
- Properties panel always shows selected object info

### 📐 Precise Positioning
- Use numeric inputs for exact coordinates
- Grid spacing is 1 unit
- Origin (0, 0, 0) is at grid center
- Y-axis points up

### 🎨 Materials
- Metalness: 0 = plastic, 1 = metal
- Roughness: 0 = mirror, 1 = matte
- Glass material needs low opacity

### 🔬 Molecules
- CPK colors are automatic for atoms
- Benzene shows aromatic ring structure
- Bonds auto-scale between atoms

### 💡 Lighting
- Scene has built-in three-point lighting
- Objects cast shadows on grid
- Metallic materials reflect light

### ⌨️ Keyboard Shortcuts
Currently, mouse/touch only. Keyboard shortcuts may be added in future updates.

## Troubleshooting

### Object Not Visible
- Check opacity (might be 0)
- Check scale (might be too small)
- Move camera closer (scroll to zoom)
- Check if object is at origin (0,0,0)

### Performance Issues
- Reduce number of objects
- Disable shadows (future setting)
- Turn off auto-rotate
- Use simpler materials (Basic instead of Glass)

### Font Not Loading (3D Text)
- Check browser console for errors
- Ensure `/public/fonts/helvetiker_regular.typeface.json` exists
- Try refreshing the page

### Scene Won't Load
- Check JSON file is valid
- Ensure file wasn't corrupted
- Try creating new scene and saving again

## Example Projects to Try

### 🔬 Chemistry Lab
1. Create benzene molecule
2. Add multiple atoms around it
3. Use different elements (H, O, N)
4. Observe CPK coloring

### 📐 Geometry Class
1. Create cube, sphere, cylinder
2. Arrange in a row
3. Change colors for each
4. Add 3D text labels

### 🎨 Art Installation
1. Create multiple torus shapes
2. Use glass material
3. Vary sizes and colors
4. Enable auto-rotate
5. Export beautiful screenshot

### 🧪 Water Molecule Study
1. Insert Water molecule
2. Observe bond angles
3. Duplicate molecule 5 times
4. Create ice crystal lattice

## Need Help?

- Check the full README at `/src/components/Diagram3D/README.md`
- Review implementation summary at `/3D_IMPLEMENTATION_SUMMARY.md`
- Report issues to development team

## Keyboard Reference Card

```
┌─────────────────────────────────────────────┐
│           3D WHITEBOARD CONTROLS            │
├─────────────────────────────────────────────┤
│  🖱️ LEFT CLICK + DRAG    → Rotate Camera   │
│  🖱️ RIGHT CLICK + DRAG   → Pan Camera      │
│  🖱️ SCROLL WHEEL         → Zoom In/Out     │
│  🖱️ CLICK OBJECT         → Select Object   │
│  🖱️ CLICK EMPTY SPACE    → Deselect All    │
│                                             │
│  📱 TWO-FINGER DRAG      → Rotate Camera   │
│  📱 PINCH                → Zoom In/Out     │
│  📱 TWO-FINGER SCROLL    → Pan Camera      │
└─────────────────────────────────────────────┘
```

## Quick Tips Summary

✨ **Start Simple**: Begin with one shape, learn the controls, then add more
🎯 **Use Grid**: Keep grid on while learning to understand positions
💾 **Save Often**: Save your work regularly (Download button)
🔬 **Try Molecules**: Pre-built molecules are a great learning tool
🎨 **Experiment**: Try different materials and colors
📐 **Numeric Input**: Use properties panel for precise control
🔄 **Auto-rotate**: Great for presentations and demos
📸 **Export**: Use export button to capture beautiful images

Enjoy creating in 3D! 🚀
