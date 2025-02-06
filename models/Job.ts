// models/Job.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  recruiterId: Schema.Types.ObjectId;
  title: string;
  department: string;
  location: string;
  workplaceType: 'onsite' | 'hybrid' | 'remote';
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
  status: 'open' | 'closed';
  salary: {
    min: string;
    max: string;
  };
  experience: 'entry' | 'mid' | 'senior' | 'lead';
  description: string;
  requirements: string[]; // description to be converted to objects 
  benefits: string[];
  skills: string[];
  applicants: Schema.Types.ObjectId[];
  postedDate: Date;
}

const JobSchema = new Schema({

  recruiterId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Recruiter',
    required: true 
  },
  title: { type: String, required: true },
  department: { type: String, required: true },
  location: { type: String, required: true },
  workplaceType: { 
    type: String,
    enum: ['onsite', 'hybrid', 'remote'],
    required: false
  },
  employmentType: { 
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship'],
    required: false
  },
  status: { 
    type: String,
    enum: ['active', 'inactive', 'closed'],
    default: 'active' 
  },
  salary: {
    min: { type: String, required: true },
    max: { type: String, required: true }
  },
  experience: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'lead'],
    required: true
  },
  description: { type: String, required: true },
  requirements: [String],
  benefits: [String],
  skills: [String],
  applicants: [{ 
    type: Schema.Types.ObjectId,
    ref: 'Candidate'
  }],
  postedDate: { 
    type: Date,
    default: Date.now 
  }
}, {
  timestamps: true
});

// Add indexes
JobSchema.index({ title: 'text', description: 'text' });
JobSchema.index({ status: 1 });
JobSchema.index({ companyId: 1 });
JobSchema.index({ recruiterId: 1 });

export const Job = mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);