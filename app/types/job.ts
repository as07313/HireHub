// types/job.ts
export interface BaseJob {
  _id: string;
  title: string;
  department: string;
  location: string;
  workplaceType: 'onsite' | 'hybrid' | 'remote';
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
  status: 'active' | 'inactive' | 'closed';
  salary: {
    min: string;
    max: string;
  };
  experience: 'entry' | 'mid' | 'senior' | 'lead';
  description: string;
  requirements: string[];
  benefits: string[];
  skills: string[];
  postedDate: Date;
  appliedDate?: Date;
}

// UI specific job interface
export interface JobUI {
  id: string;
  title: string;
  company: string; // maps to department
  logo: string;
  location: string;
  salary: string;
  type: string; // maps to employmentType
  postedDate: string;
  status?: string;
  appliedDate?: string;
  savedDate?: string;
}