// User API Keys Service with encryption
import { supabase } from './supabase';

export interface UserApiKey {
  id: string;
  user_id: string;
  service_name: 'openai' | 'stability' | 'midjourney' | 'gemini';
  api_key: string; // Decrypted API key for display
  key_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiKeyInput {
  service_name: 'openai' | 'stability' | 'midjourney' | 'gemini';
  api_key: string;
}

class UserApiKeysService {
  private static instance: UserApiKeysService;

  private constructor() {}

  static getInstance(): UserApiKeysService {
    if (!UserApiKeysService.instance) {
      UserApiKeysService.instance = new UserApiKeysService();
    }
    return UserApiKeysService.instance;
  }

  // Simple encryption/decryption (in production, use a more secure method)
  private encrypt(text: string): string {
    // Simple base64 encoding for demo - in production use proper encryption
    return btoa(text);
  }

  private decrypt(encryptedText: string): string {
    // Simple base64 decoding for demo - in production use proper decryption
    try {
      return atob(encryptedText);
    } catch {
      return '';
    }
  }

  async saveApiKey(apiKeyData: ApiKeyInput): Promise<boolean> {
    try {
      console.log('🔐 Attempting to save API key for service:', apiKeyData.service_name);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('❌ User not authenticated');
        throw new Error('User not authenticated');
      }

      console.log('✅ User authenticated:', user.id);

      const encryptedKey = this.encrypt(apiKeyData.api_key);
      console.log('🔒 Key encrypted, attempting to save to database...');

      const { error } = await supabase
        .from('user_api_keys')
        .upsert({
          user_id: user.id,
          service_name: apiKeyData.service_name,
          api_key_encrypted: encryptedKey,
          is_active: true
        });

      if (error) {
        console.error('❌ Database error saving API key:', error);
        console.error('Error details:', error.message, error.details, error.hint);
        return false;
      }

      console.log(`✅ API key saved for ${apiKeyData.service_name}`);
      return true;
    } catch (error) {
      console.error('❌ Error saving API key:', error);
      return false;
    }
  }

  // New method for the settings page with key_name support
  async saveApiKeyWithName(serviceName: string, apiKey: string, keyName: string): Promise<boolean> {
    try {
      console.log('🔐 Attempting to save API key for service:', serviceName);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('❌ User not authenticated');
        throw new Error('User not authenticated');
      }

      console.log('✅ User authenticated:', user.id);

      const encryptedKey = this.encrypt(apiKey);
      console.log('🔒 Key encrypted, attempting to save to database...');

      const { error } = await supabase
        .from('user_api_keys')
        .upsert({
          user_id: user.id,
          service_name: serviceName,
          api_key_encrypted: encryptedKey,
          key_name: keyName,
          is_active: true
        });

      if (error) {
        console.error('❌ Database error saving API key:', error);
        console.error('Error details:', error.message, error.details, error.hint);
        return false;
      }

      console.log(`✅ API key saved for ${serviceName}`);
      return true;
    } catch (error) {
      console.error('❌ Error saving API key:', error);
      return false;
    }
  }

  async getApiKey(serviceName: 'openai' | 'stability' | 'midjourney' | 'gemini'): Promise<string | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return null;
      }

      const { data, error } = await supabase
        .from('user_api_keys')
        .select('api_key_encrypted')
        .eq('user_id', user.id)
        .eq('service_name', serviceName)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error || !data) {
        console.log(`⚠️ No API key found in database for ${serviceName}:`, error?.message || 'No data');
        return null;
      }

      return this.decrypt(data.api_key_encrypted);
    } catch (error) {
      console.error('Error getting API key:', error);
      return null;
    }
  }

  async getAllApiKeys(): Promise<UserApiKey[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return [];
      }

      const { data, error } = await supabase
        .from('user_api_keys')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error getting API keys:', error);
        return [];
      }

      // Decrypt the API keys before returning
      const decryptedKeys = (data || []).map(key => ({
        id: key.id,
        user_id: key.user_id,
        service_name: key.service_name,
        api_key: this.decrypt(key.api_key_encrypted), // Decrypt the key
        key_name: key.key_name,
        is_active: key.is_active,
        created_at: key.created_at,
        updated_at: key.updated_at
      }));

      return decryptedKeys;
    } catch (error) {
      console.error('Error getting API keys:', error);
      return [];
    }
  }

  async deleteApiKey(serviceName: 'openai' | 'stability' | 'midjourney' | 'gemini'): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return false;
      }

      const { error } = await supabase
        .from('user_api_keys')
        .update({ is_active: false })
        .eq('user_id', user.id)
        .eq('service_name', serviceName);

      if (error) {
        console.error('Error deleting API key:', error);
        return false;
      }

      console.log(`✅ API key deleted for ${serviceName}`);
      return true;
    } catch (error) {
      console.error('Error deleting API key:', error);
      return false;
    }
  }

  async hasApiKey(serviceName: 'openai' | 'stability' | 'midjourney' | 'gemini'): Promise<boolean> {
    const apiKey = await this.getApiKey(serviceName);
    return apiKey !== null && apiKey.length > 0;
  }
}

export default UserApiKeysService;

// Helper function for easy access
export async function getUserApiKey(userId: string, serviceName: 'openai' | 'stability' | 'midjourney' | 'gemini'): Promise<string | null> {
  console.log(`🔍 getUserApiKey called for service: ${serviceName}, userId: ${userId}`);
  const service = UserApiKeysService.getInstance();
  
  // Try to get from database first
  console.log('📦 Step 1: Checking database...');
  const dbKey = await service.getApiKey(serviceName);
  if (dbKey) {
    console.log(`✅ Found ${serviceName} API key in DATABASE`);
    console.log(`🔑 Key length: ${dbKey.length}`);
    console.log(`🔑 Key preview: ${dbKey.substring(0, 10)}...`);
    return dbKey;
  }
  
  console.log('⚠️ No key found in database, checking localStorage...');
  
  // Fallback to localStorage (for keys saved before database was available)
  try {
    const savedKeys = localStorage.getItem('user_api_keys');
    if (savedKeys) {
      console.log('📦 Found user_api_keys in localStorage');
      // LocalStorage stores plain api_key, not encrypted
      interface LocalStorageApiKey {
        id: string;
        user_id: string;
        service_name: string;
        api_key: string;
        key_name?: string;
        is_active: boolean;
        created_at: string;
        updated_at: string;
      }
      const parsedKeys = JSON.parse(savedKeys) as LocalStorageApiKey[];
      console.log(`📦 Parsed ${parsedKeys.length} keys from localStorage`);
      console.log(`📦 Services found: ${parsedKeys.map(k => k.service_name).join(', ')}`);
      
      const key = parsedKeys.find((k) => k.service_name === serviceName && k.is_active);
      if (key && key.api_key) {
        console.log(`✅ Found ${serviceName} API key in localStorage`);
        console.log(`🔑 Key length: ${key.api_key.length}`);
        console.log(`🔑 Key preview: ${key.api_key.substring(0, 10)}...`);
        return key.api_key;
      } else {
        console.log(`⚠️ No matching key found for ${serviceName} in localStorage`);
        if (key) {
          console.log(`⚠️ Key exists but api_key is empty or invalid`);
        }
      }
    } else {
      console.log('⚠️ No user_api_keys found in localStorage');
    }
  } catch (error) {
    console.error('❌ Error reading API keys from localStorage:', error);
  }
  
  console.log(`❌ No ${serviceName} API key found in database or localStorage`);
  return null;
}
