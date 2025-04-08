// import { NextApiRequest, NextApiResponse } from 'next'
// import connectToDatabase from '@/lib/mongodb'
// import { Job } from '@/models/Job'
// import { Applicant } from '@/models/Applicant'
// import { Apiauth } from '@/app/middleware/auth'

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' })
//   }

//   try {
//     await connectToDatabase()
    
//     // Authenticate the request
//     const user = await Apiauth(req, res)
//     if (!user || user.type !== 'recruiter') {
//       return res.status(401).json({ error: 'Unauthorized' })
//     }

//     const { id: jobId } = req.query
    
//     if (!jobId || typeof jobId !== 'string') {
//       return res.status(400).json({ error: 'Invalid job ID' })
//     }
    
//     // Get job details with applicants
//     const job = await Job.findById(jobId)
//       .populate({
//         path: 'applicants',
//         model: 'Applicant',
//         select: 'candidateId status resumeId appliedDate',
//         populate: [
//           {
//             path: 'candidateId',
//             select: 'fullName email phone skills experience location currentRole'
//           },
//           {
//             path: 'resumeId',
//             select: 'fileName filePath uploadDate parsedData'
//           }
//         ]
//       })

//     if (!job) {
//       return res.status(404).json({ error: 'Job not found' })
//     }

//     // Check if there are applicants
//     if (!job.applicants || job.applicants.length === 0) {
//       return res.status(200).json({
//         message: 'No applicants found for this job',
//         candidates: []
//       })
//     }

//     // Prepare resume data for analysis
//     const applicantsData = job.applicants.map(applicant => {
//       const resumeContent = applicant.resumeId?.parsedData || '';
//       const skills = applicant.candidateId?.skills || [];
//       const experience = applicant.candidateId?.experience || '';
      
//       return {
//         applicantId: applicant._id.toString(),
//         candidateId: applicant.candidateId._id.toString(),
//         name: applicant.candidateId.fullName,
//         email: applicant.candidateId.email,
//         resumeContent,
//         skills,
//         experience
//       };
//     });

//     // Call AI API for ranking
//     const response = await fetch("https://hirehub-api-795712866295.europe-west4.run.app/api/rank-job-applicants", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         job_description: job.description,
//         requirements: job.requirements || [],
//         skills: job.skills || [],
//         applicants: applicantsData
//       })
//     });

//     if (!response.ok) {
//       throw new Error(`Error from AI service: ${response.statusText}`);
//     }

//     const rankingData = await response.json();
    
//     // Update applicant records with scores
//     for (const result of rankingData.results) {
//       const applicant = job.applicants.find(
//         a => a.candidateId._id.toString() === result.candidateId
//       );
      
//       if (applicant) {
//         await Applicant.findByIdAndUpdate(applicant._id, {
//           jobFitScore: result.total_score,
//           technicalScore: result.technical_score,
//           experienceScore: result.experience_score,
//           educationScore: result.education_score,
//           softSkillsScore: result.soft_skills_score,
//           aiAnalysis: {
//             strengths: result.strengths || [],
//             improvements: result.improvements || [],
//             analysis: result.analysis || ''
//           }
//         });
//       }
//     }

//     return res.status(200).json({
//       message: 'Candidates ranked successfully',
//       candidates: rankingData.results
//     });
    
//   } catch (error) {
//     console.error('Error ranking candidates:', error);
//     return res.status(500).json({ 
//       error: error instanceof Error ? error.message : 'Internal server error' 
//     });
//   }
// }