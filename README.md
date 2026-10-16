# CommonGround — University Research Dashboard & Prototype

> **University Human-Centered Computing Showcase**  
> *"What is actually going wrong in how people come to meet, and for whom?"*

CommonGround is a dual-module academic project investigating modern interpersonal disconnection and demonstrating an ethical, consent-first design response:

1. 🔍 **Module 1: The Problem Detective** — An evidence-based, interactive research dashboard investigating why existing ways of meeting fail to foster meaningful connections.
2. 🚀 **Module 3: The Solution Architect** — A working, interactive prototype demonstrating interest-based discovery, mutual consent gates, explainable compatibility, and psychological safety.

---

## 🔍 Module 1: The Problem Detective

### The Central Research Question
> **"What is actually going wrong in how people come to meet, and for whom?"**

### The Top 5 Evidence-Backed Problems

1. **Superficial Judgments and Poor Compatibility Signals**
   - *Evidence:* Finkel et al. (2012) *Psychological Science in the Public Interest*; Heino et al. (2010); Iyengar & Lepper (2000).
   - *Core Finding:* Photo-dominant browsing grids induce a transactional "marketplace mindset" where human beings are evaluated like retail goods. Static profile questionnaires fail to predict dynamic relational chemistry, while infinite swipe queues cause choice overload and decision paralysis.

2. **Ghosting, Rejection Pressure, and Unwanted Interactions**
   - *Evidence:* Pew Research Center (February 2023) probabilistic survey of U.S. online daters; LeFebvre et al. (2019).
   - *Core Finding:* 48% of U.S. online daters experienced at least one of four unwanted behaviors (unsolicited explicit content, persistent unwanted contact, offensive name-calling, physical threats). Young women under 50 face disproportionate harassment (56% received unsolicited explicit imagery). Ghosting functions as an avoidant coping mechanism driven by low-friction interfaces lacking dignified closure mechanics.

3. **Limited Social Circles, Network Homophily & Social Pressure**
   - *Evidence:* Linda Zhao (2023) *Social Science Research* (PubMed 36797007); McPherson, Smith-Lovin & Cook (2001).
   - *Core Finding:* Longitudinal dynamic modeling demonstrates that initial peer network segregation actively reinforces ongoing homophily. Passive physical proximity alone fails to bridge insular circles without structured shared activities. Meeting through friends/family introduces social expectations and awkward stakes.

4. **Unpredictability and Accessibility Barriers of Chance Encounters**
   - *Evidence:* U.S. Surgeon General’s Advisory on Loneliness and Isolation (Dr. Vivek Murthy, HHS 2023).
   - *Core Finding:* Public community infrastructure ("third places") has precipitously declined over two decades. Spontaneous in-person encounters depend heavily on physical location, financial resources, accessible transit, and neurotypical confidence—systematically excluding introverted, mobility-impaired, or socially anxious individuals.

5. **Trust Deficits, Suspected Scams, and Lack of Boundary Control**
   - *Evidence:* Pew Research Center (2023); Federal Trade Commission (FTC 2023 Data Spotlight).
   - *Core Finding:* 52% of U.S. online daters believe they have encountered someone attempting to scam them (self-reported perception). FTC reports $1.3 billion lost to romance fraud in 2022. Lack of boundary transparency and fear of retaliatory reports breed chronic cynicism.

---

## 📊 Comparison of the 4 Major Ways People Meet

| Meeting Method | What Works Well (Advantages) | What Fails (Limitations) | Who Is Left Out / Disadvantaged | Design Response in CommonGround |
|---|---|---|---|---|
| **Dating & Social Apps** | Broad discovery, convenience, asynchronous timing. | Superficial lookism, 48% harassment rate, choice overload, ghosting. | Introverts, shy hobbyists, safety-conscious individuals. | Interest-first profiles, consent gates before DMs, quiet declines. |
| **Friends & Family** | Pre-existing trust, safety vetting, shared context. | Network homophily, social pressure, awkward stakes if connections fail. | Geographic newcomers, immigrants, people with specialized hobbies. | Discovery independent of personal contact address books. |
| **Chance Encounters** | Real-world chemistry check, spontaneous shared moment. | Declining third places, unpredictability, high social anxiety hurdle. | Mobility-impaired, introverts, tight financial budgets. | Digital discovery as a low-pressure prep tool for local shared activities. |
| **Online Communities** | Rich niche passion matching, topic-first discussion. | Geographic fragmentation, unmoderated DMs, difficult in-person transition. | People seeking local physical friends, users targeted by trolls. | Combines interest depth with local proximity and mutual consent gates. |

