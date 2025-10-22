import { Router } from 'express';
import deviceControlController from '../controllers/device-control.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';
import { commandLimiter } from '../middleware/rateLimit';

const router = Router();

router.use(authenticate);

router.post(
  '/command',
  commandLimiter,
  authorize(UserRole.OPERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  deviceControlController.sendCommand
);

router.post('/refresh/:deviceId', deviceControlController.refreshStatus);
router.post('/refresh-all', authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN), deviceControlController.refreshAllStatuses);

export default router;
