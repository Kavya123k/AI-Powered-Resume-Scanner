import React from 'react';
import { Trophy, TrendingUp, AlertTriangle, CheckCircle, Target, BookOpen, Award, Lightbulb } from 'lucide-react';
import type { AnalysisResult } from '../types';

interface AnalysisResultsProps {
  result: AnalysisResult;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const ScoreCard = ({ title, score, icon: Icon, description }: { 
    title: string; 
    score: number; 
    icon: React.ElementType; 
    description: string;
  }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon className="h-5 w-5 text-gray-600" />
          <h3 className="font-medium text-gray-900">{title}</h3>
        </div>
        <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
          {score}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${getScoreBgColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Overall Score Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Resume Analysis Complete</h2>
            <p className="text-blue-100">
              Your resume has been analyzed against the job requirements
            </p>
          </div>
          <div className="text-center">
            <div className="bg-white/20 rounded-full p-6 mb-2">
              <Trophy className="h-12 w-12 text-white" />
            </div>
            <div className="text-4xl font-bold">{result.overallScore}%</div>
            <div className="text-sm text-blue-100">Overall Match</div>
          </div>
        </div>
      </div>

      {/* Category Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ScoreCard 
          title="Skills Match"
          score={result.categoryScores.skills}
          icon={Target}
          description="How well your skills align with job requirements"
        />
        <ScoreCard 
          title="Experience"
          score={result.categoryScores.experience}
          icon={TrendingUp}
          description="Relevance of your professional experience"
        />
        <ScoreCard 
          title="Education"
          score={result.categoryScores.education}
          icon={BookOpen}
          description="Educational background alignment"
        />
        <ScoreCard 
          title="Keywords"
          score={result.categoryScores.keywords}
          icon={Award}
          description="Presence of important job keywords"
        />
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Strengths */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <h3 className="text-xl font-semibold text-gray-900">Strengths</h3>
          </div>
          <div className="space-y-3">
            {result.strengths.map((strength, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                <p className="text-gray-700">{strength}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Areas for Improvement */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
            <h3 className="text-xl font-semibold text-gray-900">Areas for Improvement</h3>
          </div>
          <div className="space-y-3">
            {result.improvements.map((improvement, index) => (
              <div key={index} className="flex items-start space-x-3">
                <AlertTriangle className="h-4 w-4 text-orange-500 mt-1 flex-shrink-0" />
                <p className="text-gray-700">{improvement}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills Analysis */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Target className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">Skills Analysis</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-green-700 mb-3">Matched Skills ({result.matchedSkills.length})</h4>
            <div className="flex flex-wrap gap-2">
              {result.matchedSkills.map((skill, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-red-700 mb-3">Missing Skills ({result.missingSkills.length})</h4>
            <div className="flex flex-wrap gap-2">
              {result.missingSkills.map((skill, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Lightbulb className="h-6 w-6 text-yellow-600" />
          <h3 className="text-xl font-semibold text-gray-900">Recommendations</h3>
        </div>
        <div className="space-y-4">
          {result.recommendations.map((recommendation, index) => (
            <div 
              key={index}
              className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg"
            >
              <div className="flex items-start space-x-3">
                <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">{recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Keyword Analysis */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Award className="h-6 w-6 text-purple-600" />
          <h3 className="text-xl font-semibold text-gray-900">Keyword Analysis</h3>
        </div>
        
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">Found Keywords</h4>
          <div className="flex flex-wrap gap-2">
            {result.matchedKeywords.map((keyword, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;