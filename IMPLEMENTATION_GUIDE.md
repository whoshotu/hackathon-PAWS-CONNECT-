# Pawz-Connect Implementation Guide

This document provides guidance for implementing advanced features that require external API keys.

## Perplexity AI Integration

The application is designed to integrate with Perplexity AI for intelligent search and recommendations. The integration includes rate limiting, caching, and cost optimization features.

### Database Setup

The database already includes tables for API usage tracking:
- `api_usage`: Tracks all API calls with token usage and costs
- `api_rate_limits`: Per-user quotas (50 daily, 1000 monthly by default)
- `api_cache`: Caches responses to reduce duplicate API calls

### Implementation Pattern

To add Perplexity AI features:

1. Install the Perplexity client:
```bash
npm install @perplexity/sdk
```

2. Add environment variable to `.env`:
```
VITE_PERPLEXITY_API_KEY=your_api_key_here
```

3. Create a service file `src/lib/perplexityService.ts`:

```typescript
import { supabase } from './supabase';

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

interface PerplexityRequest {
  userId: string;
  prompt: string;
  requestType: 'search' | 'recommendation' | 'assistance';
}

export async function callPerplexityAPI({ userId, prompt, requestType }: PerplexityRequest) {
  // Check rate limits
  const { data: limits } = await supabase
    .from('api_rate_limits')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (limits && limits.daily_used >= limits.daily_limit) {
    throw new Error('Daily API limit reached');
  }

  // Check cache
  const cacheKey = `${requestType}_${prompt.slice(0, 100)}`;
  const { data: cached } = await supabase
    .from('api_cache')
    .select('*')
    .eq('cache_key', cacheKey)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();

  if (cached) {
    // Update hit count
    await supabase
      .from('api_cache')
      .update({ hit_count: cached.hit_count + 1 })
      .eq('id', cached.id);

    // Log cached usage
    await supabase.from('api_usage').insert({
      user_id: userId,
      endpoint: 'perplexity',
      request_type: requestType,
      cached: true,
      tokens_used: 0,
      cost: 0,
    });

    return cached.response_data;
  }

  // Make API call
  const response = await fetch(PERPLEXITY_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_PERPLEXITY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-sonar-small-128k-online',
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const data = await response.json();
  const tokensUsed = data.usage?.total_tokens || 0;
  const cost = tokensUsed * 0.00001; // Example cost calculation

  // Cache response (24 hour expiry)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  await supabase.from('api_cache').insert({
    cache_key: cacheKey,
    request_params: { prompt, requestType },
    response_data: data,
    expires_at: expiresAt.toISOString(),
  });

  // Log usage
  await supabase.from('api_usage').insert({
    user_id: userId,
    endpoint: 'perplexity',
    request_type: requestType,
    tokens_used: tokensUsed,
    cached: false,
    cost,
  });

  // Update rate limits
  await supabase
    .from('api_rate_limits')
    .update({
      daily_used: (limits?.daily_used || 0) + 1,
      monthly_used: (limits?.monthly_used || 0) + 1,
    })
    .eq('user_id', userId);

  return data;
}
```

4. Use in components:
```typescript
import { callPerplexityAPI } from '../lib/perplexityService';

const handleSearch = async (query: string) => {
  try {
    const result = await callPerplexityAPI({
      userId: user.id,
      prompt: `Find pet services: ${query}`,
      requestType: 'search',
    });
    // Handle result
  } catch (error) {
    if (error.message.includes('limit reached')) {
      // Show upgrade prompt
    }
  }
};
```

### Usage Monitoring

View API usage in the Settings page or create an admin dashboard:

```typescript
const { data: usage } = await supabase
  .from('api_usage')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false });

const { data: limits } = await supabase
  .from('api_rate_limits')
  .select('*')
  .eq('user_id', userId)
  .single();
```

## Stripe Payment Integration

The application supports subscription management through Stripe.

### Setup

1. Create a Stripe account at https://dashboard.stripe.com/register

2. Get your API keys from https://dashboard.stripe.com/apikeys

3. Add to `.env`:
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

4. Create a Supabase Edge Function for Stripe webhooks:

```bash
supabase functions deploy stripe-webhook
```

### Implementation

The database includes:
- `subscriptions`: User subscription records
- `payment_transactions`: Payment history

Refer to Stripe documentation for implementing checkout, webhooks, and subscription management:
https://stripe.com/docs/billing/subscriptions/build-subscriptions

## Security Best Practices

1. **Never expose API keys in client code**
   - Use Edge Functions for API calls requiring secret keys
   - Store keys in environment variables
   - Use Supabase service role key only in Edge Functions

2. **Implement rate limiting**
   - Per-user quotas prevent abuse
   - Global rate limits protect your budget
   - Cache frequently requested data

3. **Monitor costs**
   - Set up alerts for unusual usage patterns
   - Review API usage logs regularly
   - Implement spending caps per user tier

4. **Data privacy**
   - All user data follows RLS policies
   - Sensitive data is encrypted
   - Users can export/delete their data

## Legal Compliance

### Terms of Service

Create a Terms of Service document covering:
- Service description and limitations
- User responsibilities
- Content guidelines
- Privacy policy reference
- Liability disclaimers
- Subscription terms and refund policy

### Privacy Policy

Include sections on:
- Data collection and usage
- Third-party services (Stripe, Perplexity)
- User rights (GDPR, CCPA)
- Data retention and deletion
- Cookie policy
- Contact information for privacy inquiries

### GDPR Compliance

Implemented features:
- Consent tracking in `user_consents` table
- User data export capability
- Right to deletion
- Privacy settings control
- Audit logging

### CCPA Compliance

Supported rights:
- Right to know (data export)
- Right to delete
- Right to opt-out (privacy settings)
- Non-discrimination for privacy choices

## Next Steps

1. Add Perplexity API key and implement AI features
2. Set up Stripe account and payment flows
3. Create Terms of Service and Privacy Policy
4. Implement data export functionality
5. Add email notification system
6. Build admin moderation dashboard
7. Implement image upload with storage
8. Add real-time chat features
9. Create mobile-responsive design improvements
10. Set up analytics and monitoring

## Support

For questions or issues, refer to:
- Supabase Documentation: https://supabase.com/docs
- Stripe Documentation: https://stripe.com/docs
- Perplexity API Documentation: https://docs.perplexity.ai
