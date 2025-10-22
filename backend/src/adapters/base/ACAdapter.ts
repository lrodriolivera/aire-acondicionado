// Interfaz base para todos los adaptadores de aires acondicionados

import { DeviceStatus, ACMode, FanSpeed, CommandType } from '../../types';

export interface ACAdapterInterface {
  deviceId: string;
  config: any;

  // Métodos de conexión
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;

  // Métodos de lectura
  getStatus(): Promise<Partial<DeviceStatus>>;

  // Métodos de control
  setPower(on: boolean): Promise<void>;
  setTemperature(temperature: number): Promise<void>;
  setMode(mode: ACMode): Promise<void>;
  setFanSpeed(speed: FanSpeed): Promise<void>;

  // Método genérico para ejecutar comandos
  executeCommand(commandType: CommandType, parameters: any): Promise<void>;
}

export abstract class BaseACAdapter implements ACAdapterInterface {
  deviceId: string;
  config: any;
  protected connected: boolean = false;

  constructor(deviceId: string, config: any) {
    this.deviceId = deviceId;
    this.config = config;
  }

  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;
  abstract getStatus(): Promise<Partial<DeviceStatus>>;
  abstract setPower(on: boolean): Promise<void>;
  abstract setTemperature(temperature: number): Promise<void>;
  abstract setMode(mode: ACMode): Promise<void>;
  abstract setFanSpeed(speed: FanSpeed): Promise<void>;

  isConnected(): boolean {
    return this.connected;
  }

  async executeCommand(commandType: CommandType, parameters: any): Promise<void> {
    switch (commandType) {
      case CommandType.SET_POWER:
        await this.setPower(parameters.value);
        break;
      case CommandType.SET_TEMPERATURE:
        await this.setTemperature(parameters.value);
        break;
      case CommandType.SET_MODE:
        await this.setMode(parameters.value);
        break;
      case CommandType.SET_FAN_SPEED:
        await this.setFanSpeed(parameters.value);
        break;
      default:
        throw new Error(`Unknown command type: ${commandType}`);
    }
  }
}
