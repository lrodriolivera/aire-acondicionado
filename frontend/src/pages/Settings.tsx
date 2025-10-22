import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Settings as SettingsIcon, User, Bell, Shield, Save } from 'lucide-react';
// import { Database } from 'lucide-react'; // TODO: Use for database settings tab
import toast from 'react-hot-toast';

export default function Settings() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');

  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email_alerts: true,
    critical_alerts: true,
    warning_alerts: true,
    info_alerts: false,
    daily_reports: true,
    weekly_reports: false
  });

  const [systemSettings, setSystemSettings] = useState({
    temperature_unit: 'celsius',
    time_format: '24h',
    language: 'es',
    timezone: 'America/Bogota',
    auto_logout: '30'
  });

  const handleProfileSave = () => {
    if (profileData.new_password && profileData.new_password !== profileData.confirm_password) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    toast.success('Perfil actualizado exitosamente');
  };

  const handleNotificationSave = () => {
    toast.success('Preferencias de notificación guardadas');
  };

  const handleSystemSave = () => {
    toast.success('Configuración del sistema guardada');
  };

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'system', label: 'Sistema', icon: SettingsIcon },
    { id: 'security', label: 'Seguridad', icon: Shield }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Configuración</h1>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar de tabs */}
        <div className="col-span-3">
          <div className="bg-white rounded-lg shadow p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Contenido */}
        <div className="col-span-9">
          <div className="bg-white rounded-lg shadow p-6">
            {/* Tab: Perfil */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Perfil de Usuario</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      value={profileData.full_name}
                      onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    />
                  </div>

                  <div className="border-t pt-4 mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Cambiar Contraseña</h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contraseña Actual
                        </label>
                        <input
                          type="password"
                          value={profileData.current_password}
                          onChange={(e) => setProfileData({ ...profileData, current_password: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nueva Contraseña
                        </label>
                        <input
                          type="password"
                          value={profileData.new_password}
                          onChange={(e) => setProfileData({ ...profileData, new_password: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirmar Nueva Contraseña
                        </label>
                        <input
                          type="password"
                          value={profileData.confirm_password}
                          onChange={(e) => setProfileData({ ...profileData, confirm_password: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleProfileSave}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <Save size={18} />
                      <span>Guardar Cambios</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Notificaciones */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Preferencias de Notificación</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas en Tiempo Real</h3>
                    <div className="space-y-3">
                      {[
                        { key: 'email_alerts', label: 'Recibir alertas por email', desc: 'Enviar notificaciones de alertas a tu correo' },
                        { key: 'critical_alerts', label: 'Alertas Críticas', desc: 'Notificar sobre eventos críticos del sistema' },
                        { key: 'warning_alerts', label: 'Alertas de Advertencia', desc: 'Notificar sobre advertencias importantes' },
                        { key: 'info_alerts', label: 'Alertas Informativas', desc: 'Notificar sobre eventos informativos' }
                      ].map((item) => (
                        <label key={item.key} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings[item.key as keyof typeof notificationSettings] as boolean}
                            onChange={(e) => setNotificationSettings({ ...notificationSettings, [item.key]: e.target.checked })}
                            className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{item.label}</div>
                            <div className="text-sm text-gray-500">{item.desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Reportes Periódicos</h3>
                    <div className="space-y-3">
                      {[
                        { key: 'daily_reports', label: 'Reportes Diarios', desc: 'Recibir resumen diario de actividad' },
                        { key: 'weekly_reports', label: 'Reportes Semanales', desc: 'Recibir resumen semanal consolidado' }
                      ].map((item) => (
                        <label key={item.key} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings[item.key as keyof typeof notificationSettings] as boolean}
                            onChange={(e) => setNotificationSettings({ ...notificationSettings, [item.key]: e.target.checked })}
                            className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{item.label}</div>
                            <div className="text-sm text-gray-500">{item.desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleNotificationSave}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <Save size={18} />
                      <span>Guardar Preferencias</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Sistema */}
            {activeTab === 'system' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Configuración del Sistema</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unidad de Temperatura
                    </label>
                    <select
                      value={systemSettings.temperature_unit}
                      onChange={(e) => setSystemSettings({ ...systemSettings, temperature_unit: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    >
                      <option value="celsius">Celsius (°C)</option>
                      <option value="fahrenheit">Fahrenheit (°F)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Formato de Hora
                    </label>
                    <select
                      value={systemSettings.time_format}
                      onChange={(e) => setSystemSettings({ ...systemSettings, time_format: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    >
                      <option value="24h">24 horas</option>
                      <option value="12h">12 horas (AM/PM)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Idioma
                    </label>
                    <select
                      value={systemSettings.language}
                      onChange={(e) => setSystemSettings({ ...systemSettings, language: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    >
                      <option value="es">Español</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Zona Horaria
                    </label>
                    <select
                      value={systemSettings.timezone}
                      onChange={(e) => setSystemSettings({ ...systemSettings, timezone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    >
                      <option value="America/Bogota">América/Bogotá (GMT-5)</option>
                      <option value="America/New_York">América/New York (GMT-5)</option>
                      <option value="America/Mexico_City">América/Ciudad de México (GMT-6)</option>
                      <option value="America/Los_Angeles">América/Los Angeles (GMT-8)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cerrar Sesión Automáticamente
                    </label>
                    <select
                      value={systemSettings.auto_logout}
                      onChange={(e) => setSystemSettings({ ...systemSettings, auto_logout: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    >
                      <option value="15">15 minutos</option>
                      <option value="30">30 minutos</option>
                      <option value="60">1 hora</option>
                      <option value="never">Nunca</option>
                    </select>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleSystemSave}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <Save size={18} />
                      <span>Guardar Configuración</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Seguridad */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Seguridad y Privacidad</h2>

                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="text-blue-600 mt-1" size={24} />
                      <div>
                        <h3 className="font-semibold text-blue-900">Estado de Seguridad</h3>
                        <p className="text-sm text-blue-700 mt-1">
                          Tu cuenta está protegida con autenticación JWT y encriptación de datos.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Información de la Cuenta</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rol:</span>
                        <span className="font-medium text-gray-900">{user?.role}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Último acceso:</span>
                        <span className="font-medium text-gray-900">
                          {user?.last_login ? new Date(user.last_login).toLocaleString() : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cuenta creada:</span>
                        <span className="font-medium text-gray-900">
                          {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Actividad Reciente</h3>
                    <p className="text-sm text-gray-600">
                      Aquí se mostrarán las sesiones activas y la actividad reciente de tu cuenta.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
