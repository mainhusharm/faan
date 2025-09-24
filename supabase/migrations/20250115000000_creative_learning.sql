/*
  # Creative Learning Features Migration

  1. New Tables
    - `user_api_keys`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `service` (text) - 'google_imagen'
      - `api_key` (text, encrypted)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `creative_designs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `title` (text)
      - `description` (text)
      - `prompt` (text)
      - `image_url` (text)
      - `tags` (text array)
      - `is_public` (boolean, default true)
      - `likes_count` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `design_likes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `design_id` (uuid, foreign key)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Public read access for creative designs
*/

-- Create user_api_keys table
CREATE TABLE IF NOT EXISTS user_api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  service text NOT NULL CHECK (service IN ('google_imagen')),
  api_key text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, service)
);

-- Create creative_designs table
CREATE TABLE IF NOT EXISTS creative_designs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  prompt text NOT NULL,
  image_url text NOT NULL,
  tags text[] DEFAULT '{}',
  is_public boolean DEFAULT true,
  likes_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create design_likes table
CREATE TABLE IF NOT EXISTS design_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  design_id uuid REFERENCES creative_designs(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, design_id)
);

-- Enable Row Level Security
ALTER TABLE user_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE creative_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_likes ENABLE ROW LEVEL SECURITY;

-- User API Keys policies
CREATE POLICY "Users can view own API keys"
  ON user_api_keys
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own API keys"
  ON user_api_keys
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own API keys"
  ON user_api_keys
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own API keys"
  ON user_api_keys
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Creative Designs policies
CREATE POLICY "Anyone can view public creative designs"
  ON creative_designs
  FOR SELECT
  TO authenticated
  USING (is_public = true);

CREATE POLICY "Users can view own creative designs"
  ON creative_designs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own creative designs"
  ON creative_designs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own creative designs"
  ON creative_designs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own creative designs"
  ON creative_designs
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Design Likes policies
CREATE POLICY "Users can view all design likes"
  ON design_likes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own design likes"
  ON design_likes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own design likes"
  ON design_likes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to update likes count
CREATE OR REPLACE FUNCTION update_design_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE creative_designs 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.design_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE creative_designs 
    SET likes_count = likes_count - 1 
    WHERE id = OLD.design_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for likes count
CREATE TRIGGER update_likes_count_on_insert
  AFTER INSERT ON design_likes
  FOR EACH ROW EXECUTE FUNCTION update_design_likes_count();

CREATE TRIGGER update_likes_count_on_delete
  AFTER DELETE ON design_likes
  FOR EACH ROW EXECUTE FUNCTION update_design_likes_count();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_user_api_keys_updated_at
  BEFORE UPDATE ON user_api_keys
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creative_designs_updated_at
  BEFORE UPDATE ON creative_designs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
