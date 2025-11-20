import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, CheckCircle2 } from 'lucide-react';

interface ConsentModalProps {
  onComplete: () => void;
}

export function ConsentModal({ onComplete }: ConsentModalProps) {
  const { user } = useAuth();
  const [consents, setConsents] = useState({
    data_processing: false,
    marketing: false,
    location: false,
    analytics: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConsentChange = (type: keyof typeof consents) => {
    setConsents(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!consents.data_processing) {
      setError('You must consent to data processing to use this service.');
      return;
    }

    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const { ip } = await ipResponse.json();

      const consentRecords = Object.entries(consents).map(([type, granted]) => ({
        user_id: user.id,
        consent_type: type,
        granted,
        ip_address: ip,
      }));

      const { error: insertError } = await supabase
        .from('user_consents')
        .insert(consentRecords);

      if (insertError) throw insertError;

      await supabase
        .from('audit_logs')
        .insert({
          user_id: user.id,
          action: 'consent_granted',
          resource_type: 'user_consents',
          resource_id: user.id,
          ip_address: ip,
        });

      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save consents');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Privacy & Consent</h2>
        </div>

        <p className="text-gray-600 mb-6">
          Welcome to Pawz-Connect! Before you start using our platform, we need your consent to collect and process your data.
          Your privacy is important to us, and we're committed to transparency.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={consents.data_processing}
                onChange={() => handleConsentChange('data_processing')}
                className="mt-1 w-5 h-5 text-blue-600 rounded"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-900">Data Processing (Required)</div>
                <div className="text-sm text-gray-600">
                  I consent to Pawz-Connect collecting and processing my personal data including profile information,
                  pet records, posts, and interactions to provide the service.
                </div>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={consents.analytics}
                onChange={() => handleConsentChange('analytics')}
                className="mt-1 w-5 h-5 text-blue-600 rounded"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-900">Analytics (Optional)</div>
                <div className="text-sm text-gray-600">
                  I consent to the collection of usage analytics to help improve the platform experience.
                </div>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={consents.location}
                onChange={() => handleConsentChange('location')}
                className="mt-1 w-5 h-5 text-blue-600 rounded"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-900">Location Services (Optional)</div>
                <div className="text-sm text-gray-600">
                  I consent to sharing my location to find nearby pet services and connect with local pet owners.
                </div>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={consents.marketing}
                onChange={() => handleConsentChange('marketing')}
                className="mt-1 w-5 h-5 text-blue-600 rounded"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-900">Marketing Communications (Optional)</div>
                <div className="text-sm text-gray-600">
                  I consent to receiving promotional emails about new features, tips, and special offers.
                </div>
              </div>
            </label>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <p className="text-sm text-blue-900">
              You can change these preferences anytime in your account settings. You also have the right to
              export your data or delete your account at any time.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !consents.data_processing}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Saving...' : 'Accept and Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
