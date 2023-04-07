import { createObjectCsvWriter } from 'csv-writer';
import Students from '@interfaces/students.interface';
import path from 'path';
import moment from 'moment';

export const generateCSV = (students: Students[]): string => {
  // Define the CSV writer
  console.log('2323', students[0].electives);
  const fileName = `school_${moment().format('YYYYMMDD_HHmmss')}`;
  const csvFilePath = path.join(__dirname, '..', '..', 'uploads', `${fileName}.csv`);
  const csvWriter = createObjectCsvWriter({
    path: csvFilePath,
    header: [
      { id: 'name', title: 'Student_name' },
      { id: 'email', title: 'Student_email' },
      { id: 'electives', title: 'Electives' }, // Add elective fields to the header
    ],
  });

  // Extract the necessary data for CSV from the students array
  const data = students.map((student) => ({
    name: student.name,
    email: student.email,
    electives: student.electives.map((_) => `${_.title} - ${_.description}`).join(', '),
  }));
  // Extract the necessary data for CSV from the students array
  console.log('data', data);
  // Write the data to the CSV file
  csvWriter
    .writeRecords(data)
    .then(() => console.log(data, 'CSV file generated successfully.'))
    .catch((error) => console.error(`Failed to generate CSV file: ${error.message}`));
  return csvFilePath;
};
