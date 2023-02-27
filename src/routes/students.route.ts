import { Router } from 'express';
import {
  createStudent,
  loginStudent,
  updateStudent,
  getAllStudents,
  getStudentById,
  deleteStudent,
} from '@controllers/students.controller';
import { checkUserAuth } from '@middleware/auth.middleware';
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
router.get('/', checkUserAuth, getAllStudents); // Get all students at once
router.get('/:userId', checkUserAuth, getStudentById); // Get one student by it's id

// Update
router.put('/:userId', checkUserAuth, updateStudent); // Update a specific student by it's id

// Delete
router.delete('/:userId', checkUserAuth, deleteStudent); // delete a specific student by it's id

// Export
export default router;
