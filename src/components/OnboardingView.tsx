import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Zap,
  Lock,
} from 'lucide-react';
import {
  IntentionType,
  CommunicationPace,
  CommunicationStyle,
  SocialEnergy,
} from '../types';
import { ALL_INTEREST_TAGS, ALL_VALUES } from '../data/mockUsers';

export const OnboardingView: React.FC = () => {
  const { currentUser, updateCurrentUser, setActiveTab, showToast, authSession, openAuthModal } = useApp();

  const [step, setStep] = useState<number>(1);
  const totalSteps = 6;

  // Form State initialized from currentUser
  const [name, setName] = useState(currentUser.name);
  const [pronouns, setPronouns] = useState(currentUser.pronouns || 'she/her');
  const [age, setAge] = useState(currentUser.age || 26);
  const [location, setLocation] = useState(currentUser.location || 'Seattle, WA');
  const [headline, setHeadline] = useState(currentUser.headline);
  const [bio, setBio] = useState(currentUser.bio);

  const [intentions, setIntentions] = useState<IntentionType[]>(currentUser.intentions);
  const [interests, setInterests] = useState<string[]>(currentUser.interests);
  const [customInterest, setCustomInterest] = useState('');
  const [values, setValues] = useState<string[]>(currentUser.values);

  const [pace, setPace] = useState<CommunicationPace>(currentUser.communicationPreferences.pace);
  const [style, setStyle] = useState<CommunicationStyle>(currentUser.communicationPreferences.style);
  const [socialEnergy, setSocialEnergy] = useState<SocialEnergy>(
    currentUser.communicationPreferences.socialEnergy
  );

  const [visibility, setVisibility] = useState(currentUser.privacySettings.visibility);
  const [introRequirement, setIntroRequirement] = useState(
    currentUser.privacySettings.introRequirement
  );
  const [discoveryPaused, setDiscoveryPaused] = useState(
    currentUser.privacySettings.discoveryPaused
  );

  // Validation
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    setError(null);
    if (step === 1 && !name.trim()) {
      setError('Please provide a first name or display name.');
      return;
    }
    if (step === 2 && intentions.length === 0) {
      setError('Please select at least one intention for joining.');
      return;
    }
    if (step === 3 && interests.length === 0) {
      setError('Please choose at least 2 interests to enable compatibility matching.');
      return;
    }

    if (step < totalSteps) {
      setStep(prev => prev + 1);
    } else {
      if (!authSession.isAuthenticated) {
        openAuthModal('Please sign in or create an account to save your verified profile to the database.');
        return;
      }
      // Save all to AppContext
      updateCurrentUser({
        name: name.trim(),
        pronouns,
        age: Number(age) || undefined,
        location,
        headline,
        bio,
        intentions,
        interests,
        values,
        communicationPreferences: {
          pace,
          style,
          socialEnergy,
        },
        privacySettings: {
          discoveryPaused,
          visibility,
          showLocation: true,
          introRequirement,
        },
      });
      showToast(`Welcome to CommonGround, ${name.trim()}! Here are people who share your vibe.`, 'success');
      setActiveTab('discovery');
    }
  };

  const handleBack = () => {
    setError(null);
    if (step > 1) {
      setStep(prev => prev - 1);
    } else {
      setActiveTab('landing');
    }
  };

  // Quick Pre-Fill Shortcut for Evaluators / Demo
  const prefillDemo = () => {
    setName('Maya Lin');
    setPronouns('she/her');
    setAge(26);
    setLocation('Seattle, WA');
    setHeadline('UX Researcher & weekend ceramicist seeking kindred spirits');
    setBio('I study how people experience technology by day, and throw clay on the wheel by night. Big fan of slow Sunday mornings, pour-over coffee, and exploring mountain trails.');
    setIntentions(['Friendship', 'Activity Partners', 'Dating']);
    setInterests([
      'Ceramics & Pottery',
      'Specialty Coffee',
      'Hiking & Trails',
      'Analog Photography',
      'Sci-Fi & Speculative Fiction',
      'Mindful Meditation',
    ]);
    setValues(['Empathy & Kindness', 'Creative Expression', 'Intellectual Curiosity']);
    setPace('Balanced & steady');
    setStyle('Deep & reflective');
    setSocialEnergy('Ambivert / Adaptable');
    showToast('Demo profile populated with realistic responses.', 'info');
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

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 text-left">
      {/* Top Banner with Quick Fill */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-stone-200 dark:border-stone-800">
        <div>
          <span className="text-xs font-bold text-teal-800 dark:text-teal-400 uppercase tracking-wider">
            Step {step} of {totalSteps}
          </span>
          <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            {step === 1 && 'Welcome! Tell us what to call you'}
            {step === 2 && 'What brings you to CommonGround?'}
            {step === 3 && 'What activities and topics excite you?'}
            {step === 4 && 'What values guide your everyday life?'}
            {step === 5 && 'How do you prefer to communicate?'}
            {step === 6 && 'Your comfort & privacy boundaries'}
          </h2>
        </div>

        <button
          type="button"
          onClick={prefillDemo}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-800 dark:text-teal-300 text-xs font-semibold border border-teal-200 dark:border-teal-800 transition-colors shrink-0"
          title="Autofill Maya Lin's demo profile"
        >
          <Zap className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span>Quick Demo Fill</span>
        </button>
      </div>

      {/* Visitor Preview Mode Banner */}
      {!authSession.isAuthenticated && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-950 dark:text-amber-200">
                Visitor Preview Mode
              </p>
              <p className="text-xs text-amber-800 dark:text-amber-300">
                You are previewing onboarding. Sign in or register to persist your verified profile in the database.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => openAuthModal('Sign in or register to save your profile to the database.')}
            className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shrink-0 shadow-2xs transition-colors"
          >
            Sign In / Register
          </button>
        </div>
      )}

      {/* Progress Bar */}
      <div className="w-full bg-stone-200 dark:bg-stone-800 rounded-full h-2 mb-8 overflow-hidden">
        <div
          className="bg-teal-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>

      {error && (
        <div className="p-3 mb-6 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Step Contents */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 p-6 sm:p-8 shadow-sm space-y-6">
        {/* STEP 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-5">
            <p className="text-sm text-stone-600 dark:text-stone-400">
              Only share what feels comfortable. No public popularity metrics, no follower counts.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wide mb-1.5">
                  First Name or Display Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Maya"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wide mb-1.5">
                  Pronouns (optional)
                </label>
                <input
                  type="text"
                  value={pronouns}
                  onChange={e => setPronouns(e.target.value)}
                  placeholder="e.g. she/her or they/them"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wide mb-1.5">
                  General Location / City
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Seattle, WA"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wide mb-1.5">
                  Age (optional)
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={e => setAge(Number(e.target.value))}
                  placeholder="e.g. 26"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wide mb-1.5">
                One-Sentence Vibe or Headline
              </label>
              <input
                type="text"
                value={headline}
                onChange={e => setHeadline(e.target.value)}
                placeholder="e.g. UX Researcher & weekend ceramicist seeking kindred spirits"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wide mb-1.5">
                Short Bio / What you appreciate in others
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Share a little bit about what makes you happy, favorite weekend routines, or what kind of conversations you enjoy..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Intentions */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-stone-600 dark:text-stone-400">
              Clear intentions eliminate guesswork. Select all intentions that apply to you:
            </p>

            <div className="grid sm:grid-cols-2 gap-3.5">
              {[
                {
                  id: 'Friendship' as IntentionType,
                  title: 'Friendship & Camaraderie',
                  desc: 'Looking for thoughtful companions, coffee dates, and deep conversations.',
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
                  title: 'Creative / Tech Collaboration',
                  desc: 'Low-ego creative partners, indie game collaborators, or career mentorship.',
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

        {/* STEP 3: Interests */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Choose your favorite passions ({interests.length} selected):
              </p>
              <span className="text-xs text-teal-800 dark:text-teal-300 font-semibold bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-md border border-teal-200 dark:border-teal-800">
                Weights 40% of compatibility
              </span>
            </div>

            <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto pr-1">
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
                placeholder="Don't see your hobby? Add custom interest..."
                className="flex-1 px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 text-xs focus:outline-none focus:ring-2 focus:ring-teal-600"
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

        {/* STEP 4: Values */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Shared values build enduring connections ({values.length} selected):
              </p>
              <span className="text-xs text-teal-800 dark:text-teal-300 font-semibold bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-md border border-teal-200 dark:border-teal-800">
                Weights 20% of compatibility
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-2.5">
              {ALL_VALUES.map(val => {
                const isSelected = values.includes(val);
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => toggleValue(val)}
                    className={`p-3 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-purple-500 dark:border-purple-400 bg-purple-50/70 dark:bg-purple-950/50 text-purple-950 dark:text-purple-200 font-semibold'
                        : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-800/40'
                    }`}
                  >
                    <span>{val}</span>
                    {isSelected && <Check className="w-4 h-4 text-purple-700 dark:text-purple-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: Communication Preferences */}
        {step === 5 && (
          <div className="space-y-6">
            <p className="text-sm text-stone-600 dark:text-stone-400">
              Honoring communication pacing reduces social anxiety and boundary clashes.
            </p>

            {/* Pace */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wide mb-2">
                Preferred Interaction Pace
              </label>
              <div className="grid sm:grid-cols-3 gap-2.5">
                {[
                  {
                    id: 'Gradual & thoughtful' as CommunicationPace,
                    title: 'Gradual & Thoughtful',
                    desc: 'Take days between messages, no rush.',
                  },
                  {
                    id: 'Balanced & steady' as CommunicationPace,
                    title: 'Balanced & Steady',
                    desc: 'Regular check-ins, comfortable cadence.',
                  },
                  {
                    id: 'Quick & spontaneous' as CommunicationPace,
                    title: 'Quick & Spontaneous',
                    desc: 'Fast text banter, spontaneous hangs.',
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
                Conversation Focus
              </label>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {[
                  {
                    id: 'Deep & reflective' as CommunicationStyle,
                    title: 'Deep & Reflective',
                    desc: 'Big ideas, values, life perspectives.',
                  },
                  {
                    id: 'Lighthearted & casual' as CommunicationStyle,
                    title: 'Lighthearted & Casual',
                    desc: 'Memes, daily humor, friendly banter.',
                  },
                  {
                    id: 'Activity-focused' as CommunicationStyle,
                    title: 'Activity-Focused',
                    desc: 'Meet over shared hobbies, less texting.',
                  },
                  {
                    id: 'Prompt & concise' as CommunicationStyle,
                    title: 'Prompt & Concise',
                    desc: 'Direct, clear, to the point.',
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

            {/* Social Energy */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wide mb-2">
                Social Energy / Battery
              </label>
              <div className="grid sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'Introverted / Calm' as SocialEnergy, label: 'Introverted / Low-key' },
                  { id: 'Ambivert / Adaptable' as SocialEnergy, label: 'Ambivert / Flexible' },
                  { id: 'Extroverted / High energy' as SocialEnergy, label: 'Extroverted / High energy' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSocialEnergy(opt.id)}
                    className={`p-2.5 text-center rounded-xl border text-xs font-medium transition-all ${
                      socialEnergy === opt.id
                        ? 'border-teal-600 dark:border-teal-500 bg-teal-50 dark:bg-teal-950/60 text-teal-900 dark:text-teal-200 font-bold'
                        : 'border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-800/40'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Privacy & Boundary Setup */}
        {step === 6 && (
          <div className="space-y-5">
            <p className="text-sm text-stone-600 dark:text-stone-400">
              You are always in control of when and how people discover you.
            </p>

            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm text-stone-900 dark:text-stone-100 block">Pause Discovery Mode</span>
                  <span className="text-xs text-stone-500 dark:text-stone-400 block mt-0.5">
                    Temporarily hide your profile from new people when your social battery is full.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={discoveryPaused}
                  onChange={e => setDiscoveryPaused(e.target.checked)}
                  className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wide mb-2">
                  Who Can Discover Your Profile
                </label>
                <div className="space-y-2">
                  {[
                    {
                      id: 'public_match',
                      title: 'All Compatible Members',
                      desc: 'Anyone who shares your interests or intentions can view your card.',
                    },
                    {
                      id: 'intentions_only',
                      title: 'Same Intentions Only',
                      desc: 'Only show your profile to people seeking the exact same intentions.',
                    },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setVisibility(opt.id as any)}
                      className={`w-full p-3 rounded-xl border text-left transition-all ${
                        visibility === opt.id
                          ? 'border-teal-600 dark:border-teal-500 bg-teal-50/70 dark:bg-teal-950/50 font-medium'
                          : 'border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-800/40'
                      }`}
                    >
                      <span className="block font-bold text-xs text-stone-900 dark:text-stone-100">{opt.title}</span>
                      <span className="block text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wide mb-2">
                  Introduction Barrier Requirement
                </label>
                <div className="space-y-2">
                  {[
                    {
                      id: 'shared_intention',
                      title: 'Shared Intention Required (Recommended)',
                      desc: 'People must share at least one mutual intention before sending an introduction.',
                    },
                    {
                      id: 'high_match',
                      title: 'High Compatibility Only (70%+ Match)',
                      desc: 'Requires significant shared interests and matching communication energy.',
                    },
                    {
                      id: 'any',
                      title: 'Open to Any Introduction',
                      desc: 'Any compatible member can craft a personalized introduction.',
                    },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setIntroRequirement(opt.id as any)}
                      className={`w-full p-3 rounded-xl border text-left transition-all ${
                        introRequirement === opt.id
                          ? 'border-teal-600 dark:border-teal-500 bg-teal-50/70 dark:bg-teal-950/50 font-medium'
                          : 'border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-800/40'
                      }`}
                    >
                      <span className="block font-bold text-xs text-stone-900 dark:text-stone-100">{opt.title}</span>
                      <span className="block text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-teal-50/80 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-xs text-teal-900 dark:text-teal-200 leading-relaxed space-y-1">
                <span className="font-bold block">🔒 The CommonGround Safety Promise</span>
                <p>
                  No unsolicited messages. No public rejection counts. You can block or pause anytime with dignity.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-8">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-sm font-semibold hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{step === 1 ? 'Cancel' : 'Back'}</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-stone-900 dark:bg-teal-600 hover:bg-stone-800 dark:hover:bg-teal-500 text-white text-sm font-semibold shadow-md transition-all"
        >
          <span>{step === totalSteps ? 'Complete & Start Discovery' : 'Continue'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
