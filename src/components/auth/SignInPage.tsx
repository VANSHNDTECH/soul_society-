import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { authService, isProfileComplete } from '../../services/authService';
import { isSupabaseConfigured } from '../../lib/supabase';
import { useApp } from '../../context/AppContext';

export const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rawRedirect = searchParams.get('redirect');
  const redirectTarget = rawRedirect ? decodeURIComponent(rawRedirect) : '/module-3';

  const { refreshBackendData, showToast } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const isConnected = isSupabaseConfigured();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.signIn(email, password);
      if (result.error) {
        setErrorMsg(result.error);
      } else {
        await refreshBackendData();
        setSuccessMsg(`Welcome back, ${result.profile?.display_name || email}!`);
        showToast('Signed in successfully.', 'success');

        setTimeout(() => {
          // If profile is incomplete, send to profile setup
          if (!isProfileComplete(result.profile)) {
            navigate(`/profile-setup?redirect=${encodeURIComponent(redirectTarget)}`, { replace: true });
          } else {
            navigate(redirectTarget, { replace: true });
          }
        }, 800);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async (archetype: 'maya' | 'rohan' | 'editor') => {
    setLoading(true);
    setErrorMsg(null);
    try {
      if (archetype === 'editor') {
        await authService.signIn('research.editor@university.edu', 'demo');
      } else {
        await authService.signInAsDemo(archetype);
      }
      await refreshBackendData();
      showToast(`Signed in via Evaluation Demo (${archetype.toUpperCase()})`, 'success');
      navigate(redirectTarget, { replace: true });
    } catch (err: any) {
      setErrorMsg(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16 text-left">
      {/* Brand & Title */}
      <div className="text-center space-y-2 mb-8">
        <Link to="/" className="inline-flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-900 via-stone-900 to-purple-950 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <span className="font-heading font-black text-sm tracking-tighter text-teal-300">CG</span>
          </div>
          <span className="font-heading font-extrabold text-xl tracking-tight text-stone-900 dark:text-stone-100">
            CommonGround
          </span>
        </Link>
        <h1 className="font-heading font-bold text-2xl text-stone-900 dark:text-stone-100">
          Sign In to Your Account
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
          Access your verified profile, mutual introductions, and secure conversations.
        </p>
      </div>

      {/* Backend Status Banner */}
      <div
        className={`mb-6 p-3 rounded-xl border text-xs flex items-center justify-between ${
          isConnected
            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
            : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          <span className="font-medium">
            {isConnected ? 'Supabase PostgreSQL Database Active' : 'Local Demonstration Mode (Offline Backend)'}
          </span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/70 dark:bg-black/30">
          {isConnected ? 'Live Auth' : 'Demo Mode'}
        </span>
      </div>

      {/* Main Sign In Card */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 p-6 sm:p-8 shadow-sm space-y-5">
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wide mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wide">
                Password
              </label>
              <Link
                to="/reset-password"
                className="text-xs text-teal-700 dark:text-teal-400 hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 p-0.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 focus:outline-none"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-teal-800 hover:bg-teal-900 dark:bg-teal-600 dark:hover:bg-teal-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-3 border-t border-stone-100 dark:border-stone-800 text-center">
          <p className="text-xs text-stone-600 dark:text-stone-400">
            Don't have an account yet?{' '}
            <Link
              to={`/signup?redirect=${encodeURIComponent(redirectTarget)}`}
              className="text-teal-700 dark:text-teal-400 font-bold hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>

      {/* Separated & Clearly Labeled Demo Access Section */}
      <div className="mt-8 p-5 rounded-2xl bg-stone-100/70 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 text-left space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h3 className="font-heading font-bold text-xs text-stone-900 dark:text-stone-100">
              Evaluation & Demonstration Access
            </h3>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300">
            Hackathon / Demo
          </span>
        </div>
        <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
          Evaluating the application for presentation or grading? Use these sample personas to test features in pre-seeded demo mode without setting up an email inbox:
        </p>

        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            type="button"
            onClick={() => handleDemoSignIn('maya')}
            disabled={loading}
            className="py-2 px-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-teal-500 text-stone-800 dark:text-stone-200 text-xs font-semibold text-center transition shadow-2xs hover:shadow-xs"
          >
            Maya (Student)
          </button>
          <button
            type="button"
            onClick={() => handleDemoSignIn('rohan')}
            disabled={loading}
            className="py-2 px-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-teal-500 text-stone-800 dark:text-stone-200 text-xs font-semibold text-center transition shadow-2xs hover:shadow-xs"
          >
            Rohan (Peer)
          </button>
          <button
            type="button"
            onClick={() => handleDemoSignIn('editor')}
            disabled={loading}
            className="py-2 px-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-300 text-xs font-semibold text-center transition shadow-2xs hover:shadow-xs"
          >
            Dr. Elena (Editor)
          </button>
        </div>
      </div>
    </div>
  );
};
