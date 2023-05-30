import { Response } from 'express';
import IRequest from '@interfaces/request.interface';
import Hospitals from '@models/hospitals.model';
import Electives from '@models/electives.model';
import Students from '@models/students.model';
import Hospital from '@interfaces/hospitals.interface';
import Elective from '@interfaces/electives.interface';
import ApplyElective from '@interfaces/applyelectives.interface';
// import { sendApplyConfirmationEmail } from '@utils/sendEmail';
import { checkElectiveConflict, checkExtendElectiveConflict } from '@utils/checkElectiveConflicts';

export const createElectives = async (req: IRequest, res: Response): Promise<Response> => {
  const user = req.user as Hospital;

  try {
    const { _id } = user;
    const hospital = await Hospitals.findById(_id);

    if (!hospital) {
      // If we not found existing Hospital in db
      return res.status(409).json({
        success: false,
        message: 'Invalid Token or Hospital not exists',
      });
    }

    // // Creating Elective
    // const elective = new Electives({
    //   ...req.body,
    //   hospital: _id,
    // });
    // await elective.save();
    const elective = await Electives.create({ ...req.body, hospital: _id }); // Adding New Elective in db
    await Hospitals.findByIdAndUpdate(
      _id,
      { $push: { electives: elective._id } },
      {
        new: true,
      },
    ); // update architect to push bookLibrary
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

    const elective = await Electives.findByIdAndUpdate(electiveId, body, {
      new: true,
    }); // Updating the elective
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
    const { studentId, electiveId, name, phone } = body;
    console.log(studentId, electiveId, name);
    if (!studentId) {
      return res.status(409).json({
        success: false,
        message: 'Invalid Student Id or Student not exists',
      });
    }
    if (!electiveId) {
      return res.status(409).json({
        success: false,
        message: 'Invalid electiveId Id or elective not exists',
      });
    }

    const getstudentAppliedElectives = await Electives.find({
      'students.studentId': { $in: [studentId] },
    });

    const getElective = await Electives.findById(electiveId);
    if (!getElective) {
      return res.status(409).json({ success: false, message: 'No Elective Found' });
    }
    const conflict = checkElectiveConflict(
      getstudentAppliedElectives || [],
      getElective,
      studentId,
    );
    console.log('conflict', conflict);
    if (conflict) {
      return res.status(409).json({
        success: false,
        message: ' Your date is overlapping with another Applied Elective',
      });
    }
    await Students.findByIdAndUpdate(studentId, { phone, name }, { new: true }); // Updating the student data

    await Students.findByIdAndUpdate(
      studentId,
      { $push: { electives: electiveId } },
      { new: true },
    );
    // Updating the elective
    await Electives.findByIdAndUpdate(
      electiveId,
      { $push: { students: { studentId, duration: getElective?.duration } } },
      { new: true },
    );
    //  student should receive email to applied electives
    // await sendApplyConfirmationEmail(email);
    return res.json({ success: true, message: 'Applied successfully' }); // Success
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const RemoveStudentFromElective = async (
  req: IRequest,
  res: Response,
): Promise<Response> => {
  try {
    const studentId = req.params.studentid; // Getting Elective id from URL parameter
    const electiveId = req.body.electiveID;
    console.log('studentid', studentId);
    console.log('electiveId', electiveId);
    // remove from Student array of elective
    await Students.findByIdAndUpdate(
      studentId,
      { $pull: { electives: electiveId } },
      {
        new: true,
      },
    ); // Updating the Students
    // remove from Elective array of student
    // await Electives.findByIdAndUpdate(
    //   electiveId,
    //   { $pull: { students: studentId } },
    //   {
    //     new: true,
    //   },
    // ); // Updating the Elective
    await Electives.findByIdAndUpdate(
      electiveId,
      { $pull: { students: { studentId } } },
      {
        new: true,
      },
    );

    return res.json({ success: true }); // Success
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
export const ExtendElective = async (req: IRequest, res: Response): Promise<Response> => {
  try {
    const studentId = req.params.studentid; // Getting Elective id from URL parameter
    const electiveId = req.body.electiveID;
    const studentDuraion = req.body.studentDuration;

    // find Elective of given ID
    const elective: Elective | null = await Electives.findById(electiveId);
    if (!elective) {
      return res.status(409).json({ success: false, message: 'Elective not found' });
    }
    // find student whose duration will extend in this elective
    // const student = elective.students.find(
    //   (student) => student?.studentId?.toString() === studentId,
    // );
    const student = elective.students.find((student) => {
      const studentIdString = student?.studentId as string;
      console.log('studentIdString', studentIdString, studentId);
      return studentIdString && studentIdString.toString() === studentId;
    });

    if (!student) {
      return res.status(409).json({
        success: false,
        message: 'Student not found',
      });
    }
    // update duration of student
    student.duration = studentDuraion;

    // check conflicts
    const getstudentAppliedElectives = await Electives.find({
      _id: { $ne: electiveId },
      'students.studentId': { $in: [studentId] },
    });

    const conflict = checkExtendElectiveConflict(
      getstudentAppliedElectives,
      elective,
      studentDuraion,
    );
    console.log('conflict', conflict);

    // Update the elective with new student duration
    await Electives.findByIdAndUpdate(electiveId, elective, {
      new: true,
    });

    return res.json({ success: true }); // Success
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getAllElectivesOfHospital = async (
  _req: IRequest,
  res: Response,
): Promise<Response> => {
  const hospital = _req.user as Hospital;
  try {
    const { _id } = hospital;
    const electives = await Electives.find({
      hospital: _id,
    })
      .populate('hospital')
      .populate('students.studentId')
      .sort({ start_date: 1 }); // Finding all the Electives from db
    electives.sort((a: Elective, b: Elective) => {
      const startDateA: Date = new Date(a.start_date);
      const startDateB: Date = new Date(b.start_date);

      if (startDateA.getMonth() === startDateB.getMonth()) {
        return a.title.localeCompare(b.title);
      }
      console.log('startDateA', startDateA);
      const sortByDate: number = startDateA.getTime() - startDateB.getTime();

      return sortByDate;
    });

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
export const getAllElectives = async (_req: IRequest, res: Response): Promise<Response> => {
  try {
    const electives = await Electives.find().populate('hospital').populate('students.studentId'); // Finding all the Electives from db
    return res.json({ success: true, electives }); // Success
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getAllAffiliatedElectives = async (
  req: IRequest,
  res: Response,
): Promise<Response> => {
  try {
    // get all affiliated Electives with student's school
    const user = req.user as Hospital;
    const { _id } = user;
    const student = await Students.findById(_id);
    if (!student) {
      return res.status(409).json({ success: false, message: 'Student not Found' });
    }
    // find affiliated hospital with student's school id
    const affiliatedHospitals = await Hospitals.find(
      { schools: { $in: [student?.school] } },
      { _id: 1 },
    );
    // Extract the hospital IDs from the hospitalIds array
    const ids = affiliatedHospitals.map((idObj) => idObj._id);
    // now find electives with affiliated hospitals
    const affiliatedElectives = await Electives.find({
      hospital: { $in: ids },
    }).populate('hospital');
    return res.json({ success: true, electives: affiliatedElectives }); // Success
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
    const elective = await Electives.findById(electiveId)
      .populate('hospital')
      .populate('students.studentId'); // the elective
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
