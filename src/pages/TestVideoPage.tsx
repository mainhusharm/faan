import React from 'react';
import VideoPlayer from '../components/VideoPlayer/VideoPlayer';

const TestVideoPage: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Video Player Test</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">YouTube Video Test</h2>
        <VideoPlayer 
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          onVideoEnd={() => console.log('Video ended')}
        />
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Regular Video Test</h2>
        <VideoPlayer 
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          onVideoEnd={() => console.log('Video ended')}
        />
      </div>
    </div>
  );
};

export default TestVideoPage;

