import React, { useState, useRef, useEffect, useCallback, Suspense, lazy } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Pencil, 
  Eraser, 
  Circle, 
  Square, 
  Triangle,
  ArrowRight,
  Minus,
  Type,
  Undo2,
  Redo2,
  Trash2,
  Download,
  Send,
  Loader2,
  Sparkles,
  Grid3x3,
  AlertCircle,
  CheckCircle2,
  Box,
  Layers,
  Maximize2,
  Minimize2,
  Wand2,
  ChevronDown,
  ChevronUp,
  Pointer
} from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getUserApiKey } from '../lib/userApiKeys';
import type { Diagram3DHandle } from '../components/Diagram3D';
import { DrawingOverlay } from '../components/DrawingOverlay';

const Diagram3DContainer = lazy(() => 
  import('../components/Diagram3D/Diagram3DContainer')
);

type Tool = 'select' | 'pencil' | 'eraser' | 'rectangle' | 'circle' | 'triangle' | 'arrow' | 'line' | 'text';
type BackgroundType = 'plain' | 'grid' | 'dots' | 'ruled';
type ProcessingStep = 'idle' | 'analyzing' | 'completed' | 'error';
type ViewMode = '2d' | '3d' | 'draw-to-3d';

interface Point {
  x: number;
  y: number;
}

interface DrawingAction {
  tool: Tool;
  points: Point[];
  color: string;
  thickness: number;
  text?: string;
}

interface DiagramResult {
  description: string;
  concept: string;
  errors: string[];
  suggestions: string[];
  explanation: string;
  relatedTopics: string[];
}

