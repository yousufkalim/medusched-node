import { Response } from 'express';
import IRequest from '@interfaces/request.interface';
import Hospitals from '@models/hospitals.model';
import Electives from '@models/electives.model';
import Students from '@models/students.model';
import Hospital from '@interfaces/hospitals.interface';
import Elective from '@interfaces/electives.interface';
import ApplyElective from '@interfaces/applyelectives.interface';

export const createElectives = async (req: IRequest, res: Response): Promise<Response> => {
  const user = req.user as Hospital;

  try {
    const { _id } = user;
    const hospital = await Hospitals.findById(_id);

    if (!hospital) {
      // If we not found existing Hospital in db
      return res
        .status(409)
        .json({ success: false, message: 'Invalid Token or Hospital not exists' });
    }

    // // Creating Elective
    // const elective = new Electives({
    //   ...req.body,
    //   hospital: _id,
    // });
    // console.log('3');
    // await elective.save();
    const elective = await Electives.create({ ...req.body, hospital: _id }); // Adding New Elective in db
    console.log('4');
    // Done
    return res.json({ success: true, elective }); // Success
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const updateElective = async (req: IRequest, res: Response): Promise<Response> => {
  const body: Elective = req.body;
  try {
    const electiveId = req.params.electiveId; // Getting electiveId id from URL parameter

    const elective = await Electives.findByIdAndUpdate(electiveId, body, { new: true }); // Updating the elective
    return res.json({ success: true, elective }); // Success
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
export const applyElective = async (req: IRequest, res: Response): Promise<Response> => {
  const body: ApplyElective = req.body;
  try {
    const { studentId, electiveId, phone, name } = body;
    console.log(studentId, electiveId, name);
    if (!studentId) {
      return res
        .status(409)
        .json({ success: false, message: 'Invalid Student Id or Student not exists' });
    }
    if (!electiveId) {
      return res
        .status(409)
        .json({ success: false, message: 'Invalid electiveId Id or elective not exists' });
    }
    await Students.findByIdAndUpdate(studentId, { phone, name }, { new: true }); // Updating the student data
    const a = await Students.findByIdAndUpdate(
      studentId,
      { $push: { electives: electiveId } },
      { new: true },
    );
    console.log('a is', a);

    await Electives.findByIdAndUpdate(
      electiveId,
      { $push: { students: studentId } },
      { new: true },
    ); // Updating the elective
    return res.json({ success: true, message: 'Applied successfully' }); // Success
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getAllElectives = async (req: IRequest, res: Response): Promise<Response> => {
  // const hospital = req.user as Hospital;
  try {
    // const { _id } = hospital;
    const electives = await Electives.find({}); // Finding all the Electives from db

    // Here we can fing electives of specific hospital or all electives related to specific hospital.

    // const { _id } = user;
    // const electives = await Electives.find({
    //   hospital: _id,
    // }); // Finding electives of specific hospital
    return res.json({ success: true, electives }); // Success
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
export const getAllElectivesByHospital = async (
  req: IRequest,
  res: Response,
): Promise<Response> => {
  const hospital = req.user as Hospital;
  try {
    const { _id } = hospital;
    const electives = await Electives.find({
      hospital: _id,
    }); // Finding all the Electives from db

    // Here we can fing electives of specific hospital or all electives related to specific hospital.

    // const { _id } = user;
    // const electives = await Electives.find({
    //   hospital: _id,
    // }); // Finding electives of specific hospital
    return res.json({ success: true, electives }); // Success
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
export const getSingleElective = async (req: IRequest, res: Response): Promise<Response> => {
  try {
    const electiveId = req.params.electiveId; // Getting Elective id from URL parameter
    const elective = await Electives.findById(electiveId).populate('students'); // the elective
    return res.json({ success: true, elective }); // Success
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const deleteElective = async (req: IRequest, res: Response): Promise<Response> => {
  try {
    const electiveId = req.params.electiveId; // Getting Elective id from URL parameter
    await Electives.findByIdAndUpdate(
      electiveId,
      {
        active: false,
      },
      { new: true },
    ); // Deleting the elective
    return res.json({ success: true }); // Success
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
