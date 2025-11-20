import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { MapPin, Search, Filter, Star, Phone, Mail, Globe, Loader2 } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  service_type: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  rating_avg: number;
  rating_count: number;
}

export function ServiceFinder() {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const serviceTypes = [
    { value: 'all', label: 'All Services' },
    { value: 'grooming', label: 'Grooming' },
    { value: 'veterinary', label: 'Veterinary' },
    { value: 'hospital', label: 'Hospital' },
    { value: 'store', label: 'Pet Store' },
    { value: 'training', label: 'Training' },
  ];

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [searchTerm, selectedType, services]);

  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from('pet_services')
        .select('*')
        .eq('verified', true)
        .order('rating_avg', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = services;

    if (selectedType !== 'all') {
      filtered = filtered.filter(s => s.service_type === selectedType);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(term) ||
        s.description.toLowerCase().includes(term) ||
        s.address.toLowerCase().includes(term)
      );
    }

    setFilteredServices(filtered);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Pet Services Near You</h2>
        <p className="text-gray-600">Find trusted grooming, veterinary, and pet care services</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search services..."
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              {serviceTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredServices.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No services found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredServices.map((service) => (
            <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{service.name}</h3>
                  <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                    {service.service_type.charAt(0).toUpperCase() + service.service_type.slice(1)}
                  </span>
                </div>
                {service.rating_count > 0 && (
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                    <Star className="w-4 h-4 text-amber-500 fill-current" />
                    <span className="text-sm font-semibold text-amber-900">{service.rating_avg.toFixed(1)}</span>
                  </div>
                )}
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>

              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{service.address}</span>
                </div>

                {service.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <a href={`tel:${service.phone}`} className="hover:text-blue-600 transition-colors">
                      {service.phone}
                    </a>
                  </div>
                )}

                {service.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${service.email}`} className="hover:text-blue-600 transition-colors">
                      {service.email}
                    </a>
                  </div>
                )}

                {service.website && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Globe className="w-4 h-4" />
                    <a href={service.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
