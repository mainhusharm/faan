import React, { useState } from 'react';
import { Play, Pause, Square, Download, Save, Settings, Wand2, Video, Image as ImageIcon, Music } from 'lucide-react';

interface VideoEditorDemoProps {
  onClose: () => void;
}

const VideoEditorDemo: React.FC<VideoEditorDemoProps> = ({ onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(120); // 2 minutes demo

  const demoFeatures = [
    {
      icon: Video,
      title: 'Multi-track Editing',
      description: 'Layer multiple video, audio, and image tracks'
    },
    {
      icon: Wand2,
      title: 'AI Integration',
      description: 'Generate AI videos and combine with your content'
    },
    {
      icon: Settings,
      title: 'Professional Tools',
      description: 'Split, trim, adjust volume, and apply effects'
    },
    {
      icon: Download,
      title: 'Export Options',
      description: 'Export in multiple formats and qualities'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Video Editor Preview
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {/* Video Preview */}
          <div className="mb-6">
            <div className="bg-gray-900 rounded-lg overflow-hidden mb-4">
              <div className="aspect-video bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <Video className="h-16 w-16 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Video Editor Preview</h3>
                  <p className="text-indigo-200">Professional video editing tools</p>
                </div>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-colors"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>
              
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
              
              <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')} / {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {demoFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                      <Icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Timeline Preview */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Timeline Editor
            </h3>
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="space-y-2">
                {/* Video Track */}
                <div className="flex items-center space-x-3">
                  <Video className="h-4 w-4 text-red-500" />
                  <div className="flex-1 bg-red-500/20 rounded h-8 flex items-center px-3">
                    <span className="text-sm text-white">My Video.mp4</span>
                  </div>
                </div>
                
                {/* AI Generated Track */}
                <div className="flex items-center space-x-3">
                  <Wand2 className="h-4 w-4 text-purple-500" />
                  <div className="flex-1 bg-purple-500/20 rounded h-8 flex items-center px-3">
                    <span className="text-sm text-white">AI Generated Content</span>
                  </div>
                </div>
                
                {/* Audio Track */}
                <div className="flex items-center space-x-3">
                  <Music className="h-4 w-4 text-green-500" />
                  <div className="flex-1 bg-green-500/20 rounded h-8 flex items-center px-3">
                    <span className="text-sm text-white">Background Music.mp3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
              <Video className="h-5 w-5" />
              <span>Open Full Editor</span>
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoEditorDemo;
