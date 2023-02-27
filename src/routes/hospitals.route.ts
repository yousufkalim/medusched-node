import { Router } from 'express';
import {
  registerHospital,
  getAllHospital,
  loginHospital,
  updateHospital,
  deleteHospital,
  getSingleHospital,
} from '@controllers/hospitals.controller';
import { checkAdminAuth , checkUserAuth } from '@middleware/auth.middleware';
const router = Router();

router.post('/', checkAdminAuth, registerHospital); // Create - Hospital Signup

router.get('/', checkAdminAuth, getAllHospital); // Get all Hospital
router.get('/:hospitalId', checkAdminAuth, getSingleHospital); // Get single Hospital

router.post('/login', loginHospital); // Hospital Login
router.put('/:hospitalId', checkUserAuth, updateHospital); // Hospital Update
router.delete('/:hospitalId', checkUserAuth, deleteHospital); // Hospital Delete

// Export
export default router;
