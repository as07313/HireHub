import mongoose, { Document, Schema } from 'mongoose';
import exp from 'node:constants';

interface IResume extends Document {
  candidateId: Schema.Types.ObjectId;
  fileName: string;
  fileSize: string;
  filePath: string;
  status: string;
  uploadDate: Date;
  lastModified: Date;
  processingStatus: 'queued' | 'processing' | 'completed' | 'error';
  processingError?: string;
  parsedData?: Record<string, any>; // Add this field to store the JSON object


}

const ResumeSchema = new Schema({
  candidateId: {
    type: Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  fileName: { type: String, required: true },
  fileSize: { type: String, required: true },
  filePath: { type: String, required: false }, // Add this field
  uploadDate: { type: Date, default: Date.now },
  lastModified: { type: Date, default: Date.now },
  status: {type: String, required: false},
  processingStatus: {
    type: String,
    enum: ['queued', 'processing', 'completed', 'error'],
    default: 'queued'
  },
  processingError: {
    type: String
  },
  parsedData: { type: Schema.Types.Mixed, required: false },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export const Resume = mongoose.models.Resume || mongoose.model<IResume>('Resume', ResumeSchema);

export default Resume;
export type { IResume };

