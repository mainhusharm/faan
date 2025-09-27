import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';
import UserApiKeysService, { UserApiKey } from '../lib/userApiKeys';
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
  Monitor,
  Cpu,
  Sparkles
} from 'lucide-react';

interface ApiKeyForm {
  service_name: 'openai' | 'stability' | 'midjourney' | 'gemini';
  api_key: string;
  key_name: string;
}

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [apiKeys, setApiKeys] = useState<UserApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState<{ [key: string]: boolean }>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editApiKey, setEditApiKey] = useState('');
  const [newApiKeyForm, setNewApiKeyForm] = useState<ApiKeyForm>({
    service_name: 'openai',
    api_key: '',
    key_name: ''
  });
  const [userApiKeysService] = useState(() => UserApiKeysService.getInstance());

  // Service name mapping for display
  const getServiceDisplayName = (serviceName: string) => {
    const serviceMap: { [key: string]: string } = {
      'openai': 'OpenAI DALL-E',
      'stability': 'Stability AI',
      'midjourney': 'Midjourney',
      'gemini': 'Google Gemini'
    };
    return serviceMap[serviceName] || serviceName;
  };

  useEffect(() => {
    // Add a timeout fallback in case loading gets stuck
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn('⚠️ Loading timeout, forcing stop');
        setLoading(false);
      }
    }, 5000); // 5 second timeout

    loadApiKeys();
    
    return () => clearTimeout(timeoutId);
  }, []);

  const loadApiKeys = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading API keys...');
      
      // First try to load from localStorage (immediate)
      const savedKeys = localStorage.getItem('user_api_keys');
      if (savedKeys) {
        try {
          const parsedKeys = JSON.parse(savedKeys);
          setApiKeys(parsedKeys);
          console.log('📦 Loaded API keys from localStorage:', parsedKeys.length);
        } catch (parseError) {
          console.warn('⚠️ Failed to parse saved API keys:', parseError);
          // Clear corrupted data
          localStorage.removeItem('user_api_keys');
        }
      } else {
        console.log('📦 No saved API keys in localStorage');
      }
      
      // Set loading to false immediately after localStorage load
      setLoading(false);
      
      // Then try to load from database (background sync) - don't block UI
      setTimeout(async () => {
        try {
          console.log('🔄 Attempting database sync...');
          const dbKeys = await userApiKeysService.getAllApiKeys();
          if (dbKeys && dbKeys.length > 0) {
            setApiKeys(dbKeys);
            // Save to localStorage for next time
            localStorage.setItem('user_api_keys', JSON.stringify(dbKeys));
            console.log('💾 Synced API keys from database:', dbKeys.length);
          } else {
            console.log('💾 No API keys in database');
          }
        } catch (dbError) {
          console.warn('⚠️ Database load failed, using localStorage:', dbError);
        }
      }, 100);
      
    } catch (error) {
      console.error('❌ Error loading API keys:', error);
      setLoading(false);
    }
  };


  const saveApiKey = async () => {
    console.log('💾 Save button clicked');
    
    if (!newApiKeyForm.api_key.trim()) {
      alert('Please enter an API key.');
      return;
    }

    if (!newApiKeyForm.key_name.trim()) {
      alert('Please enter a name for your API key.');
      return;
    }

    setSaving(true);
    
    try {
      console.log('🔐 Attempting to save API key...');
      console.log('Service:', newApiKeyForm.service_name);
      console.log('Key name:', newApiKeyForm.key_name);
      console.log('API key length:', newApiKeyForm.api_key.length);
      
      // For now, let's simulate saving to local state until database is ready
      const newApiKey = {
        id: Date.now().toString(),
        user_id: 'demo-user',
        service_name: newApiKeyForm.service_name,
        api_key: newApiKeyForm.api_key.trim(),
        key_name: newApiKeyForm.key_name.trim(),
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Add to local state immediately
      setApiKeys(prevKeys => [...prevKeys, newApiKey]);
      
      // Save to localStorage for persistence
      const updatedKeys = [...apiKeys, newApiKey];
      localStorage.setItem('user_api_keys', JSON.stringify(updatedKeys));
      
      console.log('✅ API key added to local state and localStorage');
      
      // Try to save to database (but don't fail if it doesn't work)
      try {
        await userApiKeysService.saveApiKeyWithName(
          newApiKeyForm.service_name,
          newApiKeyForm.api_key.trim(),
          newApiKeyForm.key_name.trim()
        );
        console.log('✅ API key saved to database');
      } catch (dbError) {
        console.warn('⚠️ Database save failed, but key is saved locally:', dbError);
      }
      
      alert('API key saved successfully!');
      setNewApiKeyForm({ service_name: 'openai', api_key: '', key_name: '' });
      setShowAddForm(false);
      
    } catch (error) {
      console.error('❌ Error saving API key:', error);
      alert('Error saving API key. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const deleteApiKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to delete this API key?')) return;

    try {
      // Find the API key to get the service name
      const apiKey = apiKeys.find(key => key.id === keyId);
      if (!apiKey) {
        alert('API key not found.');
        return;
      }

      // Remove from local state immediately
      setApiKeys(prevKeys => prevKeys.filter(key => key.id !== keyId));
      
      // Update localStorage
      const updatedKeys = apiKeys.filter(key => key.id !== keyId);
      localStorage.setItem('user_api_keys', JSON.stringify(updatedKeys));
      
      // Try to delete from database (but don't fail if it doesn't work)
      try {
        await userApiKeysService.deleteApiKey(apiKey.service_name);
        console.log('✅ API key deleted from database');
      } catch (dbError) {
        console.warn('⚠️ Database delete failed, but key is removed locally:', dbError);
      }
      
      alert('API key deleted successfully!');
      
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* API Keys Section */}
        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Key className="h-6 w-6 mr-3 text-gray-400" />
                API Keys
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Add and manage your API keys for different AI services.
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
            {apiKeys.length === 0 && (
              <div className="text-center py-12">
                <Key className="h-16 w-16 text-gray-500 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-white mb-3">
                  No API keys added
                </h3>
                <p className="text-gray-400 mb-6">
                  Add your first API key to unlock enhanced features like AI image generation.
                </p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Your First Key
                </button>
              </div>
            )}

            {apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="border border-gray-700 rounded-lg p-4 bg-gray-700">
                {editingKey === apiKey.id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-white capitalize">
                        Edit {getServiceDisplayName(apiKey.service_name)} API Key
                      </h3>
                      <button
                        onClick={cancelEdit}
                        className="p-1 text-gray-400 hover:text-gray-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        API Key
                      </label>
                      <input
                        type="password"
                        value={editApiKey}
                        onChange={(e) => setEditApiKey(e.target.value)}
                        placeholder="Enter your API key"
                        className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-600 text-white"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={cancelEdit}
                        className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
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
                        <h3 className="font-medium text-white">
                          {apiKey.key_name || getServiceDisplayName(apiKey.service_name)}
                        </h3>
                        <span className="ml-2 px-2 py-1 bg-blue-900 text-blue-200 text-xs rounded-full">
                          {getServiceDisplayName(apiKey.service_name)}
                        </span>
                        <span className="ml-2 px-2 py-1 bg-green-900 text-green-200 text-xs rounded-full flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <code className="text-sm text-gray-300 font-mono bg-gray-600 px-2 py-1 rounded">
                          {showApiKey[apiKey.id] ? apiKey.api_key : maskApiKey(apiKey.api_key)}
                        </code>
                        <button
                          onClick={() => toggleShowApiKey(apiKey.id)}
                          className="p-1 text-gray-400 hover:text-gray-300"
                        >
                          {showApiKey[apiKey.id] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
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
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Edit API Key"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteApiKey(apiKey.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete API Key"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>


        {/* Add API Key Form */}
        {showAddForm && (
          <div className="bg-gray-800 rounded-lg shadow-md p-6 mt-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Add API Key
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Key Name
                </label>
                <input
                  type="text"
                  value={newApiKeyForm.key_name}
                  onChange={(e) => setNewApiKeyForm(prev => ({ ...prev, key_name: e.target.value }))}
                  placeholder="e.g., My Gemini Key, Production OpenAI Key"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Give your API key a memorable name to identify it easily.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Service
                </label>
                <select
                  value={newApiKeyForm.service_name}
                  onChange={(e) => setNewApiKeyForm(prev => ({ ...prev, service_name: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white"
                >
                  <option value="openai">OpenAI DALL-E</option>
                  <option value="stability">Stability AI</option>
                  <option value="midjourney">Midjourney</option>
                  <option value="gemini">Google Gemini</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  value={newApiKeyForm.api_key}
                  onChange={(e) => setNewApiKeyForm(prev => ({ ...prev, api_key: e.target.value }))}
                  placeholder={`Enter your ${getServiceDisplayName(newApiKeyForm.service_name)} API key`}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white"
                />
                <p className="text-xs text-gray-400 mt-1">
                  This key will be used for AI image generation with {getServiceDisplayName(newApiKeyForm.service_name)}.
                </p>
              </div>
              
              <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
                  <div className="text-sm text-blue-200">
                    <p className="font-medium mb-1">How to get your API key:</p>
                    <ol className="list-decimal list-inside space-y-1 text-xs">
                      <li>Go to the service provider's website (OpenAI, Stability AI, etc.)</li>
                      <li>Create an account or sign in</li>
                      <li>Navigate to API keys or billing section</li>
                      <li>Generate a new API key</li>
                      <li>Copy the API key and paste it above</li>
                    </ol>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewApiKeyForm({ service_name: 'openai', api_key: '', key_name: '' });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log('🔘 Save button clicked!');
                    console.log('API key value:', newApiKeyForm.api_key);
                    console.log('API key trimmed:', newApiKeyForm.api_key.trim());
                    console.log('Is disabled?', !newApiKeyForm.api_key.trim() || saving);
                    saveApiKey();
                  }}
                  disabled={!newApiKeyForm.api_key.trim() || !newApiKeyForm.key_name.trim() || saving}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center ${
                    !newApiKeyForm.api_key.trim() || !newApiKeyForm.key_name.trim() || saving
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  title={!newApiKeyForm.key_name.trim() ? 'Please enter a key name' : !newApiKeyForm.api_key.trim() ? 'Please enter an API key' : saving ? 'Saving...' : 'Save API key'}
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
