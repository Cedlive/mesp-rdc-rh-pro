
import { Router } from 'express';
import { LeaveController } from '../controllers/LeaveController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();
const controller = new LeaveController();

router.use(protect); // Toutes les routes nécessitent une authentification

router.get('/', controller.getAll);
router.post('/', controller.create);
router.patch('/:id/status', controller.updateStatus);

export default router;
