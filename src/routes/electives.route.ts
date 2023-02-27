import { Router } from 'express';
import {
  createElectives,
  getAllElectives,
  applyElective,
  updateElective,
  deleteElective,
} from '@controllers/electives.controller';
import { checkUserAuth } from '@middleware/auth.middleware';
const router = Router();

router.post('/', checkUserAuth, createElectives); // Create Elective
router.put('/applyelective', checkUserAuth, applyElective); // Create Elective

router.get('/', checkUserAuth, getAllElectives); // get all Elective

router.put('/:electiveId', checkUserAuth, updateElective); // Update Elective
router.delete('/:electiveId', checkUserAuth, deleteElective); // Hospital Delete

// Export
export default router;
