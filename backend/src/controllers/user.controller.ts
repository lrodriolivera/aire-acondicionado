import { Response, NextFunction } from 'express';
import userService from '../services/user.service';
import { AuthRequest } from '../middleware/auth';

export class UserController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAll();

      res.json({
        success: true,
        data: users
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await userService.getById(req.params.id);

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await userService.create(req.body);

      res.status(201).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await userService.update(req.params.id, req.body);

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { newPassword } = req.body;
      await userService.changePassword(req.params.id, newPassword);

      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await userService.delete(req.params.id);

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
