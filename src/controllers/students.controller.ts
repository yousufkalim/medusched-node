import { Request, Response } from 'express';
import Students from '@models/students.model';
import Schools from '@models/schools.model';
import Hospitals from '@models/hospitals.model';
import Electives from '@models/electives.model';
import Student from '@/interfaces/students.interface';
import Auth from '@/interfaces/auth.interface';
import School from '@/interfaces/schools.interface';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { BCRYPT_SALT, JWT_SECRET } from '@config';
import IRequest from '@interfaces/request.interface';
// import { BCRYPT_SALT, JWT_SECRET, ORIGIN } from '@config';
// import { verifyStudent } from '@/utils/sendEmail';

/**
 * Create User - Signup
 * @param {object} req
 * @param {object} res
 */
export const createStudent = async (req: Request, res: Response): Promise<Response> => {
  const body: Student = req.body;

  try {
    const { email, password, school } = body; // Getting required fields from body
    const existingStudnet = await Students.findOne({ email }); // Finding already existing student
    const existingEmailInSchool = await Schools.findOne({ email }); // Finding already existing school
    const existingEmailInHospital = await Hospitals.findOne({ email }); // Finding already existing school

    // Extra Validations
    if (existingStudnet) {
      // If we found existing student in db
      return res.status(409).json({ success: false, message: 'Student already exists.' });
    }
    // Extra Validations
    if (existingEmailInSchool) {
      // If we found existing student in db
      return res.status(409).json({ success: false, message: 'Email exists in school' });
    }
    // Extra Validations
    if (existingEmailInHospital) {
      // If we found existing student in db
      return res.status(409).json({ success: false, message: 'Email exists in hospital' });
    }

    // Creating Studnet
    body.password = bcrypt.hashSync(password, BCRYPT_SALT); // Hashing the password with salt 8
    const student = await Students.create(body); // Adding student in db

    // Add Student in School schema
    const getSchool = await Schools.findById(school); // Finding school by id
    if (getSchool) {
      getSchool.students.push(student._id); // Adding student in school schema
      await getSchool.save(); // Saving school schema
    } else {
      return res.status(409).json({ success: false, message: 'School does not exist' });
    }
    // const token = jwt.sign({ user: student }, JWT_SECRET, { expiresIn: '15m' });
    // await verifyStudent(email, `${ORIGIN}/verify/${token}`);

    // // Done
    return res.json({ success: true, message: 'Student Created Successfully.Please Verify' }); // Success
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
    const { email, password } = body;
    let payload;
    let userRole;

    const student = await Students.findOne({ email });
    const school = await Schools.findOne({ email });
    if (student) {
      console.log('student', student);
      if (!student.active) {
        // If student not found or not active
        return res.status(400).json({ success: false, message: 'Account not active' });
      }
      const isMatched = bcrypt.compareSync(password, student.password);
      if (!isMatched) {
        return res.status(400).json({ success: false, message: 'Invalid Password' });
      }
      // @ts-expect-error
      delete student.password;
      payload = { user: student };
      userRole = student.role;
    } else if (school) {
      console.log('school', school);
      if (!school.active) {
        // If student not found or not active
        return res.status(400).json({ success: false, message: 'Account not active' });
      }
      const isMatched = bcrypt.compareSync(password, school.password);
      if (!isMatched) {
        return res.status(400).json({ success: false, message: 'Invalid Password' });
      }
      // @ts-expect-error
      delete school.password;
      payload = { user: school };
      userRole = school.role;
    } else {
      return res.status(404).json({ success: false, message: 'user not found' });
    }

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
    // done
    return res.json({ success: true, userRole, token });
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
    const users = await Students.find().populate('school'); // Finding all the users from db
    return res.json({ success: true, users }); // Success
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
    const studentId = req.params.userId; // Getting student by id from URL parameter
    console.log('std', studentId);
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
    console.log('studentId', studentId);

    // If user want to update it's password
    if (body.password) {
      body.password = bcrypt.hashSync(body.password, BCRYPT_SALT);
    }
    if (req.file) {
      req.body.logo = req.file.path;
    }

    const student = await Students.findByIdAndUpdate(studentId, body, { new: true }); // Updating the student
    console.log('studentId2', student);
    return res.json({ success: true, student }); // Success
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Activate user
 * @param {object} req
 * @param {object} res
 */
export const ActivateStudent = async (req: Request, res: Response): Promise<Response> => {
  const body: Student = req.body;

  try {
    const studentId = req.params.studentId; // Getting studnet id from URL parameter

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
    console.log('studentId', studentId);
    await Electives.updateMany(
      { 'students.studentId': studentId },
      { $pull: { students: { studentId } } },
    );

    //  remove student from school
    await Schools.updateOne({ students: studentId }, { $pull: { students: studentId } });

    const user = await Students.findByIdAndDelete(studentId); // Deleting the student

    // when student delete pop student id from array of elective if exists

    return res.json({ success: true, user }); // Success
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const VerifyStudent = async (req: Request, res: Response): Promise<Response> => {
  try {
    console.log('student112');
    const { token } = req.params;
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const student = await Students.findById(decoded.user._id);
    console.log('student11', student);
    if (student) {
      student.active = true;
      await student.save();
      return res.status(200).json({ success: true, message: 'Student Verify Successfully' });
    } else {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const resetStudentPassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    const studentId = req.params.studentId;
    const { oldPassword, newPassword } = req.body; // Getting student id from URL parameter
    console.log('studentId', studentId);
    const student = await Students.findById(studentId); // Deleting the student
    if (!student) {
      return res.status(404).json({ success: false, message: 'student not found' });
    }
    const isMatched = bcrypt.compareSync(oldPassword, student.password);
    if (!isMatched) {
      return res.status(400).json({ success: false, message: 'Old Password not Correct' });
    }
    const password = bcrypt.hashSync(newPassword, BCRYPT_SALT);
    await Students.findByIdAndUpdate(studentId, { password }, { new: true });
    // if a student register with school 1 then what we do if student(have electives) delete that link with school 1

    return res.json({ success: true }); // Success
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getStudentsforSchool = async (_req: IRequest, res: Response): Promise<Response> => {
  const school = _req.user as School;
  try {
    const { _id } = school;
    const students = await Students.find({
      school: _id,
    }).sort({ start_date: 1 }); // Finding all the Electives from db

    return res.json({ success: true, students }); // Success
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
