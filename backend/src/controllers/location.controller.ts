import { Response, NextFunction } from 'express';
import locationService from '../services/location.service';
import { AuthRequest } from '../middleware/auth';

export class LocationController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const locations = await locationService.getAll();
      res.json({
        success: true,
        data: locations
      });
    } catch (error) {
      next(error);
    }
  }

  async getTree(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tree = await locationService.getTree();
      res.json({
        success: true,
        data: tree
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const location = await locationService.getById(req.params.id);
      res.json({
        success: true,
        data: location
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const location = await locationService.create(req.body);
      res.status(201).json({
        success: true,
        data: location
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const location = await locationService.update(req.params.id, req.body);
      res.json({
        success: true,
        data: location
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await locationService.delete(req.params.id);
      res.json({
        success: true,
        message: 'Location deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new LocationController();
