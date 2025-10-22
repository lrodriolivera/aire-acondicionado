// Frontend Types

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  OPERATOR = 'operator',
  VIEWER = 'viewer'
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface Brand {
  id: string;
  name: string;
  logo_url?: string;
  website?: string;
  created_at: string;
}

export interface Model {
  id: string;
  brand_id: string;
  brand?: Brand;
  name: string;
  protocol_type: ProtocolType;
  capabilities?: DeviceCapabilities;
  min_temperature: number;
  max_temperature: number;
  created_at: string;
}

export enum ProtocolType {
  MQTT = 'mqtt',
  HTTP = 'http',
  MODBUS = 'modbus',
  BACNET = 'bacnet'
}

export interface DeviceCapabilities {
  hasHumidity?: boolean;
  hasTimer?: boolean;
  hasFanSpeed?: boolean;
  hasSwing?: boolean;
  hasTurbo?: boolean;
  hasEco?: boolean;
  supportedModes?: ACMode[];
  supportedFanSpeeds?: FanSpeed[];
}

export interface Device {
  id: string;
  model_id: string;
  model?: Model;
  location_id?: string;
  location?: Location;
  serial_number: string;
  name: string;
  ip_address?: string;
  status: DeviceConnectionStatus;
  last_seen?: string;
  created_at: string;
}

export enum DeviceConnectionStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  ERROR = 'error'
}

export interface DeviceStatus {
  id: string;
  device_id: string;
  temperature?: number;
  target_temperature?: number;
  humidity?: number;
  mode?: ACMode;
  fan_speed?: FanSpeed;
  power_state: boolean;
  is_online: boolean;
  error_code?: string;
  timestamp: string;
}

export enum ACMode {
  COOL = 'cool',
  HEAT = 'heat',
  FAN = 'fan',
  DRY = 'dry',
  AUTO = 'auto'
}

export enum FanSpeed {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  AUTO = 'auto'
}

export interface DeviceWithStatus extends Device {
  currentStatus?: DeviceStatus;
}

export interface CommandPayload {
  command_type: CommandType;
  parameters: Record<string, any>;
}

export enum CommandType {
  SET_POWER = 'setPower',
  SET_TEMPERATURE = 'setTemperature',
  SET_MODE = 'setMode',
  SET_FAN_SPEED = 'setFanSpeed'
}

export interface Alert {
  id: string;
  device_id: string;
  device?: Device;
  alert_type: AlertType;
  severity: AlertSeverity;
  message: string;
  acknowledged: boolean;
  acknowledged_by?: string;
  acknowledged_at?: string;
  resolved: boolean;
  resolved_at?: string;
  created_at: string;
}

export enum AlertType {
  TEMPERATURE_HIGH = 'temperature_high',
  TEMPERATURE_LOW = 'temperature_low',
  OFFLINE = 'offline',
  ERROR = 'error',
  MAINTENANCE = 'maintenance',
  CONSUMPTION_ANOMALY = 'consumption_anomaly'
}

export enum AlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  CRITICAL = 'critical'
}

export interface Schedule {
  id: string;
  device_id: string;
  device?: Device;
  name: string;
  enabled: boolean;
  schedule_config: ScheduleConfig;
  next_execution?: string;
  created_at: string;
}

export interface ScheduleConfig {
  cron?: string;
  days?: number[];
  time?: string;
  action: {
    type: CommandType;
    value: any;
  };
  parameters: Record<string, any>;
}

export interface Location {
  id: string;
  name: string;
  parent_id?: string;
  type: LocationType;
  description?: string;
  created_at: string;
}

export enum LocationType {
  BUILDING = 'building',
  FLOOR = 'floor',
  ROOM = 'room',
  ZONE = 'zone'
}

export interface TelemetryData {
  timestamp: string;
  temperature?: number;
  humidity?: number;
  power_consumption?: number;
  mode?: ACMode;
  power_state: boolean;
}
