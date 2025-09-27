import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Play, Pause, Image as ImageIcon, Video, FileText, CheckCircle, AlertCircle } from 'lucide-react';

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

interface MediaUploaderProps {
  onFilesUploaded: (files: MediaFile[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
  className?: string;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
  onFilesUploaded,
  maxFiles = 10,
  acceptedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'image/jpeg', 'image/png', 'image/gif', 'audio/mp3', 'audio/wav'],
  className = ''
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
  const [uploadedFiles, setUploadedFiles] = useState<MediaFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateThumbnail = (file: File, type: 'video' | 'image'): Promise<string> => {
    return new Promise((resolve) => {
      if (type === 'image') {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      } else if (type === 'video') {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        video.addEventListener('loadedmetadata', () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          video.currentTime = 1; // Seek to 1 second
        });
        
        video.addEventListener('seeked', () => {
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', 0.8));
          }
        });
        
        video.src = URL.createObjectURL(file);
        video.load();
      }
    });
  };

  const getFileDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('video/') || file.type.startsWith('audio/')) {
        const media = document.createElement(file.type.startsWith('video/') ? 'video' : 'audio');
        media.addEventListener('loadedmetadata', () => {
          resolve(media.duration);
        });
        media.src = URL.createObjectURL(file);
      } else {
        resolve(0);
      }
    });
  };

  const processFile = async (file: File): Promise<MediaFile> => {
    const fileType = file.type.startsWith('video/') ? 'video' : 
                    file.type.startsWith('image/') ? 'image' : 'audio';
    
    const thumbnail = await generateThumbnail(file, fileType as 'video' | 'image');
    const duration = await getFileDuration(file);
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      file,
      type: fileType as 'video' | 'image' | 'audio',
      name: file.name,
      size: file.size,
      duration,
      thumbnail,
      url: URL.createObjectURL(file)
    };
  };

  const handleFiles = useCallback(async (files: FileList) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => 
      acceptedTypes.includes(file.type) && file.size <= 100 * 1024 * 1024 // 100MB limit
    );

    if (validFiles.length === 0) {
      alert('Please select valid media files (max 100MB each)');
      return;
    }

    if (uploadedFiles.length + validFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const newFiles: MediaFile[] = [];
    
    for (const file of validFiles) {
      const fileId = Math.random().toString(36).substr(2, 9);
      setUploadingFiles(prev => new Set([...prev, fileId]));
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
      
      try {
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        const processedFile = await processFile(file);
        newFiles.push(processedFile);
        
        setUploadingFiles(prev => {
          const newSet = new Set(prev);
          newSet.delete(fileId);
          return newSet;
        });
      } catch (error) {
        console.error('Error processing file:', error);
        setUploadingFiles(prev => {
          const newSet = new Set(prev);
          newSet.delete(fileId);
          return newSet;
        });
      }
    }

    const updatedFiles = [...uploadedFiles, ...newFiles];
    setUploadedFiles(updatedFiles);
    onFilesUploaded(updatedFiles);
  }, [uploadedFiles, maxFiles, acceptedTypes, onFilesUploaded]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(files);
    }
  };

  const removeFile = (fileId: string) => {
    const updatedFiles = uploadedFiles.filter(file => file.id !== fileId);
    setUploadedFiles(updatedFiles);
    onFilesUploaded(updatedFiles);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Upload Media Files
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Drag and drop your files here, or click to browse
        </p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Choose Files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
        />
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          Supports: MP4, WebM, OGG, JPEG, PNG, GIF, MP3, WAV (max 100MB each)
        </p>
      </div>

      {/* Uploading Files */}
      {uploadingFiles.size > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Uploading Files...
          </h4>
          {Array.from(uploadingFiles).map(fileId => (
            <div key={fileId} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Processing...
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {uploadProgress[fileId] || 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress[fileId] || 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Uploaded Files ({uploadedFiles.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {uploadedFiles.map(file => (
              <div key={file.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="relative">
                  {file.thumbnail && (
                    <img
                      src={file.thumbnail}
                      alt={file.name}
                      className="w-full h-24 object-cover"
                    />
                  )}
                  <button
                    onClick={() => removeFile(file.id)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    {file.type === 'video' && file.duration && formatDuration(file.duration)}
                    {file.type === 'image' && 'Image'}
                    {file.type === 'audio' && file.duration && formatDuration(file.duration)}
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    {file.type === 'video' && <Video className="h-4 w-4 text-red-500" />}
                    {file.type === 'image' && <ImageIcon className="h-4 w-4 text-green-500" />}
                    {file.type === 'audio' && <FileText className="h-4 w-4 text-blue-500" />}
                    <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.name}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
