
import { Router } from 'express';
import { DocumentController } from '../controllers/DocumentController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();
const controller = new DocumentController();

router.use(protect);
router.get('/', controller.getAll);
router.post('/', controller.create);

export default router;
