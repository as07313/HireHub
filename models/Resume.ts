import mongoose, { Document, Schema } from 'mongoose';

interface IResume extends Document {
  candidateId: Schema.Types.ObjectId;
  fileName: string;
  fileSize: string;
  filePath: string;
  uploadDate: Date;
  lastModified: Date;
  parsedData: {
    Name: string;
    'Contact Information': string;
    Education: Array<{
      Degree: string;
      Institution: string;
      Year: string;
    }>;
    'Work Experience': Array<{
      'Job Title': string;
      Company: string;
      Duration: string;
      Description: string;
    }>;
    Skills: string[];
  };
}

const ResumeSchema = new Schema({
  candidateId: {
    type: Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  fileName: { type: String, required: true },
  fileSize: { type: String, required: true },
  filePath: { type: String, required: true }, // Add this field
  uploadDate: { type: Date, default: Date.now },
  lastModified: { type: Date, default: Date.now },
  parsedData: {
    Name: { type: String, required: false },
    'Contact Information': { type: String, required: false },
    Education: [{
      Degree: { type: String, required: false },
      Institution: { type: String, required: false },
      Year: { type: String, required: false }
    }],
    'Work Experience': [{
      'Job Title': { type: String, required: false },
      Company: { type: String, required: false },
      Duration: { type: String, required: false },
      Description: { type: String, required: false }
    }],
    Skills: { type: [String], required: false }
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export const Resume = mongoose.models.Resume || mongoose.model<IResume>('Resume', ResumeSchema);