---

## 🚀 Running the Project Locally

### Prerequisites
- Node.js (v18+ or v24+)
- npm (v9+)

### Setup and Start

```bash
# 1. Clone repository & install dependencies
npm install

# 2. Launch Vite development server
npm run dev

# 3. Open in browser
http://127.0.0.1:5173/
```

- By default, the application opens in **Module 1: The Problem Detective** (Research Dashboard).
- Click **"Launch Module 3 Prototype"** in the top navigation bar at any time to test the interactive CommonGround application prototype.
- Click **"Module 1 Research"** in the prototype header to return to the investigative research dashboard.

---

## 🛠️ Interactive Research Dashboard Features

1. **Problem Explorer:** Deep dive into each of the 5 candidate problems with epistemic boundaries (*"What evidence supports"* vs. *"What evidence does NOT establish"*).
2. **Prioritization Matrix:** Transparent scoring framework across **Severity, Reach, Evidence Strength, and Design Opportunity**. Includes interactive sliders allowing evaluators to adjust analytical weights and observe dynamic rank re-sorting with an automatic user-judgment disclaimer badge.
3. **Evidence Library:** Searchable and filterable database of 9 verified empirical sources (Peer-Reviewed, Government/Public Health, Reputable Demographic Surveys) with direct functional links to original papers.
4. **From Problems to Solutions:** Explicit mapping bridging Module 1 diagnostic findings to Module 2 user needs and Module 3 features.
5. **Research Gaps & Qualitative Interview Guide:** Analysis of 5 major literature deficits (India vs. US cross-cultural divergence, college freshman transitions, disability accessibility, platonic vs. dating intent, transit/affordability constraints) and a standardized 7-question interview protocol with an interactive local scratchpad for recording field notes.

---

## 📚 Primary Academic Citations

1. **Finkel, E. J., Eastwick, P. W., Karney, B. R., Reis, H. T., & Sprecher, S. (2012).** *Online Dating: A Critical Analysis From the Perspective of Psychological Science.* Psychological Science in the Public Interest, 13(1), 3–66. [DOI: 10.1177/1529100612436522](https://doi.org/10.1177/1529100612436522)
2. **Pew Research Center (2023).** *From Looking for Love to Swiping the Field: Online Dating in the U.S.* Colleen McClain et al. [Report Link](https://www.pewresearch.org/internet/2023/02/02/the-experiences-of-u-s-online-daters/)
3. **Zhao, L. (2023).** *Networks in the making: Friendship segregation and ethnic homophily.* Social Science Research, 110, 102835. [PubMed: 36797007](https://pubmed.ncbi.nlm.nih.gov/36797007/)
4. **Office of the U.S. Surgeon General (2023).** *Our Epidemic of Loneliness and Isolation: The U.S. Surgeon General’s Advisory on the Healing Effects of Social Connection and Community.* Dr. Vivek H. Murthy, U.S. Department of Health and Human Services. [NCBI Books: NBK595227](https://www.ncbi.nlm.nih.gov/books/NBK595227/)
5. **Heino, R. D., Ellison, N. B., & Hancock, J. T. (2010).** *Finding the One Online: Exploring the Marketplace Mindset of Online Daters.* Journal of Social and Personal Relationships, 27(4), 427–447. [DOI: 10.1177/0265407510373753](https://doi.org/10.1177/0265407510373753)
6. **Iyengar, S. S., & Lepper, M. R. (2000).** *When Choice is Demotivating: Can One Desire Too Much of a Good Thing?* Journal of Personality and Social Psychology, 79(6), 995–1006. [DOI: 10.1037/0022-3514.79.6.995](https://doi.org/10.1037/0022-3514.79.6.995)
7. **LeFebvre, L. E., et al. (2019).** *Ghosting in Emerging Adults’ Romantic Relationships: The Digital Dissolution Process.* Imagination, Cognition and Personality, 39(2), 125–150. [DOI: 10.1177/0276236618820303](https://doi.org/10.1177/0276236618820303)
8. **Federal Trade Commission (2023).** *Romance Scammers’ Favorite Lies Exposed: FTC Data Spotlight.* [FTC Publication](https://www.ftc.gov/news-events/data-visualizations/data-spotlight/2023/02/romance-scammers-favorite-lies-exposed)
