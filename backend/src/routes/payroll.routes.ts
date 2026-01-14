
import { Router } from 'express';
import { PayrollController } from '../controllers/PayrollController';
import { protect } from '../middlewares/authMiddleware';
import { restrictTo } from '../middlewares/roleMiddleware';

const router = Router();
const controller = new PayrollController();

router.use(protect);
router.get('/', restrictTo('Directeur RH', 'Comptable', 'Administrateur'), controller.getAll);
router.post('/generate', restrictTo('Directeur RH', 'Comptable', 'Administrateur'), controller.generate);

export default router;
