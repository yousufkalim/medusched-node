import { model, Schema, Document } from 'mongoose';
import Student from '@/interfaces/students.interface';

// Schema
const studentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    stdId: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
    },
    school: {
      type: Schema.Types.ObjectId,
      ref: 'School',
    },
    electives: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Elective',
      },
    ],
    role: {
      type: String,
      default: 'student',
    },
    phone: String,
    address: String,
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Model
export default model<Student & Document>('Student', studentSchema);
