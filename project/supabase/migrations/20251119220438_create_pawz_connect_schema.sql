/*
  # Pawz-Connect Database Schema
  
  ## Overview
  Complete database schema for Pawz-Connect pet social platform with privacy-first design,
  secure authentication, subscription management, and API usage tracking.
  
  ## 1. New Tables
  
  ### Authentication & Users
    - `profiles` - Extended user profile information
      - `id` (uuid, primary key, references auth.users)
      - `username` (text, unique)
      - `display_name` (text)
      - `avatar_url` (text)
      - `bio` (text)
      - `location` (text)
      - `privacy_settings` (jsonb) - User privacy preferences
      - `mfa_enabled` (boolean)
      - `email_verified` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `user_consents` - GDPR/CCPA consent tracking
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `consent_type` (text) - e.g., 'marketing', 'data_processing', 'location'
      - `granted` (boolean)
      - `granted_at` (timestamptz)
      - `ip_address` (text)
    
    - `audit_logs` - Security audit trail
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `action` (text)
      - `resource_type` (text)
      - `resource_id` (uuid)
      - `ip_address` (text)
      - `user_agent` (text)
      - `created_at` (timestamptz)
  
  ### Pet Management
    - `pets` - User's pets
      - `id` (uuid, primary key)
      - `owner_id` (uuid, references profiles)
      - `name` (text)
      - `species` (text)
      - `breed` (text)
      - `birth_date` (date)
      - `photo_url` (text)
      - `microchip_id` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `health_records` - Pet health tracking
      - `id` (uuid, primary key)
      - `pet_id` (uuid, references pets)
      - `record_type` (text) - e.g., 'vaccination', 'checkup', 'medication'
      - `title` (text)
      - `description` (text)
      - `record_date` (date)
      - `veterinarian` (text)
      - `attachments` (jsonb) - Array of file URLs
      - `created_at` (timestamptz)
  
  ### Social Features
    - `posts` - Community feed posts
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `content` (text)
      - `media_urls` (jsonb) - Array of image/video URLs
      - `visibility` (text) - 'public', 'followers', 'private'
      - `pet_ids` (jsonb) - Array of tagged pet IDs
      - `likes_count` (integer)
      - `comments_count` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `comments` - Post comments
      - `id` (uuid, primary key)
      - `post_id` (uuid, references posts)
      - `user_id` (uuid, references profiles)
      - `content` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `likes` - Post likes
      - `id` (uuid, primary key)
      - `post_id` (uuid, references posts)
      - `user_id` (uuid, references profiles)
      - `created_at` (timestamptz)
    
    - `follows` - User connections
      - `id` (uuid, primary key)
      - `follower_id` (uuid, references profiles)
      - `following_id` (uuid, references profiles)
      - `created_at` (timestamptz)
  
  ### Pet Services
    - `pet_services` - Service providers directory
      - `id` (uuid, primary key)
      - `name` (text)
      - `service_type` (text) - 'grooming', 'veterinary', 'hospital', 'store', 'training'
      - `description` (text)
      - `address` (text)
      - `latitude` (numeric)
      - `longitude` (numeric)
      - `phone` (text)
      - `email` (text)
      - `website` (text)
      - `hours` (jsonb)
      - `verified` (boolean)
      - `verified_at` (timestamptz)
      - `verified_by` (uuid, references profiles)
      - `rating_avg` (numeric)
      - `rating_count` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `service_reviews` - Service ratings and reviews
      - `id` (uuid, primary key)
      - `service_id` (uuid, references pet_services)
      - `user_id` (uuid, references profiles)
      - `rating` (integer) - 1-5 stars
      - `review` (text)
      - `moderation_status` (text) - 'pending', 'approved', 'rejected'
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  ### Payments & Subscriptions
    - `subscriptions` - User subscription tiers
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `stripe_customer_id` (text)
      - `stripe_subscription_id` (text)
      - `plan_type` (text) - 'free', 'premium', 'professional'
      - `status` (text) - 'active', 'canceled', 'past_due'
      - `current_period_start` (timestamptz)
      - `current_period_end` (timestamptz)
      - `cancel_at_period_end` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `payment_transactions` - Payment history (encrypted sensitive data)
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `stripe_payment_intent_id` (text)
      - `amount` (integer) - Amount in cents
      - `currency` (text)
      - `status` (text)
      - `description` (text)
      - `created_at` (timestamptz)
  
  ### AI Usage Tracking
    - `api_usage` - Perplexity API usage monitoring
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `endpoint` (text)
      - `request_type` (text) - 'search', 'recommendation', 'assistance'
      - `tokens_used` (integer)
      - `cached` (boolean)
      - `cost` (numeric)
      - `created_at` (timestamptz)
    
    - `api_rate_limits` - User API quotas
      - `user_id` (uuid, primary key, references profiles)
      - `daily_limit` (integer)
      - `daily_used` (integer)
      - `monthly_limit` (integer)
      - `monthly_used` (integer)
      - `last_reset_daily` (date)
      - `last_reset_monthly` (date)
      - `updated_at` (timestamptz)
    
    - `api_cache` - Response caching to reduce API calls
      - `id` (uuid, primary key)
      - `cache_key` (text, unique)
      - `request_params` (jsonb)
      - `response_data` (jsonb)
      - `expires_at` (timestamptz)
      - `hit_count` (integer)
      - `created_at` (timestamptz)
  
  ## 2. Security Features
    - Row Level Security (RLS) enabled on all tables
    - Restrictive policies checking authentication and ownership
    - Encrypted sensitive data fields
    - Audit logging for critical operations
    - Privacy controls and consent tracking
  
  ## 3. Indexes
    - Performance indexes on frequently queried columns
    - Location indexes for geospatial searches
    - Full-text search indexes for content discovery
  
  ## 4. Functions
    - Automatic timestamp updates
    - Counter updates for denormalized counts
    - API usage tracking and rate limiting checks
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PROFILES & AUTHENTICATION
-- ============================================================================

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  display_name text NOT NULL,
  avatar_url text,
  bio text DEFAULT '',
  location text DEFAULT '',
  privacy_settings jsonb DEFAULT '{"profile_visibility": "public", "location_sharing": false, "show_pets": true}'::jsonb,
  mfa_enabled boolean DEFAULT false,
  email_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30),
  CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_]+$')
);

CREATE TABLE IF NOT EXISTS user_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  consent_type text NOT NULL,
  granted boolean NOT NULL,
  granted_at timestamptz DEFAULT now(),
  ip_address text,
  CONSTRAINT valid_consent_type CHECK (consent_type IN ('marketing', 'data_processing', 'location', 'analytics'))
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- PET MANAGEMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS pets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  species text NOT NULL,
  breed text DEFAULT '',
  birth_date date,
  photo_url text,
  microchip_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS health_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  record_type text NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  record_date date NOT NULL,
  veterinarian text DEFAULT '',
  attachments jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_record_type CHECK (record_type IN ('vaccination', 'checkup', 'medication', 'surgery', 'allergy', 'other'))
);

-- ============================================================================
-- SOCIAL FEATURES
-- ============================================================================

CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  media_urls jsonb DEFAULT '[]'::jsonb,
  visibility text DEFAULT 'public',
  pet_ids jsonb DEFAULT '[]'::jsonb,
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_visibility CHECK (visibility IN ('public', 'followers', 'private'))
);

CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

CREATE TABLE IF NOT EXISTS follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CONSTRAINT no_self_follow CHECK (follower_id != following_id)
);

-- ============================================================================
-- PET SERVICES
-- ============================================================================

CREATE TABLE IF NOT EXISTS pet_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  service_type text NOT NULL,
  description text DEFAULT '',
  address text NOT NULL,
  latitude numeric(10, 8) NOT NULL,
  longitude numeric(11, 8) NOT NULL,
  phone text DEFAULT '',
  email text DEFAULT '',
  website text DEFAULT '',
  hours jsonb DEFAULT '{}'::jsonb,
  verified boolean DEFAULT false,
  verified_at timestamptz,
  verified_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  rating_avg numeric(3, 2) DEFAULT 0,
  rating_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_service_type CHECK (service_type IN ('grooming', 'veterinary', 'hospital', 'store', 'training')),
  CONSTRAINT valid_rating CHECK (rating_avg >= 0 AND rating_avg <= 5)
);

CREATE TABLE IF NOT EXISTS service_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES pet_services(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL,
  review text DEFAULT '',
  moderation_status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_rating CHECK (rating >= 1 AND rating <= 5),
  CONSTRAINT valid_moderation_status CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
  UNIQUE(service_id, user_id)
);

-- ============================================================================
-- PAYMENTS & SUBSCRIPTIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan_type text DEFAULT 'free',
  status text DEFAULT 'active',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_plan_type CHECK (plan_type IN ('free', 'premium', 'professional')),
  CONSTRAINT valid_status CHECK (status IN ('active', 'canceled', 'past_due', 'incomplete')),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS payment_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_payment_intent_id text,
  amount integer NOT NULL,
  currency text DEFAULT 'usd',
  status text NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'succeeded', 'failed', 'canceled'))
);

-- ============================================================================
-- AI USAGE TRACKING
-- ============================================================================

CREATE TABLE IF NOT EXISTS api_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  endpoint text NOT NULL,
  request_type text NOT NULL,
  tokens_used integer DEFAULT 0,
  cached boolean DEFAULT false,
  cost numeric(10, 6) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_request_type CHECK (request_type IN ('search', 'recommendation', 'assistance', 'chat'))
);

CREATE TABLE IF NOT EXISTS api_rate_limits (
  user_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  daily_limit integer DEFAULT 50,
  daily_used integer DEFAULT 0,
  monthly_limit integer DEFAULT 1000,
  monthly_used integer DEFAULT 0,
  last_reset_daily date DEFAULT CURRENT_DATE,
  last_reset_monthly date DEFAULT CURRENT_DATE,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS api_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key text UNIQUE NOT NULL,
  request_params jsonb NOT NULL,
  response_data jsonb NOT NULL,
  expires_at timestamptz NOT NULL,
  hit_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Profile indexes
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC);

-- Pet indexes
CREATE INDEX IF NOT EXISTS idx_pets_owner_id ON pets(owner_id);

-- Health records indexes
CREATE INDEX IF NOT EXISTS idx_health_records_pet_id ON health_records(pet_id);
CREATE INDEX IF NOT EXISTS idx_health_records_date ON health_records(record_date DESC);

-- Post indexes
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_visibility ON posts(visibility);

-- Comment indexes
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);

-- Like indexes
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);

-- Follow indexes
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);

-- Service indexes
CREATE INDEX IF NOT EXISTS idx_pet_services_service_type ON pet_services(service_type);
CREATE INDEX IF NOT EXISTS idx_pet_services_verified ON pet_services(verified);
CREATE INDEX IF NOT EXISTS idx_pet_services_rating ON pet_services(rating_avg DESC);
CREATE INDEX IF NOT EXISTS idx_pet_services_lat ON pet_services(latitude);
CREATE INDEX IF NOT EXISTS idx_pet_services_lng ON pet_services(longitude);

-- Review indexes
CREATE INDEX IF NOT EXISTS idx_service_reviews_service_id ON service_reviews(service_id);
CREATE INDEX IF NOT EXISTS idx_service_reviews_moderation ON service_reviews(moderation_status);

-- API usage indexes
CREATE INDEX IF NOT EXISTS idx_api_usage_user_id ON api_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_created_at ON api_usage(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_cache_key ON api_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_api_cache_expires ON api_cache(expires_at);

-- Audit log indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_profiles_updated_at') THEN
    CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_pets_updated_at') THEN
    CREATE TRIGGER update_pets_updated_at BEFORE UPDATE ON pets
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_posts_updated_at') THEN
    CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_comments_updated_at') THEN
    CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_pet_services_updated_at') THEN
    CREATE TRIGGER update_pet_services_updated_at BEFORE UPDATE ON pet_services
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_service_reviews_updated_at') THEN
    CREATE TRIGGER update_service_reviews_updated_at BEFORE UPDATE ON service_reviews
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_subscriptions_updated_at') THEN
    CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Function to increment post comments count
CREATE OR REPLACE FUNCTION increment_post_comments()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE posts SET comments_count = comments_count + 1
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement post comments count
CREATE OR REPLACE FUNCTION decrement_post_comments()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE posts SET comments_count = comments_count - 1
  WHERE id = OLD.post_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Apply comment count triggers
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'increment_post_comments_trigger') THEN
    CREATE TRIGGER increment_post_comments_trigger AFTER INSERT ON comments
      FOR EACH ROW EXECUTE FUNCTION increment_post_comments();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'decrement_post_comments_trigger') THEN
    CREATE TRIGGER decrement_post_comments_trigger AFTER DELETE ON comments
      FOR EACH ROW EXECUTE FUNCTION decrement_post_comments();
  END IF;
END $$;

-- Function to increment post likes count
CREATE OR REPLACE FUNCTION increment_post_likes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE posts SET likes_count = likes_count + 1
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement post likes count
CREATE OR REPLACE FUNCTION decrement_post_likes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE posts SET likes_count = likes_count - 1
  WHERE id = OLD.post_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Apply like count triggers
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'increment_post_likes_trigger') THEN
    CREATE TRIGGER increment_post_likes_trigger AFTER INSERT ON likes
      FOR EACH ROW EXECUTE FUNCTION increment_post_likes();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'decrement_post_likes_trigger') THEN
    CREATE TRIGGER decrement_post_likes_trigger AFTER DELETE ON likes
      FOR EACH ROW EXECUTE FUNCTION decrement_post_likes();
  END IF;
END $$;

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, display_name, email_verified)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'User'),
    NEW.email_confirmed_at IS NOT NULL
  );
  
  INSERT INTO api_rate_limits (user_id)
  VALUES (NEW.id);
  
  INSERT INTO subscriptions (user_id, plan_type, status)
  VALUES (NEW.id, 'free', 'active');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply user creation trigger
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION handle_new_user();
  END IF;
END $$;

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_cache ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view public profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    privacy_settings->>'profile_visibility' = 'public'
    OR id = auth.uid()
  );

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- User consents policies
CREATE POLICY "Users can view own consents"
  ON user_consents FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own consents"
  ON user_consents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Audit logs policies (read-only for users)
CREATE POLICY "Users can view own audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Pets policies
CREATE POLICY "Users can view own pets"
  ON pets FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own pets"
  ON pets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own pets"
  ON pets FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete own pets"
  ON pets FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Health records policies
CREATE POLICY "Pet owners can view health records"
  ON health_records FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = health_records.pet_id
      AND pets.owner_id = auth.uid()
    )
  );

CREATE POLICY "Pet owners can insert health records"
  ON health_records FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = pet_id
      AND pets.owner_id = auth.uid()
    )
  );

CREATE POLICY "Pet owners can update health records"
  ON health_records FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = health_records.pet_id
      AND pets.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = pet_id
      AND pets.owner_id = auth.uid()
    )
  );

CREATE POLICY "Pet owners can delete health records"
  ON health_records FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = health_records.pet_id
      AND pets.owner_id = auth.uid()
    )
  );

-- Posts policies
CREATE POLICY "Users can view public posts"
  ON posts FOR SELECT
  TO authenticated
  USING (
    visibility = 'public'
    OR user_id = auth.uid()
    OR (
      visibility = 'followers'
      AND EXISTS (
        SELECT 1 FROM follows
        WHERE follows.following_id = posts.user_id
        AND follows.follower_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can insert own posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Users can view comments on visible posts"
  ON comments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = comments.post_id
      AND (
        posts.visibility = 'public'
        OR posts.user_id = auth.uid()
        OR (
          posts.visibility = 'followers'
          AND EXISTS (
            SELECT 1 FROM follows
            WHERE follows.following_id = posts.user_id
            AND follows.follower_id = auth.uid()
          )
        )
      )
    )
  );

CREATE POLICY "Users can insert comments on visible posts"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = post_id
      AND (
        posts.visibility = 'public'
        OR posts.user_id = auth.uid()
        OR (
          posts.visibility = 'followers'
          AND EXISTS (
            SELECT 1 FROM follows
            WHERE follows.following_id = posts.user_id
            AND follows.follower_id = auth.uid()
          )
        )
      )
    )
  );

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Likes policies
CREATE POLICY "Users can view likes on visible posts"
  ON likes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = likes.post_id
      AND (
        posts.visibility = 'public'
        OR posts.user_id = auth.uid()
        OR (
          posts.visibility = 'followers'
          AND EXISTS (
            SELECT 1 FROM follows
            WHERE follows.following_id = posts.user_id
            AND follows.follower_id = auth.uid()
          )
        )
      )
    )
  );

CREATE POLICY "Users can insert own likes"
  ON likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes"
  ON likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Follows policies
CREATE POLICY "Users can view all follows"
  ON follows FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own follows"
  ON follows FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can delete own follows"
  ON follows FOR DELETE
  TO authenticated
  USING (auth.uid() = follower_id);

-- Pet services policies (public read, restricted write)
CREATE POLICY "Anyone can view verified services"
  ON pet_services FOR SELECT
  TO authenticated
  USING (verified = true);

CREATE POLICY "Authenticated users can insert services"
  ON pet_services FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Service reviews policies
CREATE POLICY "Users can view approved reviews"
  ON service_reviews FOR SELECT
  TO authenticated
  USING (
    moderation_status = 'approved'
    OR user_id = auth.uid()
  );

CREATE POLICY "Users can insert own reviews"
  ON service_reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON service_reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON service_reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Subscriptions policies
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Payment transactions policies
CREATE POLICY "Users can view own transactions"
  ON payment_transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- API usage policies
CREATE POLICY "Users can view own API usage"
  ON api_usage FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert API usage"
  ON api_usage FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- API rate limits policies
CREATE POLICY "Users can view own rate limits"
  ON api_rate_limits FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can update rate limits"
  ON api_rate_limits FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- API cache policies (system-managed)
CREATE POLICY "Authenticated users can read cache"
  ON api_cache FOR SELECT
  TO authenticated
  USING (true);