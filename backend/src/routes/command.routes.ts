import { Router } from 'express';
import commandController from '../controllers/command.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';
import { commandLimiter } from '../middleware/rateLimit';

const router = Router();

router.use(authenticate);

router.post('/', commandLimiter, authorize(UserRole.OPERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN), commandController.create);
router.get('/device/:deviceId', commandController.getByDevice);
router.get('/:id', commandController.getById);

export default router;
