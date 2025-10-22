import { Response, NextFunction } from 'express';
import telemetryService from '../services/telemetry.service';
import { AuthRequest } from '../middleware/auth';

export class TelemetryController {
  async getByDevice(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { deviceId } = req.params;
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date(Date.now() - 24 * 60 * 60 * 1000);
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();
      const limit = parseInt(req.query.limit as string) || 1000;

      const telemetry = await telemetryService.getByDevice(deviceId, startDate, endDate, limit);

      res.json({
        success: true,
        data: telemetry
      });
    } catch (error) {
      next(error);
    }
  }

  async getLatest(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { deviceId } = req.params;
      const limit = parseInt(req.query.limit as string) || 100;

      const telemetry = await telemetryService.getLatest(deviceId, limit);

      res.json({
        success: true,
        data: telemetry
      });
    } catch (error) {
      next(error);
    }
  }

  async getAggregated(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { deviceId } = req.params;
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();
      const interval = (req.query.interval as 'hour' | 'day') || 'hour';

      const telemetry = await telemetryService.getAggregated(deviceId, startDate, endDate, interval);

      res.json({
        success: true,
        data: telemetry
      });
    } catch (error) {
      next(error);
    }
  }

  async getConsumptionStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { deviceId } = req.params;
      const days = parseInt(req.query.days as string) || 30;

      const stats = await telemetryService.getConsumptionStats(deviceId, days);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new TelemetryController();
