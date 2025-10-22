import { Response, NextFunction } from 'express';
import deviceService from '../services/device.service';
import { AuthRequest } from '../middleware/auth';

export class DeviceController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const filters = {
        location_id: req.query.location_id as string,
        status: req.query.status as string,
        model_id: req.query.model_id as string
      };

      const devices = await deviceService.getAll(filters);
      res.json({
        success: true,
        data: devices
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const device = await deviceService.getById(req.params.id);
      res.json({
        success: true,
        data: device
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const device = await deviceService.create(req.body);
      res.status(201).json({
        success: true,
        data: device
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const device = await deviceService.update(req.params.id, req.body);
      res.json({
        success: true,
        data: device
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await deviceService.delete(req.params.id);
      res.json({
        success: true,
        message: 'Device deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const stats = await deviceService.getStats();
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new DeviceController();
