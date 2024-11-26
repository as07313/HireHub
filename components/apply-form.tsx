// components/ApplyForm.tsx

import React, { useState } from 'react';

const ApplyForm: React.FC = () => {
  const [cv, setCv] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState<File | null>(null);

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCv(e.target.files[0]);
    }
  };

  const handleCoverLetterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCoverLetter(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('CV:', cv);
    console.log('Cover Letter:', coverLetter);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Upload CV</label>
        <input type="file" accept=".pdf,.doc,.docx" onChange={handleCvChange} className="mt-1 block w-full" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Upload Cover Letter</label>
        <input type="file" accept=".pdf,.doc,.docx" onChange={handleCoverLetterChange} className="mt-1 block w-full" />
      </div>
      <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded-md">Submit</button>
    </form>
  );
};

export default ApplyForm;