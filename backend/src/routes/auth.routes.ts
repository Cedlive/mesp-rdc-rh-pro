
import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const router = Router();
const controller = new AuthController();

// POST /api/v1/auth/login
router.post('/login', controller.login);

// POST /api/v1/auth/register (Optionnel, si inscription ouverte)
router.post('/register', controller.register);

export default router;
