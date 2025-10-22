import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertService } from '../services/alert.service';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Alerts() {
  const queryClient = useQueryClient();

  const { data: alerts } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => alertService.getAll()
  });

  const acknowledgeMutation = useMutation({
    mutationFn: (id: string) => alertService.acknowledge(id),
    onSuccess: () => {
      toast.success('Alerta reconocida');
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    }
  });

  const resolveMutation = useMutation({
    mutationFn: (id: string) => alertService.resolve(id),
    onSuccess: () => {
      toast.success('Alerta resuelta');
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    }
  });

  const severityColors: any = {
    critical: 'border-red-500 bg-red-50',
    warning: 'border-yellow-500 bg-yellow-50',
    info: 'border-blue-500 bg-blue-50'
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Alertas</h1>

      <div className="space-y-4">
        {alerts?.map((alert: any) => (
          <div
            key={alert.id}
            className={`border-l-4 rounded-lg p-4 ${severityColors[alert.severity]}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="text-gray-700 mt-1" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-900">{alert.message}</h3>
                  <p className="text-sm text-gray-600">{alert.device_name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(alert.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                {!alert.acknowledged && (
                  <button
                    onClick={() => acknowledgeMutation.mutate(alert.id)}
                    className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50"
                  >
                    Reconocer
                  </button>
                )}
                {!alert.resolved && (
                  <button
                    onClick={() => resolveMutation.mutate(alert.id)}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    <CheckCircle size={16} className="inline mr-1" />
                    Resolver
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {alerts?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No hay alertas</p>
          </div>
        )}
      </div>
    </div>
  );
}
