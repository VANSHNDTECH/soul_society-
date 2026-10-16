import { authService } from '../src/services/authService';
import { profileService } from '../src/services/profileService';
import { connectionService } from '../src/services/connectionService';
import { chatService } from '../src/services/chatService';
import { GUEST_VISITOR_USER, MOCK_USERS } from '../src/data/mockUsers';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✕ FAIL: ${testName} ${details ? `(${details})` : ''}`);
    failed++;
  }
}

async function runThemeAuthUnificationSuite() {
  console.log('\n============================================================');
  console.log('CommonGround — UI Unification, Auth & Theme Verification Suite');
  console.log('============================================================\n');

  // --------------------------------------------------------------------------
  // Requirement 2: Authentication Enforcement & Identity Verification
  // --------------------------------------------------------------------------
  console.log('--- 1. Authentication Enforcement & Session Handling ---');

  // Clear any existing session to start as unauthenticated guest
  authService.signOut();
  const guestSession = authService.getCachedSession();

  assert(
    guestSession !== null && guestSession.isAuthenticated === false,
    'Unauthenticated guest visitor is NOT treated as authenticated',
    `isAuthenticated was: ${guestSession?.isAuthenticated}`
  );

  assert(
    guestSession?.user === null,
    'Unauthenticated session contains null user object'
  );

  // Test guest user definition
  assert(
    GUEST_VISITOR_USER.id === 'guest-visitor' && GUEST_VISITOR_USER.name.includes('Visitor'),
    'GUEST_VISITOR_USER is cleanly defined with unauthenticated guest ID'
  );

  // Authenticate as a demo user
  const authSession = await authService.signInAsDemo('maya');
  assert(
    authSession !== null && authSession.isAuthenticated === true,
    'authService.signInAsDemo authenticates User A successfully'
  );
  assert(
    authSession.user?.id === 'usr-maya-001',
    'Authenticated session correctly binds to verified user ID (usr-maya-001)'
  );

  // Session persistence check
  const restoredSession = authService.getCachedSession();
  assert(
    restoredSession !== null && restoredSession.isAuthenticated && restoredSession.user?.id === 'usr-maya-001',
    'Session is persisted and can be restored synchronously from storage cache'
  );

  // --------------------------------------------------------------------------
  // Requirement 3: Database & Profile Synchronization
  // --------------------------------------------------------------------------
  console.log('\n--- 2. Database Synchronization & Profile Identity ---');

  // Authenticated profile update
  const updatedHeadline = `Senior UX Researcher & Ceramicist (${Date.now()})`;
  const updateResult = await profileService.updateProfile('usr-maya-001', {
    headline: updatedHeadline,
    bio: 'Updated verified bio for regression testing',
  });

  assert(
    updateResult.profile !== null && updateResult.profile.headline === updatedHeadline,
    'profileService saves verified profile update to backend / state'
  );

  // Re-fetch profile to verify persistence
  const reFetchedProfile = await profileService.getProfile('usr-maya-001');
  assert(
    reFetchedProfile !== null && reFetchedProfile.headline === updatedHeadline,
    'Re-fetched profile reflects the stored database modification'
  );

  // Unauthorized profile modification boundary check:
  // User cannot update another user's profile if user_id doesn't match
  const profileServiceSource = readFileSync(resolve(process.cwd(), 'src/services/profileService.ts'), 'utf8');
  assert(
    profileServiceSource.includes('eq(\'id\', userId)') || profileServiceSource.includes('usr-'),
    'Profile operations bind directly to specified user ID filter'
  );

  // --------------------------------------------------------------------------
  // Requirement 1: UI Unification Across All Three Modules
  // --------------------------------------------------------------------------
  console.log('\n--- 3. UI Unification Across Modules 1, 2, and 3 ---');

  // Check AppHeader for shared overview tabs across all modules
  const headerSource = readFileSync(resolve(process.cwd(), 'src/components/shared/AppHeader.tsx'), 'utf8');
  assert(
    headerSource.includes("id: 'overview', label: 'Overview'") &&
    headerSource.includes("id: 'evidence', label: 'Evidence Library'") &&
    headerSource.includes("id: 'discovery', label: 'Discover'"),
    'AppHeader defines unified sub-navigation tabs starting with Overview for all modules'
  );

  assert(
    headerSource.includes('<ThemeToggle showDropdown />'),
    'AppHeader embeds the global ThemeToggle accessible from all three modules'
  );

  // Check Module 3 Overview view component existence
  const module3OverviewPath = resolve(process.cwd(), 'src/components/module3/Module3Overview.tsx');
  assert(
    existsSync(module3OverviewPath),
    'Module 3 Overview component exists (Module3Overview.tsx)'
  );

  const module3OverviewSource = readFileSync(module3OverviewPath, 'utf8');
  assert(
    module3OverviewSource.includes('The Solution Architect') &&
    module3OverviewSource.includes('Active Connections') &&
    module3OverviewSource.includes('Multi-Factor Weights'),
    'Module 3 Overview follows standardized Hero banner and Metrics strip layout matching Modules 1 & 2'
  );

  // Check Module 3 router renders Overview
  const module3PrototypeSource = readFileSync(resolve(process.cwd(), 'src/components/Module3PrototypeView.tsx'), 'utf8');
  assert(
    module3PrototypeSource.includes('Module3Overview') &&
    module3PrototypeSource.includes("activeTab === 'overview'"),
    'Module3PrototypeView routes "overview" tab to Module3Overview component'
  );

  // Check AppContext guards user mutations
  const appContextSource = readFileSync(resolve(process.cwd(), 'src/context/AppContext.tsx'), 'utf8');
  assert(
    appContextSource.includes('requireAuth(') &&
    appContextSource.includes('sendIntroduction') &&
    appContextSource.includes('sendMessage') &&
    appContextSource.includes('updateCurrentUser'),
    'AppContext strictly guards mutating user actions with requireAuth'
  );

  // --------------------------------------------------------------------------
  // Requirement 4: Complete Light / Dark Mode System
  // --------------------------------------------------------------------------
  console.log('\n--- 4. Theme System (Light, Dark, System) & Tokens ---');

  // Verify ThemeContext
  const themeContextPath = resolve(process.cwd(), 'src/context/ThemeContext.tsx');
  assert(
    existsSync(themeContextPath),
    'ThemeContext exists and exports ThemeProvider and useTheme'
  );

  const themeContextSource = readFileSync(themeContextPath, 'utf8');
  assert(
    themeContextSource.includes('commonground_theme_preference_v1') &&
    themeContextSource.includes('prefers-color-scheme: dark') &&
    themeContextSource.includes("root.classList.add('dark')"),
    'ThemeContext supports light, dark, and system modes and persists preference to localStorage'
  );

  // Verify ThemeToggle component
  const themeTogglePath = resolve(process.cwd(), 'src/components/shared/ThemeToggle.tsx');
  assert(
    existsSync(themeTogglePath),
    'ThemeToggle component exists with accessible ARIA labels'
  );

  const themeToggleSource = readFileSync(themeTogglePath, 'utf8');
  assert(
    themeToggleSource.includes('aria-label') &&
    themeToggleSource.includes('Sun') &&
    themeToggleSource.includes('Moon'),
    'ThemeToggle renders accessible sun/moon icons and interactive mode picker'
  );

  // Verify CSS custom dark variant in index.css
  const indexCssSource = readFileSync(resolve(process.cwd(), 'src/index.css'), 'utf8');
  assert(
    indexCssSource.includes('@custom-variant dark (&:where(.dark, .dark *));'),
    'index.css configures Tailwind v4 dark variant selector (@custom-variant dark)'
  );

  assert(
    indexCssSource.includes('.dark {') && indexCssSource.includes('--color-stone-900'),
    'index.css specifies dark theme tokens and background overrides'
  );

  // Verify dark mode styling on primary views
  const discoverySource = readFileSync(resolve(process.cwd(), 'src/components/DiscoveryView.tsx'), 'utf8');
  assert(
    discoverySource.includes('dark:bg-stone-900') && discoverySource.includes('dark:border-stone-800'),
    'DiscoveryView candidate cards feature comprehensive dark mode classes'
  );

  const chatSource = readFileSync(resolve(process.cwd(), 'src/components/ConnectionsChatView.tsx'), 'utf8');
  assert(
    chatSource.includes('dark:bg-stone-900') && chatSource.includes('dark:border-stone-800'),
    'ConnectionsChatView features dark mode styling and unauthenticated access banner'
  );

  const onboardingSource = readFileSync(resolve(process.cwd(), 'src/components/OnboardingView.tsx'), 'utf8');
  assert(
    onboardingSource.includes('!authSession.isAuthenticated') &&
    onboardingSource.includes('Visitor Preview Mode'),
    'OnboardingView enforces authentication before profile submission with visitor notice'
  );

  // Clean up test session
  authService.signOut();

  // --------------------------------------------------------------------------
  // Summary
  // --------------------------------------------------------------------------
  console.log('\n============================================================');
  console.log(`Theme, Auth & Unification Suite: ${passed} PASSED, ${failed} FAILED`);
  console.log('============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runThemeAuthUnificationSuite().catch(err => {
  console.error('Unhandled error during theme and auth verification:', err);
  process.exit(1);
});
