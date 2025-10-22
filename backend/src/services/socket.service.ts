import { Server as SocketIOServer } from 'socket.io';
import logger from '../utils/logger';

class SocketService {
  private io: SocketIOServer | null = null;

  initialize(io: SocketIOServer) {
    this.io = io;
    logger.info('Socket.io service initialized');
  }

  // Emitir actualización de estado de dispositivo
  emitDeviceStatusUpdate(deviceId: string, status: any) {
    if (!this.io) return;

    this.io.to(`device:${deviceId}`).emit('device:status', {
      deviceId,
      status,
      timestamp: new Date()
    });

    logger.debug(`Device status update emitted for ${deviceId}`);
  }

  // Emitir nueva alerta
  emitAlert(alert: any) {
    if (!this.io) return;

    this.io.emit('alert:new', alert);

    if (alert.device_id) {
      this.io.to(`device:${alert.device_id}`).emit('device:alert', alert);
    }

    logger.debug('Alert emitted', { alertId: alert.id });
  }

  // Emitir comando ejecutado
  emitCommandExecuted(deviceId: string, command: any) {
    if (!this.io) return;

    this.io.to(`device:${deviceId}`).emit('device:command', {
      deviceId,
      command,
      timestamp: new Date()
    });

    logger.debug(`Command executed event emitted for ${deviceId}`);
  }

  // Emitir telemetría en tiempo real
  emitTelemetry(deviceId: string, telemetry: any) {
    if (!this.io) return;

    this.io.to(`device:${deviceId}`).emit('device:telemetry', {
      deviceId,
      telemetry,
      timestamp: new Date()
    });
  }

  // Broadcast a todos los usuarios
  broadcast(event: string, data: any) {
    if (!this.io) return;

    this.io.emit(event, data);
    logger.debug(`Broadcast event: ${event}`);
  }
}

export default new SocketService();
