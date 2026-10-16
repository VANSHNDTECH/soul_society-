import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  ClearSignalsReflection,
  ConversationMessageAnalysis,
  DbPrivateReflection,
  NextStepOption,
  ReplyDraftResult,
  ReplyTone,
  ScenarioShortcut,
} from '../types/clearsignals';

const LOCAL_STORAGE_KEY = 'commonground_private_reflections_v1';

// ============================================================================
// 1. Scenario Templates & Cognitive Reframing Knowledge Base
// ============================================================================

interface ScenarioRule {
  facts: string[];
  assumptions: string[];
  alternativeExplanations: string[];
  unknowns: string[];
  nextSteps: NextStepOption[];
}

const SCENARIO_KNOWLEDGE_BASE: Record<ScenarioShortcut, ScenarioRule> = {
  delayed_reply: {
    facts: [
      'A message was sent, and some time has elapsed without a reply.',
      'Digital delivery or read indicators show transmission occurred, but cannot reveal the recipient’s emotional state or attention.',
    ],
    assumptions: [
      'Assuming that a delay equals disinterest, intentional rejection, or annoyance.',
      'Assuming the recipient saw the message, fully comprehended it, and consciously decided to ignore it.',
    ],
    alternativeExplanations: [
      'They opened the notification in the middle of a task (work, class, driving) and intended to reply later when focused.',
      'They may be experiencing digital fatigue or low social energy, delaying replies across all their conversations.',
      'They might be composing a thoughtful response rather than a hurried one.',
      'Unexpected offline emergencies or family responsibilities may have taken immediate priority.',
    ],
    unknowns: [
      'What their schedule and stress level look like right now.',
      'Their personal texting habits and baseline response speed with others.',
      'Whether they have read notifications enabled or muted.',
    ],
    nextSteps: [
      {
        type: 'wait',
        label: "I'd rather wait.",
        summary: 'Allow breathing room without sending anxious follow-ups.',
        guidance:
          'Healthy adult connections tolerate natural response latencies. Stepping away from the screen protects your own peace of mind.',
      },
      {
        type: 'clarify',
        label: 'Help me ask for clarification.',
        summary: 'Send a gentle, low-pressure check-in without accusing them of ignoring you.',
        guidance: 'Keep it warm and non-demanding so they do not feel put on the spot.',
        suggestedDraft:
          'Hey! Hope your week is going smoothly. No rush at all to reply, just wanted to check in and say hi!',
      },
      {
        type: 'express',
        label: 'Help me express how I feel.',
        summary: 'Share your appreciation for the connection without placing blame.',
        guidance: 'Focus on your own positive experience rather than evaluating their behavior.',
        suggestedDraft:
          'Hey, I really enjoyed our conversation earlier. Catch you whenever your schedule frees up!',
      },
    ],
  },
  short_reply: {
    facts: [
      'The received reply contained few words (e.g., "ok", "cool", "sounds good") compared to previous exchanges.',
      'The message lacks vocal inflection, body language, and facial cues.',
    ],
    assumptions: [
      'Interpreting brevity as passive aggression, coldness, or anger.',
      'Assuming that a short message means you said something inappropriate or that they no longer enjoy talking to you.',
    ],
    alternativeExplanations: [
      'They were typing on the move (walking, commuting, between meetings) and sent a quick acknowledgment.',
      'Brevity may be their standard communication style when busy, without any negative emotional weight.',
      'They may feel comfortable enough with you not to write performative paragraphs.',
      'They might be fatigued and unable to engage in deep conversation at this exact hour.',
    ],
    unknowns: [
      'The tone of voice they would use if speaking aloud in person.',
      'Their current cognitive bandwidth and physical context.',
      'Whether they intended the message as an acknowledgment rather than a brush-off.',
    ],
    nextSteps: [
      {
        type: 'wait',
        label: "I'd rather wait.",
        summary: 'Wait until the next natural conversational exchange before drawing conclusions.',
        guidance:
          'A single brief text is almost never evidence of an emotional shift. Wait to see if their warmth returns in the next exchange.',
      },
      {
        type: 'clarify',
        label: 'Help me ask for clarification.',
        summary: 'Lightheartedly verify if they are busy without sounding insecure.',
        guidance: 'Frame it playfully or kindly, acknowledging they might be occupied.',
        suggestedDraft:
          "Hey, wasn't sure if you were in the middle of something busy! All good on my end—talk soon.",
      },
      {
        type: 'express',
        label: 'Help me express how I feel.',
        summary: 'Reassure them that you are happy to chat when they have free time.',
        guidance: 'Leave the door open for when their social energy is higher.',
        suggestedDraft:
          "Hey! Always happy to pick this up later when you're less swamped. Have a great afternoon!",
      },
    ],
  },
  interest_uncertainty: {
    facts: [
      'The connection is recent, or the signals about intentions and mutual interest feel ambiguous.',
      'You are experiencing internal uncertainty about how much they value the connection.',
    ],
    assumptions: [
      'Assuming that ambiguity automatically equals rejection.',
      'Believing you must immediately know their exact feelings to feel secure.',
      'Over-indexing on microscopic details (emojis, timestamps) as definitive proof.',
    ],
    alternativeExplanations: [
      'They may be a gradual connector who prefers establishing trust before showing open enthusiasm.',
      'They might also feel nervous and be matching your perceived energy level.',
      'They could be observing how your shared values align over time.',
      'They might have busy personal lives that divide their attention.',
    ],
    unknowns: [
      'Their general attachment and social pace (gradual vs spontaneous).',
      'How they currently perceive the connection.',
      'What they are seeking right now in their social or dating life.',
    ],
    nextSteps: [
      {
        type: 'wait',
        label: "I'd rather wait.",
        summary: 'Observe consistency over time rather than a single interaction.',
        guidance:
          'True compatibility reveals itself through repeated, steady actions across weeks, not single days.',
      },
      {
        type: 'clarify',
        label: 'Help me ask for clarification.',
        summary: 'Ask an honest, open-ended question about how they are experiencing the connection.',
        guidance: 'Normalize that it is healthy and brave to align on expectations.',
        suggestedDraft:
          "Hey, I've really enjoyed our chats! I like checking in early on—how are you feeling about how we're connecting?",
      },
      {
        type: 'express',
        label: 'Help me express how I feel.',
        summary: 'Share your own authentic interest without demanding an instant match.',
        guidance: 'Expressing warm interest gives the other person permission to reciprocate if they feel the same.',
        suggestedDraft:
          "I wanted to let you know that I really appreciate getting to know you. No expectations, just wanted to share that!",
      },
    ],
  },
  worried_said_wrong: {
    facts: [
      'You sent a message that you are now second-guessing or worrying sounded awkward.',
      'The other person has not stated that they took offense or were upset.',
    ],
    assumptions: [
      'Assuming the worst possible interpretation of your own words.',
      'Believing that one awkward phrase will permanently ruin their perception of you.',
      'Assuming they are dissecting your message as harshly as you are.',
    ],
    alternativeExplanations: [
      'They understood your positive intention and paid no mind to any clunky wording.',
      'They may have skimmed the text and found it completely friendly and normal.',
      'They might have related to the awkwardness and found it human and endearing.',
      'Any delay in their response is likely unrelated to the phrase you are worrying about.',
    ],
    unknowns: [
      'How they actually interpreted the specific wording.',
      'Whether they even noticed the detail that is causing you anxiety.',
    ],
    nextSteps: [
      {
        type: 'wait',
        label: "I'd rather wait.",
        summary: 'Avoid sending multiple self-conscious apology texts.',
        guidance:
          'Over-apologizing often introduces tension that was never there in the first place. Giving it a few hours often proves the fear was unwarranted.',
      },
      {
        type: 'clarify',
        label: 'Help me ask for clarification.',
        summary: 'Add a brief, lighthearted clarification without self-flagellation.',
        guidance: 'Keep it breezy so it does not feel heavy or dramatic.',
        suggestedDraft:
          "Hey! Re-reading my last note, it sounded a bit clunky—just wanted to make sure it came across kindly!",
      },
      {
        type: 'express',
        label: 'Help me express how I feel.',
        summary: 'Own your vulnerability with humor and self-compassion.',
        guidance: 'Authenticity disarms social anxiety.',
        suggestedDraft:
          "I definitely overthink my texts sometimes! Hope that last message made sense—talk soon!",
      },
    ],
  },
  plans_changed: {
    facts: [
      'A scheduled meetup or conversation was postponed, rescheduled, or cancelled.',
      'The specific logistical plan cannot proceed as originally intended.',
    ],
    assumptions: [
      'Assuming the cancellation is an excuse to avoid seeing you.',
      'Assuming they do not respect your time or interest.',
      'Assuming this means they will never want to connect in the future.',
    ],
    alternativeExplanations: [
      'Life happens: genuine work deadlines, illness, exhaustion, or family needs arose.',
      'They may be genuinely disappointed they had to cancel and feel bad about letting you down.',
      'Social burnout or introversion may have depleted their capacity for an in-person meeting today.',
    ],
    unknowns: [
      'The exact private context behind the change of plans.',
      'Whether they actively want to reschedule for a future date.',
    ],
    nextSteps: [
      {
        type: 'wait',
        label: "I'd rather wait.",
        summary: 'Give them the space to take the initiative in rescheduling.',
        guidance:
          'If someone genuinely wants to connect, their follow-up offer to reschedule will demonstrate their commitment.',
      },
      {
        type: 'clarify',
        label: 'Help me ask for clarification.',
        summary: 'Acknowledge the change gracefully and invite them to propose a new time.',
        guidance: 'Graciousness removes guilt and makes rescheduling comfortable.',
        suggestedDraft:
          "No problem at all! Life gets busy. Would you like to reschedule for next week, or let me know when your calendar clears up?",
      },
      {
        type: 'express',
        label: 'Help me express how I feel.',
        summary: 'Express gentle disappointment while respecting their schedule.',
        guidance: 'Balance honesty about your enthusiasm with respect for their constraints.',
        suggestedDraft:
          "Sorry we couldn't make it happen today, but I completely understand. Hope everything goes smoothly on your end!",
      },
    ],
  },
  other: {
    facts: [
      'An ambiguous or uncomfortable communication dynamic has caused personal uncertainty.',
      'You are seeking cognitive clarity before reacting or jumping to conclusions.',
    ],
    assumptions: [
      'Filling in informational blanks with worst-case fears or mind-reading.',
      'Assuming other people share the exact same communication habits and timeline expectations as you.',
    ],
    alternativeExplanations: [
      'People have vastly different digital communication rhythms, stress tolerances, and social energy levels.',
      'Text-based interactions strip away over 70% of human emotional context (tone, pacing, gaze).',
      'The other person may have completely neutral or positive intentions that are obscured by digital medium limits.',
    ],
    unknowns: [
      'Their internal state, emotions, and personal stresses.',
      'What they actually meant to convey versus what was inferred.',
    ],
    nextSteps: [
      {
        type: 'wait',
        label: "I'd rather wait.",
        summary: 'Pause before responding to let emotional reactivity settle.',
        guidance:
          'Taking 24 hours to reflect prevents impulsive, defensive reactions that damage emerging trust.',
      },
      {
        type: 'clarify',
        label: 'Help me ask for clarification.',
        summary: 'Ask an open, respectful question to clarify their meaning.',
        guidance: 'Ask with curiosity rather than cross-examination.',
        suggestedDraft:
          "Hey, I wanted to check in because I wasn't totally sure how to read our last exchange. Is everything okay?",
      },
      {
        type: 'express',
        label: 'Help me express how I feel.',
        summary: 'Use calm "I"-statements to express your experience.',
        guidance: 'Focus on your feelings rather than prescribing their motives.',
        suggestedDraft:
          "Hey, I value our communication and wanted to share how I was feeling about our recent exchange so we're on the same page.",
      },
    ],
  },
};

