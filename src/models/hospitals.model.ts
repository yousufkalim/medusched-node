import { model, Schema, Document } from 'mongoose';
import Hospital from '@interfaces/hospitals.interface';

// Admin Schema
const hospitalSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
    },
    logo: {
      type: String,
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
    },
    electives: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Elective',
      },
    ],
    schools: [
      {
        type: Schema.Types.ObjectId,
        ref: 'School',
      },
    ],
    address: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      default: 'Hospital',
    },
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
export default model<Hospital & Document>('Hospital', hospitalSchema);
