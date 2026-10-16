export type ScenarioShortcut =
  | 'delayed_reply'
  | 'short_reply'
  | 'interest_uncertainty'
  | 'worried_said_wrong'
  | 'plans_changed'
  | 'other';

export interface NextStepOption {
  type: 'wait' | 'clarify' | 'express';
  label: string;
  summary: string;
  guidance: string;
  suggestedDraft?: string;
}

export interface ClearSignalsReflection {
  id: string;
  userId: string;
  situation: string;
  scenarioShortcut?: ScenarioShortcut;
  facts: string[];
  assumptions: string[];
  alternativeExplanations: string[];
  unknowns: string[];
  suggestedNextSteps: NextStepOption[];
  engineType: 'rules' | 'ai';
  createdAt: string;
  updatedAt: string;
  isSaved?: boolean;
}

export interface ConversationMessageAnalysis {
  literalContent: string;
  whatItDoesNotEstablish: string[];
  possibleInterpretations: string[];
  respectfulClarificationQuestion: string;
  engineType: 'rules' | 'ai';
}

export type ReplyTone = 'casual' | 'gentle' | 'direct' | 'boundary';

export interface ReplyToneOption {
  id: ReplyTone;
  name: string;
  description: string;
  iconName: string;
}

export interface ReplyDraftResult {
  tone: ReplyTone;
  draft: string;
  guidingPrinciples: string[];
  engineType: 'rules' | 'ai';
}

export interface DbPrivateReflection {
  id: string;
  user_id: string;
  situation: string;
  facts: string[];
  assumptions: string[];
  alternative_explanations: string[];
  unknowns: string[];
  suggested_next_steps: NextStepOption[];
  scenario_shortcut?: string;
  created_at: string;
  updated_at: string;
}
