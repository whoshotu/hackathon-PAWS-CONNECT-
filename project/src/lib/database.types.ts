export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string
          avatar_url: string | null
          bio: string
          location: string
          privacy_settings: Json
          mfa_enabled: boolean
          email_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          display_name: string
          avatar_url?: string | null
          bio?: string
          location?: string
          privacy_settings?: Json
          mfa_enabled?: boolean
          email_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string
          avatar_url?: string | null
          bio?: string
          location?: string
          privacy_settings?: Json
          mfa_enabled?: boolean
          email_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      pets: {
        Row: {
          id: string
          owner_id: string
          name: string
          species: string
          breed: string
          birth_date: string | null
          photo_url: string | null
          microchip_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          species: string
          breed?: string
          birth_date?: string | null
          photo_url?: string | null
          microchip_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          species?: string
          breed?: string
          birth_date?: string | null
          photo_url?: string | null
          microchip_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      health_records: {
        Row: {
          id: string
          pet_id: string
          record_type: string
          title: string
          description: string
          record_date: string
          veterinarian: string
          attachments: Json
          created_at: string
        }
        Insert: {
          id?: string
          pet_id: string
          record_type: string
          title: string
          description?: string
          record_date: string
          veterinarian?: string
          attachments?: Json
          created_at?: string
        }
        Update: {
          id?: string
          pet_id?: string
          record_type?: string
          title?: string
          description?: string
          record_date?: string
          veterinarian?: string
          attachments?: Json
          created_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          content: string
          media_urls: Json
          visibility: string
          pet_ids: Json
          likes_count: number
          comments_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          media_urls?: Json
          visibility?: string
          pet_ids?: Json
          likes_count?: number
          comments_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          media_urls?: Json
          visibility?: string
          pet_ids?: Json
          likes_count?: number
          comments_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          post_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      likes: {
        Row: {
          id: string
          post_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          created_at?: string
        }
      }
      follows: {
        Row: {
          id: string
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          id?: string
          follower_id: string
          following_id: string
          created_at?: string
        }
        Update: {
          id?: string
          follower_id?: string
          following_id?: string
          created_at?: string
        }
      }
      pet_services: {
        Row: {
          id: string
          name: string
          service_type: string
          description: string
          address: string
          latitude: number
          longitude: number
          phone: string
          email: string
          website: string
          hours: Json
          verified: boolean
          verified_at: string | null
          verified_by: string | null
          rating_avg: number
          rating_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          service_type: string
          description?: string
          address: string
          latitude: number
          longitude: number
          phone?: string
          email?: string
          website?: string
          hours?: Json
          verified?: boolean
          verified_at?: string | null
          verified_by?: string | null
          rating_avg?: number
          rating_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          service_type?: string
          description?: string
          address?: string
          latitude?: number
          longitude?: number
          phone?: string
          email?: string
          website?: string
          hours?: Json
          verified?: boolean
          verified_at?: string | null
          verified_by?: string | null
          rating_avg?: number
          rating_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      service_reviews: {
        Row: {
          id: string
          service_id: string
          user_id: string
          rating: number
          review: string
          moderation_status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          service_id: string
          user_id: string
          rating: number
          review?: string
          moderation_status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          service_id?: string
          user_id?: string
          rating?: number
          review?: string
          moderation_status?: string
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          plan_type: string
          status: string
          current_period_start: string | null
          current_period_end: string | null
          cancel_at_period_end: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          plan_type?: string
          status?: string
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          plan_type?: string
          status?: string
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      api_rate_limits: {
        Row: {
          user_id: string
          daily_limit: number
          daily_used: number
          monthly_limit: number
          monthly_used: number
          last_reset_daily: string
          last_reset_monthly: string
          updated_at: string
        }
        Insert: {
          user_id: string
          daily_limit?: number
          daily_used?: number
          monthly_limit?: number
          monthly_used?: number
          last_reset_daily?: string
          last_reset_monthly?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          daily_limit?: number
          daily_used?: number
          monthly_limit?: number
          monthly_used?: number
          last_reset_daily?: string
          last_reset_monthly?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
