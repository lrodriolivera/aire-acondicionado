// Types and Interfaces for AC Management Platform

export interface User {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  role: UserRole;
  permissions?: Record<string, any>;
  is_active: boolean;
  last_login?: Date;
  created_at: Date;
  updated_at: Date;
}

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  OPERATOR = 'operator',
  VIEWER = 'viewer'
}

export interface Brand {
  id: string;
  name: string;
  logo_url?: string;
  website?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Model {
  id: string;
  brand_id: string;
  name: string;
  protocol_type: ProtocolType;
  connection_config?: ConnectionConfig;
  capabilities?: DeviceCapabilities;
  min_temperature: number;
  max_temperature: number;
  created_at: Date;
  updated_at: Date;
}

export enum ProtocolType {
  MQTT = 'mqtt',
  HTTP = 'http',
  MODBUS = 'modbus',
  BACNET = 'bacnet'
}

export interface ConnectionConfig {
  broker?: string;
  topicPrefix?: string;
  topics?: {
    status: string;
    command: string;
    telemetry: string;
  };
  mappings?: Record<string, string>;
  commands?: Record<string, any>;
  apiUrl?: string;
  apiKey?: string;
  [key: string]: any;
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
  location_id?: string;
  serial_number: string;
  name: string;
  ip_address?: string;
  mqtt_topic?: string;
  status: DeviceConnectionStatus;
  last_seen?: Date;
  config?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
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
  timestamp: Date;
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

export interface DeviceTelemetry {
  id: string;
  device_id: string;
  temperature?: number;
  humidity?: number;
  power_consumption?: number;
  mode?: ACMode;
  fan_speed?: FanSpeed;
  power_state: boolean;
  timestamp: Date;
}

export interface DeviceCommand {
  id: string;
  device_id: string;
  user_id?: string;
  command_type: CommandType;
  parameters: Record<string, any>;
  status: CommandStatus;
  error_message?: string;
  executed_at?: Date;
  created_at: Date;
}

export enum CommandType {
  SET_POWER = 'setPower',
  SET_TEMPERATURE = 'setTemperature',
  SET_MODE = 'setMode',
  SET_FAN_SPEED = 'setFanSpeed'
}

export enum CommandStatus {
  PENDING = 'pending',
  EXECUTING = 'executing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export interface Alert {
  id: string;
  device_id: string;
  alert_type: AlertType;
  severity: AlertSeverity;
  message: string;
  metadata?: Record<string, any>;
  acknowledged: boolean;
  acknowledged_by?: string;
  acknowledged_at?: Date;
  resolved: boolean;
  resolved_at?: Date;
  created_at: Date;
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
  name: string;
  enabled: boolean;
  schedule_type: ScheduleType;
  schedule_config: ScheduleConfig;
  last_executed?: Date;
  next_execution?: Date;
  created_at: Date;
  updated_at: Date;
}

export enum ScheduleType {
  ONCE = 'once',
  RECURRING = 'recurring'
}

export interface ScheduleConfig {
  cron?: string;
  days?: number[]; // 0-6 (Sunday-Saturday)
  time?: string; // HH:mm
  action: ScheduleAction;
  parameters: Record<string, any>;
}

export interface ScheduleAction {
  type: CommandType;
  value: any;
}

export interface Location {
  id: string;
  name: string;
  parent_id?: string;
  type: LocationType;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export enum LocationType {
  BUILDING = 'building',
  FLOOR = 'floor',
  ROOM = 'room',
  ZONE = 'zone'
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
