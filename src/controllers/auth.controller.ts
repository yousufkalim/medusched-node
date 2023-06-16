/**
 * User auth controllers
 * @author Yousuf Kalim
 */
import { Request, Response } from 'express';
import IRequest from '@interfaces/request.interface';
import Auth, { ChangePassword } from '@interfaces/auth.interface';
import Users from '@models/users.model';
import Hospitals from '@models/hospitals.model';
import Students from '@models/students.model';
import Schools from '@models/schools.model';
import Electives from '@models/electives.model';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { sendForgotEmail } from '@utils/sendEmail';
import { JWT_SECRET, BCRYPT_SALT, ORIGIN } from '@config';
import { sendEvaluationEmail } from '../utils/sendEmail';
import path from 'path';
import moment from 'moment';

/**
 * Login
 * @param {object} req
 * @param {object} res
 */
export const login = async (req: Request, res: Response): Promise<Response> => {
  const body: Auth = req.body;

  try {
    // Getting email and password
    const { email, password } = body;

    // Getting user from db
    const user = await Users.findOne({ email });

    if (!user) {
      // If user not found
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Comparing password
    const isMatched = bcrypt.compareSync(password, user.password);

    if (!isMatched) {
      // If password not matched
      return res.status(400).json({ success: false, message: 'Invalid Password' });
    }

    // Creating payload with user object
    // @ts-expect-error
    delete user.password; // Removing password from user object
    const payload = { user };

    // Generating token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

    return res.json({ success: true, user, token });
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Change Password
 * @param {object} req
 * @param {object} res
 */
export const changePassword = async (req: Request, res: Response): Promise<Response> => {
  const { userId } = req.params;
  const body: ChangePassword = req.body;

  try {
    const { oldPassword, newPassword, confirmPassword } = body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password and confirm password are not same',
      });
    }

    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatched = bcrypt.compareSync(oldPassword, user.password);

    if (!isMatched) {
      return res.status(400).json({ success: false, message: 'Invalid old Password' });
    }

    // Generate token
    user.password = bcrypt.hashSync(newPassword, BCRYPT_SALT);

    await user.save();

    return res.json({ success: true, user });
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Confirm auth
 * @param {object} req
 * @param {object} res
 */
export const confirmAuth = (req: IRequest, res: Response): Response => {
  // If user authenticated
  return res.json({ success: true, user: req.user });
};

/**
 * Forgot password
 * @param {object} req
 * @param {object} res
 */
export const forgot = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email } = req.params;
    console.log('email', req?.body?.role);

    if (req.body.role === 'Hospital') {
      const hospital = await Hospitals.findOne({ email });
      if (!hospital) {
        return res.status(404).json({ success: false, message: 'Hospital not found' });
      }
      // Generating token
      const token = jwt.sign({ user: hospital }, JWT_SECRET, { expiresIn: '15m' });
      // Sending email to hospital
      await sendForgotEmail(email, `${ORIGIN}/reset/${token}`);
      // Done
      return res.json({ success: true, message: 'Email sent successfully' });
    } else {
      const student = await Students.findOne({ email });
      const school = await Schools.findOne({ email });

      if (student) {
        console.log('student', student);
        if (!student.active) {
          // If student not found or not active
          return res.status(400).json({ success: false, message: 'Account not active' });
        }
        // Generating token
        const token = jwt.sign({ user: student }, JWT_SECRET, { expiresIn: '15m' });
        console.log('token2222', token, email);
        // Sending email to hospital
        await sendForgotEmail(email, `${ORIGIN}/reset/${token}`);
        // Done
        return res.json({ success: true, message: 'Email sent successfully' });
      } else if (school) {
        console.log('school', school);
        if (!school.active) {
          // If student not found or not active
          return res.status(400).json({ success: false, message: 'Account not active' });
        }
        // Generating token
        const token = jwt.sign({ user: school }, JWT_SECRET, { expiresIn: '15m' });
        console.log('token2222 school', token, email);
        // Sending email to hospital
        await sendForgotEmail(email, `${ORIGIN}/reset/${token}`);
      } else {
        return res.status(404).json({ success: false, message: 'user not found' });
      }
      return res.json({ success: true, message: 'Email sent successfully' });
    }
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Forgot password
 * @param {object} req
 * @param {object} res
 */
export const evaluationemail = async (req: IRequest, res: Response): Promise<Response> => {
  try {
    const { email, id, electiveId } = req.body;
    const student = await Students.findById(id);
    if (!student) {
      return res.status(409).json({
        success: false,
        message: 'Student Not Found',
      });
    }
    const elective = await Electives.findById(electiveId);
    if (!elective) {
      return res.status(409).json({
        success: false,
        message: 'Elective Not Found',
      });
    }

    // Sending email to hospital
    // attachment path
    const attachmentPath = path.join(
      __dirname,
      '..',
      '..',
      'src',
      'utils',
      `assementmedusched.pdf`,
    );
    const studentName = student?.name;
    const ElectiveName = elective?.title;
    const startDate = moment(elective?.start_date).format('MM-DD-YYYY');
    const duration = elective?.duration;

    await sendEvaluationEmail(
      email,
      attachmentPath,
      studentName,
      ElectiveName,
      startDate,
      duration,
    );
    // Done
    return res.json({ success: true, message: 'Email sent successfully' });
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const verifyToken = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    console.log(decoded, 'decoded');
    if (decoded?.user?.role === 'Hospital') {
      const hospital = await Hospitals.findById(decoded?.user?._id);

      return res.status(200).json({
        success: true,
        message: 'Token verified successfully',
        userId: hospital?._id,
      });
    } else if (decoded?.user?.role === 'student') {
      const student = await Students.findById(decoded?.user?._id);

      console.log('user', student);
      return res.status(200).json({
        success: true,
        message: 'Token verified successfully',
        userId: student?._id,
      });
    } else if (decoded?.user?.role === 'school') {
      const school = await Schools.findById(decoded?.user?._id);

      console.log('user', school);
      return res.status(200).json({
        success: true,
        message: 'Token verified successfully',
        userId: school?._id,
      });
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
export const resetPassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const hospital = await Hospitals.findById(decoded.user._id);
    const student = await Students.findById(decoded.user._id);
    const school = await Schools.findById(decoded.user._id);
    if (student) {
      student.password = bcrypt.hashSync(req.body.password, 10);
      student.active = true;
      await student.save();
      return res
        .status(200)
        .json({ success: true, message: 'Password updated successfully', role: student.role });
    } else if (hospital) {
      hospital.password = bcrypt.hashSync(req.body.password, 10);
      hospital.active = true;
      await hospital.save();
      return res
        .status(200)
        .json({ success: true, message: 'Password updated successfully', role: hospital.role });
    } else if (school) {
      school.password = bcrypt.hashSync(req.body.password, 10);
      school.active = true;
      await school.save();
      return res
        .status(200)
        .json({ success: true, message: 'Password updated successfully', role: school.role });
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
