# CommonGround — LLM Specification & Master Prompt

This file preserves the master prompt and specification provided to the AI model to architect and implement the **CommonGround** consent-first social connection platform prototype. You can provide this prompt to any LLM (e.g., Claude, GPT-4o, Gemini) to reproduce, extend, or evaluate the system.

---

```markdown
Project: CommonGround — A Better Way for People to Meet

Act as a senior UI/UX designer, product strategist, and full-stack developer. Build a polished, interactive web application prototype called CommonGround, a platform that helps compatible people discover each other through shared interests, values, and intentions rather than superficial appearance or popularity.

1. Problem Statement

People struggle to form meaningful connections because existing ways of meeting others have significant problems:

Dating and social apps often prioritize appearance, swiping, and popularity.
Meeting through friends or family can create social pressure and limited choices.
Random encounters and traditional introductions do not guarantee compatibility.
Many people feel ignored, rejected, overwhelmed, or unsafe when trying to connect.
Users may not know whether another person shares their intentions.
Privacy concerns and unwanted messages discourage people from participating.
Some people are excluded because they are shy, socially anxious, new to an area, or outside common social circles.

Our mission: Make meeting compatible people more inclusive, mutual, safe, comfortable, and intentional.

2. Proposed Solution

Create CommonGround, a consent-first connection platform where users discover people based on shared interests, communication preferences, relationship or friendship intentions, and personal values.

The platform must NOT function like a traditional swipe-based dating app.

Instead, introduce these core features:

A. Interest-Based Discovery
Let users select interests such as music, technology, books, travel, gaming, sports, art, volunteering, and learning.
Let users specify their intentions: friendship, dating, finding activity partners, professional networking, or meeting a community.
Allow users to select their preferred communication style, social energy, and pace of getting to know someone.
Show compatible people based on shared interests and compatible intentions.
Display clear explanations of compatibility, such as "You both love photography and weekend hikes."
Never rank users by attractiveness, popularity, follower count, or number of likes.

B. Mutual Introduction System
Replace swiping and unsolicited direct messages with a low-pressure introduction process.
A user discovers a compatible profile.
They can send a friendly introduction invitation based on a shared interest.
The recipient can accept, decline, or ignore the invitation without explanation.
A conversation opens only after both people agree.
Either person can pause, end, or block the connection at any time.
There must be no public rejection count, pressure to respond, or penalty for declining.

Provide suggested introduction messages such as:
"I noticed we both enjoy photography. What do you love taking pictures of?"
"We both selected hiking. Do you have a favorite trail?"
"I see we share an interest in books. What are you reading lately?"

C. Explainable Compatibility
Show a simple compatibility summary using shared interests, intentions, values, and communication preferences.
Use a transparent scoring model for the demo. For example:
- Shared interests: 40%
- Compatible intentions: 30%
- Shared values: 20%
- Compatible communication preferences: 10%

These percentages are illustrative and should be configurable. Clearly label the result as an estimated compatibility indicator, not a scientific prediction or guarantee of a successful relationship.
Do not use sensitive personal characteristics to infer compatibility.

D. Privacy and Safety Center
Build a dedicated safety section containing:
- Profile visibility controls.
- Controls for which profile information is shown to other people.
- Block-user functionality.
- Report-user functionality with selectable reasons.
- Controls for receiving introduction requests.
- A way to pause discovery or hide a profile.
- Clear consent reminders before a conversation begins.

For this prototype, simulate reporting and blocking locally. Clearly show the resulting interface state, and do not claim reports have been sent to a real moderation team.

E. Inclusive Onboarding
Create a welcoming onboarding experience that asks users about:
- Their first name or display name.
- Their interests.
- Their reasons for joining.
- Their preferred pace of interaction.
- Their preferred communication style.
- Their privacy preferences.

Keep questions optional wherever possible. Do not request unnecessary sensitive information.

3. Main Screens to Build
Create the following screens with consistent navigation:
- Landing Page
  - Brand name: CommonGround.
  - Headline: "Better connections begin with common ground."
  - Supporting text explaining the consent-first approach.
  - Primary CTA: "Find Your People."
  - Secondary CTA: "How It Works."
  - A modern visual showing people connecting through shared interests.
- Onboarding
  - A simple, attractive multi-step form.
  - Selectable interest chips.
  - Intention selection cards.
  - Communication preferences.
  - Privacy choices.
  - A progress indicator and Back/Continue buttons.
- Discovery Dashboard
  - A personalized welcome message.
  - Filters for interests and intentions.
  - Compatible profile cards.
  - Shared interests displayed prominently.
  - A short compatibility explanation.
  - An "Invite to Connect" action instead of a swipe or like button.
  - A "Why this match?" link or expandable panel.
- Profile Details
  - Display name, a short bio, selected interests, intentions, and communication preferences.
  - Explain why the two users may be compatible.
  - Provide an option to send a contextual introduction invitation.
  - Include block and report controls.
- Introduction Requests
  - Tabs for received and sent invitations.
  - Accept, decline, and cancel actions where appropriate.
  - A clear pending state.
  - No public rejection statistics.
- Connections and Chat
  - Only accepted introductions appear as active connections.
  - A clean chat interface with sample messages.
  - Conversation controls to pause, disconnect, or block.
  - An introductory prompt based on shared interests.
  - For the demo, messages may be stored locally rather than sent to a real server.
- Privacy and Safety Settings
  - Toggle profile visibility.
  - Pause discovery.
  - Manage introduction preferences.
  - Blocked-user list.
  - Report-user modal.
  - Clear feedback after each action.

4. User Flow
Implement this complete demonstration flow:
Landing Page → Onboarding → Discovery → View Compatible Profile → Send Introduction → Other User Receives Request → Accept Request → Connection Created → Start Conversation.

Also demonstrate alternative paths:
- Decline an invitation without explaining why.
- Cancel a pending invitation.
- Block a user and remove them from discovery.
- Report a profile and show a confirmation.
- Pause discovery and hide the current profile.
- Change interests and see the discovery results update.

All important buttons must work. Avoid decorative controls that do nothing.

5. Prototype Requirements
Build a functional, clickable, responsive web prototype suitable for a university project presentation and live demonstration.
Preferred technology stack:
- React
- TypeScript
- Tailwind CSS
- Lucide icons
- Local storage for demo persistence

Use the existing project structure if one already exists. If the project is empty, initialize a suitable frontend application.
Do not require paid APIs, external authentication services, or API keys. Use realistic seeded demo profiles and locally simulated interactions.
Include at least 8 fictional profiles with varied interests, intentions, communication styles, and personalities.
Create a small, deterministic compatibility algorithm that updates the displayed compatibility explanation when the current user's interests or preferences change.
Persist the demo user's preferences, connection requests, accepted connections, blocked profiles, and relevant settings locally when feasible.
Use fictional identities and do not use real people's personal information.

6. Visual Design
Create a premium, friendly, calm, inclusive, and trustworthy visual identity.
Design direction:
- Warm off-white background.
- Deep navy or charcoal typography.
- Soft lavender, muted blue, or teal accents.
- Rounded cards and subtle shadows.
- Generous whitespace.
- Clean typography and accessible contrast.
- Small, purposeful animations.
- Attractive profile illustrations, avatars, or suitable placeholder images.
- Clear success, pending, declined, and blocked states.

Avoid:
- A Tinder-like red-and-black interface.
- Endless swiping.
- Gamification based on likes or popularity.
- Aggressive notifications.
- Manipulative urgency or artificial scarcity.
- Cluttered dashboards.
- Excessive gradients or distracting animations.

The application should feel like a thoughtful, modern product that values people over engagement metrics.
Ensure it works on desktop, tablet, and mobile screens.

7. Technical and Functional Requirements
- Use reusable React components.
- Maintain clear TypeScript types.
- Include realistic sample data.
- Add working navigation and interactive controls.
- Validate required onboarding inputs.
- Provide empty states, confirmation dialogs, and helpful error messages.
- Make forms keyboard accessible and add appropriate labels.
- Keep the application free of broken links, runtime errors, and nonfunctional primary actions.
- Handle refreshes gracefully using local persistence.
- Include a README with setup and run instructions.
- Do not expose private profile information in public discovery cards.
- Make it clear that this is a demonstration prototype, not a production-ready matchmaking or moderation service.

8. Project Presentation Support
Add a concise "How CommonGround Works" section explaining:
- The problem with existing ways of meeting people.
- How shared interests and intentions improve discovery.
- Why mutual consent reduces unwanted interactions.
- How privacy and safety controls build trust.
- What makes this approach more inclusive.
Also include a short, clear explanation of the proposed solution and its limitations so the team can present the design decisions.

9. Acceptance Criteria
The project is complete only when:
- The landing page looks polished and professional.
- A user can complete onboarding.
- Discovery displays relevant fictional profiles.
- Compatibility explanations are generated from actual demo profile data.
- An introduction can be sent, accepted, declined, and cancelled.
- A connection appears only after mutual acceptance.
- The user can interact with the demo chat.
- Blocking and reporting produce visible state changes.
- Privacy controls affect the demo interface appropriately.
- Key state survives a page refresh where local persistence is implemented.
- The layout works on desktop and mobile.
- The app can be launched locally and demonstrated without paid services.

Final Instruction:
Deliver the actual working prototype. The final result should demonstrate a credible answer to this question:
"What is going wrong in how people come to meet, and for whom — and how can we make those connections more compatible, mutual, safe, and inclusive?"
```
