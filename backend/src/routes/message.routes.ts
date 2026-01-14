
import { Router } from 'express';
import { MessageController } from '../controllers/MessageController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();
const controller = new MessageController();

router.use(protect);

router.get('/', controller.getMyMessages);
router.post('/', controller.send);

export default router;
