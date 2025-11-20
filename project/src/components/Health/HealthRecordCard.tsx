import { Calendar, User, FileText } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

interface HealthRecord {
  id: string;
  record_type: string;
  title: string;
  description: string;
  record_date: string;
  veterinarian: string;
  attachments: string[];
}

interface HealthRecordCardProps {
  record: HealthRecord;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function HealthRecordCard({ record, onEdit, onDelete }: HealthRecordCardProps) {
  const getRecordTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      vaccination: 'bg-green-100 text-green-800',
      checkup: 'bg-blue-100 text-blue-800',
      medication: 'bg-purple-100 text-purple-800',
      surgery: 'bg-red-100 text-red-800',
      allergy: 'bg-orange-100 text-orange-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[type] || colors.other;
  };

  const getRecordTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      vaccination: 'Vaccination',
      checkup: 'Checkup',
      medication: 'Medication',
      surgery: 'Surgery',
      allergy: 'Allergy',
      other: 'Other',
    };
    return labels[type] || type;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-semibold px-2 py-1 rounded ${getRecordTypeColor(record.record_type)}`}>
              {getRecordTypeLabel(record.record_type)}
            </span>
          </div>
          <h4 className="font-semibold text-gray-900 text-lg">{record.title}</h4>
        </div>
      </div>

      {record.description && (
        <p className="text-gray-600 text-sm mb-3">{record.description}</p>
      )}

      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(record.record_date)}</span>
        </div>
        {record.veterinarian && (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{record.veterinarian}</span>
          </div>
        )}
        {record.attachments && record.attachments.length > 0 && (
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>{record.attachments.length} attachment{record.attachments.length > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {(onEdit || onDelete) && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
