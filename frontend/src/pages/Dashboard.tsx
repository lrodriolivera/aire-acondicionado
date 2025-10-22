import { useQuery } from '@tanstack/react-query';
import { deviceService } from '../services/device.service';
import { alertService } from '../services/alert.service';
import { Thermometer, AlertTriangle, Power, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { data: devices } = useQuery({
    queryKey: ['devices'],
    queryFn: () => deviceService.getAll()
  });

  const { data: stats } = useQuery({
    queryKey: ['device-stats'],
    queryFn: () => deviceService.getStats()
  });

  const { data: alerts } = useQuery({
    queryKey: ['alerts-unack'],
    queryFn: () => alertService.getAll({ acknowledged: false })
  });

  const statCards = [
    {
      title: 'Total Dispositivos',
      value: stats?.total_devices || 0,
      icon: Thermometer,
      color: 'blue'
    },
    {
      title: 'En Línea',
      value: stats?.online_devices || 0,
      icon: Power,
      color: 'green'
    },
    {
      title: 'Alertas Activas',
      value: alerts?.length || 0,
      icon: AlertTriangle,
      color: 'yellow'
    },
    {
      title: 'Eficiencia',
      value: '87%',
      icon: TrendingUp,
      color: 'purple'
    }
  ];

  const colorClasses: any = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500'
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${colorClasses[stat.color]} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Devices */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Dispositivos Recientes</h2>
        <div className="space-y-4">
          {devices?.slice(0, 5).map((device: any) => (
            <div key={device.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${device.is_online ? 'bg-green-500' : 'bg-gray-300'}`} />
                <div>
                  <h3 className="font-medium text-gray-900">{device.name}</h3>
                  <p className="text-sm text-gray-600">{device.location_name || 'Sin ubicación'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">
                  {device.temperature ? `${device.temperature}°C` : '--'}
                </p>
                <p className="text-sm text-gray-600">{device.power_state ? 'Encendido' : 'Apagado'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Alerts */}
      {alerts && alerts.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Alertas Recientes</h2>
          <div className="space-y-3">
            {alerts.slice(0, 5).map((alert: any) => (
              <div key={alert.id} className="flex items-start space-x-3 p-3 border-l-4 border-yellow-500 bg-yellow-50 rounded">
                <AlertTriangle className="text-yellow-600 mt-1" size={20} />
                <div>
                  <p className="font-medium text-gray-900">{alert.message}</p>
                  <p className="text-sm text-gray-600">{new Date(alert.created_at).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
