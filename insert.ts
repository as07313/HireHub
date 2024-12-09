import mongoose from 'mongoose';
import Job from './models/Job'; // Adjust the path if necessary
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

const dummyJobs = [
  {
    title: "Senior UX Designer",
    department: "Design",
    location: "Washington",
    type: "Full Time",
    status: "active",
    applicants: 10,
    postedDate: new Date(),
    salary: "50k-80k/month",
    experience: "5+ years",
    employmentType: "Full-time",
    workplaceType: "Hybrid",
    teamSize: "10-20 people",
    education: "Bachelor's degree",
    logo: "https://example.com/logo.png",
    companyDescription: "A leading design company.",
    benefits: ["Flexible working hours", "Health insurance"],
    skills: ["UI/UX Design", "Figma", "Sketch"],
    description: "We are looking for a Senior UX Designer...",
    requirements: ["5+ years of experience", "Strong portfolio"]
  },
  {
    title: "Junior Frontend Developer",
    department: "Engineering",
    location: "New York",
    type: "Full Time",
    status: "active",
    applicants: 5,
    postedDate: new Date(),
    salary: "40k-60k/month",
    experience: "2+ years",
    employmentType: "Full-time",
    workplaceType: "Remote",
    teamSize: "5-10 people",
    education: "Bachelor's degree",
    logo: "https://example.com/logo.png",
    companyDescription: "A leading tech company.",
    benefits: ["Remote work", "Stock options"],
    skills: ["JavaScript", "React", "CSS"],
    description: "We are looking for a Junior Frontend Developer...",
    requirements: ["2+ years of experience", "Strong portfolio"]
  },
  // Add more dummy jobs as needed
];

Job.insertMany(dummyJobs)
  .then(() => {
    console.log('Dummy jobs inserted');
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error('Error inserting dummy jobs:', error);
    mongoose.connection.close();
  });