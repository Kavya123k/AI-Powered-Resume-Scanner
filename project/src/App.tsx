import React, { useState } from 'react';
import { Upload, FileText, Target, BarChart3, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import ResumeUploader from './components/ResumeUploader';
import JobDescriptionInput from './components/JobDescriptionInput';
import AnalysisResults from './components/AnalysisResults';
import { analyzeResume } from './utils/resumeAnalyzer';
import type { AnalysisResult } from './types';

function App() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleAnalyze = async () => {
    if (!resumeText || !jobDescription) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis time for better UX
    setTimeout(() => {
      const result = analyzeResume(resumeText, jobDescription);
      setAnalysisResult(result);
      setIsAnalyzing(false);
      setCurrentStep(3);
    }, 2000);
  };

  const handleReset = () => {
    setResumeText('');
    setJobDescription('');
    setAnalysisResult(null);
    setCurrentStep(1);
  };

  const canProceedToStep2 = resumeText.length > 0;
  const canAnalyze = resumeText.length > 0 && jobDescription.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Resume Scanner</h1>
                <p className="text-sm text-gray-600">Intelligent resume analysis powered by advanced NLP</p>
              </div>
            </div>
            {analysisResult && (
              <button 
                onClick={handleReset}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>New Analysis</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-12">
          {[
            { step: 1, title: 'Upload Resume', icon: FileText, active: currentStep >= 1, completed: resumeText.length > 0 },
            { step: 2, title: 'Job Description', icon: Target, active: currentStep >= 2, completed: jobDescription.length > 0 },
            { step: 3, title: 'Analysis Results', icon: TrendingUp, active: currentStep >= 3, completed: !!analysisResult }
          ].map(({ step, title, icon: Icon, active, completed }) => (
            <div key={step} className="flex items-center">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                completed 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : active 
                    ? 'bg-blue-500 border-blue-500 text-white' 
                    : 'bg-gray-100 border-gray-300 text-gray-400'
              }`}>
                {completed ? <CheckCircle className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
              </div>
              <div className="ml-4">
                <h3 className={`text-sm font-medium ${active ? 'text-gray-900' : 'text-gray-500'}`}>
                  Step {step}
                </h3>
                <p className={`text-xs ${active ? 'text-gray-600' : 'text-gray-400'}`}>
                  {title}
                </p>
              </div>
              {step < 3 && (
                <div className={`flex-1 h-0.5 mx-8 ${completed ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Step 1: Resume Upload */}
          <div className={`transition-all duration-500 ${currentStep === 1 ? 'opacity-100' : currentStep > 1 ? 'opacity-60' : 'opacity-100'}`}>
            <ResumeUploader 
              onResumeUpload={setResumeText}
              resumeText={resumeText}
            />
            {canProceedToStep2 && currentStep === 1 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <span>Continue to Job Description</span>
                  <Target className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Step 2: Job Description */}
          {currentStep >= 2 && (
            <div className={`transition-all duration-500 ${currentStep === 2 ? 'opacity-100' : currentStep > 2 ? 'opacity-60' : 'opacity-100'}`}>
              <JobDescriptionInput 
                jobDescription={jobDescription}
                onJobDescriptionChange={setJobDescription}
              />
              {canAnalyze && currentStep === 2 && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Analyzing Resume...</span>
                      </>
                    ) : (
                      <>
                        <BarChart3 className="h-4 w-4" />
                        <span>Analyze Resume</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Analysis Results */}
          {currentStep >= 3 && analysisResult && (
            <div className="transition-all duration-500 opacity-100">
              <AnalysisResults result={analysisResult} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;