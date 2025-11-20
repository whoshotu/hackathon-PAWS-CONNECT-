import { supabase } from './supabase';

export interface RateLimitInfo {
  daily_limit: number;
  daily_used: number;
  monthly_limit: number;
  monthly_used: number;
  daily_remaining: number;
  monthly_remaining: number;
}

export async function checkRateLimit(userId: string): Promise<{
  allowed: boolean;
  info: RateLimitInfo | null;
}> {
  try {
    const { data, error } = await supabase
      .from('api_rate_limits')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      const { error: createError } = await supabase
        .from('api_rate_limits')
        .insert({ user_id: userId });

      if (createError) throw createError;

      return {
        allowed: true,
        info: {
          daily_limit: 50,
          daily_used: 0,
          monthly_limit: 1000,
          monthly_used: 0,
          daily_remaining: 50,
          monthly_remaining: 1000,
        },
      };
    }

    const dailyRemaining = data.daily_limit - data.daily_used;
    const monthlyRemaining = data.monthly_limit - data.monthly_used;

    return {
      allowed: dailyRemaining > 0 && monthlyRemaining > 0,
      info: {
        daily_limit: data.daily_limit,
        daily_used: data.daily_used,
        monthly_limit: data.monthly_limit,
        monthly_used: data.monthly_used,
        daily_remaining: Math.max(0, dailyRemaining),
        monthly_remaining: Math.max(0, monthlyRemaining),
      },
    };
  } catch (error) {
    console.error('Error checking rate limit:', error);
    return { allowed: false, info: null };
  }
}

export async function incrementUsage(userId: string): Promise<void> {
  try {
    const { data } = await supabase
      .from('api_rate_limits')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (!data) return;

    await supabase
      .from('api_rate_limits')
      .update({
        daily_used: data.daily_used + 1,
        monthly_used: data.monthly_used + 1,
      })
      .eq('user_id', userId);
  } catch (error) {
    console.error('Error incrementing usage:', error);
  }
}

export async function getRateLimitInfo(userId: string): Promise<RateLimitInfo | null> {
  try {
    const { data, error } = await supabase
      .from('api_rate_limits')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return {
      daily_limit: data.daily_limit,
      daily_used: data.daily_used,
      monthly_limit: data.monthly_limit,
      monthly_used: data.monthly_used,
      daily_remaining: Math.max(0, data.daily_limit - data.daily_used),
      monthly_remaining: Math.max(0, data.monthly_limit - data.monthly_used),
    };
  } catch (error) {
    console.error('Error getting rate limit info:', error);
    return null;
  }
}
