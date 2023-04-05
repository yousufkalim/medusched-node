import { Router } from 'express';
import {
  createElectives,
  getAllElectives,
  getAllElectivesOfHospital,
  getAllElectivesByHospital,
  getSingleElective,
  applyElective,
  updateElective,
  deleteElective,
} from '@controllers/electives.controller';
import { checkUserAuth } from '@middleware/auth.middleware';
const router = Router();

router.post('/', checkUserAuth, createElectives); // Create Elective
router.put('/applyelective', checkUserAuth, applyElective); // Create Elective

router.get('/', checkUserAuth, getAllElectivesOfHospital); // get all Elective of a hospital
router.get('/all', checkUserAuth, getAllElectives); // get all Elective
router.get('/hospital/:hospitalId', checkUserAuth, getAllElectivesByHospital); // get all Electives by hospital
router.get('/:electiveId', checkUserAuth, getSingleElective); // get Single Elective

router.put('/:electiveId', checkUserAuth, updateElective); // Update Elective
router.put('/delete/:electiveId', checkUserAuth, deleteElective); // Hospital Delete

// Export
export default router;
