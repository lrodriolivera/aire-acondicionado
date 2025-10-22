import { Response, NextFunction } from 'express';
import brandService from '../services/brand.service';
import { AuthRequest } from '../middleware/auth';

export class BrandController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const brands = await brandService.getAll();
      res.json({
        success: true,
        data: brands
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const brand = await brandService.getById(req.params.id);
      res.json({
        success: true,
        data: brand
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const brand = await brandService.create(req.body);
      res.status(201).json({
        success: true,
        data: brand
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const brand = await brandService.update(req.params.id, req.body);
      res.json({
        success: true,
        data: brand
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await brandService.delete(req.params.id);
      res.json({
        success: true,
        message: 'Brand deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new BrandController();
