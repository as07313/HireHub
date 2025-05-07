import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/mongodb';
import { Company, ICompany } from '@/models/Company'; // Ensure ICompany is imported
import { Recruiter } from '@/models/User'; 
import { Apiauth } from '@/app/middleware/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  const user = await Apiauth(req, res);

  if (!user || user.type !== 'recruiter') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Handle GET request to fetch existing company data
  if (req.method === 'GET') {
    try {
      const recruiter = await Recruiter.findById(user.userId).populate('companyId');
      
      if (recruiter && recruiter.companyId) {
        const company = recruiter.companyId as ICompany; // companyId is populated
        // Ensure all fields expected by the form are present and correctly formatted
        const companyData = {
            ...company.toObject(), // Get plain object
            _id: (company._id as import('mongoose').Types.ObjectId).toString(), // Ensure _id is a string
            // Provide defaults for nested objects if they might be missing
            location: company.location ? {
                address: company.location.address || "",
                city: company.location.city || "",
                state: company.location.state || "",
                country: company.location.country || ""
            } : { address: "", city: "", state: "", country: "" },
            socialMedia: company.socialMedia ? {
                linkedin: company.socialMedia.linkedin || "",
                facebook: company.socialMedia.facebook || ""
            } : { linkedin: "", facebook: "" }
        };
        return res.status(200).json(companyData);
      }
      return res.status(404).json({ error: 'Company profile not found for this recruiter.' });
    } catch (error) {
      console.error('Error fetching company data (GET):', error);
      return res.status(500).json({ error: 'Failed to fetch company data' });
    }
  }

  // Handle POST request to create a new company profile
  if (req.method === 'POST') {
    try {
      // Check if the recruiter already has a companyId
      const existingRecruiter = await Recruiter.findById(user.userId);
      if (existingRecruiter && existingRecruiter.companyId) {
        return res.status(409).json({ error: 'A company profile already exists for this recruiter. Please update the existing one.' });
      }

      const companyData: Partial<ICompany> = {
        name: req.body.name,
        logo: req.body.logo,
        website: req.body.website,
        industry: req.body.industry,
        size: req.body.size,
        founded: req.body.founded,
        headquarters: req.body.headquarters,
        description: req.body.description,
        location: req.body.location,
        socialMedia: req.body.socialMedia,
        status: 'active'
      };

      const company = await Company.create(companyData);

      await Recruiter.findByIdAndUpdate(
        user.userId,
        { 
          companyId: company._id,
          profileComplete: true // Consider basing this on actual completion percentage
        },
        { new: true }
      );

      return res.status(201).json({ 
        message: 'Company profile created successfully',
        company: { ...company.toObject(), _id: (company._id as import('mongoose').Types.ObjectId).toString() }
      });

    } catch (error: any) {
      console.error('Company setup error (POST):', error);
      if (error.code === 11000) { // MongoDB duplicate key error
        return res.status(409).json({ error: 'A company with this name already exists.' });
      }
      return res.status(500).json({
        error: error.message || 'Failed to create company profile'
      });
    }
  }

  // Handle PUT request to update an existing company profile
  if (req.method === 'PUT') {
    try {
      const recruiter = await Recruiter.findById(user.userId);
      if (!recruiter || !recruiter.companyId) {
        return res.status(404).json({ error: 'No company profile found to update for this recruiter.' });
      }

      const companyId = recruiter.companyId;
      const updateData = req.body;

      // Ensure _id is not part of the update payload sent to MongoDB's findByIdAndUpdate
      if (updateData._id) {
        delete updateData._id;
      }
      
      const updatedCompany = await Company.findByIdAndUpdate(
        companyId,
        updateData,
        { new: true, runValidators: true } // new: true returns the updated doc, runValidators ensures schema validation
      );

      if (!updatedCompany) {
        return res.status(404).json({ error: 'Failed to find and update company profile.' });
      }
      
      // Optionally update recruiter's profileComplete status if needed
      // await Recruiter.findByIdAndUpdate(user.userId, { profileComplete: true });


      return res.status(200).json({ 
        message: 'Company profile updated successfully',
        company: { ...updatedCompany.toObject(), _id: (updatedCompany._id as import('mongoose').Types.ObjectId).toString() }
      });

    } catch (error: any) {
      console.error('Company update error (PUT):', error);
      if (error.code === 11000) {
         return res.status(409).json({ error: 'A company with this name already exists.' });
      }
      return res.status(500).json({
        error: error.message || 'Failed to update company profile'
      });
    }
  }

  // If method is not GET, POST, or PUT
  return res.status(405).json({ error: 'Method not allowed' });
}