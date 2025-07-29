import type { AnalysisResult } from '../types';

// Common technical skills and their variations
const TECHNICAL_SKILLS = [
  'javascript', 'python', 'java', 'react', 'node.js', 'typescript', 'html', 'css',
  'sql', 'mongodb', 'postgresql', 'git', 'docker', 'kubernetes', 'aws', 'azure',
  'machine learning', 'data analysis', 'artificial intelligence', 'angular', 'vue.js',
  'php', 'ruby', 'go', 'rust', 'c++', 'c#', '.net', 'spring', 'django', 'flask',
  'express', 'graphql', 'rest api', 'microservices', 'devops', 'ci/cd', 'jenkins',
  'terraform', 'linux', 'unix', 'bash', 'powershell', 'agile', 'scrum', 'jira'
];

// Common soft skills
const SOFT_SKILLS = [
  'leadership', 'communication', 'teamwork', 'problem solving', 'analytical thinking',
  'project management', 'time management', 'adaptability', 'creativity', 'collaboration',
  'critical thinking', 'decision making', 'mentoring', 'strategic thinking',
  'customer service', 'presentation skills', 'negotiation', 'conflict resolution'
];

// Important keywords that often appear in job descriptions
const IMPORTANT_KEYWORDS = [
  'experience', 'bachelor', 'master', 'degree', 'certification', 'years',
  'senior', 'junior', 'lead', 'manager', 'architect', 'developer', 'engineer',
  'analyst', 'consultant', 'specialist', 'coordinator', 'director', 'startup',
  'enterprise', 'remote', 'hybrid', 'full-time', 'part-time', 'contract'
];

export function analyzeResume(resumeText: string, jobDescription: string): AnalysisResult {
  const resumeLower = resumeText.toLowerCase();
  const jobLower = jobDescription.toLowerCase();

  // Extract skills from job description
  const requiredTechnicalSkills = extractSkills(jobLower, TECHNICAL_SKILLS);
  const requiredSoftSkills = extractSkills(jobLower, SOFT_SKILLS);
  const allRequiredSkills = [...requiredTechnicalSkills, ...requiredSoftSkills];

  // Find skills in resume
  const resumeTechnicalSkills = extractSkills(resumeLower, TECHNICAL_SKILLS);
  const resumeSoftSkills = extractSkills(resumeLower, SOFT_SKILLS);
  const allResumeSkills = [...resumeTechnicalSkills, ...resumeSoftSkills];

  // Calculate matches
  const matchedSkills = allRequiredSkills.filter(skill => 
    allResumeSkills.includes(skill)
  );
  const missingSkills = allRequiredSkills.filter(skill => 
    !allResumeSkills.includes(skill)
  );

  // Find matched keywords
  const matchedKeywords = IMPORTANT_KEYWORDS.filter(keyword =>
    resumeLower.includes(keyword) && jobLower.includes(keyword)
  );

  // Calculate category scores
  const skillsScore = allRequiredSkills.length > 0 
    ? Math.round((matchedSkills.length / allRequiredSkills.length) * 100)
    : 85;

  const keywordsScore = Math.min(100, matchedKeywords.length * 10);
  
  const experienceScore = calculateExperienceScore(resumeText, jobDescription);
  const educationScore = calculateEducationScore(resumeText, jobDescription);

  // Calculate overall score
  const overallScore = Math.round(
    (skillsScore * 0.4) + 
    (experienceScore * 0.3) + 
    (keywordsScore * 0.2) + 
    (educationScore * 0.1)
  );

  // Generate recommendations
  const recommendations = generateRecommendations(
    matchedSkills,
    missingSkills,
    skillsScore,
    experienceScore,
    keywordsScore
  );

  // Generate strengths and improvements
  const strengths = generateStrengths(matchedSkills, skillsScore, experienceScore);
  const improvements = generateImprovements(missingSkills, skillsScore, keywordsScore);

  return {
    overallScore,
    categoryScores: {
      skills: skillsScore,
      experience: experienceScore,
      education: educationScore,
      keywords: keywordsScore
    },
    matchedSkills,
    missingSkills,
    matchedKeywords,
    recommendations,
    strengths,
    improvements,
    detailedAnalysis: {
      skillsAnalysis: {
        technical: resumeTechnicalSkills,
        soft: resumeSoftSkills,
        missing: missingSkills
      },
      experienceAnalysis: {
        relevantYears: extractExperienceYears(resumeText),
        matchingRoles: extractMatchingRoles(resumeText, jobDescription),
        industryMatch: checkIndustryMatch(resumeText, jobDescription)
      },
      keywordDensity: calculateKeywordDensity(resumeText, jobDescription)
    }
  };
}

function extractSkills(text: string, skillsList: string[]): string[] {
  return skillsList.filter(skill => text.includes(skill.toLowerCase()));
}

function calculateExperienceScore(resume: string, jobDesc: string): number {
  const resumeYears = extractExperienceYears(resume);
  const requiredYears = extractRequiredYears(jobDesc);
  
  if (requiredYears === 0) return 85;
  
  const ratio = resumeYears / requiredYears;
  if (ratio >= 1) return 100;
  if (ratio >= 0.8) return 85;
  if (ratio >= 0.6) return 70;
  if (ratio >= 0.4) return 55;
  return 40;
}

