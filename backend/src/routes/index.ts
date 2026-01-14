
import { Router } from 'express';
import authRoutes from './auth.routes';
import employeeRoutes from './employee.routes';
import leaveRoutes from './leave.routes';
import settingsRoutes from './settings.routes';
import messageRoutes from './message.routes';
import announcementRoutes from './announcement.routes';
import trainingRoutes from './training.routes';
import documentRoutes from './document.routes';
import recruitmentRoutes from './recruitment.routes';
import payrollRoutes from './payroll.routes';
import expenseRoutes from './expense.routes';
import surveyRoutes from './survey.routes';
import mediaRoutes from './media.routes';
import communicationRoutes from './communication.routes';
import notificationRoutes from './notification.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/employees', employeeRoutes);
router.use('/leaves', leaveRoutes);
router.use('/settings', settingsRoutes);
router.use('/messages', messageRoutes);
router.use('/announcements', announcementRoutes);
router.use('/trainings', trainingRoutes);
router.use('/documents', documentRoutes);
router.use('/recruitment', recruitmentRoutes);
router.use('/payroll', payrollRoutes);
router.use('/expenses', expenseRoutes);
router.use('/surveys', surveyRoutes);
router.use('/media', mediaRoutes);
router.use('/comm', communicationRoutes);
router.use('/notifications', notificationRoutes);

export default router;
