import { Router } from 'express';
import telemetryController from '../controllers/telemetry.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/device/:deviceId', telemetryController.getByDevice);
router.get('/device/:deviceId/latest', telemetryController.getLatest);
router.get('/device/:deviceId/aggregated', telemetryController.getAggregated);
router.get('/device/:deviceId/consumption', telemetryController.getConsumptionStats);

export default router;
