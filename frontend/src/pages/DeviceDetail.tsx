import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { deviceService } from '../services/device.service';
import { useState } from 'react';
import { CommandType, ACMode, FanSpeed } from '../types';
import toast from 'react-hot-toast';
import { Thermometer, Power, Wind, Droplets, RefreshCw } from 'lucide-react';

export default function DeviceDetail() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [targetTemp, setTargetTemp] = useState(24);

  const { data: device, isLoading } = useQuery({
    queryKey: ['device', id],
    queryFn: () => deviceService.getById(id!),
    enabled: !!id
  });

  const commandMutation = useMutation({
    mutationFn: (payload: any) => deviceService.sendCommand(payload),
    onSuccess: () => {
      toast.success('Comando enviado');
      queryClient.invalidateQueries({ queryKey: ['device', id] });
    },
    onError: () => {
      toast.error('Error al enviar comando');
    }
  });

  const sendCommand = (commandType: CommandType, value: any) => {
    commandMutation.mutate({
      deviceId: id,
      commandType,
      parameters: { value }
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Cargando...</div>;
  }

  if (!device) {
    return <div>Dispositivo no encontrado</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{device.name}</h1>
          <p className="text-gray-600">{device.location_name || 'Sin ubicación'}</p>
        </div>
        <div className={`px-4 py-2 rounded-lg ${device.is_online ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {device.is_online ? 'En línea' : 'Fuera de línea'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Estado Actual</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Thermometer className="text-blue-600" size={24} />
              <div>
                <p className="text-sm text-gray-600">Temperatura</p>
                <p className="text-2xl font-bold">{device.temperature || '--'}°C</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Droplets className="text-cyan-600" size={24} />
              <div>
                <p className="text-sm text-gray-600">Humedad</p>
                <p className="text-2xl font-bold">{device.humidity || '--'}%</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Power className="text-green-600" size={24} />
              <div>
                <p className="text-sm text-gray-600">Estado</p>
                <p className="text-xl font-bold">{device.power_state ? 'Encendido' : 'Apagado'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Wind className="text-purple-600" size={24} />
              <div>
                <p className="text-sm text-gray-600">Modo</p>
                <p className="text-xl font-bold capitalize">{device.mode || '--'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Control Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Control</h2>

          {/* Power */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Encendido/Apagado</label>
            <div className="flex space-x-4">
              <button
                onClick={() => sendCommand(CommandType.SET_POWER, true)}
                disabled={device.power_state}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Encender
              </button>
              <button
                onClick={() => sendCommand(CommandType.SET_POWER, false)}
                disabled={!device.power_state}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apagar
              </button>
            </div>
          </div>

          {/* Temperature */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Temperatura: {targetTemp}°C
            </label>
            <input
              type="range"
              min={device.min_temperature || 16}
              max={device.max_temperature || 30}
              value={targetTemp}
              onChange={(e) => setTargetTemp(parseInt(e.target.value))}
              className="w-full"
            />
            <button
              onClick={() => sendCommand(CommandType.SET_TEMPERATURE, targetTemp)}
              className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Aplicar Temperatura
            </button>
          </div>

          {/* Mode */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Modo</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.values(ACMode).map((mode) => (
                <button
                  key={mode}
                  onClick={() => sendCommand(CommandType.SET_MODE, mode)}
                  className={`px-4 py-2 rounded-lg capitalize ${
                    device.mode === mode
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Fan Speed */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Velocidad del Ventilador</label>
            <div className="grid grid-cols-4 gap-2">
              {Object.values(FanSpeed).map((speed) => (
                <button
                  key={speed}
                  onClick={() => sendCommand(CommandType.SET_FAN_SPEED, speed)}
                  className={`px-4 py-2 rounded-lg capitalize ${
                    device.fan_speed === speed
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {speed}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