// ============================================================================
// 2. ClearSignals Service Implementation
// ============================================================================

export class ClearSignalsService {
  /**
   * Performs structured cognitive reframing on user's described situation.
   * Uses explicit, psychological-informed heuristic rules (and accurately labels them).
   */
  public analyzeSituation(
    situationText: string,
    shortcut?: ScenarioShortcut,
    userId: string = 'current-user'
  ): ClearSignalsReflection {
    const detectedShortcut = shortcut || this.detectScenarioShortcut(situationText);
    const template = SCENARIO_KNOWLEDGE_BASE[detectedShortcut];

    // Extract dynamic observable facts from input
    const dynamicFacts = this.extractObservableFacts(situationText, template.facts);
    const dynamicAssumptions = this.extractAssumptions(situationText, template.assumptions);

    const now = new Date().toISOString();
    return {
      id: `reflection-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      userId,
      situation: situationText,
      scenarioShortcut: detectedShortcut,
      facts: dynamicFacts,
      assumptions: dynamicAssumptions,
      alternativeExplanations: template.alternativeExplanations,
      unknowns: template.unknowns,
      suggestedNextSteps: template.nextSteps,
      engineType: 'rules', // Accurately labeled!
      createdAt: now,
      updatedAt: now,
      isSaved: false,
    };
  }

  /**
   * Conversation Assistant: Analyzes a specific received message.
   * Distinguishes what the text literally says from what it does not establish.
   */
  public analyzeConversationMessage(messageText: string): ConversationMessageAnalysis {
    const trimmed = messageText.trim();
    const isVeryShort = trimmed.length <= 15;
    const hasPunctuation = /[.!?]/.test(trimmed);

    const whatItDoesNotEstablish = [
      'Does not prove emotional disinterest, anger, or rejection.',
      'Does not reveal whether the sender was multitasking, rushed, or interrupted.',
      'Does not establish their vocal tone, facial expression, or warmth in real life.',
    ];

    const possibleInterpretations = [
      'Neutral acknowledgment: They confirmed receipt of your message while busy with daily tasks.',
      'Communicative efficiency: They prefer concise texting for logistics and deep conversation in person.',
      'Social battery depletion: They may be tired and conserving emotional energy.',
      'Thoughtful pause: They may intend to follow up with a fuller answer when they have quiet time.',
    ];

    let clarificationQuestion =
      "Hey! Just checking in to make sure everything's good between us—no stress or rush, just wanted to say hi.";
    if (isVeryShort) {
      clarificationQuestion =
        "Hey! Wasn't sure if you were caught up in something busy—hope your day is going well!";
    }

    return {
      literalContent: `The message literally says: "${trimmed}". It consists of ${trimmed.split(/\s+/).length} word(s)${hasPunctuation ? ' with punctuation' : ' without punctuation'}.`,
      whatItDoesNotEstablish,
      possibleInterpretations,
      respectfulClarificationQuestion: clarificationQuestion,
      engineType: 'rules',
    };
  }

  /**
   * Conversation Assistant: Generates a draft reply in a specified tone.
   * Enforces non-accusatory, boundary-respecting guidelines.
   */
  public generateReplyDraft(
    situationContext: string,
    tone: ReplyTone,
    recipientName: string = 'there'
  ): ReplyDraftResult {
    let draft = '';
    const principles: string[] = [
      'Avoids accusation, guilt-tripping, or score-keeping.',
      'Respects recipient autonomy and natural communication pacing.',
      'Does not claim to read their mind or speculate on hidden motives.',
    ];

    switch (tone) {
      case 'casual':
        draft = `Hey ${recipientName}, no worries at all! Just wanted to see how your week is treating you. Catch you when you have a free moment! 😊`;
        principles.push('Lighthearted, relaxed, and pressure-free.');
        break;

      case 'gentle':
        draft = `Hey ${recipientName}, hope you're having a calm day. Absolutely no pressure to reply right now—just wanted to send a warm hello and make sure everything is okay with you. Take all the time you need!`;
        principles.push('Reassuring, empathetic, and validating.');
        break;

      case 'direct':
        draft = `Hey ${recipientName}, I noticed our last exchange was a bit brief and wanted to check in directly to make sure we're still on the same page. Let me know what you think when you get a chance!`;
        principles.push('Clear, honest, and collaborative without confrontation.');
        break;

      case 'boundary':
        draft = `Hey ${recipientName}, I value open communication, but I also completely respect when someone needs space or is caught up in work. I'll let you reach out when the timing feels right for you!`;
        principles.push('Self-respecting, calm detachment, and healthy boundaries.');
        break;
    }

    return {
      tone,
      draft,
      guidingPrinciples: principles,
      engineType: 'rules',
    };
  }

