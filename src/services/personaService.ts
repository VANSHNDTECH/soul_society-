import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DbPersona } from '../types/database';
import { PERSONAS } from '../data/module2Data';
import { PersonaItem } from '../types/module2';

export const personaService = {
  async getPersonas(): Promise<PersonaItem[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('personas')
          .select('*')
          .order('name', { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map((p: DbPersona) => ({
            id: p.id,
            name: p.name,
            age: p.age,
            archetype: p.archetype,
            context: p.context,
            avatar: p.avatar,
            illustrativeQuote: p.illustrative_quote,
            primaryGoal: p.primary_goal,
            goals: p.goals || [],
            painPoints: p.pain_points || [],
            unmetNeeds: p.unmet_needs || [],
            currentWorkarounds: p.current_workarounds || [],
            designOpportunity: p.design_opportunity,
            commonGroundFitSummary: p.commonground_fit_summary,
            empathyMap: p.empathy_map || { says: [], thinks: [], does: [], feels: [] },
            primaryBarriers: (p.primary_barriers || []) as any,
          }));
        }
      } catch (err) {
        console.error('Error fetching personas from database:', err);
      }
    }

    // Default to verified Module 2 persona seed records
    return PERSONAS;
  },

  async getPersonaById(id: string): Promise<PersonaItem | null> {
    const list = await this.getPersonas();
    return list.find((p) => p.id === id) || null;
  },

  async updatePersona(id: string, updates: Partial<PersonaItem>): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      const dbUpdates: any = {
        updated_at: new Date().toISOString(),
      };
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.age !== undefined) dbUpdates.age = updates.age;
      if (updates.archetype !== undefined) dbUpdates.archetype = updates.archetype;
      if (updates.context !== undefined) dbUpdates.context = updates.context;
      if (updates.illustrativeQuote !== undefined) dbUpdates.illustrative_quote = updates.illustrativeQuote;
      if (updates.primaryGoal !== undefined) dbUpdates.primary_goal = updates.primaryGoal;
      if (updates.goals !== undefined) dbUpdates.goals = updates.goals;
      if (updates.painPoints !== undefined) dbUpdates.pain_points = updates.painPoints;
      if (updates.unmetNeeds !== undefined) dbUpdates.unmet_needs = updates.unmetNeeds;
      if (updates.currentWorkarounds !== undefined) dbUpdates.current_workarounds = updates.currentWorkarounds;
      if (updates.designOpportunity !== undefined) dbUpdates.design_opportunity = updates.designOpportunity;
      if (updates.commonGroundFitSummary !== undefined) dbUpdates.commonground_fit_summary = updates.commonGroundFitSummary;
      if (updates.empathyMap !== undefined) dbUpdates.empathy_map = updates.empathyMap;
      if (updates.primaryBarriers !== undefined) dbUpdates.primary_barriers = updates.primaryBarriers;

      const { error } = await supabase
        .from('personas')
        .update(dbUpdates)
        .eq('id', id);

      if (error) {
        console.error('Error updating persona in database:', error);
        return false;
      }
      return true;
    }

    // In local demo mode, update in-memory/fallback
    const existing = PERSONAS.find((p) => p.id === id);
    if (existing) {
      Object.assign(existing, updates);
      return true;
    }
    return false;
  },

  async createPersona(persona: Omit<PersonaItem, 'id'>): Promise<PersonaItem | null> {
    const newId = `persona-${Date.now()}`;
    if (isSupabaseConfigured() && supabase) {
      const dbRecord = {
        id: newId,
        name: persona.name,
        age: persona.age,
        archetype: persona.archetype,
        context: persona.context,
        avatar: persona.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
        illustrative_quote: persona.illustrativeQuote,
        primary_goal: persona.primaryGoal,
        goals: persona.goals,
        pain_points: persona.painPoints,
        unmet_needs: persona.unmetNeeds,
        current_workarounds: persona.currentWorkarounds,
        design_opportunity: persona.designOpportunity,
        commonground_fit_summary: persona.commonGroundFitSummary,
        empathy_map: persona.empathyMap,
        primary_barriers: persona.primaryBarriers,
        is_validated: false,
      };

      const { data, error } = await supabase
        .from('personas')
        .insert(dbRecord)
        .select()
        .single();

      if (error || !data) {
        console.error('Error creating persona in database:', error);
        return null;
      }

      return {
        ...persona,
        id: data.id,
      };
    }

    const created: PersonaItem = { ...persona, id: newId };
    PERSONAS.push(created);
    return created;
  },
};
