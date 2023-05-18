import Admin from './admins.interface';
import Elective from './electives.interface';
import School from './schools.interface';

export default interface Hospital {
  _id: string;
  name: string;
  email: string;
  admin: Admin | string;
  electives: Elective[] | string[];
  schools: School[] | string[] | string;
  address: string;
  password: string;
  role: 'Hospital';
  active: boolean;
  logo: string;
}

