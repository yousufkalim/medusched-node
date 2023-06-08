import { Router } from 'express';
import {
  createSchool,
  getAllSchools,
  getAllSchoolsforUser,
  updateSchool,
  deleteSchool,
  sendCSVToSchool,
} from '@controllers/schools.controller';
import { checkAdminAuth } from '@middleware/auth.middleware';
const router = Router();

router.post('/', checkAdminAuth, createSchool); // Create - School
router.get('/', checkAdminAuth, getAllSchools); // Get all - School
router.get('/forusers', getAllSchoolsforUser); // Get all - School
router.put('/:schoolId', checkAdminAuth, updateSchool); // School Update
router.delete('/:schoolId', checkAdminAuth, deleteSchool); // School Delete
// send CSV mail
router.post('/sendcsv/:schoolId', checkAdminAuth, sendCSVToSchool); // Get all - School

// Export
export default router;
