/**
 * Send email service for forgot password
 * @author Yousuf Kalim
 */
import nodemailer from 'nodemailer';
import { MAILER_DOMAIN, MAILER_EMAIL, MAILER_PASSWORD, MAILER_PORT, MAILER_HOST } from 'config';

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

export const sendEvaluationEmail = async (
  email: string,
  attachment: string,
  studentName: string,
  ElectiveName: string,
  startDate: string,
  duration: string,
): Promise<object> => {
  return await new Promise((resolve, reject) => {
    console.log('email111', email);
    // Send email options
    const mailOptions = {
      from: `${MAILER_DOMAIN} <${MAILER_EMAIL}>`,
      to: email,
      subject: 'Clinical Evaluation',
      text: `Student Name :  ${studentName} \n Elective Name :  ${ElectiveName} \n Start Date :  ${startDate} \n Duration :  ${duration} \n  Attached is the clinical evaluation for the SGU medical student that has/is completing your elective this month. Please complete, sign and return it to the Department of Medicine Student Coordinator, Christina Oquendo, via:
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
      subject: 'Confirmation Email',
      html: ConfirmationTemplate(),
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

const ConfirmationTemplate = (): string => {
  return `
  <body style="margin: 0; padding: 0">




     <p>Hey future doctor,</p>
    <p style="line-height: 1.5;">Thank you for using <strong style="font-weight: 900;">Med<strong style="color:blue">U</strong>Sched!</strong><br>
    You have successfully reserved your elective at Jersey City Medical Center!<br>
    In preparation for your elective at JCMC, here is some vital information you will need.</p>
    
    <div class="section">
        <p class="section-title">Prior to the start of your rotation, kindly email your student coordinator with following:</p>
        <p class="section-content"><strong style="color:red">Proof of Vaccination:</strong> Email a copy of your most recent Influenza & COVID-19 vaccination cards.</p>
    </div>
    
    <div class="section">
        <p <strong style="color:red">Orientation:</p>
        <p class="section-content">Main Hospital Building’s Conference Room 5 (back of the cafeteria | 355 Grand St)</p>
        <ul style="margin-left: 20px;">
            <li style="font-weight:900">Time: 8AM</li>
            <li style="font-weight:900">Date: FIRST DAY of your elective reservation</li>
        </ul>
        <p class="section-content"><strong style="color:red">ID and Parking Forms: </strong><strong style="font-weight:900"> Will be provided to you during Orientation.</strong></p>
        <ul style="margin-left: 20px;">
            <li>Everyone must fill out the ID form.</li>
            <li>If you previously rotated at JCMC and still have your ID, bring it with you and security will reactivate it.</li>
            <li>Once you have obtained your ID, you may take the completed parking form to the parking attendant.</li>
        </ul>
        <p class="section-content">Located in the parking lot between the ED & the MOB building (377 Jersey Ave).</p>
    </div>
    
    <div class="section">
        
        <p class="section-content"><strong style="color:red">Absences: </strong> As per SGU policy “Unexcused absences are not permitted while doing a clinical rotation”. (This includes weddings, flights, birthdays, etc.)</p>
        <ul style="margin-left: 20px;">
            <li>“Absences from a rotation without such permission, even for interviews, can be grounds for an incomplete or failure in that rotation”.</li>
            <li>As per SGU policy “No time off is permitted during sub-internships”.</li>
            <li>If you wake up sick you must contact your attending or your student coordinator directly the morning of; Not in the afternoon, not the following day.</li>
        </ul>
    </div>
    
    <div class="section">
        
        <p class="section-content"> <strong style="color:red">Exams:</strong> If you are taking your STEP exam, you are permitted 2 study days off and the day of your exam off.</p>
        <p class="section-content">Please tell your student coordinator, along with your residents & attending, when your exam is scheduled.</p>
    </div>
      
  <div class="section" style="margin-bottom: 20px;">
    <p><strong style="color:red">Attire: </strong> Professional attire should be worn at all times.</p>
    <ul style="list-style-type: disc; margin-left: 20px;">
      
      <li>Scrubs are acceptable.</li>
      <li>Short lab coats and please make sure they are impeccable.</li>
      <li>No jeans are ever to be worn for any reason, along with no midriff shirts and no leggings.</li>
      <li>Skirts can be worn, but please ensure they are a proper length.</li>
    </ul>
  </div>
  <div class="section" style="margin-bottom: 20px;">
    
    <p><strong style="color:red">Lockers: </strong> Lockers are located in the ACC building 3rd floor where the library is also located.</p>
    <ul style="list-style-type: disc; margin-left: 20px;">
      <li>Lockers are assigned and require your own lock.</li>
      <li>If you require one, let your student coordinator know on orientation day.</li>
    </ul>
  </div>
  <p>If you have any questions regarding this email or your rotation, please do not hesitate to reach out to your student coordinator.</p>
  <p>Thanks,</p>
</body>
`;
};
