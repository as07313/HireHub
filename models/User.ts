// models/User.ts
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// Base interface for shared fields
interface IBaseUser {
  email: string;
  password: string;
  createdAt: Date;
  isActive: boolean;
  profileComplete: boolean;
}

// Candidate specific interface
export interface ICandidate extends IBaseUser, Document {
  fullName: string;
  phone: string;
  skills: string[];
  experience: string;
  stats: {
    appliedJobs: number;
    savedJobs: number;
  };
  savedJobs: Array<Schema.Types.ObjectId>;
  // jobAlerts: Array<{
  //   keywords: string[];
  //   locations: string[];
  //   jobTypes: string[];
  //   isActive: boolean;
  // }>;
  applications: Array<Schema.Types.ObjectId>;
  emailVerified: boolean
  verificationCode: string;
  verificationExpires: Date;

  comparePassword(password: string): Promise<boolean>;
}

// Recruiter specific interface
export interface IRecruiter extends IBaseUser, Document {
  fullName: string;
  companyId: Schema.Types.ObjectId;
  jobPosts: Array<Schema.Types.ObjectId>;
  comparePassword(password: string): Promise<boolean>;
}

// Base schema fields shared between Candidate and Recruiter
const baseSchemaFields = {
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  // profileComplete: { type: Boolean, default: false }
};

// Candidate Schema
const CandidateSchema = new Schema({
  ...baseSchemaFields,
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  skills: [String],
  experience: { type: String, required: true },
  stats: {
    appliedJobs: { type: Number, default: 0 },
    savedJobs: { type: Number, default: 0 },
    jobAlerts: { type: Number, default: 0 }
  },
  savedJobs: [{ type: Schema.Types.ObjectId, ref: 'Job' }],
  applications: [{ type: Schema.Types.ObjectId, ref: 'Application' }],
  verificationCode: { type: String },
  verificationExpires: { type: Date },
  emailVerified: { type: Boolean, default: false }

}, 

{
  timestamps: true,
  toJSON: { virtuals: true }

});

// Recruiter Schema
const RecruiterSchema = new Schema({
  ...baseSchemaFields,
  fullName: { type: String, required: true },
  companyId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Company', 
    required: false 
  },

  jobPosts: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Job' 
  }],
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Add virtuals to get company info
RecruiterSchema.virtual('company', {
  ref: 'Company',
  localField: 'companyId',
  foreignField: '_id',
  justOne: true
});
// Password hashing middleware (shared between both schemas)
const hashPassword = async function(this: ICandidate | IRecruiter, next: Function) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
};

// Password comparison method (shared between both schemas)
const comparePassword = async function(this: ICandidate | IRecruiter, password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Apply middleware and methods to both schemas
[CandidateSchema, RecruiterSchema].forEach(schema => {
  schema.pre('save', hashPassword);
  schema.methods.comparePassword = comparePassword;
});

// Add candidate-specific virtuals
CandidateSchema.virtual('appliedJobsCount').get(function(this: ICandidate) {
  return this.applications?.length || 0;
});

CandidateSchema.virtual('savedJobsCount').get(function(this: ICandidate) {
  return this.savedJobs?.length || 0;
});

CandidateSchema.virtual('jobAlertsCount').get(function(this: ICandidate) {
  //return this.jobAlerts?.filter(alert => alert.isActive).length || 0;
});

// Update candidate stats middleware
CandidateSchema.pre<ICandidate>('save', async function(next) {
  if (this.isModified('applications') || this.isModified('savedJobs') || this.isModified('jobAlerts')) {
    this.stats = {
      appliedJobs: this.applications.length || 0,
      savedJobs: this.savedJobs.length || 0,
      //jobAlerts: this.jobAlerts.filter(alert => alert.isActive).length || 0,
    };
  }
  next();
});

export const Candidate = mongoose.models.Candidate || mongoose.model<ICandidate>('Candidate', CandidateSchema);
export const Recruiter = mongoose.models.Recruiter || mongoose.model<IRecruiter>('Recruiter', RecruiterSchema);