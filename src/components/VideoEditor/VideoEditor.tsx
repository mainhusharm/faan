import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Download, 
  Save, 
  Undo, 
  Redo, 
  Scissors, 
  Copy, 
  Trash2,
  Plus,
  Settings,
  Wand2,
  Image as ImageIcon,
  Video,
  Music,
  Type
} from 'lucide-react';
import MediaUploader from './MediaUploader';
import Timeline from './Timeline';
import ExportDialog from './ExportDialog';
import TextToVideoService from '../../lib/textToVideoService';
import GeminiImageGenerator from '../../lib/geminiImageGenerator';
import VideoExportService, { ExportResult } from '../../lib/videoExportService';

interface MediaFile {
  id: string;
  file: File;
  type: 'video' | 'image' | 'audio';
  name: string;
  size: number;
  duration?: number;
  thumbnail?: string;
  url: string;
}

interface TimelineTrack {
  id: string;
  type: 'video' | 'image' | 'audio' | 'ai-generated';
  name: string;
  startTime: number;
  duration: number;
  endTime: number;
  thumbnail?: string;
  volume: number;
  muted: boolean;
  locked: boolean;
  visible: boolean;
  sourceFile?: MediaFile;
  aiGeneratedData?: {
    prompt: string;
    style: string;
    model: string;
  };
}

interface VideoEditorProps {
  onExport: (project: any) => void;
  onSave: (project: any) => void;
}

