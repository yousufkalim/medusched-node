import { Response } from 'express';
import Admins from '@models/admins.model';
import IRequest from '@interfaces/request.interface';
import Schools from '@models/schools.model';
import Students from '@models/students.model';
import Hospitals from '@models/hospitals.model';
import Admin from '@interfaces/admins.interface';
import School from '@interfaces/schools.interface';
import Student from '@interfaces/students.interface';
import { generateCSV } from '../utils/exportCSV';
import { sendCSVEmail } from '../utils/sendEmail';
import Auth from '@interfaces/auth.interface';
import bcrypt from 'bcryptjs';
import { JWT_SECRET, BCRYPT_SALT } from '@config';
import jwt from 'jsonwebtoken';

export const createSchool = async (req: IRequest, res: Response): Promise<Response> => {
  const body: School = req.body;
  const user = req.user as Admin;

  try {
    const { email, password } = body; // Getting required fields from body
    const { _id } = user;
    const admin = await Admins.findById(_id);

    if (!admin) {
      // If we found existing user in db
      return res.status(409).json({ success: false, message: 'Invalid Token' });
    }
    const existingSchool = await Schools.findOne({ email }); // Finding already existing school

    // Extra Validations
    if (existingSchool) {
      // If we found existing School in db
      return res.status(409).json({ success: false, message: 'School already exists.' });
    }
    body.password = bcrypt.hashSync(password, BCRYPT_SALT); // Hashing the password with salt 8

    // // Creating Hospital

    const school = await Schools.create({ ...body, admin: _id }); // Adding School in db

    // Done
    return res.json({ success: true, school }); // Success
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const updateSchool = async (req: IRequest, res: Response): Promise<Response> => {
  const body: School = req.body;

  try {
    const schoolId = req.params.schoolId; // Getting schoolId id from URL parameter

    const school = await Schools.findByIdAndUpdate(schoolId, body, { new: true }); // Updating the School
    return res.json({ success: true, school }); // Success
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getAllSchools = async (_req: IRequest, res: Response): Promise<Response> => {
  try {
    const schools = await Schools.find().populate('hospitals'); // Finding all the Schools from db
    return res.json({ success: true, schools }); // Success
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getAllSchoolsforUser = async (_req: IRequest, res: Response): Promise<Response> => {
  try {
    const schools = await Schools.find(); // Finding all the Schools from db
    return res.json({ success: true, schools }); // Success
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const deleteSchool = async (req: IRequest, res: Response): Promise<Response> => {
  try {
    const schoolId = req.params.schoolId; // Getting School id from URL parameter
    await Schools.findByIdAndDelete(schoolId); // Deleting the school

    await Students.deleteMany({ school: schoolId });

    // Update all hospitals that have the schoolId in their schools array
    await Hospitals.updateMany({ schools: schoolId }, { $pull: { schools: schoolId } });

    return res.json({ success: true }); // Success
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
export const sendCSVToSchool = async (req: IRequest, res: Response): Promise<Response> => {
  // const body: School = req.body;

  try {
    const schoolId = req.params.schoolId; // Getting schoolId id from URL parameter

    const school = await Schools.findById(schoolId).populate({
      path: 'students',
      populate: {
        path: 'electives', // Populate the "electives" field within the "students" field
      },
    }); // Updating the School

    if (school?.students) {
      console.log('aaaa', school.students);
      if (school?.students.length >= 1) {
        const csvPath = generateCSV(school?.students as Student[]);
        await sendCSVEmail(school?.name, school?.email, csvPath);
        return res.json({ success: true }); // Success
      } else {
        return res.status(409).json({ success: false, message: 'School has no students yet' });
      }
    } else {
      return res.status(409).json({ success: false, message: 'School has no students yet' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
export const loginSchool = async (req: IRequest, res: Response): Promise<Response> => {
  const body: Auth = req.body;

  try {
    // Getting email and password
    const { email, password } = body;

    // Getting Hospital from db
    const school = await Schools.findOne({ email });

    if (!school) {
      // If hospital not found
      return res.status(404).json({ success: false, message: 'School not found' });
    }
    // Comparing password
    const isMatched = bcrypt.compareSync(password, school.password);
    if (!isMatched) {
      // If password not matched
      return res.status(400).json({ success: false, message: 'Invalid Password' });
    }
    // Creating payload with admin object
    // @ts-expect-error
    delete school.password; // Removing password from Hospital object
    const payload = { user: school };

    // Generating token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

    // done
    return res.json({ success: true, user: { ...school }, token });
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
