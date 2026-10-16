import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DbConnectionRequest, DbConnection } from '../types/database';

export const connectionService = {
  async sendIntroductionRequest(params: {
    senderId: string;
    recipientId: string;
    introMessage: string;
    sharedInterest?: string;
  }): Promise<{ request: DbConnectionRequest | null; error: string | null }> {
    if (isSupabaseConfigured() && supabase) {
      // Check for existing pending request
      const { data: existing } = await supabase
        .from('connection_requests')
        .select('id')
        .eq('sender_id', params.senderId)
        .eq('recipient_id', params.recipientId)
        .eq('status', 'pending')
        .maybeSingle();

      if (existing) {
        return { request: null, error: 'A pending introduction request already exists.' };
      }

      const { data, error } = await supabase
        .from('connection_requests')
        .insert({
          sender_id: params.senderId,
          recipient_id: params.recipientId,
          intro_message: params.introMessage,
          shared_interest: params.sharedInterest,
          status: 'pending',
        })
        .select()
        .single();

      if (error) {
        return { request: null, error: error.message };
      }
      return { request: data as DbConnectionRequest, error: null };
    }

    // Local simulation
    const simulatedRequest: DbConnectionRequest = {
      id: `req-${Date.now().toString(36)}`,
      sender_id: params.senderId,
      recipient_id: params.recipientId,
      status: 'pending',
      intro_message: params.introMessage,
      shared_interest: params.sharedInterest,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return { request: simulatedRequest, error: null };
  },

  async getRequests(userId: string): Promise<{
    incoming: DbConnectionRequest[];
    outgoing: DbConnectionRequest[];
  }> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('connection_requests')
        .select(`
          id,
          sender_id,
          recipient_id,
          status,
          intro_message,
          shared_interest,
          created_at,
          updated_at,
          sender:profiles!sender_id(*),
          recipient:profiles!recipient_id(*)
        `)
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching connection requests:', error);
        return { incoming: [], outgoing: [] };
      }

      const incoming = (data || []).filter((r: any) => r.recipient_id === userId && r.status === 'pending') as unknown as DbConnectionRequest[];
      const outgoing = (data || []).filter((r: any) => r.sender_id === userId) as unknown as DbConnectionRequest[];
      return { incoming, outgoing };
    }

    return { incoming: [], outgoing: [] };
  },

  async acceptRequest(requestId: string, recipientId: string): Promise<{
    connection: DbConnection | null;
    error: string | null;
  }> {
    if (isSupabaseConfigured() && supabase) {
      // 1. Fetch request details to get sender
      const { data: request, error: reqError } = await supabase
        .from('connection_requests')
        .select('*')
        .eq('id', requestId)
        .eq('recipient_id', recipientId)
        .single();

      if (reqError || !request) {
        return { connection: null, error: 'Request not found or unauthorized.' };
      }

      // 2. Update request status to accepted
      await supabase
        .from('connection_requests')
        .update({ status: 'accepted', updated_at: new Date().toISOString() })
        .eq('id', requestId);

      // 3. Create canonical connection
      const user1 = request.sender_id < recipientId ? request.sender_id : recipientId;
      const user2 = request.sender_id < recipientId ? recipientId : request.sender_id;

      const { data: connection, error: connError } = await supabase
        .from('connections')
        .insert({
          user1_id: user1,
          user2_id: user2,
          status: 'active',
        })
        .select()
        .single();

      if (connError) {
        return { connection: null, error: connError.message };
      }

      // 4. Create conversation & participants
      const { data: conversation } = await supabase
        .from('conversations')
        .insert({ connection_id: connection.id })
        .select()
        .single();

      if (conversation) {
        await supabase.from('conversation_participants').insert([
          { conversation_id: conversation.id, user_id: user1 },
          { conversation_id: conversation.id, user_id: user2 },
        ]);

        // Insert initial icebreaker message
        await supabase.from('messages').insert({
          conversation_id: conversation.id,
          sender_id: request.sender_id,
          content: request.intro_message,
        });
      }

      return { connection: connection as DbConnection, error: null };
    }

    return {
      connection: {
        id: `conn-${Date.now().toString(36)}`,
        user1_id: 'usr-current',
        user2_id: 'usr-other',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      error: null,
    };
  },

  async declineRequest(requestId: string, recipientId: string): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase
        .from('connection_requests')
        .update({ status: 'declined', updated_at: new Date().toISOString() })
        .eq('id', requestId)
        .eq('recipient_id', recipientId);

      return !error;
    }
    return true;
  },

  async cancelRequest(requestId: string, senderId: string): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase
        .from('connection_requests')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', requestId)
        .eq('sender_id', senderId);

      return !error;
    }
    return true;
  },

  async getConnections(userId: string): Promise<DbConnection[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('connections')
        .select(`
          id,
          user1_id,
          user2_id,
          status,
          created_at,
          updated_at,
          user1:profiles!user1_id(*),
          user2:profiles!user2_id(*)
        `)
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching connections:', error);
        return [];
      }
      return (data || []) as unknown as DbConnection[];
    }
    return [];
  },

  async disconnect(connectionId: string): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase
        .from('connections')
        .update({ status: 'disconnected', updated_at: new Date().toISOString() })
        .eq('id', connectionId);

      return !error;
    }
    return true;
  },
};
