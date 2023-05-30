import { Router } from 'express';
import {
  createElectives,
  getAllElectives,
  getAllElectivesOfHospital,
  getSingleElective,
  getAllAffiliatedElectives,
  getAllElectivesByHospital,
  applyElective,
  RemoveStudentFromElective,
  ExtendElective,
  updateElective,
  deleteElective,
} from '@controllers/electives.controller';
import { checkUserAuth } from '@middleware/auth.middleware';
const router = Router();

router.post('/', checkUserAuth, createElectives); // Create Elective
router.put('/applyelective', checkUserAuth, applyElective); // Create Elective
router.put('/deletestudent/:studentid', checkUserAuth, RemoveStudentFromElective); // Remove Student from elective by Hospital
router.put('/extendElective/:studentid', checkUserAuth, ExtendElective); // Remove Student from elective by Hospital

router.get('/', checkUserAuth, getAllElectivesOfHospital); // get all Elective of a hospital
router.get('/all', checkUserAuth, getAllElectives); // get all  Electives
router.get('/all/affiliated', checkUserAuth, getAllAffiliatedElectives); // get all affiliated Electives
router.get('/hospital/:hospitalId', checkUserAuth, getAllElectivesByHospital);
router.get('/:electiveId', checkUserAuth, getSingleElective); // get Single Elective

router.put('/:electiveId', checkUserAuth, updateElective); // Update Elective
router.put('/delete/:electiveId', checkUserAuth, deleteElective); // Hospital Delete

// Export
export default router;
