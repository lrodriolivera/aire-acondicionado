import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scheduleService } from '../services/schedule.service';
import { deviceService } from '../services/device.service';
import { Clock, Power, Thermometer, Wind, X, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';

const DAYS_OF_WEEK = [
  { value: 0, label: 'Dom' },
  { value: 1, label: 'Lun' },
  { value: 2, label: 'Mar' },
  { value: 3, label: 'Mié' },
  { value: 4, label: 'Jue' },
  { value: 5, label: 'Vie' },
  { value: 6, label: 'Sáb' }
];

const COMMAND_TYPES = [
  { value: 'setPower', label: 'Encender/Apagar', icon: Power },
  { value: 'setTemperature', label: 'Establecer Temperatura', icon: Thermometer },
  { value: 'setMode', label: 'Cambiar Modo', icon: Wind }
];

const AC_MODES = [
  { value: 'cool', label: 'Frío' },
  { value: 'heat', label: 'Calor' },
  { value: 'fan', label: 'Ventilador' },
  { value: 'dry', label: 'Deshumidificar' },
  { value: 'auto', label: 'Automático' }
];

export default function Schedules() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    device_id: '',
    name: '',
    schedule_type: 'recurring',
    days: [] as number[],
    time: '',
    action_type: 'setPower',
    action_value: true
  });

  const queryClient = useQueryClient();

  const { data: schedules, isLoading } = useQuery({
    queryKey: ['schedules'],
    queryFn: () => scheduleService.getAll()
  });

  const { data: devices } = useQuery({
    queryKey: ['devices'],
    queryFn: () => deviceService.getAll()
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => scheduleService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      toast.success('Horario creado exitosamente');
      setShowModal(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Error al crear horario');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => scheduleService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      toast.success('Horario eliminado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Error al eliminar horario');
    }
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
      scheduleService.toggle(id, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      toast.success('Horario actualizado');
    }
  });

  const resetForm = () => {
    setFormData({
      device_id: '',
      name: '',
      schedule_type: 'recurring',
      days: [],
      time: '',
      action_type: 'setPower',
      action_value: true
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const scheduleConfig: any = {
      days: formData.days,
      time: formData.time,
      action: {
        type: formData.action_type,
        value: formData.action_value
      },
      parameters: {}
    };

    if (formData.action_type === 'setPower') {
      scheduleConfig.parameters.power = formData.action_value;
    } else if (formData.action_type === 'setTemperature') {
      scheduleConfig.parameters.temperature = formData.action_value;
    } else if (formData.action_type === 'setMode') {
      scheduleConfig.parameters.mode = formData.action_value;
    }

    createMutation.mutate({
      device_id: formData.device_id,
      name: formData.name,
      schedule_type: formData.schedule_type,
      schedule_config: scheduleConfig,
      enabled: true
    });
  };

  const toggleDay = (day: number) => {
    setFormData({
      ...formData,
      days: formData.days.includes(day)
        ? formData.days.filter(d => d !== day)
        : [...formData.days, day]
    });
  };

  const getDaysLabel = (days: number[]) => {
    if (!days || days.length === 0) return 'Sin días configurados';
    if (days.length === 7) return 'Todos los días';
    return days.sort().map(d => DAYS_OF_WEEK[d].label).join(', ');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Cargando horarios...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Horarios</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Crear Horario
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {schedules?.map((schedule: any) => (
          <div
            key={schedule.id}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{schedule.name}</h3>
                <p className="text-sm text-gray-600">{schedule.device_name}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleMutation.mutate({ id: schedule.id, enabled: !schedule.enabled })}
                  className={`p-2 rounded ${schedule.enabled ? 'text-green-600' : 'text-gray-400'}`}
                >
                  {schedule.enabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('¿Eliminar este horario?')) {
                      deleteMutation.mutate(schedule.id);
                    }
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Clock size={16} className="text-gray-500" />
                <span className="text-gray-700">{schedule.schedule_config?.time}</span>
              </div>
              <div className="text-sm text-gray-600">
                {getDaysLabel(schedule.schedule_config?.days)}
              </div>
              <div className="text-sm text-gray-600">
                Acción: {COMMAND_TYPES.find(c => c.value === schedule.schedule_config?.action?.type)?.label}
              </div>
              {schedule.next_execution && (
                <div className="text-xs text-gray-500 mt-2">
                  Próxima ejecución: {new Date(schedule.next_execution).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {schedules?.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Clock className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600">No hay horarios configurados</p>
          <p className="text-sm text-gray-500 mt-2">
            Crea horarios para automatizar el control de tus dispositivos
          </p>
        </div>
      )}

      {/* Modal Crear Horario */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Crear Horario</h2>
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
                  Nombre del Horario *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  required
                  placeholder="Ej: Apagar oficinas a las 6pm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dispositivo *
                </label>
                <select
                  value={formData.device_id}
                  onChange={(e) => setFormData({ ...formData, device_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  required
                >
                  <option value="">Seleccionar dispositivo...</option>
                  {devices?.map((device: any) => (
                    <option key={device.id} value={device.id}>
                      {device.name} - {device.location_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Días de la semana *
                </label>
                <div className="flex flex-wrap gap-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => toggleDay(day.value)}
                      className={`px-3 py-2 rounded-lg border ${
                        formData.days.includes(day.value)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300'
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hora *
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Acción *
                </label>
                <select
                  value={formData.action_type}
                  onChange={(e) => setFormData({ ...formData, action_type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  required
                >
                  {COMMAND_TYPES.map((cmd) => (
                    <option key={cmd.value} value={cmd.value}>
                      {cmd.label}
                    </option>
                  ))}
                </select>
              </div>

              {formData.action_type === 'setPower' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    value={formData.action_value.toString()}
                    onChange={(e) => setFormData({ ...formData, action_value: e.target.value === 'true' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  >
                    <option value="true">Encender</option>
                    <option value="false">Apagar</option>
                  </select>
                </div>
              )}

              {formData.action_type === 'setTemperature' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Temperatura (°C)
                  </label>
                  <input
                    type="number"
                    min="16"
                    max="30"
                    value={formData.action_value as number}
                    onChange={(e) => setFormData({ ...formData, action_value: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>
              )}

              {formData.action_type === 'setMode' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modo
                  </label>
                  <select
                    value={formData.action_value as string}
                    onChange={(e) => setFormData({ ...formData, action_value: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  >
                    {AC_MODES.map((mode) => (
                      <option key={mode.value} value={mode.value}>
                        {mode.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

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
                  {createMutation.isPending ? 'Creando...' : 'Crear Horario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
