import mongoose, { Document, Model, Schema } from 'mongoose';

interface IJob extends Document {
  title: string;
  department: string;
  location: string;
  type: string;
  status: string;
  applicants: number;
  postedDate: Date;
  salary: string;
  experience: string;
  employmentType: string;
  workplaceType: string;
  teamSize: string;
  education: string;
  logo: string;
  companyDescription: string;
  benefits: string[];
  skills: string[];
  description: string;
  requirements: string[];
}

const JobSchema: Schema = new Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, required: true, enum: ['active', 'inactive'], default: 'active' },
  applicants: { type: Number, default: 0 },
  postedDate: { type: Date, default: Date.now },
  salary: { type: String, required: true },
  experience: { type: String, required: true },
  employmentType: { type: String, required: true },
  workplaceType: { type: String, required: true },
  teamSize: { type: String, required: true },
  education: { type: String, required: true },
  logo: { type: String, required: true },
  companyDescription: { type: String, required: true },
  benefits: { type: [String], required: true },
  skills: { type: [String], required: true },
  description: { type: String, required: true },
  requirements: { type: [String], required: true },
});

const Job: Model<IJob> = mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);

export default Job;