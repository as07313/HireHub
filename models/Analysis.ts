// models/skillAnalysis.ts
import mongoose from 'mongoose';

interface ISkillAnalysis {
    jobId: string;
    filePath: string;
    result: {
        skill_gaps: {
            content: string;
        },
        course_recommendations: {
            content: string;
        }
    }
    createdAt: Date;
}

const SkillAnalysisSchema = new mongoose.Schema({
    jobId: { type: String, required: true },
    filePath: { type: String, required: true },
    result: {
        skill_gaps: {
            content: { type: String, required: true }
        },
        course_recommendations: {
            content: { type: String, required: true }
        }
    },
    createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Check if model exists before creating a new one
const SkillAnalysis = mongoose.models.SkillAnalysis || 
                      mongoose.model<ISkillAnalysis>('SkillAnalysis', SkillAnalysisSchema);

export default SkillAnalysis;