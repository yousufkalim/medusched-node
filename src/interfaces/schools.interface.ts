import Admin from './admins.interface';
import Student from './students.interface';
import Hospital from './hospitals.interface';

export default interface School {
  _id: string;
  admin: Admin | string;
  students: Student[] | string[];
  hospitals: Hospital[] | string[];
  name: string;
  domain_name: string;
  email: string;
  description: string;
  active: boolean;
}
