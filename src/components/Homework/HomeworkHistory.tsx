import React, { useState, useEffect } from 'react';
import { Clock, Trash2, Eye, Search, FileText } from 'lucide-react';
import { getHomeworkHistory, deleteHomeworkUpload, HomeworkUpload } from '../../lib/homeworkService';

interface HomeworkHistoryProps {
  userId: string;
  onViewSolution: (uploadId: string) => void;
}

const HomeworkHistory: React.FC<HomeworkHistoryProps> = ({ userId, onViewSolution }) => {
  const [history, setHistory] = useState<HomeworkUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await getHomeworkHistory(userId);
      setHistory(data);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (upload: HomeworkUpload) => {
    if (!confirm('Are you sure you want to delete this homework submission?')) {
      return;
    }

    try {
      setDeleting(upload.id);
      await deleteHomeworkUpload(upload.id, upload.image_url);
      setHistory((prev) => prev.filter((h) => h.id !== upload.id));
    } catch (error) {
      console.error('Error deleting upload:', error);
      alert('Failed to delete upload. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const filteredHistory = history.filter((upload) =>
    upload.file_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
            Completed
          </span>
        );
      case 'processing':
        return (
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
            Processing
          </span>
        );
      case 'failed':
        return (
          <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-medium rounded-full">
            Failed
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full">
            Pending
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search homework by filename..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {searchQuery ? 'No results found' : 'No homework uploaded yet'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery
              ? 'Try a different search term'
              : 'Upload your first homework problem to get started'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((upload) => (
            <div
              key={upload.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                {/* Thumbnail */}
                <div className="flex-shrink-0 w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <img
                    src={upload.image_url}
                    alt={upload.file_name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {upload.file_name}
                    </h3>
                    {getStatusBadge(upload.status)}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(upload.created_at)}
                    </span>
                    <span>{(upload.file_size / 1024).toFixed(0)} KB</span>
                    <span className="uppercase">{upload.format}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {upload.status === 'completed' && (
                      <button
                        onClick={() => onViewSolution(upload.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 rounded-lg text-xs font-medium transition-colors"
                      >
                        <Eye className="h-3 w-3" />
                        View Solution
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(upload)}
                      disabled={deleting === upload.id}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleting === upload.id ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-700 dark:border-red-300" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeworkHistory;
