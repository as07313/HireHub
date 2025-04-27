# HireHub - Intelligent Job Portal

<!-- ![HireHub Logo](https://placeholder.com/logo.png) Replace with actual logo URL -->

A modern job portal connecting candidates with recruiters using AI-powered matching.

<!-- [![Deploy with Vercel](https://vercel.com/button)](https://hirehub-lime.vercel.app/) Replace with actual Vercel deployment link -->

## 📋 Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Usage](#usage)
- [Testing](#testing)
- [Deployment](#deployment)
- [Project Team](#project-team)

## 🚀 Overview

HireHub is a comprehensive job portal designed to streamline the connection between job seekers and recruiters. Built on a modern tech stack featuring Next.js, TypeScript, and Tailwind CSS, the platform offers an intuitive experience for both parties.

Our platform's standout feature is the AI-powered resume parsing and analysis system. Leveraging **LlamaParse**, **Llama Index**, **Llama Cloud**, and **OpenAI's GPT-4o-mini model**, it provides recruiters with data-driven insights like job fit scores, skills matching, and candidate ranking to optimize the hiring process.

## 🌐 Live Demo

The application is deployed and accessible live on Vercel:

**[https://hirehub.vercel.app](https://hirehub-lime.vercel.app/)** 

## ✨ Features

### For Candidates
- **Secure Authentication** - Account creation with email verification
- **Advanced Job Search** - Filter by keywords, location, category, job type, and experience level
- **Resume Management** - Upload and manage multiple resumes (PDF, DOC, DOCX)
- **Application Tracking** - Monitor status of submitted applications
- **Job Bookmarking** - Save interesting positions for later review
- **Profile Management** - Update personal information and preferences

### For Recruiters
- **Company Profile** - Create and manage detailed company information
- **Job Posting** - Create and manage job listings with comprehensive details
- **Applicant Tracking** - View, filter, and manage applicants by stage
- **AI-Powered Analysis** - Automated resume parsing (**LlamaParse**), skills matching, and job fit scores using **OpenAI GPT-4o-mini** and **Llama Index**.
- **Analytics Dashboard** - Gain insights into job performance and applicant trends
- **Candidate Management** - Track and update candidate status throughout the hiring process

### Core System Features
- **Role-Based Access** - Separate interfaces for candidates and recruiters
- **Responsive Design** - Optimized for all device sizes
- **Notifications** - Real-time updates on important events
- **API Integration** - Separate Python service for AI resume analysis using **FastAPI**.

## 🛠️ Technology Stack

### Frontend
- **Next.js** (v15+) - React framework for server-rendered applications
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Component library built on Radix UI primitives
- **Framer Motion** - Animation library
- **Chart.js/Recharts** - Data visualization
- **Sonner** - Toast notifications

### Backend (Next.js)
- **Next.js API Routes** - Server-side API functionality
- **MongoDB with Mongoose** - Database and ODM
- **JWT** - Authentication
- **Formidable** - File upload handling
- **Nodemailer** - Email services

### AI Resume Parser & Analysis (Python Service)
- **FastAPI** - Python web framework for the API
- **LlamaParse** - Document parsing (PDF, DOCX)
- **Llama Index** - Data framework for connecting LLMs with external data (used for retrieval and knowledge base)
- **OpenAI GPT-4o-mini** - Language model for analysis, metadata extraction, and ranking
- **Uvicorn** - ASGI server

### Infrastructure & Services
- **Llama Cloud** - Managed service for indexing, pipelines, and storing parsed/embedded data
- **Redis** - Caching (e.g., for ranking results)
- **RabbitMQ** - Message queue for background tasks (e.g., resume processing)
- **AWS S3 / Cloudflare R2** - File storage (optional, for original resumes or parsed markdown)

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.8+)
- MongoDB instance
- Redis server
- RabbitMQ server
- OpenAI API Key
- Llama Cloud API Key

### Installation

#### Frontend Setup
```bash
# Clone the repository
git clone <repository-url>
cd Nextjs-app

# Install dependencies
npm install
# or
yarn install

#### Backend Parser Setup
```bash
# Navigate to Python directory
cd lib/python

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

# Install Python dependencies
pip install -r requirements.txt
```

### Configuration

Create a `.env.local` file in the root directory with the following variables:

```
# Required
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>
JWT_SECRET=your_strong_jwt_secret_key
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://guest:guest@localhost:5672
PYTHON_API_URL=http://localhost:8000

# Email Configuration
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email_username
EMAIL_PASS=your_email_password
EMAIL_FROM="HireHub <noreply@yourdomain.com>"

# Optional - S3 Storage
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=your_aws_region
S3_BUCKET_NAME=your_s3_bucket_name

# Application URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

For the Python parser, create a `.env` file in `lib/python` directory:
```
OPENAI_API_KEY=your_openai_api_key  # If using OpenAI integration
```

## 🖥️ Usage

### Starting the Services

1. **Start the Resume Parser API**:
   ```bash
   cd lib/python
   uvicorn api:app --reload --port 8000
   ```

2. **Start the Next.js Application**:
   ```bash
   # In the project root
   npm run dev
   ```

3. Access the application at [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

Run the test suite:
```bash
npm test
# or in watch mode
npm run test:watch
```

## 🚢 Deployment

Deployment instructions will vary based on your hosting provider. For production, ensure:

1. All environment variables are properly configured
2. Build the application with `npm run build`
3. Deploy both the Next.js application and Python parser service

## 👥 Project Team

**Final Year Project Group Members:**
- Ahmed Shoaib
- Vania Imran
- Asad Muhammad
- Syed Nisar Hussain

---

© 2025 HireHub. All rights reserved.
