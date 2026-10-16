export type ResearchTab =
  | 'overview'
  | 'problems'
  | 'methods'
  | 'prioritization'
  | 'evidence'
  | 'bridge'
  | 'gaps'
  | 'references';

export type ConfidenceLevel = 'Strong' | 'Moderate' | 'Preliminary';

export type SourceType =
  | 'Peer-Reviewed Academic'
  | 'Government & Public Health'
  | 'Reputable Survey Institution'
  | 'Regulatory Agency'
  | 'Sociological Field Study';

export interface EvidenceSource {
  id: string;
  problemId: string;
  claim: string;
  sourceTitle: string;
  authorOrOrganization: string;
  publicationDate: string;
  sourceType: SourceType;
  relevantFinding: string;
  exactStatistic?: string;
  populationAndGeography: string;
  whatItSupports: string;
  whatItDoesNotEstablish: string;
  limitations: string;
  directUrl: string;
  confidenceLevel: ConfidenceLevel;
  confidenceJustification: string;
}

export interface ProblemItem {
  id: string;
  number: number;
  title: string;
  tagline: string;
  shortExplanation: string;
  detailedExplanation: string;
  evidenceSummary: string;
  keyStatistic?: string;
  statisticContext?: string;
  confidenceLevel: ConfidenceLevel;
  confidenceJustification: string;
  whatEvidenceSupports: string[];
  whatEvidenceDoesNotEstablish: string[];
  affectedGroups: string[];
  designImplications: string[];
  sourceIds: string[];
  baselineScores: {
    severity: number; // 1-5
    reach: number; // 1-5
    evidenceStrength: number; // 1-5
    opportunity: number; // 1-5
  };
  scoreRationale: {
    severity: string;
    reach: string;
    evidenceStrength: string;
    opportunity: string;
  };
}

export interface MeetingMethod {
  id: string;
  name: string;
  tagline: string;
  summary: string;
  advantages: string[];
  limitations: string[];
  whoIsLeftOut: string[];
  supportingEvidenceSummary: string;
  keySourceIds: string[];
  improvementOpportunities: string[];
}

export interface SolutionBridgeItem {
  id: string;
  problemTitle: string;
  evidenceSummary: string;
  affectedGroup: string;
  userNeedToInvestigate: string;
  designOpportunity: string;
  commonGroundFeature: string;
  testableQuestion: string;
}

export interface ResearchGap {
  id: string;
  title: string;
  question: string;
  currentEvidenceDeficit: string;
  recommendedMethodology: string;
  targetDemographic: string;
}

export interface InterviewQuestionItem {
  id: string;
  number: number;
  question: string;
  researchRationale: string;
  whatToObserve: string;
}
