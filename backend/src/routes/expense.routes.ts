
import { Router } from 'express';
import { ExpenseController } from '../controllers/ExpenseController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();
const controller = new ExpenseController();

router.use(protect);
router.get('/', controller.getAll);
router.post('/', controller.create);

export default router;
