import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getRateLimitInfo, RateLimitInfo } from '../../lib/rateLimitService';
import { Activity, TrendingUp, Calendar, Loader2 } from 'lucide-react';

export function UsageDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [rateLimit, setRateLimit] = useState<RateLimitInfo | null>(null);

  useEffect(() => {
    loadUsageData();
  }, [user]);

  const loadUsageData = async () => {
    if (!user) return;

    try {
      const info = await getRateLimitInfo(user.id);
      setRateLimit(info);
    } catch (error) {
      console.error('Error loading usage data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!rateLimit) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Unable to load usage data</p>
      </div>
    );
  }

  const dailyPercentage = (rateLimit.daily_used / rateLimit.daily_limit) * 100;
  const monthlyPercentage = (rateLimit.monthly_used / rateLimit.monthly_limit) * 100;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-900">API Usage</h3>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-900">Daily Usage</span>
            </div>
            <span className="text-sm text-gray-600">
              {rateLimit.daily_used} / {rateLimit.daily_limit}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                dailyPercentage >= 90
                  ? 'bg-red-600'
                  : dailyPercentage >= 70
                  ? 'bg-orange-500'
                  : 'bg-blue-600'
              }`}
              style={{ width: `${Math.min(dailyPercentage, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {rateLimit.daily_remaining} requests remaining today
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-900">Monthly Usage</span>
            </div>
            <span className="text-sm text-gray-600">
              {rateLimit.monthly_used} / {rateLimit.monthly_limit}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                monthlyPercentage >= 90
                  ? 'bg-red-600'
                  : monthlyPercentage >= 70
                  ? 'bg-orange-500'
                  : 'bg-green-600'
              }`}
              style={{ width: `${Math.min(monthlyPercentage, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {rateLimit.monthly_remaining} requests remaining this month
          </p>
        </div>

        {(dailyPercentage >= 90 || monthlyPercentage >= 90) && (
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800">
              <strong>Warning:</strong> You're approaching your usage limit. Consider upgrading to a premium plan for higher limits.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