function calculateEducationScore(resume: string, jobDesc: string): number {
  const resumeLower = resume.toLowerCase();
  const jobLower = jobDesc.toLowerCase();
  
  const educationKeywords = ['bachelor', 'master', 'phd', 'degree', 'university', 'college'];
  const resumeEducation = educationKeywords.filter(keyword => resumeLower.includes(keyword));
  const requiredEducation = educationKeywords.filter(keyword => jobLower.includes(keyword));
  
  if (requiredEducation.length === 0) return 90;
  
  const matchRatio = resumeEducation.length / requiredEducation.length;
  return Math.min(100, Math.round(matchRatio * 100));
}

function extractExperienceYears(text: string): number {
  const patterns = [
    /(\d+)\+?\s*years?\s*(?:of\s*)?experience/gi,
    /experience\s*(?:of\s*)?(\d+)\+?\s*years?/gi,
    /(\d+)\+?\s*years?\s*in/gi
  ];
  
  let maxYears = 0;
  patterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const years = parseInt(match.match(/\d+/)?.[0] || '0');
        maxYears = Math.max(maxYears, years);
      });
    }
  });
  
  return maxYears;
}

function extractRequiredYears(jobDesc: string): number {
  const patterns = [
    /(\d+)\+?\s*years?\s*(?:of\s*)?experience/gi,
    /minimum\s*(?:of\s*)?(\d+)\+?\s*years?/gi,
    /at\s*least\s*(\d+)\+?\s*years?/gi
  ];
  
  let requiredYears = 0;
  patterns.forEach(pattern => {
    const matches = jobDesc.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const years = parseInt(match.match(/\d+/)?.[0] || '0');
        requiredYears = Math.max(requiredYears, years);
      });
    }
  });
  
  return requiredYears;
}

function extractMatchingRoles(resume: string, jobDesc: string): string[] {
  const roles = ['developer', 'engineer', 'manager', 'analyst', 'designer', 'architect', 'consultant'];
  const resumeLower = resume.toLowerCase();
  const jobLower = jobDesc.toLowerCase();
  
  return roles.filter(role => 
    resumeLower.includes(role) && jobLower.includes(role)
  );
}

function checkIndustryMatch(resume: string, jobDesc: string): boolean {
  const industries = ['tech', 'technology', 'software', 'finance', 'healthcare', 'education', 'retail'];
  const resumeLower = resume.toLowerCase();
  const jobLower = jobDesc.toLowerCase();
  
  return industries.some(industry => 
    resumeLower.includes(industry) && jobLower.includes(industry)
  );
}

function calculateKeywordDensity(resume: string, jobDesc: string): { [key: string]: number } {
  const words = jobDesc.toLowerCase().split(/\s+/).filter(word => word.length > 3);
  const wordCount: { [key: string]: number } = {};
  
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  const topKeywords = Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .reduce((obj, [word, count]) => {
      obj[word] = resume.toLowerCase().includes(word) ? count : 0;
      return obj;
    }, {} as { [key: string]: number });
  
  return topKeywords;
}

function generateRecommendations(
  matchedSkills: string[],
  missingSkills: string[],
  skillsScore: number,
  experienceScore: number,
  keywordsScore: number
): string[] {
  const recommendations: string[] = [];
  
  if (missingSkills.length > 0) {
    recommendations.push(
      `Consider adding these missing skills to your resume: ${missingSkills.slice(0, 3).join(', ')}`
    );
  }
  
  if (skillsScore < 70) {
    recommendations.push(
      'Highlight more technical skills that match the job requirements in your resume'
    );
  }
  
  if (experienceScore < 60) {
    recommendations.push(
      'Emphasize relevant work experience and quantify your achievements with specific metrics'
    );
  }
  
  if (keywordsScore < 50) {
    recommendations.push(
      'Include more industry-specific keywords from the job description in your resume'
    );
  }
  
  recommendations.push(
    'Tailor your resume summary to better match the specific role requirements'
  );
  
  return recommendations;
}

function generateStrengths(
  matchedSkills: string[],
  skillsScore: number,
  experienceScore: number
): string[] {
  const strengths: string[] = [];
  
  if (matchedSkills.length > 0) {
    strengths.push(
      `Strong skill alignment with ${matchedSkills.length} matching technical competencies`
    );
  }
  
  if (skillsScore >= 80) {
    strengths.push('Excellent skills match for the position requirements');
  }
  
  if (experienceScore >= 80) {
    strengths.push('Relevant professional experience aligns well with job expectations');
  }
  
  if (matchedSkills.some(skill => ['leadership', 'management', 'lead'].includes(skill))) {
    strengths.push('Demonstrates leadership and management capabilities');
  }
  
  strengths.push('Resume shows clear career progression and professional development');
  
  return strengths;
}

function generateImprovements(
  missingSkills: string[],
  skillsScore: number,
  keywordsScore: number
): string[] {
  const improvements: string[] = [];
  
  if (missingSkills.length > 3) {
    improvements.push(
      `Consider developing skills in: ${missingSkills.slice(0, 3).join(', ')}`
    );
  }
  
  if (skillsScore < 60) {
    improvements.push('Add more specific technical skills mentioned in the job posting');
  }
  
  if (keywordsScore < 40) {
    improvements.push('Incorporate more relevant industry keywords throughout your resume');
  }
  
  improvements.push('Consider adding quantifiable achievements and impact metrics');
  improvements.push('Ensure your resume format is ATS-friendly for better parsing');
  
  return improvements;
}