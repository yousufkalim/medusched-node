import { Router } from 'express';
import {
  createStudent,
  loginStudent,
  updateStudent,
  getAllStudents,
  getStudentById,
  deleteStudent,
  ActivateStudent,
  VerifyStudent,
  resetStudentPassword,
  getStudentsforSchool,
} from '@controllers/students.controller';
import { checkUserAuth } from '@middleware/auth.middleware';
import { upload } from '../middleware/multer.middleware';
const router = Router();

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post user signup
 * @method get get all users
 * @method get get user by id
 * @method put update user
 * @method delete delete user
 */

// Create - User Signup
router.post('/', createStudent);

router.post('/login', loginStudent); // Hospital Login

// Read
router.get('/schoolStudents', checkUserAuth, getStudentsforSchool); // Get all students at once
router.get('/', checkUserAuth, getAllStudents); // Get all students at once
router.get('/:userId', checkUserAuth, getStudentById); // Get one student by it's id

// Update
router.put('/:studentId', checkUserAuth, upload.single('logo'), updateStudent); // Update a specific student by it's id

// Delete
router.delete('/:studentId', checkUserAuth, deleteStudent); // delete a specific student by it's id
router.put('/activate/:studentId', checkUserAuth, ActivateStudent); // delete a specific student by it's id

router.put('/verifystudent/:token', VerifyStudent); // Verify Student

router.put('/resetPassword/:studentId', checkUserAuth, resetStudentPassword); // Hospital Delete

// Export
export default router;
