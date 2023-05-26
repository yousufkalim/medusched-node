import Hospital from './hospitals.interface';
import School from './schools.interface';
import Student from './students.interface';

interface IStudent {
  studentId: Student | string;
  duration: string;
}
export default interface Elective {
  _id: string;
  hospital: Hospital | string;
  schools: School[] | string[];
  // students: Student[] | string[];
  students: IStudent[];
  title: string;
  description: string;
  start_date: Date;
  duration: string;
  limitenrollment: boolean;
  limit: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
