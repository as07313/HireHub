// models/Resume.ts
import mongoose, { Document, Schema } from 'mongoose';

interface IResume extends Document {
  userId: string;
  fileName: string;
  fileSize: string;
  uploadDate: Date;
  lastModified: Date;
  status: 'completed' | 'error';
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
    metadata: {
      file_name: string;
      text_length: number;
      has_contact: boolean;
      education_count: number;
      experience_count: number;
      skills_count: number;
    };
  };
}

const ResumeSchema = new Schema({
  userId: { type: String, required: true },
  fileName: { type: String, required: true },
  fileSize: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  lastModified: { type: Date, default: Date.now },
  status: { type: String, enum: ['completed', 'error'], required: true },
  parsedData: {
    Name: { type: String },
    'Contact Information': { type: String },
    Education: [{
      Degree: String,
      Institution: String,
      Year: String
    }],
    'Work Experience': [{
      'Job Title': String,
      Company: String,
      Duration: String,
      Description: String
    }],
    Skills: [String],
    metadata: {
      file_name: String,
      text_length: Number,
      has_contact: Boolean,
      education_count: Number,
      experience_count: Number,
      skills_count: Number
    }
  }
});

export default mongoose.models.Resume || mongoose.model<IResume>('Resume', ResumeSchema);