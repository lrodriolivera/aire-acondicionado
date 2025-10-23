import { AdapterFactory } from '../adapters/AdapterFactory';
import deviceService from './device.service';
import commandService from './command.service';
import telemetryService from './telemetry.service';
import { CommandType, CommandStatus } from '../types';
import logger from '../utils/logger';

export class DeviceControlService {
  async sendCommand(
    deviceId: string,
    userId: string,
    commandType: CommandType,
    parameters: any
  ): Promise<void> {
    try {
      // Obtener información del dispositivo
      const device = await deviceService.getById(deviceId);

      if (!device.protocol_type || !device.connection_config) {
        throw new Error('Device protocol not configured');
      }

      // Crear comando en la base de datos
      const command = await commandService.create(deviceId, userId, commandType, parameters);

      // Actualizar estado del comando a "executing"
      await commandService.updateStatus(command.id, CommandStatus.EXECUTING);

      try {
        // Modo demo: simular ejecución de comandos para dispositivos de prueba
        const isDemoMode = device.serial_number?.includes('2024') ||
                          device.ip_address?.startsWith('192.168');

        if (isDemoMode) {
          // Simular delay de ejecución
          await new Promise(resolve => setTimeout(resolve, 500));

          // Actualizar el estado del dispositivo inmediatamente para feedback visual
          if (commandType === CommandType.SET_TEMPERATURE && parameters.temperature) {
            await deviceService.updateStatus(deviceId, {
              target_temperature: parameters.temperature
            });
          } else if (commandType === CommandType.SET_POWER && parameters.power !== undefined) {
            await deviceService.updateStatus(deviceId, {
              power_state: parameters.power
            });
          } else if (commandType === CommandType.SET_MODE && parameters.mode) {
            await deviceService.updateStatus(deviceId, {
              mode: parameters.mode
            });
          } else if (commandType === CommandType.SET_FAN_SPEED && parameters.fanSpeed) {
            await deviceService.updateStatus(deviceId, {
              fan_speed: parameters.fanSpeed
            });
          }

          logger.info(`Command simulated successfully for demo device ${deviceId}`, {
            commandType,
            parameters
          });
        } else {
          // Obtener o crear adaptador para dispositivos reales
          const adapter = await AdapterFactory.createAdapter(
            deviceId,
            device.protocol_type,
            device.connection_config
          );

          // Ejecutar el comando
          await adapter.executeCommand(commandType, parameters);

          logger.info(`Command executed successfully for device ${deviceId}`, {
            commandType,
            parameters
          });
        }

        // Marcar comando como completado
        await commandService.updateStatus(command.id, CommandStatus.COMPLETED);

      } catch (error: any) {
        // Marcar comando como fallido
        await commandService.updateStatus(
          command.id,
          CommandStatus.FAILED,
          error.message
        );

        throw error;
      }

    } catch (error) {
      logger.error(`Failed to send command to device ${deviceId}:`, error);
      throw error;
    }
  }

  async refreshDeviceStatus(deviceId: string): Promise<void> {
    try {
      const device = await deviceService.getById(deviceId);

      if (!device.protocol_type || !device.connection_config) {
        logger.warn(`Device ${deviceId} has no protocol configured, skipping status refresh`);
        return;
      }

      const adapter = await AdapterFactory.createAdapter(
        deviceId,
        device.protocol_type,
        device.connection_config
      );

      const status = await adapter.getStatus();

      // Actualizar estado en la base de datos
      await deviceService.updateStatus(deviceId, status);

      // Guardar telemetría
      if (status.temperature !== undefined) {
        await telemetryService.store(deviceId, {
          temperature: status.temperature,
          humidity: status.humidity,
          power_consumption: 0, // TODO: Calcular consumo
          mode: status.mode,
          fan_speed: status.fan_speed,
          power_state: status.power_state || false
        });
      }

      logger.debug(`Status refreshed for device ${deviceId}`);

    } catch (error) {
      logger.error(`Failed to refresh status for device ${deviceId}:`, error);
    }
  }

  async refreshAllDeviceStatuses(): Promise<void> {
    try {
      const devices = await deviceService.getAll({ status: 'online' });

      const promises = devices.map(device =>
        this.refreshDeviceStatus(device.id).catch(error =>
          logger.error(`Error refreshing device ${device.id}:`, error)
        )
      );

      await Promise.all(promises);

      logger.info(`Refreshed status for ${devices.length} devices`);

    } catch (error) {
      logger.error('Failed to refresh all device statuses:', error);
    }
  }
}

export default new DeviceControlService();
