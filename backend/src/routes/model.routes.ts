import { Router } from 'express';
import modelController from '../controllers/model.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

router.use(authenticate);

router.get('/', modelController.getAll);
router.get('/:id', modelController.getById);
router.post('/', authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN), modelController.create);
router.put('/:id', authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN), modelController.update);
router.delete('/:id', authorize(UserRole.SUPER_ADMIN), modelController.delete);

export default router;
