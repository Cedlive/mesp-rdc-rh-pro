
import { Router } from 'express';
import { RecruitmentController } from '../controllers/RecruitmentController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();
const controller = new RecruitmentController();

router.use(protect);
router.get('/jobs', controller.getJobs);
router.get('/candidates', controller.getCandidates);
router.post('/candidates', controller.createCandidate);

export default router;
