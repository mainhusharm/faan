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
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] group">
        <iframe
          ref={iframeRef}
          src={src}
          className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-3xl"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          title="YouTube video player"
          loading="lazy"
        />
        
        {/* Clean overlay controls */}
        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-3 bg-slate-900/90 backdrop-blur-xl rounded-xl text-white hover:bg-slate-800/95 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
        
        {/* Settings panel */}
        {showSettings && (
          <div className="absolute top-20 right-6 p-6 bg-slate-900/95 backdrop-blur-2xl rounded-2xl border border-slate-700/50 shadow-2xl animate-fadeIn">
            <div className="space-y-4">
              <div className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
                <Settings className="h-4 w-4 text-blue-400" />
                Playback Speed
              </div>
              <div className="flex flex-wrap gap-2">
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all transform hover:scale-105 ${
                      playbackSpeed === speed 
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50' 
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
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
      className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] group"
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
        className="w-full h-auto max-h-[70vh] sm:max-h-[80vh] md:max-h-[90vh] rounded-3xl"
        poster="https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=800"
        onClick={togglePlay}
      />
      
      {/* Play/Pause overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black/10 via-black/20 to-black/30 backdrop-blur-[2px]">
        <button
            onClick={togglePlay}
            className="p-8 bg-white/95 rounded-full hover:bg-white transition-all duration-300 shadow-2xl hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-110 backdrop-blur-sm"
        >
            <Play className="h-14 w-14 text-slate-900 ml-1" />
        </button>
        </div>
      )}
      
      {/* Settings button */}
      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-3 bg-slate-900/90 backdrop-blur-xl rounded-xl text-white hover:bg-slate-800/95 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="absolute top-20 right-6 p-6 bg-slate-900/95 backdrop-blur-2xl rounded-2xl border border-slate-700/50 shadow-2xl animate-fadeIn">
          <div className="space-y-5">
            <div>
              <div className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
                <Settings className="h-4 w-4 text-blue-400" />
                Playback Speed
              </div>
            <div className="flex flex-wrap gap-2">
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
              <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all transform hover:scale-105 ${
                      playbackSpeed === speed 
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50' 
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {speed}x
              </button>
                ))}
              </div>
            </div>
            
            <div>
              <div className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-blue-400" />
                Volume
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="flex-1 h-2 bg-slate-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-blue-500 [&::-webkit-slider-thumb]:to-cyan-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg hover:[&::-webkit-slider-thumb]:shadow-blue-500/50"
                />
                <span className="text-white text-sm font-semibold min-w-[45px] text-right">{Math.round(volume * 100)}%</span>
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
        <div className="px-6 pb-3">
          <div
            className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer hover:h-2 transition-all duration-200 group/progress"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full relative shadow-lg shadow-blue-500/30"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-xl opacity-0 group-hover/progress:opacity-100 transition-opacity duration-200 ring-2 ring-blue-400"></div>
            </div>
          </div>
        </div>

        {/* Control bar */}
        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-2xl rounded-2xl p-4 sm:p-5 shadow-2xl border border-slate-700/50">
            <div className="flex items-center justify-between gap-3">
              {/* Left controls */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button
                  onClick={togglePlay}
                  className="p-2.5 sm:p-3 bg-white rounded-full text-slate-900 hover:bg-slate-100 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  {isPlaying ? <Pause className="h-5 w-5 sm:h-6 sm:w-6" /> : <Play className="h-5 w-5 sm:h-6 sm:w-6 ml-0.5" />}
                </button>
                
                <div className="flex space-x-1 sm:space-x-2">
                  <button
                    onClick={() => skip(-10)}
                    className="p-2 sm:p-2.5 text-white hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105"
                  >
                    <SkipBack className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  
                  <button
                    onClick={() => skip(10)}
                    className="p-2 sm:p-2.5 text-white hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105"
                  >
                    <SkipForward className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>

                <button
                  onClick={toggleMute}
                  className="p-2 sm:p-2.5 text-white hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105"
                >
                  {isMuted ? <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" /> : <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />}
                </button>
              </div>

              {/* Right controls */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="text-white text-xs sm:text-sm font-mono font-semibold bg-slate-800/50 px-3 py-1.5 rounded-lg">
                  {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
                </div>
                <button className="p-2 sm:p-2.5 text-white hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105">
                  <Maximize className="h-4 w-4 sm:h-5 sm:w-5" />
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