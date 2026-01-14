
import { Router } from 'express';
import { AnnouncementController } from '../controllers/AnnouncementController';
import { protect } from '../middlewares/authMiddleware';
import { restrictTo } from '../middlewares/roleMiddleware';

const router = Router();
const controller = new AnnouncementController();

router.use(protect);

router.get('/', controller.getAll);
router.post('/', restrictTo('Directeur RH', 'Administrateur', 'Communication'), controller.create);
router.delete('/:id', restrictTo('Directeur RH', 'Administrateur'), controller.delete);

export default router;
