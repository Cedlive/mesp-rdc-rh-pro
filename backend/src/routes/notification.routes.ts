
import { Router } from 'express';
import { NotificationController } from '../controllers/NotificationController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();
const controller = new NotificationController();

router.use(protect);
router.get('/', controller.getAll);
router.patch('/:id/read', controller.markRead);

export default router;
