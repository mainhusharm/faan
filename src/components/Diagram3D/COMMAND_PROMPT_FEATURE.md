# 3D Command Prompt Feature

## Overview
The 3D Command Prompt feature allows students to create 3D objects using natural language commands instead of clicking buttons. This makes 3D creation intuitive and accessible through conversational commands.

## Components

### CommandInput.tsx
The main UI component that provides:
- Text input field for commands
- Command suggestions dropdown
- Command history (accessible with ↑↓ arrows)
- Help panel with example commands
- Real-time feedback display
- Loading states

### commandParser.ts
Parses natural language commands into structured data:
- **Pattern Matching**: Fast parsing for simple, common commands
- **AI Parsing**: Falls back to Google Gemini for complex/ambiguous commands
- **Smart Extraction**: Extracts colors, sizes, positions, materials, etc.
- **Suggestions**: Provides auto-complete suggestions as users type

### commandExecutor.ts
Executes parsed commands and creates 3D objects:
- Creates basic shapes (cube, sphere, cylinder, cone, torus, pyramid, plane)
- Creates 3D text objects
- Creates molecular structures
- Handles multiple objects and arrangements
- Manages object positioning, sizing, and materials

## Supported Commands

### Basic Shapes
```
create sphere
make cube
add cylinder
create cone
make pyramid
add torus
create plane
```

### Shapes with Colors
```
create red sphere
make blue cube
add yellow cylinder
create green cone
make orange pyramid
```

### Shapes with Sizes
```
create large sphere
make small cube
add tiny cylinder
create huge cone
make big pyramid
```

### Shapes with Materials
```
create metallic sphere
make transparent cube
add glowing cylinder
create wireframe cone
```

### Combined Properties
```
create large red metallic sphere
make small transparent blue cube
add tiny glowing yellow cylinder
```

### 3D Text
```
create text "Hello"
make 3D text "Physics"
add text "H2O"
create text "Welcome"
```

### Molecular Structures
```
create water molecule
make methane
add ethanol molecule
create benzene
make water
add methane molecule
```

### Positioned Objects
```
create sphere at center
make cube to the left
add cylinder to the right
create sphere above
make cube below
```

### Multiple Objects
```
create 5 spheres
make 3 red cubes
add 10 cylinders
create 5 spheres in a circle
make 4 cubes in a grid
add 6 spheres in a row
```

### Scene Management
```
clear
clear scene
delete all
remove all
```

## Implementation Details

### Command Processing Flow
1. User types command → "create blue sphere"
2. Submit triggers `handleCommand(command)`
3. Parse command using pattern matching or AI
4. Extract: action=create, shape=sphere, color=blue
5. Execute command to generate Object3DData
6. Add objects to scene
7. Show success feedback
8. Add command to history

### Color Recognition
The parser recognizes common color names and converts them to hex:
- red → #FF0000
- blue → #0000FF
- green → #00FF00
- yellow → #FFFF00
- orange → #FFA500
- purple → #800080
- etc.

### Size Recognition
Supports both named sizes and numeric values:
- tiny → 0.3
- small → 0.5
- medium → 1
- large → 2
- huge → 3
- Or numeric: "size 2.5", "radius 1.5"

### Position Recognition
Supports named positions and coordinates:
- Named: left, right, center, above, below
- Coordinates: "at 2,3,1" or "at x:2 y:3 z:1"

### Material Properties
Recognizes material keywords:
- metallic → high metalness, low roughness
- transparent → low opacity
- glowing → emissive intensity
- wireframe → wireframe mode

### AI Integration
For complex or ambiguous commands, the system uses Google Gemini AI:
- Sends command with structured prompt
- Receives parsed JSON response
- Falls back to pattern matching if AI fails
- Requires user to have Gemini API key configured

## Error Handling

### Unknown Shape
"Did you mean 'sphere'?" - Suggests similar shapes

### Missing Parameters
Uses sensible defaults:
- Color: Blue (#3b82f6)
- Size: Medium (1)
- Position: Center (0,0,0)

### Invalid Commands
Provides helpful error messages:
"Command not recognized. Try: 'create sphere', 'make red cube'"

### API Errors
Gracefully falls back to pattern matching if AI parsing fails

## User Experience Features

### Command History
- Press ↑ to browse previous commands
- Press ↓ to move forward in history
- Stores last 20 commands in localStorage

### Auto-Suggestions
- Shows suggestions as you type
- Click suggestion to auto-fill
- Context-aware suggestions

### Real-Time Feedback
- Success: ✓ Green message with details
- Error: ✗ Red message with helpful info
- Auto-dismisses after 5 seconds

### Help Panel
- Click lightbulb icon to show help
- Displays example commands
- Click example to auto-fill

### Visual Feedback
- Loading spinner during processing
- Disabled state while processing
- Selected object highlight after creation

## Integration

The CommandInput is integrated into Diagram3DContainer:
```tsx
<CommandInput
  onCommand={handleCommand}
  isProcessing={isProcessingCommand}
  feedback={commandFeedback}
/>
```

The handler:
1. Gets user's Gemini API key (if available)
2. Parses command (pattern matching or AI)
3. Executes command to generate objects
4. Adds objects to scene
5. Provides user feedback

## Future Enhancements

Possible future additions:
- Object modification: "make it bigger", "change color to red"
- Object deletion: "delete the red sphere"
- Camera control: "zoom to object", "rotate camera"
- Custom molecules: "create molecule with 1 carbon and 4 hydrogen"
- Advanced positioning: "between the sphere and cube"
- Batch operations: "create 10 random colored spheres"
- Voice commands integration
- Natural language queries: "how many objects are there?"

## Testing Commands

Try these commands to test the feature:
```
create sphere
make red cube
add blue cylinder
create water molecule
make metallic sphere
add transparent cube
create 3D text "Hello"
create large yellow sphere
add 5 spheres in a circle
create benzene molecule
make glowing red cylinder
clear scene
```

## Technical Notes

- Uses React hooks for state management
- Leverages Google Gemini AI for complex parsing
- Stores command history in localStorage
- Provides TypeScript type safety throughout
- Integrates with existing 3D object system
- Supports both pattern matching and AI parsing
- Graceful degradation when AI unavailable
