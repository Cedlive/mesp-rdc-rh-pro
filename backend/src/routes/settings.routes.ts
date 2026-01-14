
import { Router } from 'express';
import { SettingsController } from '../controllers/SettingsController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();
const controller = new SettingsController();

router.get('/', controller.getSettings); // Public (pour afficher le logo au login)
router.patch('/', protect, controller.updateSettings); // Protégé

export default router;
