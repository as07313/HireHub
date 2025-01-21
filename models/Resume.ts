import mongoose, { Document, Schema } from 'mongoose';

interface IResume extends Document {
  candidateId: Schema.Types.ObjectId;
  fileName: string;
  fileSize: string;
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
  uploadDate: { type: Date, default: Date.now },
  lastModified: { type: Date, default: Date.now },
  parsedData: {
    Name: { type: String, required: true },
    'Contact Information': { type: String, required: true },
    Education: [{
      Degree: { type: String, required: true },
      Institution: { type: String, required: true },
      Year: { type: String, required: true }
    }],
    'Work Experience': [{
      'Job Title': { type: String, required: true },
      Company: { type: String, required: true },
      Duration: { type: String, required: true },
      Description: { type: String, required: true }
    }],
    Skills: { type: [String], required: true }
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


export default mongoose.models.Resume || mongoose.model<IResume>('Resume', ResumeSchema);
