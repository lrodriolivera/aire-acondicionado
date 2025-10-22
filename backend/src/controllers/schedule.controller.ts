import { Response, NextFunction } from 'express';
import scheduleService from '../services/schedule.service';
import { AuthRequest } from '../middleware/auth';

export class ScheduleController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const deviceId = req.query.deviceId as string | undefined;
      const schedules = await scheduleService.getAll(deviceId);

      res.json({
        success: true,
        data: schedules
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schedule = await scheduleService.getById(req.params.id);

      res.json({
        success: true,
        data: schedule
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schedule = await scheduleService.create(req.body);

      res.status(201).json({
        success: true,
        data: schedule
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schedule = await scheduleService.update(req.params.id, req.body);

      res.json({
        success: true,
        data: schedule
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await scheduleService.delete(req.params.id);

      res.json({
        success: true,
        message: 'Schedule deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ScheduleController();
