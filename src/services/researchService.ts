import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DbResearchProblem, DbResearchSource } from '../types/database';
import { TOP_PROBLEMS, EVIDENCE_SOURCES } from '../data/researchData';
import { ProblemItem, EvidenceSource } from '../types/research';

export const researchService = {
  async getProblems(): Promise<ProblemItem[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('research_problems')
          .select('*')
          .order('number', { ascending: true });

        if (!error && data && data.length > 0) {
          return TOP_PROBLEMS.map((tp) => {
            const dbMatch = data.find((d: DbResearchProblem) => d.id === tp.id || d.number === tp.number);
            if (!dbMatch) return tp;
            return {
              ...tp,
              severityScore: Number(dbMatch.severity_score),
              reachScore: Number(dbMatch.reach_score),
              evidenceStrengthScore: Number(dbMatch.evidence_strength_score),
              designOpportunityScore: Number(dbMatch.design_opportunity_score),
              weight: Number(dbMatch.weight),
              compositeScore: Number(dbMatch.composite_score),
              baselineScores: {
                severity: Number(dbMatch.severity_score),
                reach: Number(dbMatch.reach_score),
                evidenceStrength: Number(dbMatch.evidence_strength_score),
                opportunity: Number(dbMatch.design_opportunity_score),
              },
            };
          });
        }
      } catch (err) {
        console.error('Error fetching research problems from database:', err);
      }
    }

    // Default verified research baseline from Module 1
    return TOP_PROBLEMS;
  },

  async getSources(): Promise<EvidenceSource[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('research_sources')
          .select('*')
          .order('created_at', { ascending: true });

        if (!error && data && data.length > 0) {
          return EVIDENCE_SOURCES.map((es) => {
            const dbMatch = data.find((d: DbResearchSource) => d.id === es.id);
            if (!dbMatch) return es;
            return {
              ...es,
              claim: dbMatch.claim || es.claim,
              relevantFinding: dbMatch.relevant_finding || es.relevantFinding,
              directUrl: dbMatch.direct_url || es.directUrl,
            };
          });
        }
      } catch (err) {
        console.error('Error fetching research sources from database:', err);
      }
    }

    return EVIDENCE_SOURCES;
  },

  async updateProblemScore(
    problemId: string,
    scores: {
      severityScore?: number;
      reachScore?: number;
      evidenceStrengthScore?: number;
      designOpportunityScore?: number;
      weight?: number;
      compositeScore?: number;
    }
  ): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      const dbUpdates: any = {
        updated_at: new Date().toISOString(),
      };
      if (scores.severityScore !== undefined) dbUpdates.severity_score = scores.severityScore;
      if (scores.reachScore !== undefined) dbUpdates.reach_score = scores.reachScore;
      if (scores.evidenceStrengthScore !== undefined) dbUpdates.evidence_strength_score = scores.evidenceStrengthScore;
      if (scores.designOpportunityScore !== undefined) dbUpdates.design_opportunity_score = scores.designOpportunityScore;
      if (scores.weight !== undefined) dbUpdates.weight = scores.weight;
      if (scores.compositeScore !== undefined) dbUpdates.composite_score = scores.compositeScore;

      const { error } = await supabase
        .from('research_problems')
        .update(dbUpdates)
        .eq('id', problemId);

      if (error) {
        console.error('Error updating problem score in database:', error);
        return false;
      }
      return true;
    }

    return true;
  },
};
