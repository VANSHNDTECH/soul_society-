import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DbMessage, DbConversation } from '../types/database';

export const chatService = {
  async getOrCreateConversation(connectionId: string): Promise<DbConversation | null> {
    if (isSupabaseConfigured() && supabase) {
      let { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('connection_id', connectionId)
        .maybeSingle();

      if (!data && !error) {
        // Create conversation if it doesn't exist yet
        const { data: newConv, error: createError } = await supabase
          .from('conversations')
          .insert({ connection_id: connectionId })
          .select()
          .single();

        if (createError) {
          console.error('Error creating conversation:', createError);
          return null;
        }
        data = newConv;
      }

      return data as DbConversation;
    }

    return {
      id: `conv-${connectionId}`,
      connection_id: connectionId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },

  async getMessages(conversationId: string): Promise<DbMessage[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages from database:', error);
        return [];
      }
      return data as DbMessage[];
    }

    return [];
  },

  async sendMessage(params: {
    conversationId: string;
    senderId: string;
    content: string;
  }): Promise<{ message: DbMessage | null; error: string | null }> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: params.conversationId,
          sender_id: params.senderId,
          content: params.content,
        })
        .select()
        .single();

      if (error) {
        return { message: null, error: error.message };
      }
      return { message: data as DbMessage, error: null };
    }

    // Local simulation
    const localMsg: DbMessage = {
      id: `msg-${Date.now().toString(36)}`,
      conversation_id: params.conversationId,
      sender_id: params.senderId,
      content: params.content,
      created_at: new Date().toISOString(),
    };
    return { message: localMsg, error: null };
  },

  subscribeToMessages(
    conversationId: string,
    onMessage: (message: DbMessage) => void
  ) {
    if (isSupabaseConfigured() && supabase) {
      const channel = supabase
        .channel(`messages:${conversationId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`,
          },
          (payload) => {
            onMessage(payload.new as DbMessage);
          }
        )
        .subscribe();

      return () => {
        if (supabase) {
          supabase.removeChannel(channel);
        }
      };
    }

    return () => {};
  },
};
