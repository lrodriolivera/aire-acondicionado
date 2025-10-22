import { io, Socket } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000';

class SocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    if (this.socket?.connected) return;

    this.socket = io(WS_URL, {
      auth: {
        token
      }
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  subscribeToDevice(deviceId: string) {
    if (this.socket) {
      this.socket.emit('subscribe:device', deviceId);
    }
  }

  unsubscribeFromDevice(deviceId: string) {
    if (this.socket) {
      this.socket.emit('unsubscribe:device', deviceId);
    }
  }

  onDeviceStatus(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('device:status', callback);
    }
  }

  onDeviceCommand(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('device:command', callback);
    }
  }

  onAlert(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('alert:new', callback);
    }
  }

  off(event: string) {
    if (this.socket) {
      this.socket.off(event);
    }
  }
}

export default new SocketService();
