// import http from 'k6/http';
// import { check, sleep } from 'k6';


// const BASE_URL = 'http://localhost:3000';

// // --- Test Options ---
// export const options = {
//   stages: [
//     { duration: '30s', target: 20 }, // Ramp up to 20 virtual users over 30s
//     { duration: '1m', target: 20 },  // Stay at 20 VUs for 1 minute
//     { duration: '10s', target: 0 },  // Ramp down to 0 VUs over 10s
//   ],
//   thresholds: {
//     http_req_failed: ['rate<0.01'], // Less than 1% failed requests
//     http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
//   },
// };

// // --- Test Scenario ---
// export default function () {
//   // 1. Candidate Login
//   const loginPayload = JSON.stringify({
//     email: 'ahmedshoaib.genius229@gmail.com',
//     password: 'Ahmed.12345'
//   });

//   const loginParams = {
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   };

//   const loginRes = http.post(`${BASE_URL}/api/auth/candidate/login`, loginPayload, loginParams);

//   // Check if login was successful
//   const loginCheck = check(loginRes, {
//     'Candidate login successful (status 200)': (r) => r.status === 200,
//     'Login response contains token': (r) => r.json('token') !== null,
//   });

//   // Abort VU iteration if login fails
//   if (!loginCheck) {
//     console.error(`Login failed for VU ${__VU}: ${loginRes.status} ${loginRes.body}`);
//     return;
//   }

// }



import http from 'k6/http';
import { check, sleep, fail } from 'k6';
import { SharedArray } from 'k6/data';

const BASE_URL = 'http://localhost:3000';

// --- Test Data ---
// Use SharedArray for data that needs to be read by multiple VUs
const candidateCredentials = new SharedArray('candidateUsers', function () {
  // Load candidate credentials from a JSON file or define them here
  // Ensure you have enough unique users for your target VUs
  return [
    { email: 'ahmedshoaib.genius229@gmail.com', password: 'Ahmed.12345' },
    // Add more candidate users if needed
  ];
});

const recruiterCredentials = new SharedArray('recruiterUsers', function () {
  // Load recruiter credentials from a JSON file or define them here
  return [
    { email: 'as07313@st.habib.edu.pk', password: '12345678' }, // Replace with actual recruiter credentials
    // Add more recruiter users if needed
  ];
});

// Dummy file content for resume upload
const resumeFileName = 'test-resume.pdf';
const resumeFileContent = http.file('This is a dummy PDF content.', resumeFileName, 'application/pdf');

// --- Test Options ---
export const options = {
  stages: [
    { duration: '30s', target: 10 }, // Ramp up to 10 VUs (5 candidates, 5 recruiters) over 30s
    { duration: '1m', target: 10 },  // Stay at 10 VUs for 1 minute
    { duration: '10s', target: 0 },  // Ramp down
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'], // Allow slightly higher failure rate for complex scenarios
    http_req_duration: ['p(95)<1000'], // 95% of requests below 1000ms
    'checks{scenario:candidate}': ['rate>0.95'], // Candidate checks should pass >95%
    'checks{scenario:recruiter}': ['rate>0.95'], // Recruiter checks should pass >95%
  },
  scenarios: {
    candidate: {
      executor: 'ramping-vus',
      stages: [ // VUs dedicated to candidate flow
        { duration: '30s', target: 5 },
        { duration: '1m', target: 5 },
        { duration: '10s', target: 0 },
      ],
      exec: 'candidateFlow',
      env: { USER_TYPE: 'candidate' },
    },
    recruiter: {
      executor: 'ramping-vus',
      stages: [ // VUs dedicated to recruiter flow
        { duration: '30s', target: 5 },
        { duration: '1m', target: 5 },
        { duration: '10s', target: 0 },
      ],
      exec: 'recruiterFlow',
      env: { USER_TYPE: 'recruiter' },
      startTime: '5s', // Start recruiter flow slightly after candidate flow
    },
  },
};

// --- Helper Functions ---
function loginUser(email, password, userType) {
  const loginPayload = JSON.stringify({ email, password });
  const loginParams = {
    headers: { 'Content-Type': 'application/json' },
    tags: { name: `${userType}Login` },
  };
  const loginRes = http.post(`${BASE_URL}/api/auth/${userType}/login`, loginPayload, loginParams);

  const loginCheck = check(loginRes, {
    [`${userType} login successful (status 200)`]: (r) => r.status === 200,
    [`${userType} login response contains token`]: (r) => r.json('token') !== null,
  });

  if (!loginCheck) {
    console.error(`${userType} Login failed for VU ${__VU}: ${loginRes.status} ${loginRes.body}`);
    return null;
  }
  return loginRes.json('token');
}

