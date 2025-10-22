import { Response, NextFunction } from 'express';
import alertService from '../services/alert.service';
import { AuthRequest } from '../middleware/auth';
import { AlertSeverity } from '../types';

export class AlertController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const filters = {
        deviceId: req.query.deviceId as string,
        severity: req.query.severity as AlertSeverity,
        acknowledged: req.query.acknowledged === 'true' ? true : req.query.acknowledged === 'false' ? false : undefined,
        resolved: req.query.resolved === 'true' ? true : req.query.resolved === 'false' ? false : undefined
      };

      const alerts = await alertService.getAll(filters);

      res.json({
        success: true,
        data: alerts
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const alert = await alertService.getById(req.params.id);

      res.json({
        success: true,
        data: alert
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const alert = await alertService.create(req.body);

      res.status(201).json({
        success: true,
        data: alert
      });
    } catch (error) {
      next(error);
    }
  }

  async acknowledge(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const alert = await alertService.acknowledge(req.params.id, userId);

      res.json({
        success: true,
        data: alert
      });
    } catch (error) {
      next(error);
    }
  }

  async resolve(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const alert = await alertService.resolve(req.params.id);

      res.json({
        success: true,
        data: alert
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await alertService.delete(req.params.id);

      res.json({
        success: true,
        message: 'Alert deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const stats = await alertService.getStats();

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AlertController();
