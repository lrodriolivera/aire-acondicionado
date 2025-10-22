import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { locationService } from '../services/location.service';
import { Building2, MapPin, X } from 'lucide-react';
import toast from 'react-hot-toast';

const LOCATION_TYPES = [
  { value: 'building', label: 'Edificio' },
  { value: 'floor', label: 'Piso' },
  { value: 'room', label: 'Habitación/Sala' },
  { value: 'zone', label: 'Zona' }
];

export default function Locations() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'building' as 'building' | 'floor' | 'room' | 'zone',
    parent_id: '',
    description: ''
  });

  const queryClient = useQueryClient();

  const { data: locations, isLoading } = useQuery({
    queryKey: ['locations'],
    queryFn: () => locationService.getAll()
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => locationService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success('Ubicación creada exitosamente');
      setShowModal(false);
      setFormData({
        name: '',
        type: 'building',
        parent_id: '',
        description: ''
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Error al crear ubicación');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => locationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success('Ubicación eliminada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Error al eliminar ubicación');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      parent_id: formData.parent_id || null
    };
    createMutation.mutate(dataToSend);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'building':
        return <Building2 className="text-blue-600" size={20} />;
      case 'floor':
      case 'room':
      case 'zone':
        return <MapPin className="text-green-600" size={20} />;
      default:
        return <MapPin className="text-gray-600" size={20} />;
    }
  };

  const getTypeLabel = (type: string) => {
    return LOCATION_TYPES.find(t => t.value === type)?.label || type;
  };

  const getParentLocations = () => {
    if (!locations) return [];
    // Solo mostrar edificios y pisos como posibles padres
    return locations.filter((loc: any) =>
      loc.type === 'building' || loc.type === 'floor'
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Cargando ubicaciones...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Ubicaciones</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Crear Ubicación
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {locations?.map((location: any) => (
          <div
            key={location.id}
            className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="mt-1">
                  {getTypeIcon(location.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{location.name}</h3>
                  <p className="text-sm text-gray-600">
                    {getTypeLabel(location.type)}
                  </p>
                  {location.description && (
                    <p className="text-sm text-gray-500 mt-1">{location.description}</p>
                  )}
                  {location.parent_name && (
                    <p className="text-xs text-gray-400 mt-1">
                      Ubicado en: {location.parent_name}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  if (window.confirm('¿Estás seguro de eliminar esta ubicación?')) {
                    deleteMutation.mutate(location.id);
                  }
                }}
                className="text-red-600 hover:text-red-800"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {locations?.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Building2 className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600">No hay ubicaciones configuradas</p>
          <p className="text-sm text-gray-500 mt-2">
            Crea edificios, pisos y salas para organizar tus dispositivos
          </p>
        </div>
      )}

      {/* Modal Crear Ubicación */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Crear Ubicación</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  required
                  placeholder="Ej: Edificio Principal, Piso 1, Oficina 101"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  required
                >
                  {LOCATION_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ubicación Padre (opcional)
                </label>
                <select
                  value={formData.parent_id}
                  onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="">Sin ubicación padre</option>
                  {getParentLocations().map((location: any) => (
                    <option key={location.id} value={location.id}>
                      {location.name} ({getTypeLabel(location.type)})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Ej: Si estás creando un piso, selecciona el edificio
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  rows={3}
                  placeholder="Descripción opcional de la ubicación"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {createMutation.isPending ? 'Creando...' : 'Crear Ubicación'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
