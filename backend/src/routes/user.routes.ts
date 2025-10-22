import { Router } from 'express';
import userController from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

router.use(authenticate);
router.use(authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN));

router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.post('/', userController.create);
router.put('/:id', userController.update);
router.patch('/:id/password', userController.changePassword);
router.delete('/:id', authorize(UserRole.SUPER_ADMIN), userController.delete);

export default router;
