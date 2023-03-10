import { Request, Response } from 'express';
import Students from '@models/students.model';
// import Schools from '@models/schools.model';
import Student from '@/interfaces/students.interface';
import Auth from '@/interfaces/auth.interface';
// import School from '@/interfaces/schools.interface';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { BCRYPT_SALT, JWT_SECRET } from '@config';

/**
 * Create User - Signup
 * @param {object} req
 * @param {object} res
 */
export const createStudent = async (req: Request, res: Response): Promise<Response> => {
  const body: Student = req.body;

  try {
    const { email, password } = body; // Getting required fields from body
    const existingStudnet = await Students.findOne({ email }); // Finding already existing student

    // Extra Validations
    if (existingStudnet) {
      // If we found existing student in db
      return res.status(409).json({ success: false, message: 'Student already exists.' });
    }

    // Creating Studnet
    body.password = bcrypt.hashSync(password, BCRYPT_SALT); // Hashing the password with salt 8
    await Students.create(body); // Adding student in db

    // if (student.school) {
    //   // Add Student in School schema
    //   const school = await Schools.findById(student.school); // Finding school by id
    //   if (school) {
    //     school.students.push(student._id); // Adding student in school schema
    //     await school.save(); // Saving school schema
    //   } else {
    //     return res.status(409).json({ success: false, message: 'School does not exist' });
    //   }
    // }
    // // Done
    return res.json({ success: true, message: 'Student Created Successfully.' }); // Success
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const loginStudent = async (req: Request, res: Response): Promise<Response> => {
  const body: Auth = req.body;

  try {
    // Getting email and password
    const { email, password } = body;

    // Getting student from db
    const student = await Students.findOne({ email });

    if (!student) {
      // If student not found
      return res.status(404).json({ success: false, message: 'student not found' });
    } else if (!student.active) {
      // If student not found or not active
      return res.status(400).json({ success: false, message: 'Your account is not activated' });
    }

    // Comparing password
    const isMatched = bcrypt.compareSync(password, student.password);
    if (!isMatched) {
      // If password not matched
      return res.status(400).json({ success: false, message: 'Invalid Password' });
    }
    // Creating payload with admin object
    // @ts-expect-error
    delete student.password; // Removing password from student object
    const payload = { user: student };

    // Generating token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

    // done
    return res.json({ success: true, student, token });
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get all users
 * @param {object} _req
 * @param {object} res
 */
export const getAllStudents = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const students = await Students.find(); // Finding all the users from db
    return res.json({ success: true, students }); // Success
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get user by id
 * @param {object} req
 * @param {object} res
 */
export const getStudentById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const studentId = req.params.studentId; // Getting student by id from URL parameter
    const student = await Students.findById(studentId); // Finding studnet by id
    return res.json({ success: true, student }); // Success
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Update user
 * @param {object} req
 * @param {object} res
 */
export const updateStudent = async (req: Request, res: Response): Promise<Response> => {
  const body: Student = req.body;

  try {
    const studentId = req.params.studentId; // Getting studnet id from URL parameter

    // If user want to update it's password
    if (body.password) {
      body.password = bcrypt.hashSync(body.password, BCRYPT_SALT);
    }

    const student = await Students.findByIdAndUpdate(studentId, body, { new: true }); // Updating the student
    return res.json({ success: true, student }); // Success
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Delete user
 * @param {object} req
 * @param {object} res
 */
export const deleteStudent = async (req: Request, res: Response): Promise<Response> => {
  try {
    const studentId = req.params.studentId; // Getting student id from URL parameter
    const user = await Students.findByIdAndUpdate(studentId, { active: false }, { new: true }); // Deleting the student
    return res.json({ success: true, user }); // Success
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
