import { model, Schema, Document } from 'mongoose';
import School from '@interfaces/schools.interface';

// Admin Schema
const schoolSchema = new Schema(
  {
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
    },
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Student',
      },
    ],
    hospitals: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Hospital',
      },
    ],
    name: {
      type: String,
      required: true,
    },
    domain_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
    },

    description: {
      type: String,
    },
    address: {
      type: String,
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
export default model<School & Document>('School', schoolSchema);
