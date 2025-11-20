import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { HealthRecordCard } from './HealthRecordCard';
import { AddHealthRecordModal } from './AddHealthRecordModal';
import { Plus, Loader2, Activity } from 'lucide-react';

interface HealthRecord {
  id: string;
  record_type: string;
  title: string;
  description: string;
  record_date: string;
  veterinarian: string;
  attachments: string[];
}

interface HealthRecordsListProps {
  petId: string;
  petName: string;
}

export function HealthRecordsList({ petId, petName }: HealthRecordsListProps) {
  const { user } = useAuth();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadRecords();
  }, [petId]);

  const loadRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('health_records')
        .select('*')
        .eq('pet_id', petId)
        .order('record_date', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('Error loading health records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (recordId: string) => {
    if (!confirm('Are you sure you want to delete this health record?')) return;

    try {
      const { error } = await supabase
        .from('health_records')
        .delete()
        .eq('id', recordId);

      if (error) throw error;

      if (user) {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const { ip } = await ipResponse.json();

        await supabase.from('audit_logs').insert({
          user_id: user.id,
          action: 'health_record_deleted',
          resource_type: 'health_records',
          resource_id: recordId,
          ip_address: ip,
        });
      }

      await loadRecords();
    } catch (error) {
      console.error('Error deleting health record:', error);
      alert('Failed to delete health record');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Health Records for {petName}
          </h3>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Record
        </button>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No health records yet</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add First Record
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {records.map((record) => (
            <HealthRecordCard
              key={record.id}
              record={record}
              onDelete={() => handleDelete(record.id)}
            />
          ))}
        </div>
      )}

      {showAddModal && (
        <AddHealthRecordModal
          petId={petId}
          onClose={() => setShowAddModal(false)}
          onSuccess={loadRecords}
        />
      )}
    </div>
  );
}