// --- Setup Function (Runs once before the test) ---
export function setup() {
  console.log('Setting up test data...');

  // 1. Login a recruiter to create/find a job
  const recruiterCred = recruiterCredentials[0]; // Use the first recruiter for setup
  const recruiterToken = loginUser(recruiterCred.email, recruiterCred.password, 'recruiter');
  if (!recruiterToken) {
    fail('Recruiter login failed during setup. Aborting test.');
  }
  const recruiterAuthHeaders = { 'Authorization': `Bearer ${recruiterToken}` };

  // 2. Create a new job for testing
  const jobPayload = JSON.stringify({
    title: `Load Test Job ${Date.now()}`,
    department: 'Engineering',
    location: 'Remote',
    workplaceType: 'remote',
    employmentType: 'full-time',
    description: 'Job created for load testing.',
    requirements: 'Req1\nReq2',
    benefits: 'Benefit1\nBenefit2',
    skills: 'k6,javascript,testing',
    salary: { min: 60000, max: 90000, currency: 'USD', period: 'annual' },
    experience: '2+ years'
  });
  const createJobRes = http.post(`${BASE_URL}/api/jobs/`, jobPayload, { headers: { ...recruiterAuthHeaders, 'Content-Type': 'application/json' } });
  let jobId;
  if (check(createJobRes, { 'Job created successfully': (r) => r.status === 201 })) {
    jobId = createJobRes.json('_id');
    console.log(`Created Job ID: ${jobId}`);
  } else {
      // Fallback: Try to find an existing job if creation fails
      const getJobsRes = http.get(`${BASE_URL}/api/jobs/`, { headers: recruiterAuthHeaders });
      if (check(getJobsRes, {'Got recruiter jobs': r => r.status === 200}) && getJobsRes.json().length > 0) {
          jobId = getJobsRes.json()[0]._id;
          console.log(`Using existing Job ID: ${jobId}`);
      } else {
          fail('Failed to create or find a job during setup. Aborting test.');
      }
  }


  // 3. Login a candidate to upload a resume
  const candidateCred = candidateCredentials[0]; // Use the first candidate for setup
  const candidateToken = loginUser(candidateCred.email, candidateCred.password, 'candidate');
  if (!candidateToken) {
    fail('Candidate login failed during setup. Aborting test.');
  }
  const candidateAuthHeaders = { 'Authorization': `Bearer ${candidateToken}` };

  // 4. Upload a resume for the candidate
  const resumeData = {
    file: resumeFileContent,
  };
  const uploadResumeRes = http.post(`${BASE_URL}/api/resume`, resumeData, { headers: candidateAuthHeaders });
  let resumeId;
   if (check(uploadResumeRes, { 'Resume uploaded successfully': (r) => r.status === 201 })) {
       // Assuming the response body directly contains the new resume object or message
       // Adjust based on your actual API response structure for resume upload
       // If the ID is nested, use r.json('resume._id') or similar
       // Let's assume for now the API returns the ID directly or we fetch it
       const getResumesRes = http.get(`${BASE_URL}/api/resume`, { headers: candidateAuthHeaders });
       if (check(getResumesRes, {'Got resumes': r => r.status === 200}) && getResumesRes.json().length > 0) {
           resumeId = getResumesRes.json()[0]._id; // Get the latest uploaded resume ID
           console.log(`Uploaded/Using Resume ID: ${resumeId}`);
       } else {
            fail('Failed to upload or find a resume during setup. Aborting test.');
       }
   } else {
       // Fallback: Try to find an existing resume if upload fails
       const getResumesRes = http.get(`${BASE_URL}/api/resume`, { headers: candidateAuthHeaders });
       if (check(getResumesRes, {'Got resumes': r => r.status === 200}) && getResumesRes.json().length > 0) {
           resumeId = getResumesRes.json()[0]._id;
           console.log(`Using existing Resume ID: ${resumeId}`);
       } else {
           fail('Failed to upload or find a resume during setup. Aborting test.');
       }
   }


  console.log('Setup complete.');
  return { jobId, resumeId }; // Pass data to VUs
}


