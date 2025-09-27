import React, { useState, useEffect } from 'react';
import { X, Download, Settings, Clock, HardDrive, CheckCircle, AlertCircle } from 'lucide-react';
import VideoExportService, { ExportOptions, ExportProgress, ExportResult } from '../../lib/videoExportService';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tracks: any[];
  duration: number;
  onExportComplete: (result: ExportResult) => void;
}

const ExportDialog: React.FC<ExportDialogProps> = ({
  isOpen,
  onClose,
  tracks,
  duration,
  onExportComplete
}) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'mp4',
    quality: 'high',
    resolution: '1080p',
    framerate: 30,
    audioCodec: 'aac',
    videoCodec: 'h264'
  });
  
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<number>(0);
  const [estimatedSize, setEstimatedSize] = useState<number>(0);
  const [exportResult, setExportResult] = useState<ExportResult | null>(null);

  const exportService = VideoExportService.getInstance();

  useEffect(() => {
    if (isOpen) {
      calculateEstimates();
    }
  }, [isOpen, exportOptions, duration]);

  const calculateEstimates = async () => {
    try {
      const time = await exportService.estimateExportTime(duration, exportOptions);
      const size = await exportService.estimateFileSize(duration, exportOptions);
      setEstimatedTime(time);
      setEstimatedSize(size);
    } catch (error) {
      console.error('Failed to calculate estimates:', error);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(null);
    setExportResult(null);

    try {
      const result = await exportService.exportVideo(
        tracks,
        duration,
        exportOptions,
        (progress) => {
          setExportProgress(progress);
        }
      );

      setExportResult(result);
      onExportComplete(result);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Export Video
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {exportResult ? (
            /* Export Complete */
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Export Complete!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your video has been successfully exported and is ready for download.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                  <span className="font-medium">{formatTime(exportResult.duration)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">File Size:</span>
                  <span className="font-medium">{formatFileSize(exportResult.fileSize)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Format:</span>
                  <span className="font-medium">{exportResult.format} • {exportResult.resolution}</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <a
                  href={exportResult.downloadUrl}
                  download
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Download className="h-5 w-5" />
                  <span>Download Video</span>
                </a>
                <button
                  onClick={onClose}
                  className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : isExporting ? (
            /* Export Progress */
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Exporting Video...
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {exportProgress?.message || 'Preparing export...'}
                </p>
              </div>

              {exportProgress && (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {exportProgress.stage.charAt(0).toUpperCase() + exportProgress.stage.slice(1)}
                    </span>
                    <span className="font-medium">{exportProgress.progress}%</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${exportProgress.progress}%` }}
                    />
                  </div>

                  {exportProgress.estimatedTimeRemaining && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                      Estimated time remaining: {formatTime(exportProgress.estimatedTimeRemaining)}
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Export Settings */
            <div className="space-y-6">
              {/* Format Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Video Format
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {exportService.getSupportedFormats().map(format => (
                    <button
                      key={format.value}
                      onClick={() => setExportOptions({...exportOptions, format: format.value as any})}
                      className={`p-3 rounded-lg border text-left transition-colors ${
                        exportOptions.format === format.value
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="font-medium text-gray-900 dark:text-white">
                        {format.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {format.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Quality
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {exportService.getQualityOptions().map(quality => (
                    <button
                      key={quality.value}
                      onClick={() => setExportOptions({...exportOptions, quality: quality.value as any})}
                      className={`p-3 rounded-lg border text-left transition-colors ${
                        exportOptions.quality === quality.value
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="font-medium text-gray-900 dark:text-white">
                        {quality.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {quality.description}
                      </div>
                      <div className="text-xs text-indigo-600 dark:text-indigo-400">
                        {quality.fileSize}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Resolution Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Resolution
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {exportService.getResolutionOptions().map(resolution => (
                    <button
                      key={resolution.value}
                      onClick={() => setExportOptions({...exportOptions, resolution: resolution.value as any})}
                      className={`p-3 rounded-lg border text-left transition-colors ${
                        exportOptions.resolution === resolution.value
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="font-medium text-gray-900 dark:text-white">
                        {resolution.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {resolution.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Export Estimates */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Export Estimates</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Export Time</div>
                      <div className="font-medium">{formatTime(estimatedTime)}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <HardDrive className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">File Size</div>
                      <div className="font-medium">{formatFileSize(estimatedSize)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Export Button */}
              <button
                onClick={handleExport}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="h-5 w-5" />
                <span>Start Export</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExportDialog;
