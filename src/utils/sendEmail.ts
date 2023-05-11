/**
 * Send email service for forgot password
 * @author Yousuf Kalim
 */
import nodemailer from 'nodemailer';
import { MAILER_DOMAIN, MAILER_EMAIL, MAILER_PASSWORD } from 'config';

// Sender mail server config
const transporter = nodemailer.createTransport({
  service: 'gmail',
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
export const sendCSVEmail = async (
  name: string,,
  attachment: string,
): Promise<object> => {
  return await new Promise((resolve, reject) => {
    // Send email options
    const mailOptions = {
      from: `${MAILER_DOMAIN} <${MAILER_EMAIL}>`,
      // to: email,
      to: 'asfi.official@gmail.com',
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
