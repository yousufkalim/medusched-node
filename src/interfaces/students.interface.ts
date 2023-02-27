import School from './schools.interface';
import Elective from './electives.interface';

export default interface Student {
  name: string;
  email: string;
  password: string;
  school: School | string;
  electives: Elective[] | string[];
  role: 'student';
  address?: string;
  phone?: string;
  active: boolean;
}
