import { model, Schema, Document } from 'mongoose';
import Elective from '@interfaces/electives.interface';

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
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
    start_date: {
      type: Date,
    },
    duration: {
      type: String,
    },
    limitenrollment: {
      type: Boolean,
    },
    limit: {
      type: Number,
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
export default model<Elective & Document>('Elective', electiveSchema);
