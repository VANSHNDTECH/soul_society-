export type Module2Tab =
  | 'overview'
  | 'personas'
  | 'barriers'
  | 'solutions'
  | 'opportunities'
  | 'methodology';

export type BarrierCategory =
  | 'Emotional'
  | 'Structural'
  | 'Discovery'
  | 'Accessibility & Inclusion'
  | 'Trust & Safety';

export interface EmpathyMapData {
  says: string[];
  thinks: string[];
  does: string[];
  feels: string[];
}

export interface PersonaItem {
  id: string;
  name: string;
  age: number;
  archetype: string;
  context: string;
  avatar: string;
  illustrativeQuote: string;
  primaryGoal: string;
  goals: string[];
  painPoints: string[];
  unmetNeeds: string[];
  currentWorkarounds: string[];
  designOpportunity: string;
  commonGroundFitSummary: string;
  empathyMap: EmpathyMapData;
  primaryBarriers: BarrierCategory[];
}

export interface BarrierItem {
  id: string;
  category: BarrierCategory;
  title: string;
  description: string;
  realWorldManifestation: string;
  affectedPersonas: string[];
  designImplication: string;
}

export interface CurrentMethodAnalysis {
  id: string;
  name: string;
  tagline: string;
  whoMayBenefit: string[];
  whatWorksWell: string[];
  whatCanGoWrong: string[];
  whoMayBeLeftOut: string[];
  opportunityForImprovement: string;
}

export interface FeatureMappingItem {
  id: string;
  userNeed: string;
  proposedFeature: string;
  intendedBenefit: string;
  targetPersonas: string[];
  designHypothesisNote: string;
}

export interface PersonaValidationQuestion {
  id: string;
  number: number;
  question: string;
  targetFocus: string;
  whatToValidate: string;
  probeFollowUps?: string[];
}

export interface MethodologyStage {
  id: string;
  stageNumber: number;
  title: string;
  description: string;
  activities: string[];
  outputArtifact: string;
  rigorNote: string;
}

export interface EpistemicCategory {
  title: string;
  definition: string;
  badgeColor: string;
  examplesInDashboard: string[];
}

export interface AcademicReference {
  id: string;
  title: string;
  authors: string;
  year: string;
  publication: string;
  relevanceToPersonas: string;
  url: string;
}

