import { Response, NextFunction } from 'express';
import commandService from '../services/command.service';
import { AuthRequest } from '../middleware/auth';

export class CommandController {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { deviceId, commandType, parameters } = req.body;
      const userId = req.user!.userId;

      const command = await commandService.create(deviceId, userId, commandType, parameters);

      res.status(201).json({
        success: true,
        data: command
      });
    } catch (error) {
      next(error);
    }
  }

  async getByDevice(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { deviceId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;

      const commands = await commandService.getByDevice(deviceId, limit);

      res.json({
        success: true,
        data: commands
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const command = await commandService.getById(req.params.id);

      res.json({
        success: true,
        data: command
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CommandController();
