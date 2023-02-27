import Admin from './admins.interface';
import Student from './students.interface';

export default interface School {
  _id: string;
  admin: Admin | string;
  students: Student[] | string[];
  name: string;
  domain_name: string;
  email: string;
  description: string;
  active: boolean;
}
