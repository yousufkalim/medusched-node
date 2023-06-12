/**
 * Admin CRUD routes
 * @author Yousuf Kalim
 */
import { Router } from 'express';
import { register, login, confirmAuth, resetAdminPassword } from '@controllers/admins.controller';
import { checkAdminAuth } from '@middleware/auth.middleware';
// import { checkUserAuth } from '@middleware/auth.middleware';
const router = Router();

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post admin signup
 * @method post admin login
 * @method get check admin auth
 */
router.post('/', register); // Create - Admin Signup

router.post('/login', login); // Admin Login
router.get('/auth', checkAdminAuth, confirmAuth); // Check admin auth

router.put('/resetPassword', checkAdminAuth, resetAdminPassword); // Hospital Delete

// Export
export default router;
