import { Users } from 'lucide-react';

export function Community() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Community</h2>
        <p className="text-gray-600">Connect with other pet parents</p>
      </div>

      <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Features Coming Soon</h3>
        <p className="text-gray-600">Discover and connect with pet parents in your area</p>
      </div>
    </div>
  );
}
