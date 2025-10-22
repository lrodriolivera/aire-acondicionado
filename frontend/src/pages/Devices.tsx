import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deviceService } from '../services/device.service';
import { modelService } from '../services/model.service';
import { locationService } from '../services/location.service';
import { Link } from 'react-router-dom';
import { Thermometer, Power, Wind, Droplets, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Devices() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    model_id: '',
    location_id: '',
    serial_number: '',
    name: '',
    ip_address: '',
    mqtt_topic: ''
  });

  const queryClient = useQueryClient();

  const { data: devices, isLoading } = useQuery({
    queryKey: ['devices'],
    queryFn: () => deviceService.getAll()
  });

  const { data: models } = useQuery({
    queryKey: ['models'],
    queryFn: () => modelService.getAll()
  });

  const { data: locations } = useQuery({
    queryKey: ['locations'],
    queryFn: () => locationService.getAll()
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => deviceService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast.success('Dispositivo creado exitosamente');
      setShowModal(false);
      setFormData({
        model_id: '',
        location_id: '',
        serial_number: '',
        name: '',
        ip_address: '',
        mqtt_topic: ''
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Error al crear dispositivo');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Cargando dispositivos...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dispositivos</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Agregar Dispositivo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices?.map((device: any) => (
          <Link
            key={device.id}
            to={`/devices/${device.id}`}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">{device.name}</h3>
              <div className={`w-3 h-3 rounded-full ${device.is_online ? 'bg-green-500' : 'bg-gray-300'}`} />
            </div>

            <p className="text-sm text-gray-600 mb-4">{device.location_name || 'Sin ubicación'}</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Thermometer size={18} className="text-blue-600" />
                <div>
                  <p className="text-xs text-gray-600">Temperatura</p>
                  <p className="font-semibold text-gray-900">
                    {device.temperature ? `${device.temperature}°C` : '--'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Droplets size={18} className="text-cyan-600" />
                <div>
                  <p className="text-xs text-gray-600">Humedad</p>
                  <p className="font-semibold text-gray-900">
                    {device.humidity ? `${device.humidity}%` : '--'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Power size={18} className="text-green-600" />
                <div>
                  <p className="text-xs text-gray-600">Estado</p>
                  <p className="font-semibold text-gray-900">
                    {device.power_state ? 'ON' : 'OFF'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Wind size={18} className="text-purple-600" />
                <div>
                  <p className="text-xs text-gray-600">Modo</p>
                  <p className="font-semibold text-gray-900 capitalize">
                    {device.mode || '--'}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {devices?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No hay dispositivos configurados</p>
        </div>
      )}

      {/* Modal Agregar Dispositivo */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Agregar Dispositivo</h2>
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
                  Nombre del Dispositivo *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modelo *
                </label>
                <select
                  value={formData.model_id}
                  onChange={(e) => setFormData({ ...formData, model_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  required
                >
                  <option value="">Seleccionar modelo...</option>
                  {models?.map((model: any) => (
                    <option key={model.id} value={model.id}>
                      {model.brand_name} - {model.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ubicación
                </label>
                <select
                  value={formData.location_id}
                  onChange={(e) => setFormData({ ...formData, location_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="">Seleccionar ubicación...</option>
                  {locations?.map((location: any) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Serie *
                </label>
                <input
                  type="text"
                  value={formData.serial_number}
                  onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección IP
                </label>
                <input
                  type="text"
                  value={formData.ip_address}
                  onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="192.168.1.100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  MQTT Topic
                </label>
                <input
                  type="text"
                  value={formData.mqtt_topic}
                  onChange={(e) => setFormData({ ...formData, mqtt_topic: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="ac/device/001"
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
                  {createMutation.isPending ? 'Guardando...' : 'Guardar Dispositivo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
