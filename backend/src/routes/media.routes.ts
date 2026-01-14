
import { Router } from 'express';
import { MediaController } from '../controllers/MediaController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();
const controller = new MediaController();

router.use(protect);

// POST /api/v1/media/upload
router.post('/upload', controller.upload);

// GET /api/v1/media/my-files
router.get('/my-files', controller.getMyFiles);

export default router;
