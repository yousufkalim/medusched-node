/**
 * Send email service for forgot password
 * @author Yousuf Kalim
 */
import nodemailer from 'nodemailer';
import { MAILER_DOMAIN, MAILER_EMAIL, MAILER_PASSWORD, MAILER_PORT, MAILER_HOST } from "config";

// Sender mail server config
const transporter = nodemailer.createTransport({
  // @ts-expect-error
  host: MAILER_HOST,
  port: MAILER_PORT,
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: true,
  },
  auth: {
    user: MAILER_EMAIL,
    pass: MAILER_PASSWORD,
  },
});

/**
 * sendEmail
 * @param {string} email
 * @param {string} password
 * @return {void}
 */
export const sendEmail = async (email: string, password: string): Promise<object> => {
  return await new Promise((resolve, reject) => {
    // Send email options
    const mailOptions = {
      from: `${MAILER_DOMAIN} <${MAILER_EMAIL}>`,
      to: email,
      subject: 'Your password has been changed',
      text: password,
    };

    // Sending email
    transporter.sendMail(mailOptions, function (error) {
      if (error) {
        // Error
        reject(error);
      } else {
        // Success
        resolve({ success: true, message: 'Email sent successfully' });
      }
    });
  });
};

export const sendForgotEmail = async (email: string, token: string): Promise<object> => {
  return await new Promise((resolve, reject) => {
    // Send email options
    const mailOptions = {
      from: `${MAILER_DOMAIN} <${MAILER_EMAIL}>`,
      to: email,
      subject: 'Password reset request',
      text: `You have initiated the request to reset your password, please click on the link below to set your new password \n ${token}`,
    };
    // Sending email
    transporter.sendMail(mailOptions, function (error) {
      if (error) {
        // Error
        reject(error);
      } else {
        // Success
        resolve({ success: true, message: 'Email sent successfully' });
      }
    });
  });
};
export const verifyStudent = async (email: string, token: string): Promise<object> => {
  return await new Promise((resolve, reject) => {
    // Send email options
    const mailOptions = {
      from: `${MAILER_DOMAIN} <${MAILER_EMAIL}>`,
      to: email,
      subject: 'Student Verification Request',
      text: `Please Click the link to verify Your Email \n ${token}`,
    };
    // Sending email
    transporter.sendMail(mailOptions, function (error) {
      if (error) {
        // Error
        reject(error);
      } else {
        // Success
        resolve({ success: true, message: 'Email sent successfully' });
      }
    });
  });
};

export const sendCSVEmail = async (
  name: string,
  _email: string,
  attachment: string,
): Promise<object> => {
  return await new Promise((resolve, reject) => {
    // Send email options
    const mailOptions = {
      from: `${MAILER_DOMAIN} <${MAILER_EMAIL}>`,
      // to: email,
      to: 'falconitconsultingpak@gmail.com',
      subject: `CSV for School ${name}`,
      text: `Attached herewith is the CSV file containing the information of students and their respective electives.`,
      attachments: [
        {
          filename: 'School.csv',
          path: `${attachment}`, // stream this file
        },
      ],
    };
    // Sending email
    transporter.sendMail(mailOptions, function (error) {
      if (error) {
        // Error
        reject(error);
      } else {
        // Success
        resolve({ success: true, message: 'Email sent successfully' });
      }
    });
  });
};

export const sendEvaluationEmail = async (email: string, attachment: string): Promise<object> => {
  return await new Promise((resolve, reject) => {
    console.log('email111', email);
    // Send email options
    const mailOptions = {
      from: `${MAILER_DOMAIN} <${MAILER_EMAIL}>`,
      to: email,
      subject: 'Clinical Evaluation',
      text: ` Attached is the clinical evaluation for the SGU medical student that has/is completing your elective this month. Please complete, sign and return it to the Department of Medicine Student Coordinator, Christina Oquendo, via:
- email: Christina.Oquendo@rwjbh.org
OR
- directly to her office: 1E Department of Medicine`,
      attachments: [
        {
          filename: 'Clinical_Evaluation.pdf',
          path: attachment,
        },
      ],
    };
    // Sending email
    transporter.sendMail(mailOptions, function (error) {
      if (error) {
        // Error
        reject(error);
      } else {
        // Success
        resolve({ success: true, message: 'Email sent successfully' });
      }
    });
  });
};
export const sendApplyConfirmationEmail = async (email: string): Promise<object> => {
  return await new Promise((resolve, reject) => {
    // Send email options
    const mailOptions = {
      from: `${MAILER_DOMAIN} <${MAILER_EMAIL}>`,
      to: email,
      subject: 'Confirmation',
      text: `You have applied successfully`,
    };
    // Sending email
    transporter.sendMail(mailOptions, function (error) {
      if (error) {
        // Error
        reject(error);
      } else {
        // Success
        resolve({ success: true, message: 'Email sent successfully' });
      }
    });
  });
};