// --- Candidate Scenario ---
export function candidateFlow(data) {
  // Get unique credentials for this VU
  const vuId = __VU - 1; // VU IDs start from 1
  const cred = candidateCredentials[vuId % candidateCredentials.length];
  const userType = 'candidate';

  // 1. Login
  const token = loginUser(cred.email, cred.password, userType);
  if (!token) {
    return; // Stop this iteration if login fails
  }
  const authHeaders = { 'Authorization': `Bearer ${token}` };

  // 2. Get User Profile
  const profileRes = http.get(`${BASE_URL}/api/user/profile`, { headers: authHeaders, tags: { name: 'CandidateGetProfile' } });
  check(profileRes, { 'Get profile successful': (r) => r.status === 200 }, { scenario: userType });
  sleep(1);

  // 3. Get All Jobs
  const jobsRes = http.get(`${BASE_URL}/api/jobs`, { tags: { name: 'CandidateGetJobs' } });
  check(jobsRes, { 'Get all jobs successful': (r) => r.status === 200 }, { scenario: userType });
  sleep(1);

  // 4. Get Specific Job Details (using jobId from setup)
  const jobDetailsRes = http.get(`${BASE_URL}/api/jobs/${data.jobId}`, { tags: { name: 'CandidateGetJobDetails' } });
  check(jobDetailsRes, { 'Get job details successful': (r) => r.status === 200 }, { scenario: userType });
  sleep(1);

  // 5. Apply for Job (using jobId and resumeId from setup)
  const applyPayload = JSON.stringify({
    jobId: data.jobId,
    resumeId: data.resumeId,
    coverLetter: 'This is a load test application.'
  });
  const applyRes = http.post(`${BASE_URL}/api/applications`, applyPayload, { headers: { ...authHeaders, 'Content-Type': 'application/json' }, tags: { name: 'CandidateApplyJob' } });
  // Allow 400 for "Already applied" during load test
  check(applyRes, { 'Apply job successful or already applied': (r) => r.status === 201 || r.status === 400 }, { scenario: userType });
  sleep(2);

  // 6. Get Applied Jobs
  const appliedJobsRes = http.get(`${BASE_URL}/api/applications/candidate`, { headers: authHeaders, tags: { name: 'CandidateGetAppliedJobs' } });
  check(appliedJobsRes, { 'Get applied jobs successful': (r) => r.status === 200 }, { scenario: userType });
  sleep(1);

  // 7. Save Job (using jobId from setup)
  const saveJobPayload = JSON.stringify({ jobId: data.jobId });
  // Note: Your API uses POST for saving, adjust if it changes
  const saveJobRes = http.post(`${BASE_URL}/api/jobs/saved/${data.jobId}`, saveJobPayload, { headers: { ...authHeaders, 'Content-Type': 'application/json' }, tags: { name: 'CandidateSaveJob' } });
  check(saveJobRes, { 'Save job successful': (r) => r.status === 200 }, { scenario: userType });
  sleep(1);

  // 8. Get Saved Jobs
  const savedJobsRes = http.get(`${BASE_URL}/api/jobs/saved`, { headers: authHeaders, tags: { name: 'CandidateGetSavedJobs' } });
  check(savedJobsRes, { 'Get saved jobs successful': (r) => r.status === 200 }, { scenario: userType });
  sleep(2);

  // 9. Logout (Optional, depends if session persistence matters for the test)
  // http.post(`${BASE_URL}/api/auth/candidate/logout`, null, { headers: authHeaders });
}

