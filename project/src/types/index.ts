export interface AnalysisResult {
  overallScore: number;
  categoryScores: {
    skills: number;
    experience: number;
    education: number;
    keywords: number;
  };
  matchedSkills: string[];
  missingSkills: string[];
  matchedKeywords: string[];
  recommendations: string[];
  strengths: string[];
  improvements: string[];
  detailedAnalysis: {
    skillsAnalysis: {
      technical: string[];
      soft: string[];
      missing: string[];
    };
    experienceAnalysis: {
      relevantYears: number;
      matchingRoles: string[];
      industryMatch: boolean;
    };
    keywordDensity: {
      [key: string]: number;
    };
  };
}