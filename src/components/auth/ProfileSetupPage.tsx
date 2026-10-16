import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Zap,
  Lock,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import {
  IntentionType,
  CommunicationPace,
  CommunicationStyle,
  SocialEnergy,
} from '../../types';
import { ALL_INTEREST_TAGS, ALL_VALUES } from '../../data/mockUsers';
import { authService, isProfileComplete } from '../../services/authService';
import { profileService } from '../../services/profileService';

export const ProfileSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rawRedirect = searchParams.get('redirect');
  const redirectTarget = rawRedirect ? decodeURIComponent(rawRedirect) : '/module-3';

  const { authSession, currentUser, updateCurrentUser, refreshBackendData, showToast } = useApp();

  const [step, setStep] = useState<number>(1);
  const totalSteps = 5;

  // Form State initialized from existing profile or session
  const [name, setName] = useState(
    authSession.profile?.display_name || currentUser.name || ''
  );
  const [age, setAge] = useState<number | string>(
    authSession.profile?.age || currentUser.age || 21
  );
  const [location, setLocation] = useState(
    authSession.profile?.location || currentUser.location || 'University Campus'
  );
  const [headline, setHeadline] = useState(
    currentUser.headline || ''
  );
  const [bio, setBio] = useState(
    authSession.profile?.bio || currentUser.bio || ''
  );

  const [intentions, setIntentions] = useState<IntentionType[]>(
    (authSession.profile?.intentions as IntentionType[]) || (currentUser.intentions?.length > 0 ? currentUser.intentions : ['Friendship'])
  );
  const [interests, setInterests] = useState<string[]>(
    currentUser.interests?.length > 0 ? currentUser.interests : ['Specialty Coffee', 'Hiking & Trails']
  );
  const [customInterest, setCustomInterest] = useState('');
  const [values, setValues] = useState<string[]>(
    currentUser.values?.length > 0 ? currentUser.values : ['Empathy & Kindness', 'Intellectual Curiosity']
  );

  const [pace, setPace] = useState<CommunicationPace>(
    (authSession.profile?.pace_preference as any) || currentUser.communicationPreferences.pace || 'Gradual & thoughtful'
  );
  const [style, setStyle] = useState<CommunicationStyle>(
    (authSession.profile?.communication_style as any) || currentUser.communicationPreferences.style || 'Deep & reflective'
  );
  const [socialEnergy, setSocialEnergy] = useState<SocialEnergy>(
    (authSession.profile?.social_energy as any) || currentUser.communicationPreferences.socialEnergy || 'Ambivert / Adaptable'
  );

  const [discoveryPaused, setDiscoveryPaused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Quick prefill helper for evaluation/testing
  const prefillSample = () => {
    setName('Maya Lin');
    setAge(20);
    setLocation('University Campus & Downtown');
    setHeadline('Design student & indie game enthusiast seeking kindred spirits');
    setBio('UX design student. Big fan of cozy coffee spots, analog photography, and gradual, thoughtful conversations.');
    setIntentions(['Friendship', 'Activity Partners']);
    setInterests(['Specialty Coffee', 'Analog Photography', 'Hiking & Trails', 'Sci-Fi & Speculative Fiction']);
    setValues(['Empathy & Kindness', 'Intellectual Curiosity']);
    setPace('Gradual & thoughtful');
    setStyle('Deep & reflective');
    setSocialEnergy('Ambivert / Adaptable');
    showToast('Sample profile data filled in.', 'info');
  };

  const toggleIntention = (item: IntentionType) => {
    setIntentions(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const toggleInterest = (tag: string) => {
    setInterests(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const addCustomInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInterest.trim() && !interests.includes(customInterest.trim())) {
      setInterests(prev => [...prev, customInterest.trim()]);
      setCustomInterest('');
    }
  };

  const toggleValue = (val: string) => {
    setValues(prev =>
      prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]
    );
  };

  const handleNext = () => {
    setErrorMsg(null);
    if (step === 1) {
      if (!name.trim()) {
        setErrorMsg('Please provide a display name or preferred first name.');
        return;
      }
      if (!bio.trim()) {
        setErrorMsg('Please write a brief bio or description of what conversations you appreciate.');
        return;
      }
    }
    if (step === 2) {
      if (intentions.length === 0) {
        setErrorMsg('Please select at least one intention for joining CommonGround.');
        return;
      }
    }
    if (step === 3) {
      if (interests.length < 2) {
        setErrorMsg('Please select at least 2 interests to enable compatibility matching.');
        return;
      }
    }

    if (step < totalSteps) {
      setStep(prev => prev + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handleBack = () => {
    setErrorMsg(null);
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleFinalSubmit = async () => {
    setErrorMsg(null);
    if (!authSession.user?.id) {
      setErrorMsg('No authenticated account session found. Please sign in first.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        display_name: name.trim(),
        age: Number(age) || null,
        bio: bio.trim(),
        location: location.trim() || 'University Campus',
        intentions,
        communication_style: style,
        social_energy: socialEnergy,
        pace_preference: pace,
        discovery_enabled: !discoveryPaused,
        profile_visibility: 'standard' as const,
      };

      const result = await authService.saveCompletedProfile(authSession.user.id, payload);

      if (result.error) {
        setErrorMsg(`Failed to save profile: ${result.error}. Please try again.`);
        return;
      }

      // Save user interests in taxonomy join table
      try {
        await profileService.setUserInterests(authSession.user.id, interests);
      } catch (err) {
        console.warn('Interests table save warning:', err);
      }

      // Sync AppContext currentUser
      updateCurrentUser({
        name: name.trim(),
        age: Number(age) || undefined,
        location: location.trim() || 'University Campus',
        headline: headline.trim() || undefined,
        bio: bio.trim(),
        intentions,
        interests,
        values,
        communicationPreferences: {
          pace,
          style,
          socialEnergy,
        },
        privacySettings: {
          ...currentUser.privacySettings,
          discoveryPaused,
        },
      });

      await refreshBackendData();
      showToast('Profile completed and saved to backend! Welcome to CommonGround.', 'success');

      // Redirect into application platform
      navigate(redirectTarget, { replace: true });
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving profile. Please check your connection and retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-stone-200 dark:border-stone-800 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-teal-800 dark:text-teal-400 uppercase tracking-wider">
              Step {step} of {totalSteps}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 px-2 py-0.5 rounded-full">
              Required Profile Setup
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
            {step === 1 && '1. Basic Identity & Bio'}
            {step === 2 && '2. Choose Your Intentions'}
            {step === 3 && '3. Passions & Activities'}
            {step === 4 && '4. Communication Cadence'}
            {step === 5 && '5. Comfort & Privacy Boundaries'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            CommonGround requires verified intentions and communication preferences to protect members from unsolicited interactions.
          </p>
        </div>

        <button
          type="button"
          onClick={prefillSample}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900 text-teal-800 dark:text-teal-300 text-xs font-semibold border border-teal-200 dark:border-teal-800 transition shrink-0"
          title="Autofill sample responses for testing"
        >
          <Zap className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span>Quick Sample Fill</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-stone-200 dark:bg-stone-800 rounded-full h-2 mb-8 overflow-hidden">
        <div
          className="bg-teal-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-relaxed font-medium">{errorMsg}</span>
        </div>
      )}

      {/* Step Form Body */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 p-6 sm:p-8 shadow-sm space-y-6">
        {/* STEP 1: Basic Identity */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wide mb-1.5">
                  Display Name or First Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya Lin"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wide mb-1.5">
                  Age (18+)
                </label>
                <input
                  type="number"
                  min="18"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="21"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wide mb-1.5">
                Location or Campus Area
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. University Campus & Downtown"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wide mb-1.5">
                One-Sentence Vibe or Headline
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Design student & analog photography enthusiast"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wide mb-1.5">
                Bio / What kinds of conversations do you enjoy? *
              </label>
              <textarea
                rows={3}
                required
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share a little bit about what makes you happy, favorite weekend routines, or what you appreciate in peers..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Intentions */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
              Clear intentions eliminate ambiguity. Select all that apply to you:
            </p>

            <div className="grid sm:grid-cols-2 gap-3.5">
              {[
                {
                  id: 'Friendship' as IntentionType,
                  title: 'Friendship & Camaraderie',
                  desc: 'Looking for thoughtful companions, coffee hangouts, and low-pressure chats.',
                },
                {
                  id: 'Activity Partners' as IntentionType,
                  title: 'Activity & Hobby Partners',
                  desc: 'Someone to hike trails, visit museums, play board games, or boulder with.',
                },
                {
                  id: 'Dating' as IntentionType,
                  title: 'Intentional Dating',
                  desc: 'Romantic discovery grounded in shared values rather than split-second swiping.',
                },
                {
                  id: 'Community & Learning' as IntentionType,
                  title: 'Community & Learning',
                  desc: 'Book clubs, mutual aid circles, philosophy discussions, and skill swaps.',
                },
                {
                  id: 'Professional Networking' as IntentionType,
                  title: 'Creative Collaboration',
                  desc: 'Low-ego creative partners, indie project collaborators, or student study groups.',
                },
              ].map(item => {
                const isSelected = intentions.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleIntention(item.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-teal-600 dark:border-teal-500 bg-teal-50/70 dark:bg-teal-950/50 shadow-2xs'
                        : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 bg-stone-50/40 dark:bg-stone-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-sm text-stone-900 dark:text-stone-100">{item.title}</span>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-xs ${
                          isSelected ? 'bg-teal-600 text-white' : 'border border-stone-300 dark:border-stone-600'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Interests & Passions */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
                Choose passions that represent your daily or weekend life ({interests.length} selected):
              </p>
              <span className="text-[11px] text-teal-800 dark:text-teal-300 font-semibold bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                40% Compatibility Weight
              </span>
            </div>

            <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto pr-1">
              {ALL_INTEREST_TAGS.map(tag => {
                const isSelected = interests.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleInterest(tag)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-teal-700 dark:bg-teal-600 text-white shadow-2xs'
                        : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {tag}
                  </button>
                );
              })}
            </div>

            {/* Custom Interest Input */}
            <form onSubmit={addCustomInterest} className="flex gap-2 pt-2 border-t border-stone-200 dark:border-stone-800">
              <input
                type="text"
                value={customInterest}
                onChange={e => setCustomInterest(e.target.value)}
                placeholder="Add custom hobby or interest..."
                className="flex-1 px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-stone-900 dark:bg-teal-600 text-white text-xs font-semibold rounded-xl hover:bg-stone-800 dark:hover:bg-teal-500 transition-colors"
              >
                Add
              </button>
            </form>
          </div>
        )}

        {/* STEP 4: Communication Preferences */}
        {step === 4 && (
          <div className="space-y-6">
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
              Communication preferences ensure you match with peers who respect your natural rhythm.
            </p>

            {/* Pace */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wide mb-2">
                Preferred Messaging Pace *
              </label>
              <div className="grid sm:grid-cols-3 gap-2.5">
                {[
                  {
                    id: 'Gradual & thoughtful' as CommunicationPace,
                    title: 'Gradual & Thoughtful',
                    desc: 'Take hours or a couple days between replies. No pressure.',
                  },
                  {
                    id: 'Balanced & steady' as CommunicationPace,
                    title: 'Balanced & Steady',
                    desc: 'Regular daily check-ins with predictable rhythm.',
                  },
                  {
                    id: 'Quick & spontaneous' as CommunicationPace,
                    title: 'Quick & Spontaneous',
                    desc: 'Fast text banter and spontaneous campus meetups.',
                  },
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPace(opt.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      pace === opt.id
                        ? 'border-teal-600 dark:border-teal-500 bg-teal-50/70 dark:bg-teal-950/50 text-teal-950 dark:text-teal-200 font-medium'
                        : 'border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-800/40'
                    }`}
                  >
                    <span className="block font-bold text-xs">{opt.title}</span>
                    <span className="block text-[11px] text-stone-500 dark:text-stone-400 mt-1">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Style */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wide mb-2">
                Conversation Focus *
              </label>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {[
                  {
                    id: 'Deep & reflective' as CommunicationStyle,
                    title: 'Deep & Reflective',
                    desc: 'Values, meaningful ideas, and thoughtful perspectives.',
                  },
                  {
                    id: 'Lighthearted & casual' as CommunicationStyle,
                    title: 'Lighthearted & Casual',
                    desc: 'Fun banter, shared humor, and casual campus life.',
                  },
                  {
                    id: 'Activity-focused' as CommunicationStyle,
                    title: 'Activity-Focused',
                    desc: 'Meet over shared hobbies or study sessions rather than long texting.',
                  },
                  {
                    id: 'Prompt & concise' as CommunicationStyle,
                    title: 'Prompt & Concise',
                    desc: 'Direct, clear, and to the point.',
                  },
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setStyle(opt.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      style === opt.id
                        ? 'border-teal-600 dark:border-teal-500 bg-teal-50/70 dark:bg-teal-950/50 text-teal-950 dark:text-teal-200 font-medium'
                        : 'border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-800/40'
                    }`}
                  >
                    <span className="block font-bold text-xs">{opt.title}</span>
                    <span className="block text-[11px] text-stone-500 dark:text-stone-400 mt-1">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Comfort & Privacy Boundaries */}
        {step === 5 && (
          <div className="space-y-5">
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
              You maintain total authority over your presence. Adjust your boundary controls:
            </p>

            <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-stone-900 dark:text-stone-100 block">Pause Discovery Mode</span>
                <span className="text-xs text-stone-500 dark:text-stone-400 block mt-0.5">
                  Temporarily hide your profile from new recommendations whenever your social battery is full.
                </span>
              </div>
              <input
                type="checkbox"
                checked={discoveryPaused}
                onChange={e => setDiscoveryPaused(e.target.checked)}
                className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold">
                <ShieldCheck className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                <span>The CommonGround Guarantee</span>
              </div>
              <p className="text-[11px] text-teal-800 dark:text-teal-300 leading-relaxed">
                By completing your profile, you will be discoverable only to peers who share your chosen intentions. All conversations require mutual consent, with zero unsolicited direct messaging.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between mt-8">
        <button
          type="button"
          onClick={handleBack}
          disabled={step === 1 || loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs sm:text-sm font-semibold hover:bg-stone-50 dark:hover:bg-stone-800 transition disabled:opacity-40"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 dark:bg-teal-600 dark:hover:bg-teal-500 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
        >
          {loading ? (
            <span>Saving Profile to Backend...</span>
          ) : step === totalSteps ? (
            <>
              <span>Complete Setup & Enter CommonGround</span>
              <Check className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
