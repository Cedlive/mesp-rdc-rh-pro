
import { Router } from 'express';
import { SurveyController } from '../controllers/SurveyController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();
const controller = new SurveyController();

router.use(protect);
router.get('/', controller.getAll);
router.post('/', controller.create);

export default router;
