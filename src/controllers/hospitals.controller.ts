import { Request, Response } from 'express';
import Admins from '@models/admins.model';
import Hospitals from '@models/hospitals.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import IRequest from '@interfaces/request.interface';
import Hospital from '@interfaces/hospitals.interface';
import Admin from '@interfaces/admins.interface';
import { JWT_SECRET, BCRYPT_SALT } from '@config';
import Auth from '@interfaces/auth.interface';

export const registerHospital = async (req: IRequest, res: Response): Promise<Response> => {
  const body: Hospital = req.body;
  const user = req.user as Admin;

  try {
    const { email, password } = body; // Getting required fields from body
    const { _id } = user;
    const admin = await Admins.findById(_id);

    if (!admin) {
      // If we found existing user in db
      return res.status(409).json({ success: false, message: 'Invalid Token' });
    }
    const existingHospital = await Hospitals.findOne({ email }); // Finding already existing hospital

    // Extra Validations
    if (existingHospital) {
      // If we found existing Hospital in db
      return res.status(409).json({ success: false, message: 'Hospital already exists.' });
    }

    // // Creating Hospital

    body.password = bcrypt.hashSync(password, BCRYPT_SALT); // Hashing the password with salt 8
    const hospital = await Hospitals.create({ ...body, admin: _id }); // Adding New Hospital in db
    // Done
    return res.json({ success: true, hospital }); // Success
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
export const updateHospital = async (req: IRequest, res: Response): Promise<Response> => {
  const body: Hospital = req.body;

  try {
    const hospitalId = req.params.hospitalId; // Getting hospitalId from URL parameter

    // If Hospital user want to update it's password
    if (body.password) {
      body.password = bcrypt.hashSync(body.password, BCRYPT_SALT);
    }

    const hospital = await Hospitals.findByIdAndUpdate(hospitalId, body, { new: true }); // Updating the Hospital user
    return res.json({ success: true, user: { ...hospital } }); // Success
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const loginHospital = async (req: IRequest, res: Response): Promise<Response> => {
  const body: Auth = req.body;

  try {
    // Getting email and password
    const { email, password } = body;

    // Getting Hospital from db
    const hospital = await Hospitals.findOne({ email });

    if (!hospital) {
      // If hospital not found
      return res.status(404).json({ success: false, message: 'hospital not found' });
    } else if (!hospital.active) {
      // If hospital not found or not active
      return res.status(400).json({ success: false, message: 'Your account is not activated' });
    }

    // Comparing password
    const isMatched = bcrypt.compareSync(password, hospital.password);
    if (!isMatched) {
      // If password not matched
      return res.status(400).json({ success: false, message: 'Invalid Password' });
    }
    // Creating payload with admin object
    // @ts-expect-error
    delete hospital.password; // Removing password from Hospital object
    const payload = { user: hospital };

    // Generating token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

    // done
    return res.json({ success: true, user: { ...hospital }, token });
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getAllHospital = async (_req: IRequest, res: Response): Promise<Response> => {
  try {
    const hospitals = await Hospitals.find().populate('schools'); // Finding all the users from db
    return res.json({ success: true, hospitals }); // Success
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
export const getSingleHospital = async (req: IRequest, res: Response): Promise<Response> => {
  try {
    const hospitalId = req.params.hospitalId;
    const hospital = await Hospitals.findById(hospitalId).populate('schools'); // Finding all the users from db
    return res.json({ success: true, user: { ...hospital } }); // Success
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
export const deleteHospital = async (req: Request, res: Response): Promise<Response> => {
  try {
    const hopitalId = req.params.hopitalId; // Getting hospital id from URL parameter
    console.log('hopitalId', hopitalId);
    await Hospitals.findByIdAndUpdate(
      hopitalId,
      {
        active: false,
      },
      { new: true },
    ); // Deleting the hospital
    return res.json({ success: true }); // Success
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
