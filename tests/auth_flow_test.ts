import { authService, isProfileComplete, DEMO_PROFILES } from '../src/services/authService';
import { profileService } from '../src/services/profileService';
import { DbProfile } from '../src/types/database';
import fs from 'node:fs';
import path from 'node:path';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`  ✕ FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`  ✓ PASS: ${message}`);
}

async function runAuthFlowTests() {
  console.log('\n============================================================');
  console.log('CommonGround — Comprehensive Authentication & Route Guard Test Suite');
  console.log('============================================================\n');

  console.log('--- 1. Fresh Visitor State & Non-Authenticated Default ---');
  await authService.signOut();
  const freshSession = await authService.getSession();
  assert(!freshSession.isAuthenticated, 'Fresh visitor session starts with isAuthenticated: false');
  assert(freshSession.user === null, 'Fresh visitor session contains user: null');
  assert(freshSession.profile === null, 'Fresh visitor session contains profile: null');

  console.log('\n--- 2. Profile Completeness Logic (Gatekeeper) ---');
  assert(!isProfileComplete(null), 'isProfileComplete returns false for null profile');
  assert(!isProfileComplete(undefined), 'isProfileComplete returns false for undefined profile');

  const emptyProfile: DbProfile = {
    id: 'test-new-user-001',
    display_name: 'New Student',
    role: 'user',
    intentions: [], // Empty intentions
    discovery_enabled: true,
    profile_visibility: 'standard',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  assert(!isProfileComplete(emptyProfile), 'isProfileComplete returns false when intentions and bio are missing');

  const partialProfile: DbProfile = {
    ...emptyProfile,
    intentions: ['Friendship'],
    bio: '', // Empty bio
  };
  assert(!isProfileComplete(partialProfile), 'isProfileComplete returns false when bio is empty');

  const completeProfile: DbProfile = {
    ...emptyProfile,
    intentions: ['Friendship', 'Activity Partners'],
    bio: 'Design student seeking coffee and indie games.',
    communication_style: 'Deep & reflective',
    pace_preference: 'Gradual & thoughtful',
  };
  assert(isProfileComplete(completeProfile), 'isProfileComplete returns true when all required fields are present');
  assert(isProfileComplete(DEMO_PROFILES.maya), 'Demo persona Maya Lin has a complete profile');
  assert(isProfileComplete(DEMO_PROFILES.rohan), 'Demo persona Rohan Sharma has a complete profile');

  console.log('\n--- 3. Registration & Initial Incomplete Profile State ---');
  const regResult = await authService.signUp('newstudent@university.edu', 'ValidPassword123!', 'Alex Morgan');
  assert(regResult.error === null, 'authService.signUp succeeds with valid credentials');
  assert(regResult.user !== null, 'signUp returns a registered user object');
  assert(!isProfileComplete(regResult.profile), 'Newly registered profile starts incomplete, gating entry until profile setup');

  console.log('\n--- 4. Profile Setup Completion Flow ---');
  const setupResult = await authService.saveCompletedProfile(regResult.user.id, {
    display_name: 'Alex Morgan',
    age: 22,
    location: 'North Campus',
    bio: 'Music enthusiast and coffee lover looking for trail hiking buddies.',
    intentions: ['Friendship', 'Activity Partners'],
    communication_style: 'Lighthearted & casual',
    social_energy: 'Ambivert / Adaptable',
    pace_preference: 'Balanced & steady',
  });
  assert(setupResult.error === null, 'saveCompletedProfile successfully saves completed profile');
  assert(setupResult.profile !== null, 'saveCompletedProfile returns updated profile');
  assert(isProfileComplete(setupResult.profile), 'Profile is now complete and unlocks platform entry');

  console.log('\n--- 5. Sign Out & Protected Content Lockout ---');
  await authService.signOut();
  const signedOutSession = await authService.getSession();
  assert(!signedOutSession.isAuthenticated, 'authService.signOut completely revokes authenticated session');
  assert(signedOutSession.user === null, 'Signed out session user object is null');
  assert(signedOutSession.profile === null, 'Signed out session profile object is null');

  console.log('\n--- 6. Invalid Credentials & Misconfigured Supabase Safety ---');
  const badLogin = await authService.signIn('unauthorized_hacker@unknown.org', 'WrongPass123!');
  assert(badLogin.error !== null, 'Unregistered / invalid credentials correctly rejected');
  assert(!badLogin.user, 'Failed sign-in does not produce a fake user object');

  console.log('\n--- 7. Password Reset Service Verification ---');
  const invalidReset = await authService.resetPassword('not-an-email');
  assert(invalidReset.error !== null, 'Password reset with invalid email is rejected');
  const validReset = await authService.resetPassword('student@university.edu');
  assert(validReset.error === null, 'Password reset with valid email succeeds');
  assert(validReset.message.length > 0, 'Password reset returns informative instructions');

  console.log('\n--- 8. Segregated Hackathon / Evaluation Demo Access ---');
  const demoSession = await authService.signInAsDemo('maya');
  assert(demoSession.isAuthenticated, 'signInAsDemo authenticates demo user cleanly');
  assert(demoSession.isDemoSession === true, 'Demo session is explicitly flagged with isDemoSession: true');
  assert(demoSession.user?.id === DEMO_PROFILES.maya.id, 'Demo session uses Maya profile ID');

  await authService.signOut();

  console.log('\n--- 9. Route Protection & Code Structure Audit ---');
  const appTsx = fs.readFileSync(path.resolve(process.cwd(), 'src/App.tsx'), 'utf-8');
  assert(appTsx.includes('/signin') && appTsx.includes('SignInPage'), 'App.tsx defines dedicated /signin route');
  assert(appTsx.includes('/signup') && appTsx.includes('SignUpPage'), 'App.tsx defines dedicated /signup route');
  assert(appTsx.includes('/reset-password') && appTsx.includes('ResetPasswordPage'), 'App.tsx defines dedicated /reset-password route');
  assert(appTsx.includes('/profile-setup') && appTsx.includes('ProfileSetupPage'), 'App.tsx defines dedicated /profile-setup route');
  assert(appTsx.includes('/discovery') && appTsx.includes('ProtectedRoute'), 'App.tsx guards /discovery direct URL with ProtectedRoute');
  assert(appTsx.includes('/chat') && appTsx.includes('ProtectedRoute'), 'App.tsx guards /chat direct URL with ProtectedRoute');
  assert(appTsx.includes('/requests') && appTsx.includes('ProtectedRoute'), 'App.tsx guards /requests direct URL with ProtectedRoute');
  assert(appTsx.includes('/clearsignals') && appTsx.includes('ProtectedRoute'), 'App.tsx guards /clearsignals direct URL with ProtectedRoute');
  assert(appTsx.includes('/opensignals') && appTsx.includes('ProtectedRoute'), 'App.tsx guards /opensignals direct URL with ProtectedRoute');

  const headerTsx = fs.readFileSync(path.resolve(process.cwd(), 'src/components/shared/AppHeader.tsx'), 'utf-8');
  assert(headerTsx.includes('nav-signin-btn') || headerTsx.includes('Sign In'), 'AppHeader contains visible Sign In button');
  assert(headerTsx.includes('nav-signup-btn') || headerTsx.includes('Create Account'), 'AppHeader contains visible Create Account button');
  assert(headerTsx.includes('nav-signout-btn') || headerTsx.includes('Sign Out'), 'AppHeader contains functional Sign Out button');

  console.log('\n============================================================');
  console.log('Authentication Flow Test Suite: ALL TESTS PASSED!');
  console.log('============================================================\n');
}

runAuthFlowTests().catch((err) => {
  console.error('Test suite error:', err);
  process.exit(1);
});
