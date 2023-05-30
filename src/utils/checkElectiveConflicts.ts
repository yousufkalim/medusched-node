import Elective from '@interfaces/electives.interface';

export function checkElectiveConflict(
  existingElectives: Elective[],
  newElective: Elective,
  studentId: string,
): boolean {
  // Convert newElective start_date to a Date object
  const newStartDate = new Date(newElective.start_date);

  // Loop through the existingElectives array
  for (let i = 0; i < existingElectives.length; i++) {
    const existingElective = existingElectives[i];
    const existingStartDate = new Date(existingElective.start_date);

    // Find the student in the existingElective with the provided studentId
    // const existingStudent = existingElective.students.find(
    //   (student) => student?.studentId?.toString() === studentId,
    // );
    const existingStudent = existingElective.students.find((student) => {
      const studentIdString = student?.studentId as string;
      return studentIdString && studentIdString.toString() === studentId;
    });

    if (existingStudent) {
      const existingStudentStartDate = new Date(existingStartDate.getTime());
      const existingStudentEndDate = new Date(
        existingStudentStartDate.getTime() +
          parseInt(existingStudent.duration) * 7 * 24 * 60 * 60 * 1000,
      );

      // Calculate the new end date based on the duration of the newElective for the student
      const newEndDate = new Date(
        newStartDate.getTime() + parseInt(existingStudent.duration) * 7 * 24 * 60 * 60 * 1000,
      );

      // Check for conflicts
      if (
        (newStartDate > existingStudentStartDate && newStartDate < existingStudentEndDate) ||
        (newEndDate > existingStudentStartDate && newEndDate < existingStudentEndDate) ||
        (newStartDate < existingStudentStartDate && newEndDate > existingStudentEndDate)
      ) {
        return true; // Conflict found
      }
    }
  }

  return false; // No conflict found
}
export function checkExtendElectiveConflict(
  existingElectives: Elective[],
  newElective: Elective,
  newDuration: string,
): boolean {
  // Convert newElective start_date to a Date object
  const newStartDate = new Date(newElective.start_date);

  // Calculate the new end date based on the duration
  const newEndDate = new Date(
    newStartDate.getTime() + parseInt(newDuration) * 7 * 24 * 60 * 60 * 1000,
  );

  // Loop through the existingElectives array
  for (let i = 0; i < existingElectives.length; i++) {
    const existingElective = existingElectives[i];
    const existingStartDate = new Date(existingElective.start_date);

    // Calculate the existing end date based on the duration
    const existingEndDate = new Date(
      existingStartDate.getTime() + parseInt(existingElective.duration) * 7 * 24 * 60 * 60 * 1000,
    );

    // Check for conflicts
    if (
      (newStartDate > existingStartDate && newStartDate < existingEndDate) ||
      (newEndDate > existingStartDate && newEndDate < existingEndDate) ||
      (newStartDate < existingStartDate && newEndDate > existingEndDate)
    ) {
      return true; // Conflict found
    }
  }

  return false; // No conflict found
}
