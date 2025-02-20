// pages/api/company/setup.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/mongodb';
import { Company } from '@/models/Company';
import { Recruiter } from '@/models/User'; // Import from User.ts instead
import { Apiauth } from '@/app/middleware/auth';
import { ICompany } from '@/models/Company';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectToDatabase();
    const user = await Apiauth(req, res);

    if (!user || user.type !== 'recruiter') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Create company with proper typing from ICompany interface
    const companyData: Partial<ICompany> = {
      name: req.body.name,
      logo: req.body.logo,
      website: req.body.website,
      industry: req.body.industry,
      size: req.body.size,
      founded: req.body.founded,
      headquarters: req.body.headquarters,
      description: req.body.description,
      location: {
        address: req.body.location.address,
        city: req.body.location.city,
        state: req.body.location.state,
        country: req.body.location.country
      },
      socialMedia: {
        linkedin: req.body.socialMedia?.linkedin,
        facebook: req.body.socialMedia?.facebook
      },
      status: 'active'
    };

    const company = await Company.create(companyData);

    // Update recruiter profile using Recruiter model from User.ts
    await Recruiter.findByIdAndUpdate(
      user.userId,
      { 
        companyId: company._id,
        profileComplete: true
      },
      { new: true }
    );

    return res.status(201).json({ 
      message: 'Company profile created successfully',
      company 
    });

  } catch (error) {
    console.error('Company setup error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to create company profile'
    });
  }
}