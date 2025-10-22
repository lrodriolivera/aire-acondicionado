import { Response, NextFunction } from 'express';
import modelService from '../services/model.service';
import { AuthRequest } from '../middleware/auth';

export class ModelController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const brandId = req.query.brandId as string | undefined;
      const models = await modelService.getAll(brandId);
      res.json({
        success: true,
        data: models
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const model = await modelService.getById(req.params.id);
      res.json({
        success: true,
        data: model
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const model = await modelService.create(req.body);
      res.status(201).json({
        success: true,
        data: model
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const model = await modelService.update(req.params.id, req.body);
      res.json({
        success: true,
        data: model
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await modelService.delete(req.params.id);
      res.json({
        success: true,
        message: 'Model deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ModelController();
