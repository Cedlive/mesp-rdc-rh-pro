
import { Router } from 'express';
import { CommunicationController } from '../controllers/CommunicationController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();
const controller = new CommunicationController();

router.use(protect);

// Calls
router.post('/calls/start', controller.startCall);
router.patch('/calls/:id/end', controller.endCall);
router.get('/calls/history', controller.getHistory);

// Messaging
router.post('/messages', controller.sendMessage);
router.get('/messages/:contactId', controller.getMessages);
router.patch('/messages/:contactId/read', controller.markRead);

export default router;
