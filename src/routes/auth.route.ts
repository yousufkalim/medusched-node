/**
 * User auth routes
 * @author Yousuf Kalim
 */
import { Router } from 'express';
import {
  login,
  confirmAuth,
  changePassword,
  forgot,
  evaluationemail,
  verifyToken,
  resetPassword,
} from '@controllers/auth.controller';
import { checkUserAuth } from '@middleware/auth.middleware';
import { validateLogin, isValidated } from '@middleware/validations.middleware';
const router = Router();

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post user login
 * @method get check auth
 * @method put change password
 * @method post forgot email
 */

// Read
router.post('/login', validateLogin, isValidated, login); // Get all users at once
router.get('/', checkUserAuth, confirmAuth); // Check user auth
router.put('/password/:userId', checkUserAuth, changePassword); // Change password route
router.put('/forgot/:email', forgot); // Forgot  password
router.post('/evaluationemail', evaluationemail); // evaluationmail
router.get('/verifyToken/:token', verifyToken); // VerifyToken
router.put('/reset/:token', resetPassword); // ResetPassword password

// Export
export default router;
