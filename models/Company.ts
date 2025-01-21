// models/Company.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  logo: string;
  website: string;
  industry: string;
  size: 'small' | 'medium' | 'large' | 'enterprise';
  founded: string;
  headquarters: string;
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
  };
  socialMedia?: {
    linkedin?: string;
    facebook?: string;
  };
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema({
  name: { 
    type: String, 
    required: true,
    unique: true,
    trim: true 
  },
  logo: { 
    type: String,
    required: true 
  },
  website: { 
    type: String,
    required: true,
    trim: true 
  },
  industry: { 
    type: String,
    required: true 
  },
  size: { 
    type: String,
    enum: ['small', 'medium', 'large', 'enterprise'],
    required: true 
  },
  founded: { 
    type: String,
    required: true 
  },
  headquarters: { 
    type: String,
    required: true 
  },
  description: { 
    type: String,
    required: true 
  },
  benefits: [{ 
    type: String 
  }],
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true }
  },
  socialMedia: {
    linkedin: String,
    twitter: String,
    facebook: String
  },
  status: { 
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
CompanySchema.index({ name: 1 });
CompanySchema.index({ industry: 1 });
CompanySchema.index({ 'location.city': 1 });
CompanySchema.index({ status: 1 });

// Virtual for recruiters
CompanySchema.virtual('recruiters', {
  ref: 'Recruiter',
  localField: '_id',
  foreignField: 'companyId'
});

// Virtual for jobs
CompanySchema.virtual('jobs', {
  ref: 'Job',
  localField: '_id',
  foreignField: 'companyId'
});

export const Company = mongoose.models.Company || 
  mongoose.model<ICompany>('Company', CompanySchema);