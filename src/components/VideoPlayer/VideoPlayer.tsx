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

  // YouTube iframe component with premium design
  if (isYouTube) {
    console.log('Rendering YouTube iframe with src:', src);
    return (
      <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-[2rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] ring-1 ring-white/5 group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none"></div>
        
        <iframe
          ref={iframeRef}
          src={src}
          className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] relative z-10"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          title="YouTube video player"
          loading="lazy"
        />
        
        {/* Premium overlay controls */}
        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 z-20">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-3.5 bg-white/10 backdrop-blur-2xl rounded-2xl text-white hover:bg-white/20 transition-all duration-300 shadow-2xl hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:scale-110 ring-1 ring-white/20"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
        
        {/* Premium settings panel */}
        {showSettings && (
          <div className="absolute top-24 right-6 p-6 bg-slate-900/98 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] animate-fadeIn z-30">
            <div className="space-y-5">
              <div className="text-white text-sm font-bold mb-3 flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                  <Settings className="h-4 w-4" />
                </div>
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Playback Speed</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all transform hover:scale-105 ${
                      playbackSpeed === speed 
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50 ring-2 ring-blue-400/50' 
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white ring-1 ring-white/5'
                    }`}
                  >
                    {speed}×
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Premium video player
  return (
    <div 
      className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-[2rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] ring-1 ring-white/5 group"
      onMouseEnter={() => {
        setIsHovering(true);
        setShowControls(true);
      }}
      onMouseLeave={() => {
        setIsHovering(false);
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none"></div>
      
      <video
        ref={videoRef}
        src={src}
        className="w-full h-auto max-h-[70vh] sm:max-h-[80vh] md:max-h-[90vh] relative z-10"
        poster="https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=800"
        onClick={togglePlay}
      />
      
      {/* Premium Play/Pause overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black/20 via-black/30 to-black/40 backdrop-blur-sm z-20">
        <button
            onClick={togglePlay}
            className="group/play p-10 bg-gradient-to-br from-white via-white to-blue-50 rounded-full hover:from-blue-50 hover:via-blue-100 hover:to-white transition-all duration-500 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] hover:shadow-[0_0_80px_rgba(59,130,246,0.6)] hover:scale-110 ring-2 ring-white/20 hover:ring-blue-400/50 backdrop-blur-sm"
        >
            <Play className="h-16 w-16 text-slate-900 ml-1 transition-all duration-300 group-hover/play:text-blue-600" />
        </button>
        </div>
      )}
      
      {/* Premium settings button */}
      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 z-30">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-3.5 bg-white/10 backdrop-blur-2xl rounded-2xl text-white hover:bg-white/20 transition-all duration-300 shadow-2xl hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:scale-110 ring-1 ring-white/20"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>

      {/* Premium settings panel */}
      {showSettings && (
        <div className="absolute top-24 right-6 p-6 bg-slate-900/98 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] animate-fadeIn z-30">
          <div className="space-y-6">
            <div>
              <div className="text-white text-sm font-bold mb-4 flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                  <Settings className="h-4 w-4" />
                </div>
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Playback Speed</span>
              </div>
            <div className="flex flex-wrap gap-2">
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
              <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all transform hover:scale-105 ${
                      playbackSpeed === speed 
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50 ring-2 ring-blue-400/50' 
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white ring-1 ring-white/5'
                    }`}
                  >
                    {speed}×
              </button>
                ))}
              </div>
            </div>
            
            <div>
              <div className="text-white text-sm font-bold mb-4 flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <Volume2 className="h-4 w-4" />
                </div>
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Volume Control</span>
              </div>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="flex-1 h-2.5 bg-slate-700/50 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-500 [&::-webkit-slider-thumb]:to-pink-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-purple-500/50 hover:[&::-webkit-slider-thumb]:shadow-purple-500/80 hover:[&::-webkit-slider-thumb]:scale-110 [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:ring-2 [&::-webkit-slider-thumb]:ring-purple-400/50"
                />
                <span className="text-white text-sm font-bold min-w-[50px] text-right px-3 py-1.5 bg-slate-800/80 rounded-xl ring-1 ring-white/5">{Math.round(volume * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Premium control interface */}
      <div
        className={`absolute inset-0 flex flex-col justify-end transition-all duration-500 z-20 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Premium progress bar */}
        <div className="px-6 sm:px-8 pb-4">
          <div
            className="w-full h-2 bg-white/10 rounded-full cursor-pointer hover:h-2.5 transition-all duration-300 group/progress backdrop-blur-sm ring-1 ring-white/5"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-400 rounded-full relative shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-gradient-to-br from-white to-blue-100 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)] opacity-0 group-hover/progress:opacity-100 transition-all duration-300 ring-2 ring-blue-400/50 scale-0 group-hover/progress:scale-100"></div>
            </div>
          </div>
        </div>

        {/* Premium control bar */}
        <div className="px-5 sm:px-8 pb-5 sm:pb-8">
          <div className="bg-gradient-to-r from-slate-900/98 via-slate-800/98 to-slate-900/98 backdrop-blur-3xl rounded-3xl p-5 sm:p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] border border-white/10 ring-1 ring-white/5">
            <div className="flex items-center justify-between gap-4">
              {/* Premium left controls */}
              <div className="flex items-center space-x-3 sm:space-x-5">
                <button
                  onClick={togglePlay}
                  className="p-3 sm:p-3.5 bg-gradient-to-br from-white via-white to-blue-50 rounded-full text-slate-900 hover:from-blue-50 hover:via-blue-100 hover:to-white transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] hover:scale-110 ring-2 ring-white/20"
                >
                  {isPlaying ? <Pause className="h-5 w-5 sm:h-6 sm:w-6" /> : <Play className="h-5 w-5 sm:h-6 sm:w-6 ml-0.5" />}
                </button>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => skip(-10)}
                    className="p-2.5 sm:p-3 text-white hover:bg-white/15 rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-lg ring-1 ring-white/5 backdrop-blur-sm"
                  >
                    <SkipBack className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  
                  <button
                    onClick={() => skip(10)}
                    className="p-2.5 sm:p-3 text-white hover:bg-white/15 rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-lg ring-1 ring-white/5 backdrop-blur-sm"
                  >
                    <SkipForward className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>

                <button
                  onClick={toggleMute}
                  className="p-2.5 sm:p-3 text-white hover:bg-white/15 rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-lg ring-1 ring-white/5 backdrop-blur-sm"
                >
                  {isMuted ? <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" /> : <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />}
                </button>
              </div>

              {/* Premium right controls */}
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="text-white text-xs sm:text-sm font-mono font-bold bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-sm ring-1 ring-white/10">
                  {formatTime(videoRef.current?.currentTime || 0)} <span className="text-blue-400">/</span> {formatTime(duration)}
                </div>
                <button className="p-2.5 sm:p-3 text-white hover:bg-white/15 rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-lg ring-1 ring-white/5 backdrop-blur-sm">
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