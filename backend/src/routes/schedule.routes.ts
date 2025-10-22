import { Router } from 'express';
import scheduleController from '../controllers/schedule.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

router.use(authenticate);

router.get('/', scheduleController.getAll);
router.get('/:id', scheduleController.getById);
router.post('/', authorize(UserRole.OPERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN), scheduleController.create);
router.put('/:id', authorize(UserRole.OPERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN), scheduleController.update);
router.delete('/:id', authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN), scheduleController.delete);

export default router;
