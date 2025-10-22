import mqtt, { MqttClient } from 'mqtt';
import { BaseACAdapter } from '../base/ACAdapter';
import { DeviceStatus, ACMode, FanSpeed } from '../../types';
import logger from '../../utils/logger';

export class GenericMQTTAdapter extends BaseACAdapter {
  private client: MqttClient | null = null;
  private statusTopic: string;
  private commandTopic: string;
  private lastStatus: Partial<DeviceStatus> = {};

  constructor(deviceId: string, config: any) {
    super(deviceId, config);

    // Configurar topics desde el config
    const topicPrefix = config.topicPrefix?.replace('{deviceId}', deviceId) || `ac/${deviceId}`;
    this.statusTopic = config.topics?.status?.replace('{deviceId}', deviceId) || `${topicPrefix}/status`;
    this.commandTopic = config.topics?.command?.replace('{deviceId}', deviceId) || `${topicPrefix}/command`;
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const brokerUrl = this.config.broker || 'mqtt://localhost:1883';

        this.client = mqtt.connect(brokerUrl, {
          clientId: `ac-platform-${this.deviceId}`,
          clean: true,
          reconnectPeriod: 5000
        });

        this.client.on('connect', () => {
          logger.info(`MQTT Adapter connected for device ${this.deviceId}`);
          this.connected = true;

          // Suscribirse al topic de estado
          this.client!.subscribe(this.statusTopic, (err) => {
            if (err) {
              logger.error(`Failed to subscribe to ${this.statusTopic}:`, err);
            } else {
              logger.info(`Subscribed to ${this.statusTopic}`);
            }
          });

          resolve();
        });

        this.client.on('error', (error) => {
          logger.error(`MQTT error for device ${this.deviceId}:`, error);
          reject(error);
        });

        this.client.on('message', (topic, payload) => {
          if (topic === this.statusTopic) {
            this.handleStatusMessage(payload);
          }
        });

      } catch (error) {
        reject(error);
      }
    });
  }

  async disconnect(): Promise<void> {
    return new Promise((resolve) => {
      if (this.client) {
        this.client.end(false, {}, () => {
          this.connected = false;
          logger.info(`MQTT Adapter disconnected for device ${this.deviceId}`);
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  private handleStatusMessage(payload: Buffer): void {
    try {
      const data = JSON.parse(payload.toString());

      // Mapear campos usando la configuración
      const mappings = this.config.mappings || {};

      this.lastStatus = {
        temperature: this.getNestedValue(data, mappings.temperature || 'temperature'),
        target_temperature: this.getNestedValue(data, mappings.target_temperature || 'target_temperature'),
        humidity: this.getNestedValue(data, mappings.humidity || 'humidity'),
        mode: this.getNestedValue(data, mappings.mode || 'mode'),
        fan_speed: this.getNestedValue(data, mappings.fan_speed || 'fan_speed'),
        power_state: this.getNestedValue(data, mappings.power_state || 'power_state'),
        is_online: true,
        timestamp: new Date()
      };

      logger.debug(`Status updated for device ${this.deviceId}:`, this.lastStatus);
    } catch (error) {
      logger.error(`Error parsing status message for device ${this.deviceId}:`, error);
    }
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  async getStatus(): Promise<Partial<DeviceStatus>> {
    return this.lastStatus;
  }

  private async publishCommand(action: string, value: any): Promise<void> {
    if (!this.client || !this.connected) {
      throw new Error('MQTT client not connected');
    }

    const commandConfig = this.config.commands?.[action];
    const topic = commandConfig?.topic?.replace('{deviceId}', this.deviceId) || this.commandTopic;

    let payload: any;
    if (commandConfig?.payload) {
      // Usar el payload configurado y reemplazar placeholders
      payload = JSON.parse(
        JSON.stringify(commandConfig.payload).replace('{value}', JSON.stringify(value))
      );
    } else {
      // Payload por defecto
      payload = { action, value };
    }

    return new Promise((resolve, reject) => {
      this.client!.publish(topic, JSON.stringify(payload), { qos: 1 }, (error) => {
        if (error) {
          logger.error(`Failed to publish command for device ${this.deviceId}:`, error);
          reject(error);
        } else {
          logger.info(`Command published for device ${this.deviceId}:`, { action, value });
          resolve();
        }
      });
    });
  }

  async setPower(on: boolean): Promise<void> {
    await this.publishCommand('setPower', on);
  }

  async setTemperature(temperature: number): Promise<void> {
    await this.publishCommand('setTemperature', temperature);
  }

  async setMode(mode: ACMode): Promise<void> {
    await this.publishCommand('setMode', mode);
  }

  async setFanSpeed(speed: FanSpeed): Promise<void> {
    await this.publishCommand('setFanSpeed', speed);
  }
}
