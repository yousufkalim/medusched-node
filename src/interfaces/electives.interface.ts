import Hospital from './hospitals.interface';
import School from './schools.interface';
import Student from './students.interface';

export default interface Elective {
  _id: string;
  hospital: Hospital | string;
  schools: School[] | string[];
  students: Student[] | string[];
  post_name: string;
  email: string;
  description: string;
  locatoin: string;
  MaxAttendees: number;
  start_date: Date;
  duration: string;
  active: boolean;
}
