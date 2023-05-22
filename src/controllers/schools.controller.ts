import { Response } from 'express';
import Admins from '@models/admins.model';
import IRequest from '@interfaces/request.interface';
import Schools from '@models/schools.model';
import Admin from '@interfaces/admins.interface';
import School from '@interfaces/schools.interface';
import Student from '@interfaces/students.interface';
import { generateCSV } from '../utils/exportCSV';
import { sendCSVEmail } from '../utils/sendEmail';

export const createSchool = async (req: IRequest, res: Response): Promise<Response> => {
  const body: School = req.body;
  const user = req.user as Admin;

  try {
    const { email } = body; // Getting required fields from body
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
    const schools = await Schools.find(); // Finding all the Schools from db
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
    await Schools.findByIdAndUpdate(
      schoolId,
      {
        active: false,
      },
      { new: true },
    ); // Deleting the school
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
