/**
 * Request interfaces - Where we define all the custom interfaces for the Request
 * @author Yousuf Kalim
 */
import { Request } from 'express';
import Admin from './admins.interface';
import Hospital from './hospitals.interface';
import School from './schools.interface';

export default interface IRequest extends Request {
  user?: Hospital | Admin | School;
  token?: string;
}
