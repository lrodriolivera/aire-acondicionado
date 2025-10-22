import { Response, NextFunction } from 'express';
import deviceControlService from '../services/device-control.service';
import { AuthRequest } from '../middleware/auth';
import { CommandType } from '../types';

export class DeviceControlController {
  async sendCommand(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { deviceId, commandType, parameters } = req.body;
      const userId = req.user!.userId;

      await deviceControlService.sendCommand(deviceId, userId, commandType as CommandType, parameters);

      res.json({
        success: true,
        message: 'Command sent successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { deviceId } = req.params;

      await deviceControlService.refreshDeviceStatus(deviceId);

      res.json({
        success: true,
        message: 'Status refreshed successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshAllStatuses(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await deviceControlService.refreshAllDeviceStatuses();

      res.json({
        success: true,
        message: 'All device statuses refreshed'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new DeviceControlController();
