import { Router } from 'express';
import deviceController from '../controllers/device.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

router.use(authenticate);

router.get('/stats', deviceController.getStats);
router.get('/', deviceController.getAll);
router.get('/:id', deviceController.getById);
router.post('/', authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN), deviceController.create);
router.put('/:id', authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.OPERATOR), deviceController.update);
router.delete('/:id', authorize(UserRole.SUPER_ADMIN), deviceController.delete);

export default router;
