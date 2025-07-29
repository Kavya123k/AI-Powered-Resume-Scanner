import React, { useCallback, useState } from 'react';
import { Upload, FileText, CheckCircle, X } from 'lucide-react';

interface ResumeUploaderProps {
  onResumeUpload: (text: string) => void;
  resumeText: string;
}

const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onResumeUpload, resumeText }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      onResumeUpload(text);
    };
    reader.readAsText(file);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onResumeUpload(e.target.value);
    setFileName('');
  };

  const clearResume = () => {
    onResumeUpload('');
    setFileName('');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FileText className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Upload Resume</h2>
        </div>
        {resumeText && (
          <button
            onClick={clearResume}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {!resumeText ? (
        <div
          className={`border-2 border-dashed rounded-lg transition-all duration-300 ${
            isDragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="p-12 text-center">
            <Upload className={`h-12 w-12 mx-auto mb-4 transition-colors duration-300 ${
              isDragOver ? 'text-blue-500' : 'text-gray-400'
            }`} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Drop your resume here, or click to browse
            </h3>
            <p className="text-gray-600 mb-6">
              Supports .txt files or paste text directly
            </p>
            <input
              type="file"
              accept=".txt"
              onChange={handleFileInput}
              className="hidden"
              id="resume-upload"
            />
            <label 
              htmlFor="resume-upload"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 cursor-pointer transition-colors duration-200"
            >
              Choose File
            </label>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {fileName && (
            <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-green-800">File uploaded: {fileName}</span>
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resume Text (you can edit if needed)
            </label>
            <textarea
              value={resumeText}
              onChange={handleTextareaChange}
              placeholder="Paste your resume text here or upload a .txt file above..."
              className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUploader;