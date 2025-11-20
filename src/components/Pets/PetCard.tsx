import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { HealthRecordsList } from '../Health/HealthRecordsList';
import { Calendar, Trash2, Heart, ChevronDown, ChevronUp } from 'lucide-react';

interface PetCardProps {
  pet: {
    id: string;
    name: string;
    species: string;
    breed: string;
    birth_date: string | null;
    photo_url: string | null;
  };
  onUpdate: () => void;
}

export function PetCard({ pet, onUpdate }: PetCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [showHealthRecords, setShowHealthRecords] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to remove ${pet.name}?`)) return;

    setDeleting(true);
    try {
      const { error } = await supabase
        .from('pets')
        .delete()
        .eq('id', pet.id);

      if (error) throw error;
      onUpdate();
    } catch (error) {
      console.error('Error deleting pet:', error);
      alert('Failed to delete pet');
    } finally {
      setDeleting(false);
    }
  };

  const getAge = () => {
    if (!pet.birth_date) return null;
    const birth = new Date(pet.birth_date);
    const now = new Date();
    const years = now.getFullYear() - birth.getFullYear();
    const months = now.getMonth() - birth.getMonth();

    if (years === 0) {
      return `${months} month${months !== 1 ? 's' : ''} old`;
    }
    return `${years} year${years !== 1 ? 's' : ''} old`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-square bg-gradient-to-br from-blue-50 to-blue-100 relative">
        {pet.photo_url ? (
          <img src={pet.photo_url} alt={pet.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Heart className="w-16 h-16 text-blue-300" />
          </div>
        )}
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-red-600 rounded-lg shadow-sm transition-colors disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{pet.name}</h3>
        <p className="text-gray-600 mb-3">
          {pet.breed || pet.species}
        </p>

        {pet.birth_date && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Calendar className="w-4 h-4" />
            <span>{getAge()}</span>
          </div>
        )}

        <button
          onClick={() => setShowHealthRecords(!showHealthRecords)}
          className="w-full flex items-center justify-between px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-lg hover:bg-blue-100 transition-colors"
        >
          <span>Health Records</span>
          {showHealthRecords ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {showHealthRecords && (
        <div className="p-5 pt-0">
          <HealthRecordsList petId={pet.id} petName={pet.name} />
        </div>
      )}
    </div>
  );
}
