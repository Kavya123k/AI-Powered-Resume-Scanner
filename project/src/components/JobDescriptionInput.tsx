import React from 'react';
import { Target, Briefcase } from 'lucide-react';

interface JobDescriptionInputProps {
  jobDescription: string;
  onJobDescriptionChange: (description: string) => void;
}

const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({ 
  jobDescription, 
  onJobDescriptionChange 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center space-x-3 mb-6">
        <Target className="h-6 w-6 text-indigo-600" />
        <h2 className="text-xl font-semibold text-gray-900">Job Description</h2>
      </div>

      <div className="space-y-4">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <div className="flex items-start space-x-3">
            <Briefcase className="h-5 w-5 text-indigo-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-indigo-900">Analysis Tip</h3>
              <p className="text-sm text-indigo-700 mt-1">
                Paste the complete job description including requirements, skills, and qualifications for the most accurate analysis.
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Description & Requirements
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => onJobDescriptionChange(e.target.value)}
            placeholder="Paste the job description here including required skills, qualifications, and experience..."
            className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="text-sm text-gray-500">
          Characters: {jobDescription.length} | Words: {jobDescription.split(/\s+/).filter(word => word.length > 0).length}
        </div>
      </div>
    </div>
  );
};

export default JobDescriptionInput;