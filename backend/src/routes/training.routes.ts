
import { Router } from 'express';
import { TrainingController } from '../controllers/TrainingController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();
const controller = new TrainingController();

router.use(protect);
router.get('/', controller.getAll);
router.post('/', controller.create);

export default router;
