import mongoose, { Document, Schema } from 'mongoose';

interface IInterview {
  scheduledDate: Date;
  type: 'technical' | 'hr' | 'cultural' | 'final';
  status: 'scheduled' | 'completed' | 'cancelled';
  feedback?: string;
  interviewer: Schema.Types.ObjectId;
}

export interface IApplicant extends Document {
  candidateId: Schema.Types.ObjectId;
  jobId: Schema.Types.ObjectId;
  status: 'new' | 'screening' | 'shortlist' | 'interview' | 'offer' | 'hired' | 'rejected';
  appliedDate: Date;
  resumeId: Schema.Types.ObjectId;
  coverLetter?: string;
  jobFitScore: number;
  aiAnalysis: {
    technicalSkills: {
      score: number;
      strengths: string[];
      gaps: string[];
    };
    experience: {
      score: number;
      strengths: string[];
      gaps: string[];
    };
    education: {
      score: number;
      strengths: string[];
      gaps: string[];
    };
  };
  interviews: IInterview[];
}

const ApplicantSchema = new Schema({
  candidateId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Candidate', 
    required: true 
  },
  jobId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Job', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['new', 'screening', 'shortlist', 'interview', 'offer', 'hired', 'rejected'],
    default: 'new',
    required: true 
  },
  appliedDate: { 
    type: Date, 
    default: Date.now,
    required: true 
  },
  resumeId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Resume', 
    required: true 
  },

  coverLetter: { 
    type: String 
  },
  jobFitScore: { 
    type: Number, 
    required: true,
    min: 0,
    max: 100 
  },
  aiAnalysis: {
    technicalSkills: {
      score: Number,
      strengths: [String], 
      gaps: [String]
    },
    experience: {
      score: Number,
      strengths: [String],
      gaps: [String]
    },
    education: {
      score: Number,
      strengths: [String],
      gaps: [String]
    }
  },
  interviews: [{
    scheduledDate: { type: Date, required: true },
    type: { 
      type: String, 
      enum: ['technical', 'hr', 'cultural', 'final'],
      required: true 
    },
    status: { 
      type: String, 
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled' 
    },
    feedback: String,
    interviewer: { 
      type: Schema.Types.ObjectId, 
      ref: 'Recruiter' 
    }
  }],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual population
ApplicantSchema.virtual('candidate', {
  ref: 'Candidate',
  localField: 'candidateId',
  foreignField: '_id',
  justOne: true
});

ApplicantSchema.virtual('job', {
  ref: 'Job',
  localField: 'jobId',
  foreignField: '_id',
  justOne: true
});

export const Applicant = mongoose.models.Applicant || 
  mongoose.model<IApplicant>('Applicant', ApplicantSchema);
