import { Router } from 'express';
import alertController from '../controllers/alert.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

router.use(authenticate);

router.get('/stats', alertController.getStats);
router.get('/', alertController.getAll);
router.get('/:id', alertController.getById);
router.post('/', authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN), alertController.create);
router.patch('/:id/acknowledge', alertController.acknowledge);
router.patch('/:id/resolve', authorize(UserRole.OPERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN), alertController.resolve);
router.delete('/:id', authorize(UserRole.SUPER_ADMIN), alertController.delete);

export default router;
