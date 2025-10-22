import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { authLimiter } from '../middleware/rateLimit';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/refresh', authLimiter, authController.refreshToken);
router.post('/logout', authController.logout);
router.get('/profile', authenticate, authController.getProfile);

export default router;
