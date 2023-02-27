import { Router } from 'express';
import {
  createSchool,
  getAllSchools,
  updateSchool,
  deleteSchool,
} from '@controllers/schools.controller';
import { checkAdminAuth } from '@middleware/auth.middleware';
const router = Router();

router.post('/', checkAdminAuth, createSchool); // Create - School
router.get('/', checkAdminAuth, getAllSchools); // Get all - School
router.put('/:schoolId', checkAdminAuth, updateSchool); // School Update
router.delete('/:schoolId', checkAdminAuth, deleteSchool); // School Delete

// Export
export default router;
