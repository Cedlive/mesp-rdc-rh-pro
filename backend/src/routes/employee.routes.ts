
import { Router } from 'express';
import { EmployeeController } from '../controllers/EmployeeController';
import { protect } from '../middlewares/authMiddleware';
import { restrictTo } from '../middlewares/roleMiddleware';

const router = Router();
const controller = new EmployeeController();

// Toutes les routes ci-dessous nécessitent d'être connecté
router.use(protect);

// GET /api/v1/employees
router.get('/', controller.getAll);

// GET /api/v1/employees/:id
router.get('/:id', controller.getById);

// POST /api/v1/employees (Créer un employé)
router.post('/', controller.create);

// PATCH /api/v1/employees/:id/status (Activer/Désactiver - Admin uniquement)
router.patch('/:id/status', restrictTo('Directeur RH', 'Administrateur', 'Responsable RH'), controller.updateStatus);

export default router;
