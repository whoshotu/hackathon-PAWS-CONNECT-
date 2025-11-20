import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, Check, X } from 'lucide-react';

interface Consent {
  consent_type: string;
  granted: boolean;
  granted_at: string;
}

export function ConsentManager() {
  const { user } = useAuth();
  const [consents, setConsents] = useState<Consent[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadConsents();
  }, [user]);

  const loadConsents = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_consents')
        .select('*')
        .eq('user_id', user.id)
        .order('granted_at', { ascending: false });

      if (error) throw error;

      const latestConsents = data?.reduce((acc, consent) => {
        if (!acc[consent.consent_type]) {
          acc[consent.consent_type] = consent;
        }
        return acc;
      }, {} as Record<string, Consent>);

      setConsents(Object.values(latestConsents || {}));
    } catch (error) {
      console.error('Error loading consents:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateConsent = async (consentType: string, granted: boolean) => {
    if (!user) return;

    if (consentType === 'data_processing' && !granted) {
      alert('Data processing consent is required to use this service. Please contact support if you wish to delete your account.');
      return;
    }

    setUpdating(true);

    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const { ip } = await ipResponse.json();

      const { error } = await supabase
        .from('user_consents')
        .insert({
          user_id: user.id,
          consent_type: consentType,
          granted,
          ip_address: ip,
        });

      if (error) throw error;

      await supabase
        .from('audit_logs')
        .insert({
          user_id: user.id,
          action: granted ? 'consent_granted' : 'consent_revoked',
          resource_type: 'user_consents',
          resource_id: user.id,
          ip_address: ip,
        });

      await loadConsents();
    } catch (error) {
      console.error('Error updating consent:', error);
      alert('Failed to update consent. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const getConsentLabel = (type: string): string => {
    const labels: Record<string, string> = {
      data_processing: 'Data Processing',
      marketing: 'Marketing Communications',
      location: 'Location Services',
      analytics: 'Usage Analytics',
    };
    return labels[type] || type;
  };

  const getConsentDescription = (type: string): string => {
    const descriptions: Record<string, string> = {
      data_processing: 'Required for using Pawz-Connect services',
      marketing: 'Receive promotional emails and updates',
      location: 'Find nearby pet services and local connections',
      analytics: 'Help improve the platform experience',
    };
    return descriptions[type] || '';
  };

  const getConsentStatus = (type: string): boolean => {
    const consent = consents.find(c => c.consent_type === type);
    return consent?.granted ?? false;
  };

  if (loading) {
    return <div className="text-center py-8">Loading consent preferences...</div>;
  }

  const consentTypes = ['data_processing', 'analytics', 'location', 'marketing'];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-900">Privacy Preferences</h3>
      </div>

      <p className="text-gray-600 mb-6">
        Manage your privacy settings and data consent preferences. You can change these at any time.
      </p>

      <div className="space-y-4">
        {consentTypes.map(type => {
          const isGranted = getConsentStatus(type);
          const isRequired = type === 'data_processing';

          return (
            <div key={type} className="flex items-start justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900">{getConsentLabel(type)}</h4>
                  {isRequired && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Required</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{getConsentDescription(type)}</p>
              </div>

              <button
                onClick={() => updateConsent(type, !isGranted)}
                disabled={updating || isRequired}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isGranted
                    ? 'bg-green-50 text-green-700 hover:bg-green-100'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isGranted ? (
                  <>
                    <Check className="w-4 h-4" />
                    Enabled
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4" />
                    Disabled
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">Your Rights</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Request a copy of your data at any time</li>
          <li>• Delete your account and all associated data</li>
          <li>• Update your consent preferences whenever you want</li>
          <li>• Opt-out of non-essential data collection</li>
        </ul>
      </div>
    </div>
  );
}
