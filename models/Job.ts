import mongoose, { Document, Model, Schema } from 'mongoose';

interface IJob extends Document {
  title: string;
  department: string;
  location: string;
  type: string;
  status: string;
  applicants: number;
  postedDate: Date;
  salary: {
    min: string;
    max: string;
  };
  experience: string;
  description: string;
  requirements: string;
  benefits: string;
}

const JobSchema: Schema = new Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, required: true, enum: ['active', 'inactive'], default: 'active' },
  applicants: { type: Number, default: 0 },
  postedDate: { type: Date, default: Date.now },
  salary: {
    min: { type: String, required: true },
    max: { type: String, required: true },
  },
  experience: { type: String, required: true },
  description: { type: String, required: true },
  requirements: { type: String, required: true },
  benefits: { type: String, required: true },
});

const Job: Model<IJob> = mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);

export default Job;