import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';
import { 
  Settings, 
  Key, 
  Save, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle,
  Trash2,
  Plus,
  Loader2,
  Edit3,
  X,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';

interface ApiKey {
  id: string;
  service: string;
  api_key: string;
  created_at: string;
  updated_at?: string;
}

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState<{ [key: string]: boolean }>({});
  const [newApiKey, setNewApiKey] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editApiKey, setEditApiKey] = useState('');

  useEffect(() => {
    if (user) {
      // For now, just set loading to false to prevent infinite loading
      setLoading(false);
      
      // Check localStorage for existing API key
      const savedApiKey = localStorage.getItem('google_imagen_api_key');
      if (savedApiKey) {
        setApiKeys([
          {
            id: '1',
            service: 'google_imagen',
            api_key: savedApiKey,
            created_at: new Date().toISOString()
          }
        ]);
      } else {
        setApiKeys([
          {
            id: '1',
            service: 'google_imagen',
            api_key: 'sk-1234567890abcdef',
            created_at: new Date().toISOString()
          }
        ]);
      }
      
      // loadApiKeys();
    }
  }, [user]);


  const saveApiKey = async () => {
    if (!user || !newApiKey.trim()) return;

    setSaving(true);
    try {
      // For now, just add to local state since we're using mock data
      const newKey = {
        id: Date.now().toString(),
        service: 'google_imagen',
        api_key: newApiKey.trim(),
        created_at: new Date().toISOString()
      };
      
      setApiKeys(prev => [newKey, ...prev]);
      setNewApiKey('');
      setShowAddForm(false);
      
      // Save to localStorage for Creative Learning page to access
      localStorage.setItem('google_imagen_api_key', newApiKey.trim());
      
      // Show success message
      alert('API key saved successfully!');
      
      // In a real app, you would save to database:
      // const { error } = await supabase
      //   .from('user_api_keys')
      //   .upsert({
      //     user_id: user.id,
      //     service: 'google_imagen',
      //     api_key: newApiKey.trim()
      //   });
    } catch (error) {
      console.error('Error saving API key:', error);
      alert('Error saving API key. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const deleteApiKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to delete this API key?')) return;

    try {
      // For now, just remove from local state since we're using mock data
      setApiKeys(prev => prev.filter(key => key.id !== keyId));
      
      // Remove from localStorage if it's the Google Imagen key
      const keyToDelete = apiKeys.find(key => key.id === keyId);
      if (keyToDelete?.service === 'google_imagen') {
        localStorage.removeItem('google_imagen_api_key');
      }
      
      alert('API key deleted successfully!');
      
      // In a real app, you would delete from database:
      // const { error } = await supabase
      //   .from('user_api_keys')
      //   .delete()
      //   .eq('id', keyId);
    } catch (error) {
      console.error('Error deleting API key:', error);
      alert('Error deleting API key. Please try again.');
    }
  };

  const startEdit = (keyId: string, currentKey: string) => {
    setEditingKey(keyId);
    setEditApiKey(currentKey);
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setEditApiKey('');
  };

  const saveEdit = async () => {
    if (!editingKey || !editApiKey.trim()) return;

    setSaving(true);
    try {
      // For now, just update local state since we're using mock data
      setApiKeys(prev => prev.map(key => 
        key.id === editingKey 
          ? { ...key, api_key: editApiKey.trim(), updated_at: new Date().toISOString() }
          : key
      ));
      
      // Update localStorage if it's the Google Imagen key
      const keyToUpdate = apiKeys.find(key => key.id === editingKey);
      if (keyToUpdate?.service === 'google_imagen') {
        localStorage.setItem('google_imagen_api_key', editApiKey.trim());
      }
      
      setEditingKey(null);
      setEditApiKey('');
      alert('API key updated successfully!');
      
      // In a real app, you would update in database:
      // const { error } = await supabase
      //   .from('user_api_keys')
      //   .update({ api_key: editApiKey.trim() })
      //   .eq('id', editingKey);
    } catch (error) {
      console.error('Error updating API key:', error);
      alert('Error updating API key. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const toggleShowApiKey = (keyId: string) => {
    setShowApiKey(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const maskApiKey = (apiKey: string) => {
    if (apiKey.length <= 8) return '•'.repeat(apiKey.length);
    return apiKey.substring(0, 4) + '•'.repeat(apiKey.length - 8) + apiKey.substring(apiKey.length - 4);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Settings className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Settings
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your account settings and API keys for enhanced features.
          </p>
        </div>

        {/* API Keys Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <Key className="h-5 w-5 mr-2" />
                API Keys
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Manage your API keys for third-party services like Google Imagen.
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Key
            </button>
          </div>

          {/* API Keys List */}
          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                {editingKey === apiKey.id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 dark:text-white capitalize">
                        Edit {apiKey.service.replace('_', ' ')} API Key
                      </h3>
                      <button
                        onClick={cancelEdit}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        API Key
                      </label>
                      <input
                        type="password"
                        value={editApiKey}
                        onChange={(e) => setEditApiKey(e.target.value)}
                        placeholder="Enter your API key"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={cancelEdit}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveEdit}
                        disabled={!editApiKey.trim() || saving}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-white capitalize">
                          {apiKey.service.replace('_', ' ')}
                        </h3>
                        <span className="ml-2 px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <code className="text-sm text-gray-600 dark:text-gray-300 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {showApiKey[apiKey.id] ? apiKey.api_key : maskApiKey(apiKey.api_key)}
                        </code>
                        <button
                          onClick={() => toggleShowApiKey(apiKey.id)}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showApiKey[apiKey.id] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Added on {new Date(apiKey.created_at).toLocaleDateString()}
                        {apiKey.updated_at && (
                          <span className="ml-2">
                            • Updated on {new Date(apiKey.updated_at).toLocaleDateString()}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => startEdit(apiKey.id, apiKey.api_key)}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Edit API Key"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteApiKey(apiKey.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete API Key"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {apiKeys.length === 0 && (
              <div className="text-center py-8">
                <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No API keys added
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Add your first API key to unlock enhanced features like AI image generation.
                </p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Key
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Theme Settings Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <Monitor className="h-5 w-5 mr-2" />
                Appearance
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Customize the look and feel of your application.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  {isDarkMode ? (
                    <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  ) : (
                    <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Dark Mode
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {isDarkMode ? 'Currently using dark theme' : 'Currently using light theme'}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  isDarkMode ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDarkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Sun className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Theme Preferences
                  </h4>
                  <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                    <p>
                      Choose between light and dark themes to match your preference. 
                      The theme will be applied across all pages of the application.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add API Key Form */}
        {showAddForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add Google API Key
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Google API Key
                </label>
                <input
                  type="password"
                  value={newApiKey}
                  onChange={(e) => setNewApiKey(e.target.value)}
                  placeholder="Enter your Google API key for Imagen 3"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  This key will be used to generate images using Google's Imagen 3 API.
                </p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5" />
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-medium mb-1">How to get your Google API key:</p>
                    <ol className="list-decimal list-inside space-y-1 text-xs">
                      <li>Go to the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></li>
                      <li>Create a new project or select an existing one</li>
                      <li>Enable the Vertex AI API</li>
                      <li>Create credentials (API key) for your project</li>
                      <li>Copy the API key and paste it above</li>
                    </ol>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewApiKey('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveApiKey}
                  disabled={!newApiKey.trim() || saving}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Key
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
