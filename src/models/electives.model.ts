import { model, Schema, Document } from 'mongoose';
import School from '@interfaces/schools.interface';

// Admin Schema
const electiveSchema = new Schema(
  {
    hospital: {
      type: Schema.Types.ObjectId,
      ref: 'Hospital',
    },
    schools: [
      {
        type: Schema.Types.ObjectId,
        ref: 'School',
      },
    ],
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Student',
      },
    ],
    post_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    locatoin: {
      type: String,
    },
    MaxAttendees: {
      type: Number,
    },
    start_date: {
      type: Date,
    },
    duration: {
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
export default model<School & Document>('Elective', electiveSchema);