// --- Recruiter Scenario ---
export function recruiterFlow(data) {
  // Get unique credentials for this VU
  const vuId = __VU - 1; // VU IDs start from 1
  const cred = recruiterCredentials[vuId % recruiterCredentials.length];
  const userType = 'recruiter';

  // 1. Login
  const token = loginUser(cred.email, cred.password, userType);
  if (!token) {
    return; // Stop this iteration if login fails
  }
  const authHeaders = { 'Authorization': `Bearer ${token}` };

  // 2. Get Recruiter Jobs
  const recruiterJobsRes = http.get(`${BASE_URL}/api/jobs/recruiter`, { headers: authHeaders, tags: { name: 'RecruiterGetJobs' } });
  check(recruiterJobsRes, { 'Get recruiter jobs successful': (r) => r.status === 200 }, { scenario: userType });
  sleep(1);

  // 3. Get Job Applicants (using jobId from setup)
  const applicantsRes = http.get(`${BASE_URL}/api/jobs/${data.jobId}/applicants`, { headers: authHeaders, tags: { name: 'RecruiterGetApplicants' } });
  check(applicantsRes, { 'Get applicants successful': (r) => r.status === 200 }, { scenario: userType });
  sleep(2);

  // 4. Trigger Candidate Ranking (using jobId from setup)
  const rankPayload = JSON.stringify({ forceRefresh: false }); // Don't force refresh usually
  const rankRes = http.post(`${BASE_URL}/api/jobs/${data.jobId}/rank-candidates`, rankPayload, { headers: { ...authHeaders, 'Content-Type': 'application/json' }, tags: { name: 'RecruiterRankCandidates' } });
  // 202 Accepted is the expected response for starting the process
  check(rankRes, { 'Rank candidates request accepted': (r) => r.status === 202 || r.status === 200 }, { scenario: userType });
  sleep(1);

  // 5. Check Ranking Status (Poll once)
  const rankStatusRes = http.get(`${BASE_URL}/api/jobs/${data.jobId}/ranking-status`, { headers: authHeaders, tags: { name: 'RecruiterCheckRankingStatus' } });
  check(rankStatusRes, { 'Check ranking status successful': (r) => r.status === 200 }, { scenario: userType });
  sleep(3); // Wait a bit longer after triggering ranking

  // 6. Get Dashboard Stats
  const statsRes = http.get(`${BASE_URL}/api/dashboard/stats`, { headers: authHeaders, tags: { name: 'RecruiterGetStats' } });
  check(statsRes, { 'Get dashboard stats successful': (r) => r.status === 200 }, { scenario: userType });
  sleep(1);

  // 7. Get Dashboard Chart Data
  const chartRes = http.get(`${BASE_URL}/api/dashboard/chart`, { headers: authHeaders, tags: { name: 'RecruiterGetChart' } });
  check(chartRes, { 'Get dashboard chart successful': (r) => r.status === 200 }, { scenario: userType });
  sleep(2);

  // 8. Logout (Optional)
  // http.post(`${BASE_URL}/api/auth/recruiter/logout`, null, { headers: authHeaders });
}


// --- Teardown Function (Runs once after the test) ---
export function teardown(data) {
  if (!data.jobId) {
      console.warn('Skipping teardown: No Job ID available from setup.');
      return;
  }
  console.log(`Tearing down test data (Job ID: ${data.jobId}, Resume ID: ${data.resumeId})...`);

  // 1. Login recruiter to delete the job
  const recruiterCred = recruiterCredentials[0];
  const recruiterToken = loginUser(recruiterCred.email, recruiterCred.password, 'recruiter');
  if (recruiterToken) {
    const recruiterAuthHeaders = { 'Authorization': `Bearer ${recruiterToken}` };
    // Delete the job created during setup (assuming DELETE /api/jobs/[id] works)
    // Your API uses PUT to update status to 'closed', let's use that
    const closeJobRes = http.put(`${BASE_URL}/api/jobs/${data.jobId}`, JSON.stringify({ status: 'closed' }), { headers: { ...recruiterAuthHeaders, 'Content-Type': 'application/json' } });
    check(closeJobRes, { 'Job closed during teardown': (r) => r.status === 200 });
    console.log(`Attempted to close job ${data.jobId}: Status ${closeJobRes.status}`);
  } else {
      console.warn('Recruiter login failed during teardown, cannot close job.');
  }

  // 2. Login candidate to delete the resume
  if (data.resumeId) {
      const candidateCred = candidateCredentials[0];
      const candidateToken = loginUser(candidateCred.email, candidateCred.password, 'candidate');
      if (candidateToken) {
          const candidateAuthHeaders = { 'Authorization': `Bearer ${candidateToken}` };
          // Delete the resume created/used during setup
          const deleteResumeRes = http.del(`${BASE_URL}/api/resume/${data.resumeId}`, null, { headers: candidateAuthHeaders });
          check(deleteResumeRes, { 'Resume deleted during teardown': (r) => r.status === 200 });
          console.log(`Attempted to delete resume ${data.resumeId}: Status ${deleteResumeRes.status}`);
      } else {
          console.warn('Candidate login failed during teardown, cannot delete resume.');
      }
  } else {
      console.warn('Skipping resume deletion: No Resume ID available from setup.');
  }

  console.log('Teardown complete.');
}

