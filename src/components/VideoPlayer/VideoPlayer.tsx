import React, { useRef, useState, useEffect } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward,
  Settings, RotateCcw, RotateCw, MoreVertical
} from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  onVideoEnd?: () => void;
  onProgress?: (progress: number) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, onVideoEnd, onProgress }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isYouTube, setIsYouTube] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Check if it's a YouTube URL
    const youtubeRegex = /(?:youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/watch\?v=)([^&\n?#]+)/;
    const isYouTubeUrl = youtubeRegex.test(src) || src.includes('youtube.com/embed/');
    console.log('VideoPlayer - src:', src, 'isYouTube:', isYouTubeUrl);
    setIsYouTube(isYouTubeUrl);

    if (!isYouTubeUrl) {
      const video = videoRef.current;
      if (!video) return;

      const handleLoadedMetadata = () => {
        setDuration(video.duration);
      };

      const handleTimeUpdate = () => {
        const currentProgress = (video.currentTime / video.duration) * 100;
        setProgress(currentProgress);
        onProgress?.(currentProgress);
      };

      const handleEnded = () => {
        setIsPlaying(false);
        onVideoEnd?.();
      };

      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('ended', handleEnded);

      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('ended', handleEnded);
      };
    }
  }, [src, onVideoEnd, onProgress]);

  useEffect(() => {
    // Auto-hide controls after 3 seconds of inactivity
    const timer = setTimeout(() => {
      if (!isHovering) {
        setShowControls(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isHovering, showControls]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    const progressBar = e.currentTarget;
    if (!video || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * video.duration;
    
    video.currentTime = newTime;
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds));
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // YouTube iframe component with clean design
  if (isYouTube) {
    console.log('Rendering YouTube iframe with src:', src);
    return (
      <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl group">
        <iframe
          ref={iframeRef}
          src={src}
          className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-2xl"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          title="YouTube video player"
          loading="lazy"
        />
        
        {/* Clean overlay controls */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-black/70 transition-all duration-200"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
        
        {/* Settings panel */}
        {showSettings && (
          <div className="absolute top-16 right-4 p-4 bg-black/90 backdrop-blur-xl rounded-lg border border-gray-700 shadow-2xl">
            <div className="space-y-3">
              <div className="text-white text-sm font-medium mb-2">Playback Speed</div>
              <div className="flex space-x-2">
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                      playbackSpeed === speed 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Modern video player
  return (
    <div 
      className="relative bg-black rounded-2xl overflow-hidden shadow-2xl group"
      onMouseEnter={() => {
        setIsHovering(true);
        setShowControls(true);
      }}
      onMouseLeave={() => {
        setIsHovering(false);
      }}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-auto max-h-[70vh] sm:max-h-[80vh] md:max-h-[90vh] rounded-2xl"
        poster="https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=800"
        onClick={togglePlay}
      />
      
      {/* Play/Pause overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
        <button
            onClick={togglePlay}
            className="p-6 bg-white/90 rounded-full hover:bg-white transition-all duration-200 shadow-2xl hover:scale-110"
        >
            <Play className="h-12 w-12 text-black ml-1" />
        </button>
        </div>
      )}
      
      {/* Settings button */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-black/70 transition-all duration-200"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="absolute top-16 right-4 p-4 bg-black/90 backdrop-blur-xl rounded-lg border border-gray-700 shadow-2xl">
          <div className="space-y-4">
            <div>
              <div className="text-white text-sm font-medium mb-2">Playback Speed</div>
            <div className="flex space-x-2">
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
              <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                      playbackSpeed === speed 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {speed}x
              </button>
                ))}
              </div>
            </div>
            
            <div>
              <div className="text-white text-sm font-medium mb-2">Volume</div>
              <div className="flex items-center space-x-2">
                <Volume2 className="h-4 w-4 text-gray-300" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-gray-300 text-xs">{Math.round(volume * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Main control interface */}
      <div
        className={`absolute inset-0 flex flex-col justify-end transition-all duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Progress bar */}
        <div className="px-4 pb-2">
          <div
            className="w-full h-1 bg-white/30 rounded-full cursor-pointer hover:h-2 transition-all duration-200"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-blue-600 rounded-full relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </div>
          </div>
        </div>

        {/* Control bar */}
        <div className="px-2 sm:px-4 pb-2 sm:pb-4">
          <div className="bg-black/80 backdrop-blur-xl rounded-lg p-2 sm:p-3">
            <div className="flex items-center justify-between">
              {/* Left controls */}
              <div className="flex items-center space-x-1 sm:space-x-3">
                <button
                  onClick={togglePlay}
                  className="p-1.5 sm:p-2 bg-white rounded-full text-black hover:bg-gray-200 transition-all duration-200"
                >
                  {isPlaying ? <Pause className="h-4 w-4 sm:h-5 sm:w-5" /> : <Play className="h-4 w-4 sm:h-5 sm:w-5 ml-0.5" />}
                </button>
                
                <div className="flex space-x-0.5 sm:space-x-1">
                  <button
                    onClick={() => skip(-10)}
                    className="p-1.5 sm:p-2 text-white hover:bg-white/20 rounded transition-all duration-200"
                  >
                    <SkipBack className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                  
                  <button
                    onClick={() => skip(10)}
                    className="p-1.5 sm:p-2 text-white hover:bg-white/20 rounded transition-all duration-200"
                  >
                    <SkipForward className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>

                <button
                  onClick={toggleMute}
                  className="p-1.5 sm:p-2 text-white hover:bg-white/20 rounded transition-all duration-200"
                >
                  {isMuted ? <VolumeX className="h-3 w-3 sm:h-4 sm:w-4" /> : <Volume2 className="h-3 w-3 sm:h-4 sm:w-4" />}
                </button>
              </div>

              {/* Right controls */}
              <div className="flex items-center space-x-1 sm:space-x-3">
                <div className="text-white text-xs sm:text-sm font-mono">
                  {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
                </div>
                <button className="p-1.5 sm:p-2 text-white hover:bg-white/20 rounded transition-all duration-200">
                  <Maximize className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;