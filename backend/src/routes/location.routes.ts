import { Router } from 'express';
import locationController from '../controllers/location.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

router.use(authenticate);

router.get('/', locationController.getAll);
router.get('/tree', locationController.getTree);
router.get('/:id', locationController.getById);
router.post('/', authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN), locationController.create);
router.put('/:id', authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN), locationController.update);
router.delete('/:id', authorize(UserRole.SUPER_ADMIN), locationController.delete);

export default router;
