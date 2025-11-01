import React, { useState, useRef } from 'react';
import { RotateCw, Sun, Contrast, Check, X } from 'lucide-react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageEditorProps {
  image: File;
  onSave: (editedImage: File) => void;
  onCancel: () => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ image, onSave, onCancel }) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imageSrc, setImageSrc] = useState<string>('');

  React.useEffect(() => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(image);
  }, [image]);

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleSave = async () => {
    if (!imgRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

    // Set canvas size based on crop or full image
    if (completedCrop) {
      canvas.width = completedCrop.width * scaleX;
      canvas.height = completedCrop.height * scaleY;
    } else {
      canvas.width = imgRef.current.naturalWidth;
      canvas.height = imgRef.current.naturalHeight;
    }

    // Apply rotation
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // Apply brightness and contrast filters
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

    // Draw image
    if (completedCrop) {
      ctx.drawImage(
        imgRef.current,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      );
    } else {
      ctx.drawImage(imgRef.current, 0, 0, canvas.width, canvas.height);
    }

    ctx.restore();

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const editedFile = new File([blob], image.name, { type: image.type });
        onSave(editedFile);
      }
    }, image.type);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 p-4">
          <h2 className="text-xl font-bold text-white">Edit Image</h2>
        </div>

        {/* Image Preview */}
        <div className="p-6 overflow-auto max-h-[60vh]">
          <div className="flex justify-center">
            <div
              style={{
                transform: `rotate(${rotation}deg)`,
                filter: `brightness(${brightness}%) contrast(${contrast}%)`,
                transition: 'all 0.3s ease'
              }}
            >
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
              >
                <img
                  ref={imgRef}
                  src={imageSrc}
                  alt="Edit preview"
                  className="max-w-full h-auto"
                  style={{ maxHeight: '50vh' }}
                />
              </ReactCrop>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 space-y-6">
          {/* Rotation */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center space-x-2">
              <RotateCw className="h-4 w-4" />
              <span>Rotate</span>
            </label>
            <button
              onClick={handleRotate}
              className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors font-medium"
            >
              Rotate 90°
            </button>
          </div>

          {/* Brightness */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center space-x-2 mb-2">
              <Sun className="h-4 w-4" />
              <span>Brightness</span>
              <span className="text-xs text-gray-500">({brightness}%)</span>
            </label>
            <input
              type="range"
              min="50"
              max="150"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          {/* Contrast */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center space-x-2 mb-2">
              <Contrast className="h-4 w-4" />
              <span>Contrast</span>
              <span className="text-xs text-gray-500">({contrast}%)</span>
            </label>
            <input
              type="range"
              min="50"
              max="150"
              value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={onCancel}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-all duration-200"
            >
              <X className="h-5 w-5" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg"
            >
              <Check className="h-5 w-5" />
              <span>Apply Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