const VideoEditor: React.FC<VideoEditorProps> = ({ onExport, onSave }) => {
  const [tracks, setTracks] = useState<TimelineTrack[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [history, setHistory] = useState<TimelineTrack[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiStyle, setAiStyle] = useState('educational');
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportResult, setExportResult] = useState<ExportResult | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize history
  useEffect(() => {
    if (history.length === 0) {
      setHistory([tracks]);
      setHistoryIndex(0);
    }
  }, []);

  const addToHistory = (newTracks: TimelineTrack[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newTracks]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setTracks([...history[historyIndex - 1]]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setTracks([...history[historyIndex + 1]]);
    }
  };

  const handleFilesUploaded = (files: MediaFile[]) => {
    const newTracks: TimelineTrack[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      type: file.type as 'video' | 'image' | 'audio',
      name: file.name,
      startTime: 0,
      duration: file.duration || 0,
      endTime: file.duration || 0,
      thumbnail: file.thumbnail,
      volume: 1,
      muted: false,
      locked: false,
      visible: true,
      sourceFile: file
    }));

    const updatedTracks = [...tracks, ...newTracks];
    setTracks(updatedTracks);
    addToHistory(updatedTracks);
    updateDuration(updatedTracks);
  };

  const updateDuration = (tracks: TimelineTrack[]) => {
    const maxEndTime = Math.max(...tracks.map(track => track.endTime), 0);
    setDuration(maxEndTime);
  };

  const handleTimeChange = (time: number) => {
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleTrackUpdate = (trackId: string, updates: Partial<TimelineTrack>) => {
    const updatedTracks = tracks.map(track =>
      track.id === trackId ? { ...track, ...updates } : track
    );
    setTracks(updatedTracks);
    addToHistory(updatedTracks);
    updateDuration(updatedTracks);
  };

  const handleTrackDelete = (trackId: string) => {
    const updatedTracks = tracks.filter(track => track.id !== trackId);
    setTracks(updatedTracks);
    addToHistory(updatedTracks);
    updateDuration(updatedTracks);
  };

  const handleTrackSplit = (trackId: string, splitTime: number) => {
    const track = tracks.find(t => t.id === trackId);
    if (!track) return;

    const splitPoint = splitTime - track.startTime;
    if (splitPoint <= 0 || splitPoint >= track.duration) return;

    const newTrack: TimelineTrack = {
      ...track,
      id: Math.random().toString(36).substr(2, 9),
      startTime: splitTime,
      duration: track.duration - splitPoint,
      endTime: track.endTime
    };

    const updatedTrack = {
      ...track,
      duration: splitPoint,
      endTime: splitTime
    };

    const updatedTracks = tracks.map(t => t.id === trackId ? updatedTrack : t);
    updatedTracks.push(newTrack);
    
    setTracks(updatedTracks);
    addToHistory(updatedTracks);
    updateDuration(updatedTracks);
  };

  const handleTrackMove = (trackId: string, newStartTime: number) => {
    const track = tracks.find(t => t.id === trackId);
    if (!track) return;

    const updatedTrack = {
      ...track,
      startTime: newStartTime,
      endTime: newStartTime + track.duration
    };

    const updatedTracks = tracks.map(t => t.id === trackId ? updatedTrack : t);
    setTracks(updatedTracks);
    updateDuration(updatedTracks);
  };

  const handleAIGeneration = async () => {
    if (!aiPrompt.trim()) return;

    setIsGeneratingAI(true);
    
    try {
      const textToVideoService = TextToVideoService.getInstance();
      await textToVideoService.initialize();

      const response = await textToVideoService.generateVideo({
        text: aiPrompt,
        style: aiStyle as any,
        duration: 2,
        voice: 'neutral',
        backgroundMusic: true,
        quality: 'standard'
      });

      // Create AI-generated track
      const aiTrack: TimelineTrack = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'ai-generated',
        name: `AI Video: ${aiPrompt.substring(0, 30)}...`,
        startTime: currentTime,
        duration: 120, // 2 minutes
        endTime: currentTime + 120,
        thumbnail: response.thumbnailUrl,
        volume: 1,
        muted: false,
        locked: false,
        visible: true,
        aiGeneratedData: {
          prompt: aiPrompt,
          style: aiStyle,
          model: response.model
        }
      };

      const updatedTracks = [...tracks, aiTrack];
      setTracks(updatedTracks);
      addToHistory(updatedTracks);
      updateDuration(updatedTracks);
      
      setShowAIGenerator(false);
      setAiPrompt('');
    } catch (error) {
      console.error('AI generation failed:', error);
      alert('AI generation failed. Please try again.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleExport = () => {
    setShowExportDialog(true);
  };

  const handleExportComplete = (result: ExportResult) => {
    setExportResult(result);
    const project = {
      tracks,
      duration,
      createdAt: new Date().toISOString(),
      version: '1.0',
      exportResult: result
    };
    onExport(project);
  };

  const handleSave = () => {
    const project = {
      tracks,
      duration,
      createdAt: new Date().toISOString(),
      version: '1.0'
    };
    onSave(project);
  };

  const renderPreview = () => {
    const activeTracks = tracks.filter(track => 
      track.visible && 
      currentTime >= track.startTime && 
      currentTime <= track.endTime
    );

    if (activeTracks.length === 0) {
      return (
        <div className="w-full h-64 bg-gray-900 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-400">
            <Video className="h-12 w-12 mx-auto mb-4" />
            <p>No content at current time</p>
            <p className="text-sm">Add media or generate AI content</p>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-64 bg-gray-900 rounded-lg relative overflow-hidden">
        {activeTracks.map(track => (
          <div key={track.id} className="absolute inset-0">
            {track.type === 'video' && track.sourceFile && (
              <video
                ref={videoRef}
                src={track.sourceFile.url}
                className="w-full h-full object-cover"
                muted={track.muted}
                style={{ opacity: track.volume }}
              />
            )}
            {track.type === 'image' && track.thumbnail && (
              <img
                src={track.thumbnail}
                alt={track.name}
                className="w-full h-full object-cover"
                style={{ opacity: track.volume }}
              />
            )}
            {track.type === 'ai-generated' && track.thumbnail && (
              <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <Wand2 className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-lg font-semibold">AI Generated</p>
                  <p className="text-sm opacity-75">{track.aiGeneratedData?.prompt}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Video Editor
          </h2>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50"
            >
              <Undo className="h-4 w-4" />
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50"
            >
              <Redo className="h-4 w-4" />
            </button>
            
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
            
            <button
              onClick={handleSave}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <Save className="h-4 w-4" />
            </button>
            <button
              onClick={handleExport}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
          <div className="space-y-6">
            {/* Media Upload */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Media Library
              </h3>
              <MediaUploader onFilesUploaded={handleFilesUploaded} />
            </div>

            {/* AI Generator */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                AI Content
              </h3>
              
              {!showAIGenerator ? (
                <button
                  onClick={() => setShowAIGenerator(true)}
                  className="w-full p-4 border-2 border-dashed border-indigo-300 dark:border-indigo-600 rounded-lg text-indigo-600 dark:text-indigo-400 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
                >
                  <Wand2 className="h-8 w-8 mx-auto mb-2" />
                  <p className="font-medium">Generate AI Content</p>
                  <p className="text-sm opacity-75">Create videos with AI</p>
                </button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Content Description
                    </label>
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Describe what you want to create..."
                      className="w-full h-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Style
                    </label>
                    <select
                      value={aiStyle}
                      onChange={(e) => setAiStyle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="educational">Educational</option>
                      <option value="presentation">Presentation</option>
                      <option value="tutorial">Tutorial</option>
                      <option value="animated">Animated</option>
                    </select>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={handleAIGeneration}
                      disabled={isGeneratingAI || !aiPrompt.trim()}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      {isGeneratingAI ? 'Generating...' : 'Generate'}
                    </button>
                    <button
                      onClick={() => setShowAIGenerator(false)}
                      className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Tracks List */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Tracks ({tracks.length})
              </h3>
              <div className="space-y-2">
                {tracks.map(track => (
                  <div
                    key={track.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedTrack === track.id
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => setSelectedTrack(track.id)}
                  >
                    <div className="flex items-center space-x-3">
                      {track.thumbnail && (
                        <img
                          src={track.thumbnail}
                          alt={track.name}
                          className="w-8 h-8 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {track.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {track.type} • {Math.round(track.duration)}s
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Editor */}
        <div className="flex-1 flex flex-col">
          {/* Preview */}
          <div className="p-4">
            {renderPreview()}
          </div>

          {/* Timeline */}
          <div className="flex-1 p-4">
            <Timeline
              tracks={tracks}
              currentTime={currentTime}
              duration={duration}
              onTimeChange={handleTimeChange}
              onTrackUpdate={handleTrackUpdate}
              onTrackDelete={handleTrackDelete}
              onTrackSplit={handleTrackSplit}
              onTrackMove={handleTrackMove}
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onSeek={handleSeek}
            />
          </div>
        </div>
      </div>

      {/* Export Dialog */}
      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        tracks={tracks}
        duration={duration}
        onExportComplete={handleExportComplete}
      />
    </div>
  );
};

export default VideoEditor;
