/**
 * Admin interfaces - Where we define all the interfaces for Admins
 * @author Yousuf Kalim
 */
export default interface Admin {
  _id: string;
  name: string;
  email: string;
  bio: string;
  password: string;
  role: 'admin' | 'superadmin';
  active: boolean;
}
