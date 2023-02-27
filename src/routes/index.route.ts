/**
 * All api routes handles here
 * @author Yousuf Kalim
 */
import { Router } from 'express';
import adminRoutes from './admins.route';
import hospitalRoutes from './hospitals.route';
import schoolRoutes from './schools.route';
import electiveRoutes from './electives.route';
import studentRoutes from './students.route';
import userRoutes from './users.route';
import authRoutes from './auth.route';
const router = Router();

// Parent Routes
router.use('/admins', adminRoutes); // All the Adim routes
router.use('/hospitals', hospitalRoutes); // All the Hospitals routes
router.use('/schools', schoolRoutes); // All the Schools routes
router.use('/electives', electiveRoutes); // All the Electives routes
router.use('/students', studentRoutes); // All the Electives routes
router.use('/users', userRoutes); // All the user routes
router.use('/auth', authRoutes); // All the auth routes

// Export
export default router;
