import { Router } from 'express';
import brandController from '../controllers/brand.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

router.get('/', brandController.getAll);
router.get('/:id', brandController.getById);
router.post('/', authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN), brandController.create);
router.put('/:id', authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN), brandController.update);
router.delete('/:id', authorize(UserRole.SUPER_ADMIN), brandController.delete);

export default router;
