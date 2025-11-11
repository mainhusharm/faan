# Drawing Icon Selection Presets with Car Color Support

## Feature Overview

This feature adds a drawing preset selection system that allows users to:
1. **Select a drawing preset before drawing** - Users must choose what they want to draw (Car, House, Tree, Flower, etc.) from a visual icon selector
2. **Use preset-specific colors and styling** - Each preset comes with recommended colors that match the object type
3. **Create realistic-looking 3D objects** - The presets include color suggestions that make the resulting 3D objects look more realistic

## Implementation Details

### Files Modified/Created

#### 1. **src/lib/drawingPresets.ts** (NEW)
A new utility module that defines all drawing presets and their properties:

**Main Exports:**
- `DRAWING_PRESETS` - Array of all available drawing presets (Car, House, Tree, Flower, Star, Heart, Freeform)
- `CAR_PRESETS` - Specialized car presets (Sedan, SUV, Sports Car) with specific colors
- `DrawingPreset` interface - TypeScript interface for preset structure
- `CarPreset` interface - Extended interface for car-specific presets
- Helper functions:
  - `getPresetById()` - Get a preset by its ID
  - `getCarPresetById()` - Get a car preset by ID
  - `applyPresetStyling()` - Apply preset-specific color schemes

**Preset Properties:**
- `id` - Unique identifier
- `name` - Display name
- `icon` - Emoji icon for visual identification
- `description` - User-friendly description
- `defaultColor` - Initial color suggestion
- `suggestedColors` - Array of colors appropriate for this preset

#### 2. **src/components/DrawingOverlay.tsx** (MODIFIED)
Updated the drawing overlay component to include preset selection:

**Changes:**
1. Added imports for preset functionality
2. Added state management:
   - `selectedPreset` - Currently selected preset
3. Updated UI to show:
   - **Preset Selection View** - Grid of preset icons when no preset is selected
   - **Active Drawing View** - Drawing controls and color picker specific to selected preset
   - Ability to change presets mid-session with "Change Preset" button
4. Modified drawing logic:
   - Require preset selection before allowing drawing
   - Use preset-specific suggested colors in color picker
   - Include preset name in the shape name when converting
5. Fixed linting issues:
   - Removed unused imports
   - Removed unused state variables
   - Added proper dependency arrays

### Visual UI Changes

#### Preset Selection Screen
- Shows grid of preset icons with emojis
- Each preset is a clickable button with:
  - Large emoji icon (🚗, 🏠, 🌳, 🌸, ⭐, ❤️, ✏️)
  - Preset name below the icon
  - Hover effects (scale up, highlighted border)
  - Tooltip with description

#### Active Drawing Screen
- Header shows: 🖊️ Drawing: [Icon] [Preset Name]
- "Change Preset" button to switch presets
- Color picker showing only colors appropriate for the preset
- Preset name displayed in drawing ready confirmation

### Available Presets

1. **🚗 Car**
   - Default color: Red (#FF0000)
   - Suggested colors: Red, Blue, Black, White, Orange, Green
   - Recommended for: Drawing vehicles, transportation objects

2. **🏠 House**
   - Default color: Brown (#8B4513)
   - Suggested colors: Brown, Red, White, Tan, Black
   - Recommended for: Drawing buildings, structures

3. **🌳 Tree**
   - Default color: Green (#228B22)
   - Suggested colors: Green (various shades), Brown, Black
   - Recommended for: Drawing plants, nature scenes

4. **🌸 Flower**
   - Default color: Hot Pink (#FF1493)
   - Suggested colors: Hot Pink, Red, Yellow, Light Pink, Magenta
   - Recommended for: Drawing flowers, decorative objects

5. **⭐ Star**
   - Default color: Gold (#FFD700)
   - Suggested colors: Gold, Orange, Red, White, Cyan
   - Recommended for: Drawing stars, celestial objects

6. **❤️ Heart**
   - Default color: Red (#FF0000)
   - Suggested colors: Red (various shades), Magenta, Orange
   - Recommended for: Drawing love-related symbols

7. **✏️ Freeform**
   - Default color: Black (#000000)
   - Suggested colors: All basic colors
   - Recommended for: Drawing anything without preset constraints

### Car Preset Variants

The system includes specialized car presets with specific styling:

1. **Sedan**
   - Body: Red | Wheels: Black | Windows: Sky Blue

2. **SUV**
   - Body: Blue | Wheels: Dark Gray | Windows: Sky Blue

3. **Sports Car**
   - Body: Orange | Wheels: Black | Windows: Dark Blue

## How It Works

### Drawing Flow

1. **Preset Selection Phase**
   - User sees the preset selector UI with 7 preset options
   - User clicks on a preset icon (e.g., 🚗 Car)
   - Preset is selected and default color is applied

2. **Drawing Phase**
   - Drawing controls appear with preset name
   - Color picker shows only suggested colors for the preset
   - User draws on the canvas using mouse or touch
   - Drawing is rendered as freeform strokes

3. **Conversion Phase**
   - Once drawing has enough points (>5), "Drawing Ready!" message appears
   - User clicks "Convert to 3D" button
   - Drawing is converted to 3D mesh with:
     - Selected color
     - Preset name included in object name
     - Aspect ratio preserved for realistic proportions

4. **Preset Change**
   - User can click "Change Preset" button to return to preset selector
   - Canvas is cleared
   - User can select a different preset

## Color Styling System

Each preset has a `applyPresetStyling()` function that provides context-aware colors:

- **Primary color**: Usually the main object color (e.g., car body)
- **Secondary color**: Usually details or contrasting elements (e.g., wheels, roof)
- **Tertiary color**: Usually accents (e.g., windows, center highlights)

## Technical Architecture

### Type Safety
- Full TypeScript support with interfaces for presets
- Type-safe color suggestions
- Optional car-specific properties

### Performance
- Presets are defined as constants (no runtime computation)
- Color picker only renders suggested colors (smaller DOM)
- Efficient state management

### Accessibility
- Clear descriptions for each preset
- Emoji icons for visual clarity
- Color selection respects preset context
- Tooltip support for descriptions

## Integration with Existing 3D System

The presets integrate seamlessly with the existing 3D conversion system:

1. When a drawing is converted, it calls `onShapeRecognized()`
2. The 3D container creates a `custom_drawing` type object
3. The selected color is applied to the material
4. The preset name is included in the object label for organization

## Benefits

1. **Guided User Experience**: Users know what they should draw before starting
2. **Better Visual Results**: Preset colors make 3D objects look more realistic
3. **Organized Workflow**: Clear separation between preset selection and drawing
4. **Flexibility**: Can switch presets or draw freeform as needed
5. **Extensibility**: Easy to add new presets with different colors and styling

## Future Enhancements

Possible extensions:

1. **Custom Presets**: Allow users to create and save custom presets
2. **Preset Templates**: Show example drawings for each preset
3. **Advanced Styling**: More detailed color schemes (3-4 colors per preset)
4. **Preset Categories**: Group presets by category (Vehicles, Buildings, Nature, etc.)
5. **AI Recognition**: Suggest presets based on drawn shapes
6. **Preset Favorites**: Save favorite presets for quick access

## Testing Checklist

- [x] All presets appear in selector
- [x] Can select each preset
- [x] Color picker shows preset-specific colors
- [x] Can draw after preset selection
- [x] Cannot draw without preset selection
- [x] Can change preset mid-session
- [x] Canvas clears when changing preset
- [x] Conversion works with preset name
- [x] Build passes without errors
- [x] No linting errors in modified files
- [x] TypeScript types are correct
