import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Scissors, Trash2, Move, Volume2, VolumeX } from 'lucide-react';

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
}

interface TimelineProps {
  tracks: TimelineTrack[];
  currentTime: number;
  duration: number;
  onTimeChange: (time: number) => void;
  onTrackUpdate: (trackId: string, updates: Partial<TimelineTrack>) => void;
  onTrackDelete: (trackId: string) => void;
  onTrackSplit: (trackId: string, splitTime: number) => void;
  onTrackMove: (trackId: string, newStartTime: number) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
}

const Timeline: React.FC<TimelineProps> = ({
  tracks,
  currentTime,
  duration,
  onTimeChange,
  onTrackUpdate,
  onTrackDelete,
  onTrackSplit,
  onTrackMove,
  isPlaying,
  onPlayPause,
  onSeek
}) => {
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, time: 0 });
  const timelineRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [scrollPosition, setScrollPosition] = useState(0);

  const pixelsPerSecond = 50 * zoom;
  const timelineWidth = duration * pixelsPerSecond;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const timeToPixels = (time: number): number => {
    return time * pixelsPerSecond;
  };

  const pixelsToTime = (pixels: number): number => {
    return pixels / pixelsPerSecond;
  };

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left + scrollPosition;
    const time = Math.max(0, Math.min(duration, pixelsToTime(x)));
    
    onSeek(time);
    setSelectedTrack(null);
  };

  const handleTrackClick = (e: React.MouseEvent, trackId: string) => {
    e.stopPropagation();
    setSelectedTrack(trackId);
  };

  const handleTrackDragStart = (e: React.MouseEvent, trackId: string) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, time: tracks.find(t => t.id === trackId)?.startTime || 0 });
    setSelectedTrack(trackId);
  };

  const handleTrackDrag = (e: React.MouseEvent) => {
    if (!isDragging || !selectedTrack) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaTime = pixelsToTime(deltaX);
    const newStartTime = Math.max(0, dragStart.time + deltaTime);
    
    onTrackMove(selectedTrack, newStartTime);
  };

  const handleTrackDragEnd = () => {
    setIsDragging(false);
  };

  const handleVolumeChange = (trackId: string, volume: number) => {
    onTrackUpdate(trackId, { volume: Math.max(0, Math.min(1, volume)) });
  };

  const handleMuteToggle = (trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    if (track) {
      onTrackUpdate(trackId, { muted: !track.muted });
    }
  };

  const handleSplitTrack = (trackId: string) => {
    onTrackSplit(trackId, currentTime);
  };

  const handleDeleteTrack = (trackId: string) => {
    onTrackDelete(trackId);
    if (selectedTrack === trackId) {
      setSelectedTrack(null);
    }
  };

  const handleZoomChange = (newZoom: number) => {
    setZoom(Math.max(0.1, Math.min(5, newZoom)));
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleTrackDrag(e as any);
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        handleTrackDragEnd();
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, selectedTrack, dragStart]);

  return (
    <div className="bg-gray-900 text-white rounded-lg overflow-hidden">
      {/* Timeline Header */}
      <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onPlayPause}
              className="p-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            
            <div className="flex items-center space-x-2">
              <SkipBack className="h-4 w-4 text-gray-400" />
              <SkipForward className="h-4 w-4 text-gray-400" />
            </div>
            
            <div className="text-sm font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Zoom:</span>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={zoom}
                onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                className="w-20"
              />
              <span className="text-sm text-gray-400">{Math.round(zoom * 100)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Tracks */}
      <div className="relative h-64 overflow-x-auto">
        <div
          ref={timelineRef}
          className="relative cursor-pointer"
          style={{ width: `${Math.max(timelineWidth, 800)}px` }}
          onClick={handleTimelineClick}
        >
          {/* Time Ruler */}
          <div className="h-8 bg-gray-800 border-b border-gray-700 relative">
            {Array.from({ length: Math.ceil(duration) }, (_, i) => (
              <div
                key={i}
                className="absolute top-0 h-full border-l border-gray-600"
                style={{ left: `${timeToPixels(i)}px` }}
              >
                <div className="text-xs text-gray-400 mt-1 ml-1">
                  {formatTime(i)}
                </div>
              </div>
            ))}
          </div>

          {/* Playhead */}
          <div
            className="absolute top-0 w-0.5 h-full bg-red-500 z-20 pointer-events-none"
            style={{ left: `${timeToPixels(currentTime)}px` }}
          >
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 transform rotate-45"></div>
          </div>

          {/* Tracks */}
          <div className="space-y-1 p-2">
            {tracks.map((track, index) => (
              <div
                key={track.id}
                className={`relative h-12 rounded border-2 cursor-move transition-all ${
                  selectedTrack === track.id
                    ? 'border-indigo-500 bg-indigo-500/20'
                    : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                } ${!track.visible ? 'opacity-50' : ''}`}
                style={{
                  left: `${timeToPixels(track.startTime)}px`,
                  width: `${timeToPixels(track.duration)}px`,
                  zIndex: selectedTrack === track.id ? 10 : 1
                }}
                onClick={(e) => handleTrackClick(e, track.id)}
                onMouseDown={(e) => handleTrackDragStart(e, track.id)}
              >
                {/* Track Content */}
                <div className="flex items-center h-full px-2">
                  {track.thumbnail && (
                    <img
                      src={track.thumbnail}
                      alt={track.name}
                      className="w-8 h-8 object-cover rounded mr-2"
                    />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">
                      {track.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatTime(track.startTime)} - {formatTime(track.endTime)}
                    </div>
                  </div>

                  {/* Track Controls */}
                  <div className="flex items-center space-x-1 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMuteToggle(track.id);
                      }}
                      className="p-1 hover:bg-gray-600 rounded"
                    >
                      {track.muted ? (
                        <VolumeX className="h-3 w-3 text-red-400" />
                      ) : (
                        <Volume2 className="h-3 w-3 text-green-400" />
                      )}
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSplitTrack(track.id);
                      }}
                      className="p-1 hover:bg-gray-600 rounded"
                    >
                      <Scissors className="h-3 w-3 text-blue-400" />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTrack(track.id);
                      }}
                      className="p-1 hover:bg-gray-600 rounded"
                    >
                      <Trash2 className="h-3 w-3 text-red-400" />
                    </button>
                  </div>
                </div>

                {/* Volume Slider */}
                {selectedTrack === track.id && (
                  <div className="absolute top-full left-0 right-0 bg-gray-800 p-2 border border-gray-600 rounded-b">
                    <div className="flex items-center space-x-2">
                      <Volume2 className="h-3 w-3" />
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={track.volume}
                        onChange={(e) => handleVolumeChange(track.id, parseFloat(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-xs w-8">{Math.round(track.volume * 100)}%</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Footer */}
      <div className="bg-gray-800 px-4 py-2 border-t border-gray-700">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div>
            {tracks.length} track{tracks.length !== 1 ? 's' : ''}
          </div>
          <div>
            Duration: {formatTime(duration)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