  // ==========================================================================
  // 3. Private Reflection Storage (Supabase + Offline/Local Fallback)
  // ==========================================================================

  /**
   * Saves a private reflection.
   * Only persists if user explicitly chooses to save!
   */
  public async saveReflection(
    reflection: ClearSignalsReflection
  ): Promise<{ success: boolean; data?: ClearSignalsReflection; error?: string }> {
    const markedSaved: ClearSignalsReflection = {
      ...reflection,
      isSaved: true,
      updatedAt: new Date().toISOString(),
    };

    // 1. Try Supabase if configured and user is authenticated
    if (isSupabaseConfigured() && supabase) {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          const dbPayload: Partial<DbPrivateReflection> = {
            id: reflection.id.startsWith('reflection-') ? undefined : reflection.id,
            user_id: session.user.id,
            situation: reflection.situation,
            facts: reflection.facts,
            assumptions: reflection.assumptions,
            alternative_explanations: reflection.alternativeExplanations,
            unknowns: reflection.unknowns,
            suggested_next_steps: reflection.suggestedNextSteps,
            scenario_shortcut: reflection.scenarioShortcut,
            created_at: reflection.createdAt,
            updated_at: markedSaved.updatedAt,
          };

          const { data, error } = await supabase
            .from('private_reflections')
            .upsert(dbPayload)
            .select()
            .single();

          if (!error && data) {
            markedSaved.id = data.id;
            this.saveToLocalStorage(markedSaved);
            return { success: true, data: markedSaved };
          }
        }
      } catch (err) {
        console.warn('Supabase reflection save failed, saving to local private storage:', err);
      }
    }

    // 2. Offline / Local fallback
    this.saveToLocalStorage(markedSaved);
    return { success: true, data: markedSaved };
  }

  /**
   * Retrieves saved reflections for current user.
   */
  public async getSavedReflections(userId: string): Promise<ClearSignalsReflection[]> {
    // 1. Try Supabase
    if (isSupabaseConfigured() && supabase) {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          const { data, error } = await supabase
            .from('private_reflections')
            .select('*')
            .order('created_at', { ascending: false });

          if (!error && data) {
            return data.map((row: DbPrivateReflection) => ({
              id: row.id,
              userId: row.user_id,
              situation: row.situation,
              scenarioShortcut: row.scenario_shortcut as ScenarioShortcut | undefined,
              facts: row.facts || [],
              assumptions: row.assumptions || [],
              alternativeExplanations: row.alternative_explanations || [],
              unknowns: row.unknowns || [],
              suggestedNextSteps: row.suggested_next_steps || [],
              engineType: 'rules',
              createdAt: row.created_at,
              updatedAt: row.updated_at,
              isSaved: true,
            }));
          }
        }
      } catch (err) {
        console.warn('Supabase fetch failed, retrieving from local storage:', err);
      }
    }

    // 2. LocalStorage fallback
    return this.getFromLocalStorage(userId);
  }

  /**
   * Deletes a saved reflection by ID.
   */
  public async deleteReflection(
    reflectionId: string,
    userId: string
  ): Promise<{ success: boolean; error?: string }> {
    // 1. Try Supabase
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase
          .from('private_reflections')
          .delete()
          .eq('id', reflectionId);

        if (error) {
          console.warn('Supabase reflection delete error:', error.message);
        }
      } catch (err) {
        console.warn('Supabase delete error:', err);
      }
    }

    // 2. Remove from local storage
    this.removeFromLocalStorage(reflectionId, userId);
    return { success: true };
  }

  // ==========================================================================
  // Private Helper Methods
  // ==========================================================================

  private detectScenarioShortcut(text: string): ScenarioShortcut {
    const lower = text.toLowerCase();
    if (
      lower.includes('late') ||
      lower.includes('hours') ||
      lower.includes('days') ||
      lower.includes('read') ||
      lower.includes('seen') ||
      lower.includes('unanswered') ||
      lower.includes("haven't replied") ||
      lower.includes('no reply') ||
      lower.includes('left me on')
    ) {
      return 'delayed_reply';
    }
    if (
      lower.includes('short') ||
      lower.includes('one word') ||
      lower.includes('brief') ||
      lower.includes('k') ||
      lower.includes('ok') ||
      lower.includes('fine') ||
      lower.includes('cool') ||
      lower.includes('dry')
    ) {
      return 'short_reply';
    }
    if (
      lower.includes('like me') ||
      lower.includes('interested') ||
      lower.includes('attracted') ||
      lower.includes('crush') ||
      lower.includes('mixed signals')
    ) {
      return 'interest_uncertainty';
    }
    if (
      lower.includes('said something wrong') ||
      lower.includes('awkward') ||
      lower.includes('offended') ||
      lower.includes('ruined') ||
      lower.includes('messed up') ||
      lower.includes('my fault')
    ) {
      return 'worried_said_wrong';
    }
    if (
      lower.includes('plan') ||
      lower.includes('cancel') ||
      lower.includes('reschedule') ||
      lower.includes('flaked') ||
      lower.includes('bail') ||
      lower.includes('busy today')
    ) {
      return 'plans_changed';
    }
    return 'other';
  }

  private extractObservableFacts(input: string, fallbackFacts: string[]): string[] {
    const facts: string[] = [];
    const trimmed = input.trim();

    // Check for quoted phrases (e.g. they replied "okay")
    const quoteMatch = trimmed.match(/"([^"]+)"|'([^']+)'/);
    if (quoteMatch) {
      const quoted = quoteMatch[1] || quoteMatch[2];
      facts.push(`Observable event: The other person sent the specific text "${quoted}".`);
    }

    // Check for time phrases with digits or words
    const timeMatch = trimmed.match(/((?:\d+|one|two|three|four|five|six|seven|eight|nine|ten|several|a few)\s*(?:hours?|days?|minutes?|weeks?)(?:\s*ago)?)/i);
    if (timeMatch) {
      facts.push(`Observable timeline: A duration of ${timeMatch[1]} was referenced.`);
    }

    if (facts.length === 0) {
      return fallbackFacts;
    }

    return [...facts, ...fallbackFacts];
  }

  private extractAssumptions(input: string, fallbackAssumptions: string[]): string[] {
    const assumptions: string[] = [];
    const lower = input.toLowerCase();

    if (lower.includes('maybe') || lower.includes('think they') || lower.includes('probably')) {
      assumptions.push('Interpreting the other person’s internal state based on incomplete external cues.');
    }
    if (lower.includes('hate') || lower.includes("don't like") || lower.includes('upset') || lower.includes('mad')) {
      assumptions.push('Assuming negative emotional intent or personal rejection without explicit confirmation.');
    }
    if (lower.includes('never') || lower.includes('always')) {
      assumptions.push('Generalizing a single interaction into a permanent behavior pattern.');
    }

    if (assumptions.length === 0) {
      return fallbackAssumptions;
    }

    return [...assumptions, ...fallbackAssumptions.slice(1)];
  }

  // Universal storage fallback across Browser localStorage and Node.js test runners
  private inMemoryReflections: Map<string, ClearSignalsReflection[]> = new Map();

  private getFromLocalStorage(userId: string): ClearSignalsReflection[] {
    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!raw) return [];
        const list = JSON.parse(raw) as ClearSignalsReflection[];
        return list.filter(r => r.userId === userId || r.userId === 'current-user');
      } catch {
        return [];
      }
    }
    return (this.inMemoryReflections.get(userId) || []).filter(
      r => r.userId === userId || r.userId === 'current-user'
    );
  }

  private saveToLocalStorage(reflection: ClearSignalsReflection): void {
    if (typeof localStorage !== 'undefined') {
      try {
        const existing = this.getFromLocalStorage(reflection.userId);
        const filtered = existing.filter(r => r.id !== reflection.id);
        const updated = [reflection, ...filtered];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return;
      } catch (err) {
        console.warn('Failed to save reflection to localStorage:', err);
      }
    }
    const current = this.inMemoryReflections.get(reflection.userId) || [];
    this.inMemoryReflections.set(reflection.userId, [
      reflection,
      ...current.filter(r => r.id !== reflection.id),
    ]);
  }

  private removeFromLocalStorage(reflectionId: string, userId: string): void {
    if (typeof localStorage !== 'undefined') {
      try {
        const existing = this.getFromLocalStorage(userId);
        const updated = existing.filter(r => r.id !== reflectionId);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return;
      } catch (err) {
        console.warn('Failed to delete reflection from localStorage:', err);
      }
    }
    const current = this.inMemoryReflections.get(userId) || [];
    this.inMemoryReflections.set(
      userId,
      current.filter(r => r.id !== reflectionId)
    );
  }
}

export const clearSignalsService = new ClearSignalsService();
