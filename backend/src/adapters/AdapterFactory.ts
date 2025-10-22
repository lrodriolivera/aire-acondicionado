import { ACAdapterInterface } from './base/ACAdapter';
import { GenericMQTTAdapter } from './mqtt/GenericMQTTAdapter';
// import { GenericHTTPAdapter } from './http/GenericHTTPAdapter'; // Temporarily disabled
import { ProtocolType } from '../types';
import logger from '../utils/logger';

export class AdapterFactory {
  private static adapters: Map<string, ACAdapterInterface> = new Map();

  static async createAdapter(
    deviceId: string,
    protocolType: ProtocolType,
    config: any
  ): Promise<ACAdapterInterface> {
    // Verificar si ya existe un adaptador para este dispositivo
    if (this.adapters.has(deviceId)) {
      logger.debug(`Reusing existing adapter for device ${deviceId}`);
      return this.adapters.get(deviceId)!;
    }

    let adapter: ACAdapterInterface;

    switch (protocolType) {
      case ProtocolType.MQTT:
        adapter = new GenericMQTTAdapter(deviceId, config);
        break;

      case ProtocolType.HTTP:
        // Temporarily disabled due to axios import issues
        throw new Error('HTTP adapter temporarily disabled');
        // adapter = new GenericHTTPAdapter(deviceId, config);
        // break;

      case ProtocolType.MODBUS:
        // TODO: Implementar adaptador Modbus
        throw new Error('Modbus adapter not implemented yet');

      case ProtocolType.BACNET:
        // TODO: Implementar adaptador BACnet
        throw new Error('BACnet adapter not implemented yet');

      default:
        throw new Error(`Unsupported protocol type: ${protocolType}`);
    }

    // Conectar el adaptador
    await adapter.connect();

    // Guardar en caché
    this.adapters.set(deviceId, adapter);

    logger.info(`Created and connected adapter for device ${deviceId} with protocol ${protocolType}`);

    return adapter;
  }

  static async getAdapter(deviceId: string): Promise<ACAdapterInterface | null> {
    return this.adapters.get(deviceId) || null;
  }

  static async removeAdapter(deviceId: string): Promise<void> {
    const adapter = this.adapters.get(deviceId);
    if (adapter) {
      await adapter.disconnect();
      this.adapters.delete(deviceId);
      logger.info(`Removed adapter for device ${deviceId}`);
    }
  }

  static async disconnectAll(): Promise<void> {
    logger.info('Disconnecting all adapters...');
    const promises = Array.from(this.adapters.values()).map(adapter => adapter.disconnect());
    await Promise.all(promises);
    this.adapters.clear();
    logger.info('All adapters disconnected');
  }
}
