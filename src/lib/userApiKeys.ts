// User API Keys Service with encryption
import { supabase } from './supabase';

export interface UserApiKey {
  id: string;
  user_id: string;
  service_name: 'openai' | 'stability' | 'midjourney' | 'gemini';
  api_key_encrypted: string;
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
        .single();

      if (error || !data) {
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

      return data || [];
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
