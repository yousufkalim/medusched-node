import School from './schools.interface';
import Elective from './electives.interface';

export default interface Student {
  name: string;
  lastName: string;
  stdId: string;
  email: string;
  password: string;
  logo?: string;
  school: School | string;
  electives: Elective[] | [];
  role: 'student';
  address?: string;
  phone?: string;
  active: boolean;
}

export interface IStudents {
  name: string;
  studentId: IStudentId;
  duration: string;
  _id: string;
}

interface IStudentId {
  _id: string;
  email: string;
}
