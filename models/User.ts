// models/User.ts
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// Base interface for shared user fields
interface IBaseUser {
  email: string;
  password: string;
  createdAt: Date;
}

// Candidate specific interface
export interface ICandidate extends IBaseUser, Document {
  fullName: string;
  phone: string;
  skills: string[];
  experience: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Recruiter specific interface
export interface IRecruiter extends IBaseUser, Document {
  fullName: string;
  companyName: string;
  companyEmail: string;
  personalEmail: string;
  companyWebsite?: string;
  employeeCount: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Base schema for shared fields
const baseUserSchema = {
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
};

// Candidate Schema
const CandidateSchema = new Schema({
  ...baseUserSchema,
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  skills: [String],
  experience: String
});

// Recruiter Schema
const RecruiterSchema = new Schema({
  ...baseUserSchema,
  fullName: { type: String, required: true },
  companyName: { type: String, required: true },
  companyEmail: { type: String, required: true, unique: true },
  personalEmail: { type: String, required: true, unique: true },
  companyWebsite: String,
  employeeCount: { type: String, required: true }
});

// Password hashing middleware for both schemas
const hashPassword = async function(next: any) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
};

CandidateSchema.pre('save', hashPassword);
RecruiterSchema.pre('save', hashPassword);

// Password comparison method for both schemas
const comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

CandidateSchema.methods.comparePassword = comparePassword;
RecruiterSchema.methods.comparePassword = comparePassword;

export const Candidate = mongoose.models.Candidate || mongoose.model<ICandidate>('Candidate', CandidateSchema);
export const Recruiter = mongoose.models.Recruiter || mongoose.model<IRecruiter>('Recruiter', RecruiterSchema);