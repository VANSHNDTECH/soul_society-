import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DbUserBlock, DbUserReport } from '../types/database';

export const safetyService = {
  async blockUser(params: {
    blockerId: string;
    blockedId: string;
  }): Promise<{ block: DbUserBlock | null; error: string | null }> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('user_blocks')
        .insert({
          blocker_id: params.blockerId,
          blocked_id: params.blockedId,
        })
        .select()
        .single();

      if (error) {
        return { block: null, error: error.message };
      }

      // Also disconnect any active connection
      await supabase
        .from('connections')
        .update({ status: 'disconnected', updated_at: new Date().toISOString() })
        .or(`and(user1_id.eq.${params.blockerId},user2_id.eq.${params.blockedId}),and(user1_id.eq.${params.blockedId},user2_id.eq.${params.blockerId})`);

      return { block: data as DbUserBlock, error: null };
    }

    return {
      block: {
        id: `blk-${Date.now().toString(36)}`,
        blocker_id: params.blockerId,
        blocked_id: params.blockedId,
        created_at: new Date().toISOString(),
      },
      error: null,
    };
  },

  async getBlockedUsers(userId: string): Promise<string[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('user_blocks')
        .select('blocked_id')
        .eq('blocker_id', userId);

      if (error) {
        console.error('Error fetching blocked users:', error);
        return [];
      }
      return data.map((d: any) => d.blocked_id);
    }

    return [];
  },

  async unblockUser(blockerId: string, blockedId: string): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase
        .from('user_blocks')
        .delete()
        .eq('blocker_id', blockerId)
        .eq('blocked_id', blockedId);

      return !error;
    }
    return true;
  },

  async reportUser(params: {
    reporterId: string;
    reportedId: string;
    reason: string;
    description?: string;
  }): Promise<{ report: DbUserReport | null; error: string | null }> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('user_reports')
        .insert({
          reporter_id: params.reporterId,
          reported_id: params.reportedId,
          reason: params.reason,
          description: params.description,
          status: 'pending',
        })
        .select()
        .single();

      if (error) {
        return { report: null, error: error.message };
      }
      return { report: data as DbUserReport, error: null };
    }

    const localReport: DbUserReport = {
      id: `rep-${Date.now().toString(36)}`,
      reporter_id: params.reporterId,
      reported_id: params.reportedId,
      reason: params.reason,
      description: params.description,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    return { report: localReport, error: null };
  },
};
