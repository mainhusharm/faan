import React, { useRef, useState } from 'react';
import { Camera, Upload, ImageIcon, X } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
  selectedImage: File | null;
  onClear: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, selectedImage, onClear }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/heic', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, HEIC) or PDF');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    onImageSelected(file);
  };

  return (
    <div className="w-full">
      {selectedImage ? (
        <div className="relative">
          <div className="border-2 border-indigo-200 dark:border-indigo-800 rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-900">
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Selected homework"
              className="w-full h-auto max-h-96 object-contain"
            />
          </div>
          <button
            onClick={onClear}
            className="absolute top-4 right-4 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-200 transform hover:scale-110"
            title="Remove image"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 scale-105'
              : 'border-gray-300 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-600'
          }`}
        >
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 rounded-full opacity-30 blur animate-pulse" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-full flex items-center justify-center">
                <ImageIcon className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Upload Homework Problem
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
                Take a photo or upload an image of your homework problem. Supports handwritten and printed text, math equations, and diagrams.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Camera className="h-5 w-5" />
                <span>Take Photo</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Upload className="h-5 w-5" />
                <span>Choose File</span>
              </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-500">
              Supports JPEG, PNG, HEIC, PDF • Max 10MB
            </p>
          </div>

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileInput}
            className="hidden"
          />

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