const DiagramPage: React.FC = () => {
  const { user } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const diagram3DRef = useRef<Diagram3DHandle>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('3d');
  const [selectedTool, setSelectedTool] = useState<Tool>('select');
  const [color, setColor] = useState('#000000');
  const [thickness, setThickness] = useState(3);
  const [background, setBackground] = useState<BackgroundType>('plain');
  const [isDrawing, setIsDrawing] = useState(false);
  const [actions, setActions] = useState<DrawingAction[]>([]);
  const [currentAction, setCurrentAction] = useState<DrawingAction | null>(null);
  const [undoneActions, setUndoneActions] = useState<DrawingAction[]>([]);
  const [processingStep, setProcessingStep] = useState<ProcessingStep>('idle');
  const [result, setResult] = useState<DiagramResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  
  // 3D Command input state
  const [command, setCommand] = useState('');
  const [commandFeedback, setCommandFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isProcessingCommand, setIsProcessingCommand] = useState(false);
  
  // Draw-to-3D state
  const [drawTo3DColor, setDrawTo3DColor] = useState('#0000FF');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging3D, setIsDragging3D] = useState(false);
  
  // How-to panel collapse state
  const [isHowToCollapsed, setIsHowToCollapsed] = useState(true);

  const colors = ['#000000', '#0000FF', '#FF0000', '#00FF00', '#FFA500', '#800080', '#FFFF00', '#8B4513'];

  const loadApiKey = useCallback(async () => {
    if (!user) return;
    try {
      const savedKeys = localStorage.getItem('user_api_keys');
      if (savedKeys) {
        try {
          const parsedKeys = JSON.parse(savedKeys);
          const geminiKey = parsedKeys.find((k: { service_name: string; is_active: boolean; api_key: string }) => k.service_name === 'gemini' && k.is_active);
          if (geminiKey && geminiKey.api_key) {
            setApiKey(geminiKey.api_key);
          }
        } catch (parseError) {
          console.warn('Failed to parse saved API keys:', parseError);
        }
      }

      setTimeout(async () => {
        try {
          const key = await getUserApiKey(user.id, 'gemini');
          if (key) {
            setApiKey(key);
          }
        } catch (dbError) {
          console.warn('Database load failed, using localStorage:', dbError);
        }
      }, 100);
    } catch (error) {
      console.error('Error loading API key:', error);
      setApiKey(null);
    }
  }, [user]);

  useEffect(() => {
    loadApiKey();
  }, [loadApiKey]);

  // Listen for fullscreen changes (ESC key, etc.)
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      console.log('Fullscreen state changed:', isCurrentlyFullscreen);
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const drawBackground = useCallback((ctx: CanvasRenderingContext2D) => {
    if (!ctx || !ctx.canvas) return;
    
    try {
      const canvas = ctx.canvas;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (background === 'grid') {
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        const gridSize = 20;
        
        for (let x = 0; x <= canvas.width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        
        for (let y = 0; y <= canvas.height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
      } else if (background === 'dots') {
        ctx.fillStyle = '#d0d0d0';
        const dotSize = 2;
        const spacing = 20;
        
        for (let x = spacing; x < canvas.width; x += spacing) {
          for (let y = spacing; y < canvas.height; y += spacing) {
            ctx.beginPath();
            ctx.arc(x, y, dotSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      } else if (background === 'ruled') {
        ctx.strokeStyle = '#d0d0d0';
        ctx.lineWidth = 1;
        const lineSpacing = 30;
        
        for (let y = lineSpacing; y < canvas.height; y += lineSpacing) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
      }
    } catch (error) {
      console.error('Error drawing background:', error);
    }
  }, [background]);

  const drawAction = useCallback((ctx: CanvasRenderingContext2D, action: DrawingAction) => {
    if (!action || !action.points || action.points.length === 0) return;

    try {
      ctx.strokeStyle = action.color || '#000000';
      ctx.fillStyle = action.color || '#000000';
      ctx.lineWidth = action.thickness || 1;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (action.tool === 'pencil') {
        ctx.globalCompositeOperation = 'source-over';
        ctx.beginPath();
        ctx.moveTo(action.points[0].x, action.points[0].y);
        action.points.forEach(point => {
          if (point && typeof point.x === 'number' && typeof point.y === 'number') {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
      } else if (action.tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.moveTo(action.points[0].x, action.points[0].y);
        action.points.forEach(point => {
          if (point && typeof point.x === 'number' && typeof point.y === 'number') {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
        ctx.globalCompositeOperation = 'source-over';
      } else if (action.points.length >= 2) {
        const start = action.points[0];
        const end = action.points[action.points.length - 1];
        
        if (!start || !end) return;
        
        if (action.tool === 'rectangle') {
          const width = end.x - start.x;
          const height = end.y - start.y;
          ctx.strokeRect(start.x, start.y, width, height);
        } else if (action.tool === 'circle') {
          const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
          ctx.beginPath();
          ctx.arc(start.x, start.y, radius, 0, Math.PI * 2);
          ctx.stroke();
        } else if (action.tool === 'triangle') {
          const width = end.x - start.x;
          ctx.beginPath();
          ctx.moveTo(start.x + width / 2, start.y);
          ctx.lineTo(start.x, end.y);
          ctx.lineTo(end.x, end.y);
          ctx.closePath();
          ctx.stroke();
        } else if (action.tool === 'line') {
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.stroke();
        } else if (action.tool === 'arrow') {
          const headLength = 15;
          const angle = Math.atan2(end.y - start.y, end.x - start.x);
          
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(end.x, end.y);
          ctx.lineTo(
            end.x - headLength * Math.cos(angle - Math.PI / 6),
            end.y - headLength * Math.sin(angle - Math.PI / 6)
          );
          ctx.moveTo(end.x, end.y);
          ctx.lineTo(
            end.x - headLength * Math.cos(angle + Math.PI / 6),
            end.y - headLength * Math.sin(angle + Math.PI / 6)
          );
          ctx.stroke();
        }
      }

      if (action.tool === 'text' && action.text && action.points[0]) {
        ctx.font = `${(action.thickness || 3) * 6}px Arial`;
        ctx.fillText(action.text, action.points[0].x, action.points[0].y);
      }
    } catch (error) {
      console.error('Error drawing action:', error, action);
    }
  }, []);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      drawBackground(ctx);

      actions.forEach(action => {
        drawAction(ctx, action);
      });
    } catch (error) {
      console.error('Error redrawing canvas:', error);
    }
  }, [actions, drawBackground, drawAction]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsCanvasReady(true);

    // Set canvas size
    const updateCanvasSize = () => {
      try {
        const container = canvas.parentElement;
        if (!container) return;
        
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        // Only update if dimensions are valid
        if (width > 0 && height > 0) {
          canvas.width = width;
          canvas.height = height;
          
          // Redraw background and actions
          const ctx = canvas.getContext('2d');
          if (ctx) {
            drawBackground(ctx);
            actions.forEach(action => {
              drawAction(ctx, action);
            });
          }
        }
      } catch (error) {
        console.error('Error updating canvas size:', error);
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [background, actions, drawBackground, drawAction]);

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>): Point | null => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const rect = canvas.getBoundingClientRect();
      
      if ('touches' in e) {
        if (e.touches.length === 0) return null;
        return {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top
        };
      } else {
        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
      }
    } catch (error) {
      console.error('Error getting mouse position:', error);
      return null;
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isCanvasReady) return;

    try {
      const pos = getMousePos(e);
      if (!pos) return;

      // Don't draw if select tool is active
      if (selectedTool === 'select') {
        return;
      }

      if (selectedTool === 'text') {
        const text = prompt('Enter text:');
        if (text) {
          const newAction: DrawingAction = {
            tool: 'text',
            points: [pos],
            color,
            thickness,
            text
          };
          setActions([...actions, newAction]);
          setUndoneActions([]);
        }
        return;
      }

      setIsDrawing(true);
      setCurrentAction({
        tool: selectedTool,
        points: [pos],
        color,
        thickness
      });
      setUndoneActions([]);
    } catch (error) {
      console.error('Error handling mouse down:', error);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentAction || !isCanvasReady) return;

    try {
      const pos = getMousePos(e);
      if (!pos) return;

      if (selectedTool === 'pencil' || selectedTool === 'eraser') {
        setCurrentAction({
          ...currentAction,
          points: [...currentAction.points, pos]
        });
        
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        drawAction(ctx, {
          ...currentAction,
          points: [...currentAction.points, pos]
        });
      } else {
        if (!currentAction.points || currentAction.points.length === 0) return;
        
        setCurrentAction({
          ...currentAction,
          points: [currentAction.points[0], pos]
        });
        
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        redrawCanvas();
        drawAction(ctx, {
          ...currentAction,
          points: [currentAction.points[0], pos]
        });
      }
    } catch (error) {
      console.error('Error handling mouse move:', error);
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && currentAction) {
      setActions([...actions, currentAction]);
      setCurrentAction(null);
    }
    setIsDrawing(false);
  };

  const handleUndo = () => {
    if (actions.length === 0) return;
    const lastAction = actions[actions.length - 1];
    setUndoneActions([...undoneActions, lastAction]);
    setActions(actions.slice(0, -1));
  };

  const handleRedo = () => {
    if (undoneActions.length === 0) return;
    const actionToRedo = undoneActions[undoneActions.length - 1];
    setActions([...actions, actionToRedo]);
    setUndoneActions(undoneActions.slice(0, -1));
  };

  const handleClear = () => {
    setShowClearDialog(true);
  };

  const confirmClear = () => {
    try {
      setActions([]);
      setUndoneActions([]);
      setCurrentAction(null);
      setResult(null);
      setError(null);
      setShowClearDialog(false);
      
      // Redraw canvas after state updates
      setTimeout(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        drawBackground(ctx);
      }, 0);
    } catch (error) {
      console.error('Error clearing canvas:', error);
      setError('Failed to clear canvas. Please try again.');
    }
  };

  const handleDownload = () => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) {
        setError('Canvas not ready. Please try again.');
        return;
      }

      canvas.toBlob((blob) => {
        try {
          if (!blob) {
            setError('Failed to create image. Please try again.');
            return;
          }
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `diagram-${Date.now()}.png`;
          a.click();
          URL.revokeObjectURL(url);
        } catch (error) {
          console.error('Error downloading canvas:', error);
          setError('Failed to download image. Please try again.');
        }
      });
    } catch (error) {
      console.error('Error preparing download:', error);
      setError('Failed to prepare download. Please try again.');
    }
  };

  const handleAnalyze = async () => {
    if (!apiKey) {
      setError('Please set up your Gemini API key in Settings first.');
      return;
    }

    if (actions.length === 0) {
      setError('Please draw something first before analyzing.');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      setError('Canvas not ready. Please try again.');
      return;
    }

    setProcessingStep('analyzing');
    setError(null);
    setResult(null);

    try {
      canvas.toBlob(async (blob) => {
        try {
          if (!blob) {
            setError('Failed to convert canvas to image. Please try again.');
            setProcessingStep('error');
            return;
          }

          const reader = new FileReader();
          
          reader.onerror = () => {
            console.error('Error reading canvas image');
            setError('Failed to read canvas image. Please try again.');
            setProcessingStep('error');
          };
          
          reader.onload = async () => {
            try {
              if (!reader.result || typeof reader.result !== 'string') {
                setError('Failed to process canvas image. Please try again.');
                setProcessingStep('error');
                return;
              }

              const base64Data = reader.result.split(',')[1];
              if (!base64Data) {
                setError('Failed to extract image data. Please try again.');
                setProcessingStep('error');
                return;
              }
              
              const genAI = new GoogleGenerativeAI(apiKey);
              const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

              const prompt = `You are an expert educational AI assistant specialized in analyzing diagrams, flowcharts, graphs, molecular structures, and visual representations. Analyze this diagram and provide a comprehensive educational response in JSON format.

Please provide:
1. A detailed description of what is drawn in the diagram
2. Identify the concept or topic being represented
3. Detect any errors, misconceptions, or missing elements
4. Provide constructive suggestions for improvement
5. Explain the concept in detail with educational context
6. List related topics the student should explore

Return ONLY a valid JSON object with this exact structure:
{
  "description": "detailed description of what is in the diagram",
  "concept": "the concept/topic being represented",
  "subject_area": "Math/Science/Biology/Chemistry/Physics/Computer Science/etc",
  "errors": ["error 1", "error 2"],
  "suggestions": ["suggestion 1", "suggestion 2"],
  "explanation": "comprehensive explanation of the concept with educational context",
  "related_topics": ["topic 1", "topic 2", "topic 3"],
  "correctness_score": 0.85,
  "completeness_score": 0.75
}`;

              const imageParts = [
                {
                  inlineData: {
                    data: base64Data,
                    mimeType: 'image/png'
                  }
                }
              ];

              const result = await model.generateContent([prompt, ...imageParts]);
              const response = await result.response;
              const text = response.text();

              let jsonText = text;
              if (text.includes('```json')) {
                jsonText = text.split('```json')[1].split('```')[0].trim();
              } else if (text.includes('```')) {
                jsonText = text.split('```')[1].split('```')[0].trim();
              }

              const aiResponse = JSON.parse(jsonText);

              setResult({
                description: aiResponse.description || 'No description available',
                concept: aiResponse.concept || 'Unknown concept',
                errors: Array.isArray(aiResponse.errors) ? aiResponse.errors : [],
                suggestions: Array.isArray(aiResponse.suggestions) ? aiResponse.suggestions : [],
                explanation: aiResponse.explanation || 'No explanation available',
                relatedTopics: Array.isArray(aiResponse.related_topics) ? aiResponse.related_topics : []
              });

              setProcessingStep('completed');
            } catch (error) {
              console.error('Error analyzing diagram:', error);
              const errorMessage = error instanceof Error ? error.message : 'Failed to analyze diagram. Please try again.';
              setError(errorMessage);
              setProcessingStep('error');
            }
          };
          
          reader.readAsDataURL(blob);
        } catch (error) {
          console.error('Error in blob callback:', error);
          setError('Failed to process canvas image. Please try again.');
          setProcessingStep('error');
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error preparing diagram for analysis:', error);
      setError('Failed to prepare diagram for analysis. Please try again.');
      setProcessingStep('error');
    }
  };

  // Command parsing helper functions for 3D mode
  const extractColor = (input: string): string | undefined => {
    const colorMap: Record<string, string> = {
      red: '#FF0000',
      blue: '#0000FF',
      green: '#00FF00',
      yellow: '#FFFF00',
      orange: '#FFA500',
      purple: '#800080',
      pink: '#FFC0CB',
      white: '#FFFFFF',
      black: '#000000',
      gray: '#808080',
      grey: '#808080',
      cyan: '#00FFFF',
      magenta: '#FF00FF',
      brown: '#8B4513',
    };
    
    const lowerInput = input.toLowerCase();
    for (const [colorName, colorHex] of Object.entries(colorMap)) {
      if (lowerInput.includes(colorName)) {
        return colorHex;
      }
    }
    return undefined;
  };

  const extractSize = (input: string): number => {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('large') || lowerInput.includes('big')) return 2;
    if (lowerInput.includes('small') || lowerInput.includes('tiny')) return 0.5;
    if (lowerInput.includes('huge') || lowerInput.includes('giant')) return 3;
    return 1; // Default medium size
  };

  const handleCommandGenerate = () => {
    if (!command.trim()) {
      setCommandFeedback({ type: 'error', message: 'Please enter a command' });
      setTimeout(() => setCommandFeedback(null), 3000);
      return;
    }

    if (!diagram3DRef.current) {
      setCommandFeedback({ type: 'error', message: '3D environment not ready yet' });
      setTimeout(() => setCommandFeedback(null), 3000);
      return;
    }

    setIsProcessingCommand(true);
    const lowerCommand = command.toLowerCase().trim();
    const color = extractColor(command);
    const size = extractSize(command);

    try {
      // Check for molecules first
      if (lowerCommand.includes('water') || lowerCommand.includes('h2o')) {
        diagram3DRef.current.createMolecule('water');
        setCommandFeedback({ type: 'success', message: '✅ Created water molecule (H₂O)' });
        setCommand('');
      } else if (lowerCommand.includes('methane') || lowerCommand.includes('ch4')) {
        diagram3DRef.current.createMolecule('methane');
        setCommandFeedback({ type: 'success', message: '✅ Created methane molecule (CH₄)' });
        setCommand('');
      } else if (lowerCommand.includes('ethanol') || lowerCommand.includes('alcohol')) {
        diagram3DRef.current.createMolecule('ethanol');
        setCommandFeedback({ type: 'success', message: '✅ Created ethanol molecule (C₂H₅OH)' });
        setCommand('');
      } else if (lowerCommand.includes('benzene')) {
        diagram3DRef.current.createMolecule('benzene');
        setCommandFeedback({ type: 'success', message: '✅ Created benzene molecule (C₆H₆)' });
        setCommand('');
      }
      // Check for animals
      else if (lowerCommand.includes('zebra')) {
        diagram3DRef.current.createAnimal('zebra');
        setCommandFeedback({ type: 'success', message: '✅ Created zebra' });
        setCommand('');
      } else if (lowerCommand.includes('dog') || lowerCommand.includes('puppy')) {
        diagram3DRef.current.createAnimal('dog');
        setCommandFeedback({ type: 'success', message: '✅ Created dog' });
        setCommand('');
      } else if (lowerCommand.includes('cat') || lowerCommand.includes('kitten')) {
        diagram3DRef.current.createAnimal('cat');
        setCommandFeedback({ type: 'success', message: '✅ Created cat' });
        setCommand('');
      } else if (lowerCommand.includes('bird') || lowerCommand.includes('eagle') || lowerCommand.includes('hawk')) {
        diagram3DRef.current.createAnimal('bird');
        setCommandFeedback({ type: 'success', message: '✅ Created bird' });
        setCommand('');
      } else if (lowerCommand.includes('fish') || lowerCommand.includes('salmon')) {
        diagram3DRef.current.createAnimal('fish');
        setCommandFeedback({ type: 'success', message: '✅ Created fish' });
        setCommand('');
      } else if (lowerCommand.includes('elephant')) {
        diagram3DRef.current.createAnimal('elephant');
        setCommandFeedback({ type: 'success', message: '✅ Created elephant' });
        setCommand('');
      } else if (lowerCommand.includes('monkey') || lowerCommand.includes('ape') || lowerCommand.includes('primate')) {
        diagram3DRef.current.createAnimal('monkey');
        setCommandFeedback({ type: 'success', message: '✅ Created monkey' });
        setCommand('');
      }
      // Check for basic shapes
      else if (lowerCommand.includes('sphere') || lowerCommand.includes('ball')) {
        diagram3DRef.current.createObject('sphere', color, size);
        const colorName = color ? `${Object.keys({ red: '#FF0000', blue: '#0000FF', green: '#00FF00', yellow: '#FFFF00', orange: '#FFA500', purple: '#800080' }).find(key => ({ red: '#FF0000', blue: '#0000FF', green: '#00FF00', yellow: '#FFFF00', orange: '#FFA500', purple: '#800080' }[key as keyof typeof color] === color))} ` : '';
        const sizeName = size === 2 ? 'large ' : size === 0.5 ? 'small ' : '';
        setCommandFeedback({ type: 'success', message: `✅ Created ${sizeName}${colorName}sphere` });
        setCommand('');
      } else if (lowerCommand.includes('cube') || lowerCommand.includes('box')) {
        diagram3DRef.current.createObject('cube', color, size);
        const colorDesc = color ? 'colored ' : '';
        const sizeDesc = size === 2 ? 'large ' : size === 0.5 ? 'small ' : '';
        setCommandFeedback({ type: 'success', message: `✅ Created ${sizeDesc}${colorDesc}cube` });
        setCommand('');
      } else if (lowerCommand.includes('cylinder')) {
        diagram3DRef.current.createObject('cylinder', color, size);
        setCommandFeedback({ type: 'success', message: '✅ Created cylinder' });
        setCommand('');
      } else if (lowerCommand.includes('cone')) {
        diagram3DRef.current.createObject('cone', color, size);
        setCommandFeedback({ type: 'success', message: '✅ Created cone' });
        setCommand('');
      } else if (lowerCommand.includes('torus') || lowerCommand.includes('donut') || lowerCommand.includes('ring')) {
        diagram3DRef.current.createObject('torus', color, size);
        setCommandFeedback({ type: 'success', message: '✅ Created torus' });
        setCommand('');
      } else if (lowerCommand.includes('pyramid')) {
        diagram3DRef.current.createObject('pyramid', color, size);
        setCommandFeedback({ type: 'success', message: '✅ Created pyramid' });
        setCommand('');
      } else if (lowerCommand.includes('plane') || lowerCommand.includes('floor') || lowerCommand.includes('platform')) {
        diagram3DRef.current.createObject('plane', color, size);
        setCommandFeedback({ type: 'success', message: '✅ Created plane' });
        setCommand('');
      } else {
        setCommandFeedback({ 
          type: 'error', 
          message: '❌ Unknown command. Try: "create sphere", "make red cube", "add water molecule", or "create zebra"' 
        });
      }

      // Clear feedback after 3 seconds
      setTimeout(() => setCommandFeedback(null), 3000);
    } catch (error) {
      console.error('Error executing command:', error);
      setCommandFeedback({ type: 'error', message: '❌ Failed to execute command' });
      setTimeout(() => setCommandFeedback(null), 3000);
    } finally {
      setIsProcessingCommand(false);
    }
  };

  const handleCommandKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommandGenerate();
    }
  };

  const handleShapeRecognized = (objectType: string, color: string, size: number, shapeName: string, aspectRatio?: number, points?: Array<{ x: number; y: number }>) => {
    if (!diagram3DRef.current) {
      setCommandFeedback({ type: 'error', message: '3D environment not ready' });
      setTimeout(() => setCommandFeedback(null), 3000);
      return;
    }

    try {
      diagram3DRef.current.createObject(objectType, color, size, aspectRatio, points);
      setCommandFeedback({
        type: 'success',
        message: `✅ Created 3D mesh from your drawing!`
      });
      setTimeout(() => setCommandFeedback(null), 3000);
    } catch (error) {
      console.error('Error creating 3D object:', error);
      setCommandFeedback({ type: 'error', message: '❌ Failed to create 3D object' });
      setTimeout(() => setCommandFeedback(null), 3000);
    }
  };

  const toggleFullscreen = async () => {
    const canvasContainer = document.getElementById('canvas-container-3d');
    
    if (!canvasContainer) {
      console.error('Canvas container not found');
      setCommandFeedback({ type: 'error', message: '❌ Canvas container not ready' });
      setTimeout(() => setCommandFeedback(null), 3000);
      return;
    }
    
    if (!document.fullscreenElement) {
      // Enter fullscreen
      console.log('Entering fullscreen mode...');
      try {
        if (canvasContainer.requestFullscreen) {
          await canvasContainer.requestFullscreen();
          console.log('✅ Fullscreen activated');
        } else if ((canvasContainer as any).webkitRequestFullscreen) {
          await (canvasContainer as any).webkitRequestFullscreen();
          console.log('✅ Fullscreen activated (webkit)');
        } else if ((canvasContainer as any).mozRequestFullScreen) {
          await (canvasContainer as any).mozRequestFullScreen();
          console.log('✅ Fullscreen activated (moz)');
        } else if ((canvasContainer as any).msRequestFullscreen) {
          await (canvasContainer as any).msRequestFullscreen();
          console.log('✅ Fullscreen activated (ms)');
        } else {
          console.error('Fullscreen API not supported');
          setCommandFeedback({ type: 'error', message: '❌ Fullscreen not supported in this browser' });
          setTimeout(() => setCommandFeedback(null), 3000);
        }
      } catch (error) {
        console.error('Error entering fullscreen:', error);
        setCommandFeedback({ type: 'error', message: `❌ Fullscreen failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
        setTimeout(() => setCommandFeedback(null), 3000);
      }
    } else {
      // Exit fullscreen
      console.log('Exiting fullscreen mode...');
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
          console.log('✅ Exited fullscreen');
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
          console.log('✅ Exited fullscreen (webkit)');
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
          console.log('✅ Exited fullscreen (moz)');
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
          console.log('✅ Exited fullscreen (ms)');
        }
      } catch (error) {
        console.error('Error exiting fullscreen:', error);
        setCommandFeedback({ type: 'error', message: `❌ Exit fullscreen failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
        setTimeout(() => setCommandFeedback(null), 3000);
      }
    }
  };

  const tools = [
    { id: 'select' as Tool, icon: Pointer, label: 'Select' },
    { id: 'pencil' as Tool, icon: Pencil, label: 'Pencil' },
    { id: 'eraser' as Tool, icon: Eraser, label: 'Eraser' },
    { id: 'rectangle' as Tool, icon: Square, label: 'Rectangle' },
    { id: 'circle' as Tool, icon: Circle, label: 'Circle' },
    { id: 'triangle' as Tool, icon: Triangle, label: 'Triangle' },
    { id: 'arrow' as Tool, icon: ArrowRight, label: 'Arrow' },
    { id: 'line' as Tool, icon: Minus, label: 'Line' },
    { id: 'text' as Tool, icon: Type, label: 'Text' }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Please Sign In
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            You need to be signed in to use the diagram analysis feature.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  AI Diagram Analysis
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Draw diagrams and get instant AI feedback and explanations
                </p>
              </div>
            </div>
            
            {/* Mode Toggle */}
            <div className="flex items-center space-x-2 p-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <button
                onClick={() => setViewMode('2d')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === '2d'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Layers className="h-5 w-5" />
                <span>2D Draw</span>
              </button>
              <button
                onClick={() => setViewMode('3d')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === '3d'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Box className="h-5 w-5" />
                <span>3D Scene</span>
              </button>
              <button
                onClick={() => setViewMode('draw-to-3d')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === 'draw-to-3d'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Wand2 className="h-5 w-5" />
                <span>Draw→3D</span>
              </button>
            </div>
          </div>
        </div>

        {!apiKey && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Gemini API Key Required
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Please set up your Gemini API key in Settings to use the AI analysis feature.
                </p>
                <a
                  href="/api-settings"
                  className="inline-flex items-center mt-2 text-sm font-medium text-yellow-800 dark:text-yellow-200 hover:text-yellow-900 dark:hover:text-yellow-100 underline"
                >
                  Go to Settings →
                </a>
              </div>
            </div>
          </div>
        )}

        <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-gray-50 dark:bg-gray-900 p-4' : ''}`}>
          {isFullscreen && (
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Diagram Workspace
              </h2>
              <button
                onClick={toggleFullscreen}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <Minimize2 className="h-5 w-5" />
                <span>Exit Fullscreen</span>
              </button>
            </div>
          )}

        <div className={`grid ${isFullscreen ? 'grid-cols-1' : isHowToCollapsed ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'} gap-6`}>
          {/* Drawing Area */}
          <div className={isFullscreen ? 'col-span-1' : isHowToCollapsed ? 'col-span-1' : 'lg:col-span-2'}>
            {viewMode === '2d' ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                {/* Toolbar */}
                <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Drawing Tools */}
                  <div className="flex items-center space-x-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    {tools.map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <button
                          key={tool.id}
                          onClick={() => setSelectedTool(tool.id)}
                          className={`p-2 rounded-lg transition-all ${
                            selectedTool === tool.id
                              ? 'bg-indigo-600 text-white shadow-lg'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                          title={tool.label}
                        >
                          <Icon className="h-5 w-5" />
                        </button>
                      );
                    })}
                  </div>

                  {/* Color Picker */}
                  <div className="flex items-center space-x-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    {colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={`w-8 h-8 rounded-lg border-2 transition-all ${
                          color === c
                            ? 'border-indigo-600 scale-110 shadow-lg'
                            : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                  </div>

                  {/* Thickness Slider */}
                  <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                      Size:
                    </span>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={thickness}
                      onChange={(e) => setThickness(Number(e.target.value))}
                      className="w-20"
                    />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300 w-6">
                      {thickness}
                    </span>
                  </div>

                  {/* Background Toggle */}
                  <div className="flex items-center space-x-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    {(['plain', 'grid', 'dots', 'ruled'] as BackgroundType[]).map((bg) => (
                      <button
                        key={bg}
                        onClick={() => setBackground(bg)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                          background === bg
                            ? 'bg-indigo-600 text-white'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {bg}
                      </button>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-1 ml-auto">
                    <button
                      onClick={handleUndo}
                      disabled={actions.length === 0}
                      className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      title="Undo"
                    >
                      <Undo2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleRedo}
                      disabled={undoneActions.length === 0}
                      className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      title="Redo"
                    >
                      <Redo2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleClear}
                      className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                      title="Clear Canvas"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleDownload}
                      className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                      title="Download"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                    <button
                      onClick={toggleFullscreen}
                      className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                      title="Toggle Fullscreen"
                    >
                      {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Canvas */}
              <div className="relative bg-white" style={{ height: isFullscreen ? 'calc(100vh - 180px)' : 'calc(100vh - 250px)', minHeight: '600px' }}>
                <canvas
                   ref={canvasRef}
                   onMouseDown={handleMouseDown}
                   onMouseMove={handleMouseMove}
                   onMouseUp={handleMouseUp}
                   onMouseLeave={handleMouseUp}
                   onTouchStart={handleMouseDown}
                   onTouchMove={handleMouseMove}
                   onTouchEnd={handleMouseUp}
                   className={`w-full h-full touch-none ${selectedTool === 'select' ? 'cursor-default' : 'cursor-crosshair'}`}
                   style={{ touchAction: 'none' }}
                 />
              </div>

              {/* Analyze Button */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <button
                  onClick={handleAnalyze}
                  disabled={processingStep === 'analyzing' || !apiKey || actions.length === 0}
                  className="w-full py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 hover:from-indigo-700 hover:via-purple-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  title={
                    !apiKey 
                      ? 'Please configure your Gemini API key in Settings first'
                      : actions.length === 0 
                      ? 'Draw something on the canvas first'
                      : processingStep === 'analyzing'
                      ? 'Analysis in progress...'
                      : 'Analyze your diagram with AI'
                  }
                >
                  {processingStep === 'analyzing' ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Analyze with AI</span>
                    </>
                  )}
                </button>
                {!apiKey && (
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2 text-center">
                    Configure your Gemini API key in Settings to enable analysis
                  </p>
                )}
                {apiKey && actions.length === 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                    Draw a diagram on the canvas to analyze it
                  </p>
                )}
              </div>
            </div>
            ) : viewMode === '3d' ? (
              <div className="space-y-4">
                {/* Command Input Box - CRITICAL! */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Sparkles className="h-5 w-5 text-indigo-600" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Create 3D Objects with Commands
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="text"
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        onKeyPress={handleCommandKeyPress}
                        placeholder="Type a command: create sphere, make red cube, add water molecule..."
                        className="flex-1 px-4 py-3 text-base border-2 border-gray-300 dark:border-gray-600 rounded-xl 
                                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                   placeholder-gray-500 dark:placeholder-gray-400 shadow-sm"
                        disabled={isProcessingCommand}
                      />
                      <button
                        onClick={handleCommandGenerate}
                        disabled={isProcessingCommand || !command.trim()}
                        className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 
                                   hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed 
                                   transition-all shadow-lg hover:shadow-xl flex items-center space-x-2"
                      >
                        {isProcessingCommand ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Creating...</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-5 w-5" />
                            <span>Generate</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={toggleFullscreen}
                        className="px-4 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 
                                   hover:bg-gray-200 dark:hover:bg-gray-600 transition-all shadow-lg hover:shadow-xl 
                                   flex items-center space-x-2 border-2 border-gray-300 dark:border-gray-600"
                        title={isFullscreen ? "Exit Fullscreen (ESC)" : "Enter Fullscreen"}
                      >
                        {isFullscreen ? (
                          <>
                            <Minimize2 className="h-5 w-5" />
                            <span>Exit</span>
                          </>
                        ) : (
                          <>
                            <Maximize2 className="h-5 w-5" />
                            <span>Fullscreen</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Feedback Message */}
                  {commandFeedback && (
                    <div className={`mt-3 p-3 rounded-lg ${
                      commandFeedback.type === 'success' 
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
                        : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
                    }`}>
                      <p className="text-sm font-medium">{commandFeedback.message}</p>
                    </div>
                  )}

                  {/* Example Commands */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      📝 Try these commands:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setCommand('create sphere')}
                        className="text-left px-3 py-2 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 
                                   text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                      >
                        "create sphere"
                      </button>
                      <button
                        onClick={() => setCommand('make red cube')}
                        className="text-left px-3 py-2 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 
                                   text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                      >
                        "make red cube"
                      </button>
                      <button
                        onClick={() => setCommand('add blue cylinder')}
                        className="text-left px-3 py-2 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 
                                   text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                      >
                        "add blue cylinder"
                      </button>
                      <button
                        onClick={() => setCommand('create water molecule')}
                        className="text-left px-3 py-2 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 
                                   text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                      >
                        "create water molecule"
                      </button>
                      <button
                        onClick={() => setCommand('make large green sphere')}
                        className="text-left px-3 py-2 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 
                                   text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                      >
                        "make large green sphere"
                      </button>
                      <button
                        onClick={() => setCommand('add methane')}
                        className="text-left px-3 py-2 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 
                                   text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                      >
                        "add methane"
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3D Viewport */}
                <div 
                  id="canvas-container-3d"
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden" 
                  style={{ 
                    height: isFullscreen ? '100vh' : 'calc(100vh - 350px)', 
                    minHeight: isFullscreen ? '100vh' : '600px',
                    width: isFullscreen ? '100vw' : '100%'
                  }}
                >
                  {/* Fullscreen Exit Button */}
                  {isFullscreen && (
                    <div className="absolute top-4 right-4 z-50">
                      <button
                        onClick={toggleFullscreen}
                        className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-900/80 text-white hover:bg-gray-900 transition-colors shadow-xl"
                      >
                        <Minimize2 className="h-5 w-5" />
                        <span className="font-medium">Exit Fullscreen</span>
                      </button>
                    </div>
                  )}
                  
                  <Suspense fallback={
                    <div className="h-full flex items-center justify-center">
                      <div className="flex flex-col items-center space-y-3">
                        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                        <p className="text-gray-600 dark:text-gray-400">Loading 3D Environment...</p>
                      </div>
                    </div>
                  }>
                    <Diagram3DContainer ref={diagram3DRef} />
                  </Suspense>
                </div>
              </div>
            ) : (
              // Draw-to-3D Mode
              <div className="space-y-4">
                {/* Info Card with Fullscreen Button */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl shadow-xl p-6 border-2 border-purple-200 dark:border-purple-800">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Wand2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Draw 2D Shapes → Convert to 3D
                      </h3>
                    </div>
                    <button
                      onClick={toggleFullscreen}
                      className="px-4 py-2 rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 
                                 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all shadow-lg hover:shadow-xl 
                                 flex items-center space-x-2 border-2 border-purple-300 dark:border-purple-600"
                      title={isFullscreen ? "Exit Fullscreen (ESC)" : "Enter Fullscreen"}
                    >
                      {isFullscreen ? (
                        <>
                          <Minimize2 className="h-5 w-5" />
                          <span>Exit</span>
                        </>
                      ) : (
                        <>
                          <Maximize2 className="h-5 w-5" />
                          <span>Fullscreen</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Draw shapes on the canvas overlay below. The system will recognize what you drew and convert it to a 3D object!
                  </p>
                </div>

                {/* Feedback Message */}
                {commandFeedback && (
                  <div className={`p-4 rounded-xl ${
                    commandFeedback.type === 'success' 
                      ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
                      : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
                  }`}>
                    <p className="text-sm font-medium">{commandFeedback.message}</p>
                  </div>
                )}

                {/* 3D Viewport with Drawing Overlay */}
                <div 
                  id="canvas-container-3d"
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden relative" 
                  style={{ 
                    height: isFullscreen ? '100vh' : 'calc(100vh - 350px)', 
                    minHeight: isFullscreen ? '100vh' : '600px',
                    width: isFullscreen ? '100vw' : '100%'
                  }}
                >
                  {/* Fullscreen Exit Button */}
                  {isFullscreen && (
                    <div className="absolute top-4 right-4 z-50">
                      <button
                        onClick={toggleFullscreen}
                        className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-900/80 text-white hover:bg-gray-900 transition-colors shadow-xl"
                      >
                        <Minimize2 className="h-5 w-5" />
                        <span className="font-medium">Exit Fullscreen</span>
                      </button>
                    </div>
                  )}
                  
                  <Suspense fallback={
                    <div className="h-full flex items-center justify-center">
                      <div className="flex flex-col items-center space-y-3">
                        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                        <p className="text-gray-600 dark:text-gray-400">Loading 3D Environment...</p>
                      </div>
                    </div>
                  }>
                    <Diagram3DContainer ref={diagram3DRef} onDragStateChange={setIsDragging3D} />
                  </Suspense>
                  
                  {/* Drawing Overlay */}
                  <DrawingOverlay
                    isActive={viewMode === 'draw-to-3d'}
                    selectedColor={drawTo3DColor}
                    onColorChange={setDrawTo3DColor}
                    onShapeRecognized={handleShapeRecognized}
                    isDragging3D={isDragging3D}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Results Panel */}
          {!isFullscreen && !isHowToCollapsed && (
          <div className="lg:col-span-1">
            {viewMode === '2d' ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-indigo-600" />
                    <span>AI Analysis</span>
                  </h2>
                  <button
                    onClick={() => setIsHowToCollapsed(true)}
                    className="p-1 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Collapse panel"
                  >
                    <ChevronUp className="h-5 w-5" />
                  </button>
                </div>

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl mb-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                  </div>
                </div>
              )}

              {processingStep === 'analyzing' && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Analyzing your diagram...
                  </p>
                </div>
              )}

              {result && processingStep === 'completed' && (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-800 dark:text-green-200">
                          Analysis Complete
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      What You Drew:
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {result.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Concept:
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                      {result.concept}
                    </p>
                  </div>

                  {result.errors.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">
                        Issues Found:
                      </h3>
                      <ul className="space-y-1">
                        {result.errors.map((error, idx) => (
                          <li key={idx} className="text-sm text-red-600 dark:text-red-400 flex items-start space-x-2">
                            <span>•</span>
                            <span>{error}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.suggestions.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 mb-2">
                        Suggestions:
                      </h3>
                      <ul className="space-y-1">
                        {result.suggestions.map((suggestion, idx) => (
                          <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start space-x-2">
                            <span>•</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Explanation:
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {result.explanation}
                    </p>
                  </div>

                  {result.relatedTopics.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Related Topics:
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {result.relatedTopics.map((topic, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-xs font-medium rounded-full"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!result && processingStep === 'idle' && (
                <div className="text-center py-12">
                  <Grid3x3 className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Draw a diagram and click "Analyze with AI" to get instant feedback and explanations.
                  </p>
                </div>
              )}
            </div>
            ) : viewMode === '3d' ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                    <Box className="h-5 w-5 text-indigo-600" />
                    <span>3D Command Guide</span>
                  </h2>
                  <button
                    onClick={() => setIsHowToCollapsed(true)}
                    className="p-1 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Collapse panel"
                  >
                    <ChevronUp className="h-5 w-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl">
                    <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-200 mb-2">
                      ✨ Create with Text Commands
                    </h3>
                    <p className="text-sm text-indigo-700 dark:text-indigo-300">
                      Type commands in the box above to instantly create 3D objects and molecules.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      📦 Shapes:
                    </h3>
                    <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                      <li>• "create sphere"</li>
                      <li>• "make cube"</li>
                      <li>• "add cylinder"</li>
                      <li>• "create cone"</li>
                      <li>• "make torus"</li>
                      <li>• "add pyramid"</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      🎨 With Colors:
                    </h3>
                    <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                      <li>• "make red cube"</li>
                      <li>• "create blue sphere"</li>
                      <li>• "add green cylinder"</li>
                      <li>• Colors: red, blue, green, yellow, orange, purple, pink, white, black, gray</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      📏 With Sizes:
                    </h3>
                    <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                      <li>• "make large sphere"</li>
                      <li>• "create small cube"</li>
                      <li>• "add huge cone"</li>
                      <li>• Sizes: small, large, huge</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      🧪 Molecules:
                    </h3>
                    <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                      <li>• "create water molecule"</li>
                      <li>• "add methane"</li>
                      <li>• "make ethanol"</li>
                      <li>• "add benzene"</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      🖱️ Camera Controls:
                    </h3>
                    <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                      <li>• Left drag: Rotate view</li>
                      <li>• Right drag: Pan camera</li>
                      <li>• Scroll: Zoom in/out</li>
                      <li>• Click: Select objects</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-xs text-green-700 dark:text-green-300">
                      💡 Tip: Combine color and size! Try "make large red sphere" or "add small blue cube"
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // Draw-to-3D Guide
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                    <Wand2 className="h-5 w-5 text-purple-600" />
                    <span>Draw→3D Guide</span>
                  </h2>
                  <button
                    onClick={() => setIsHowToCollapsed(true)}
                    className="p-1 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Collapse panel"
                  >
                    <ChevronUp className="h-5 w-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
                    <h3 className="text-sm font-semibold text-purple-900 dark:text-purple-200 mb-2">
                      ✨ Magic Drawing Mode
                    </h3>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      Draw 2D shapes and watch them transform into 3D objects automatically!
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      🎨 Shape Recognition:
                    </h3>
                    <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                      <li>• Circle → Creates 3D Sphere</li>
                      <li>• Square → Creates 3D Cube</li>
                      <li>• Rectangle → Creates 3D Box</li>
                      <li>• Triangle → Creates 3D Cone</li>
                      <li>• Line → Creates 3D Cylinder</li>
                      <li>• Arrow → Creates 3D Arrow</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      🖱️ How to Use:
                    </h3>
                    <ol className="space-y-1 text-xs text-gray-600 dark:text-gray-400 list-decimal list-inside">
                      <li>Select a color from the palette</li>
                      <li>Draw a shape on the overlay</li>
                      <li>System recognizes the shape</li>
                      <li>Click "Convert to 3D" button</li>
                      <li>3D object appears in scene!</li>
                    </ol>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      💡 Tips:
                    </h3>
                    <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                      <li>• Draw smooth, closed shapes for best recognition</li>
                      <li>• Larger drawings create larger 3D objects</li>
                      <li>• Use different colors for variety</li>
                      <li>• Clear button removes your drawing</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      🖱️ 3D Controls:
                    </h3>
                    <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                      <li>• Left drag: Rotate 3D view</li>
                      <li>• Right drag: Pan camera</li>
                      <li>• Scroll: Zoom in/out</li>
                      <li>• Click objects: Select & edit</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-xs text-green-700 dark:text-green-300">
                      🌟 Pro Tip: Draw multiple shapes in sequence to build complex 3D scenes!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          )}
        </div>
        </div>
        </div>

        {/* Expand How-To Panel Button */}
        {!isFullscreen && isHowToCollapsed && (
        <button
          onClick={() => setIsHowToCollapsed(false)}
          className="fixed bottom-8 right-8 flex items-center space-x-2 px-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl z-40"
          title="Expand how-to panel"
        >
          <ChevronDown className="h-5 w-5" />
          <span>Show Guide</span>
        </button>
        )}

        {/* Clear Confirmation Dialog */}
      {showClearDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Clear Canvas?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to clear the canvas? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowClearDialog(false)}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmClear}
                className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagramPage;
