import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  LogOut,
} from 'lucide-react';
import { authService, AuthSession } from '../../services/authService';
import { isSupabaseConfigured } from '../../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: AuthSession;
  onSessionUpdated?: (session: AuthSession) => void;
  promptMessage?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  session,
  onSessionUpdated,
  promptMessage,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'status'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const isConnected = isSupabaseConfigured();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.signIn(email, password);
      if (result.error) {
        setErrorMsg(result.error);
      } else {
        const newSession = await authService.getSession();
        onSessionUpdated?.(newSession);
        setSuccessMsg(`Signed in successfully as ${newSession.profile?.display_name || email}!`);
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    if (!email || !password || !displayName) {
      setErrorMsg('Please provide your name, email, and password.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.signUp(email, password, displayName);
      if (result.error) {
        setErrorMsg(result.error);
      } else {
        const newSession = await authService.getSession();
        onSessionUpdated?.(newSession);
        setSuccessMsg('Account registered successfully! Welcome to CommonGround.');
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await authService.signOut();
      const newSession = await authService.getSession();
      onSessionUpdated?.(newSession);
      setSuccessMsg('Signed out successfully.');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error signing out.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (role: 'user' | 'editor' | 'admin') => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const demoEmails: Record<string, string> = {
        user: 'student.maya@university.edu',
        editor: 'research.editor@university.edu',
        admin: 'lead.architect@university.edu',
      };
      const demoNames: Record<string, string> = {
        user: 'Maya Lin',
        editor: 'Dr. Elena Rostova (Editor)',
        admin: 'Admin CommonGround',
      };
      const emailToUse = demoEmails[role];
      const nameToUse = demoNames[role];

      if (isConnected) {
        const res = await authService.signIn(emailToUse, 'DemoPass123!');
        if (res.error) {
          // If demo user doesn't exist yet on remote Supabase, attempt sign up
          await authService.signUp(emailToUse, 'DemoPass123!', nameToUse);
        }
      } else {
        await authService.signIn(emailToUse, 'demo');
      }

      const newSession = await authService.getSession();
      onSessionUpdated?.(newSession);
      setSuccessMsg(`Switched to demo role: ${role.toUpperCase()}`);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 dark:bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden text-stone-900 dark:text-stone-100">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-800 text-teal-200 flex items-center justify-center font-bold text-xs">
              CG
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-stone-900 dark:text-stone-100">
                {session.isAuthenticated ? 'Account & Session' : 'CommonGround Authentication'}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {isConnected ? 'PostgreSQL & Supabase Connected' : 'Local Demonstration Mode'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Database Status Banner */}
        <div className={`px-6 py-2.5 text-xs flex items-center justify-between border-b ${
          isConnected
            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border-emerald-100 dark:border-emerald-900/60'
            : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border-amber-100 dark:border-amber-900/60'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className="font-medium">
              {isConnected ? 'Persistent Cloud Database Active' : 'Local Mock/Storage Backend'}
            </span>
          </div>
          <button
            onClick={() => setMode('status')}
            className="underline hover:text-stone-900 dark:hover:text-white font-semibold"
          >
            Details
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {promptMessage && !session.isAuthenticated && mode !== 'status' && (
            <div className="mb-4 p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200 text-xs flex items-start gap-2">
              <Lock className="w-4 h-4 shrink-0 mt-0.5 text-teal-700 dark:text-teal-400" />
              <span className="font-medium">{promptMessage}</span>
            </div>
          )}

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {mode === 'status' ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 space-y-2">
                <div className="flex items-center justify-between font-semibold text-stone-900">
                  <span>Backend Provider</span>
                  <span className="text-teal-700">Supabase (PostgreSQL 15)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Row Level Security (RLS)</span>
                  <span className="text-emerald-700 font-medium">Enabled</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Realtime Subscriptions</span>
                  <span className="text-emerald-700 font-medium">Enabled (postgres_changes)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Migrations Provided</span>
                  <span>4 SQL scripts in /supabase</span>
                </div>
              </div>

              {!isConnected && (
                <div className="p-3 rounded-xl bg-stone-100 text-stone-600 text-xs space-y-1">
                  <p className="font-semibold text-stone-800">To connect your live hosted database:</p>
                  <ol className="list-decimal pl-4 space-y-0.5">
                    <li>Create a project at <code className="bg-stone-200 px-1 rounded">supabase.com</code></li>
                    <li>Run <code className="bg-stone-200 px-1 rounded">supabase/setup.sql</code> in SQL Editor</li>
                    <li>Add <code className="bg-stone-200 px-1 rounded">VITE_SUPABASE_URL</code> and anon key to <code className="bg-stone-200 px-1 rounded">.env.local</code></li>
                  </ol>
                </div>
              )}

              <button
                type="button"
                onClick={() => setMode(session.isAuthenticated ? 'signin' : 'signin')}
                className="w-full py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800"
              >
                Back to Account
              </button>
            </div>
          ) : session.isAuthenticated ? (
            /* Authenticated User View */
            <div className="space-y-5">
              <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                <img
                  src={session.profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                  alt={session.profile?.display_name || 'User'}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-teal-600/30"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-stone-900 text-sm truncate">
                      {session.profile?.display_name || session.user?.email}
                    </h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                      {session.profile?.role || 'user'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 truncate">{session.user?.email || 'Authenticated User'}</p>
                </div>
              </div>

              {/* Roles and Capabilities */}
              <div className="text-xs space-y-1.5 p-3 rounded-xl bg-teal-50/50 border border-teal-100 text-teal-900">
                <div className="font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-700" />
                  <span>Access Permissions</span>
                </div>
                <p className="text-[11px] text-teal-800">
                  {session.profile?.role === 'editor' || session.profile?.role === 'admin'
                    ? '✓ Full permissions: Can create/edit personas, update research problem scores, and participate in Module 3 prototype.'
                    : '✓ Standard user: Can manage personal profile, send connection requests, and chat with accepted connections.'}
                </p>
              </div>

              {/* Quick Switch Persona for Demo and University Defense */}
              <div className="pt-2 border-t border-stone-100">
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-2">
                  Quick Switch Active Role (Presentation Testing):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('user')}
                    disabled={loading}
                    className="py-1.5 px-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-medium text-center transition"
                  >
                    Student (User)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('editor')}
                    disabled={loading}
                    className="py-1.5 px-2 bg-teal-50 hover:bg-teal-100 text-teal-900 rounded-lg text-xs font-semibold text-center transition"
                  >
                    Editor
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('admin')}
                    disabled={loading}
                    className="py-1.5 px-2 bg-purple-50 hover:bg-purple-100 text-purple-900 rounded-lg text-xs font-semibold text-center transition"
                  >
                    Admin
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={loading}
                  className="flex-1 py-2 px-3 border border-red-200 text-red-700 hover:bg-red-50 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 px-3 bg-stone-900 text-white hover:bg-stone-800 rounded-xl text-xs font-semibold transition"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Sign In / Sign Up Form */
            <div>
              {/* Tab Toggle */}
              <div className="flex rounded-xl bg-stone-100 dark:bg-stone-800 p-1 mb-5">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    mode === 'signin'
                      ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-2xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    mode === 'signup'
                      ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-2xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                  }`}
                >
                  Register
                </button>
              </div>

              <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp} className="space-y-3.5">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">Display Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="e.g. Maya Lin"
                        required
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@university.edu"
                      required
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-semibold shadow-xs transition disabled:opacity-50"
                >
                  {loading ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
                </button>
              </form>

              {/* Demo Quick Logins */}
              <div className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-800">
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mb-2 text-center">Or quickly test as a sample persona:</p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('user')}
                    className="py-1.5 px-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-lg text-xs font-medium text-center transition"
                  >
                    Maya (Student)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('editor')}
                    className="py-1.5 px-2 bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 dark:hover:bg-teal-900 text-teal-900 dark:text-teal-200 rounded-lg text-xs font-semibold text-center transition"
                  >
                    Editor
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('admin')}
                    className="py-1.5 px-2 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900 text-purple-900 dark:text-purple-200 rounded-lg text-xs font-semibold text-center transition"
                  >
                    Admin
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
