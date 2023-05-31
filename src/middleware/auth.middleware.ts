/**
 * Check auth middleware
 * @author Yousuf Kalim
 */
import { Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import IRequest from '@interfaces/request.interface';
import { JWT_SECRET } from '@config';
import Hospitals from '@models/hospitals.model';
import Students from '@models/students.model';

// Check auth
export const checkAdminAuth = (
  req: IRequest,
  res: Response,
  next: NextFunction,
): Response | void => {
  console.log('Test');
  // Get token from Header
  const header = req.get('Authorization');

  // Check if not token
  if (!header?.startsWith('Bearer')) {
    return res.status(403).json({
      success: false,
      message: 'No token found, Authorization denied',
    });
  }

  try {
    // Decrypting token
    const token = header.split(' ')[1];
    const { user } = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this resource',
      });
    }

    req.user = user;
    req.token = token;

    // If user authenticated
    res.set(
      'cache-control',
      'no-cache, no-store, private, must-revalidate, post-check=0, pre-check=0',
    );

    // Done
    next();
  } catch (err) {
    // If not
    res.status(403).json({ success: false, message: 'Your session has been expired' });
  }
};

// Check auth
export const checkUserAuth = async (
  req: IRequest,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  // Get token from Header
  const header = req.get('Authorization');

  // Check if not token
  if (!header?.startsWith('Bearer')) {
    return res.status(403).json({
      success: false,
      message: 'No token found, Authorization denied',
    });
  }

  try {
    // Decrypting token
    const token = header.split(' ')[1];
    const { user } = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (!user) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this resource',
      });
    }

    if (user.role === 'Hospital') {
      const hospital = await Hospitals.findById(user._id);

      req.user = hospital ?? user;
    } else if (user.role === 'student') {
      const student = await Students.findById(user._id);
      req.user = student ?? user;
    } else {
      req.user = user;
    }

    // If user authenticated
    res.set(
      'cache-control',
      'no-cache, no-store, private, must-revalidate, post-check=0, pre-check=0',
    );

    // Done
    next();
  } catch (err) {
    // If not
    res.status(403).json({ success: false, message: 'Your session has been expired' });
  }
};
