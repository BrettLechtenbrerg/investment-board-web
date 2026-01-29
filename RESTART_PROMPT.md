# Advisory Boards - Ultimate Restart Prompt

**Last Updated:** January 29, 2026
**Session Summary:** Major UI polish including styled step cards, welcome intros, troubleshooting tips, and expanded chat windows.

---

## Quick Context for AI Assistant

You are continuing work on the **Advisory Boards** project — two AI-powered web apps that let users chat with legendary investors (Investment Board) and business minds (Business Board) using the Anthropic Claude API. Both are Next.js 16 apps deployed to Vercel.

---

## Project Locations

### Primary Working Directory
```
/Users/brettlechtenberg/Documents/agent-girl/advisory-boards/
├── investment-board-web/     # Next.js web app (PRODUCTION)
├── business-board-web/       # Next.js web app (PRODUCTION)
├── investment-board-of-advisors/  # Python CLI (legacy)
├── business-board-of-advisors/    # Python CLI (legacy)
├── pictures/                 # Source app icon images
├── CLAUDE.md                 # Full project documentation
└── RESTART_PROMPT.md         # This file
```

### Also Referenced In
```
/Users/brettlechtenberg/Documents/agent-girl/advisory-board2/
  └── (secondary workspace, may have cloned repos)
```

---

## Production URLs

| Board | Vercel URL | GitHub Repo |
|-------|-----------|-------------|
| Investment | https://investment-board-web.vercel.app | https://github.com/BrettLechtenbrerg/investment-board-web |
| Business | https://business-board-web.vercel.app | https://github.com/BrettLechtenbrerg/business-board-web |

### CLI Repos (Legacy - Python apps)
| Board | GitHub Repo |
|-------|-------------|
| Investment | https://github.com/BrettLechtenbrerg/investment-board-of-advisors |
| Business | https://github.com/BrettLechtenbrerg/business-board-of-advisors |

---

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Icons:** lucide-react
- **AI:** Anthropic Claude API (user provides their own API key, stored in localStorage)
- **Deployment:** Vercel (auto-deploys on git push)
- **Streaming:** Server-Sent Events (SSE) via `/api/chat` route

---

## Current Feature Set (as of Jan 29, 2026)

### Page Layout (top to bottom):
1. **Header** — App title, Help button (accordion modal), API Key button (pulsing when not set)
2. **Welcome Section** — Title, app icon image (150px)
3. **Collapsible Instructions** — Polished accordion with:
   - Welcome intro explaining what the app is
   - Example question with advisor recommendations
   - "📋 Quick Setup Guide" header with `~5 min` badge
   - "Skip to step 4" callout for existing users
   - 8 styled step cards with numbered circles
   - Step 4 highlighted (brighter background)
   - Hover effects on each card
4. **Advisor Grid** — Clickable emoji buttons for each active advisor
5. **Instruction Button** — "Talk to an individual advisor..."
6. **Board Meeting Button** — Yellow themed, calls all active advisors
7. **Customize Your Board Button** — Themed button to toggle advisors
8. **Selected Advisor Info** — Shows name/title when advisor selected
9. **Chat Area** — EXPANDED: `calc(100vh - 400px)` with `minHeight: 500px`

### Help Modal Features:
- **Welcome Introduction** — Explains what the app is with example questions
- **5 Collapsible Steps** — Get API Key, Enter Key, Choose Advisor, Start Chatting, Watch Tutorial
- **Troubleshooting Section** — "Key Not Saving?" with common issues
- **Quick Links** — Get API Key, Video Tutorial, Anthropic Docs
- **Embedded YouTube Video** — Tutorial walkthrough

### Key Behaviors:
- Page scrolls to top on load
- Auto-scroll to bottom ONLY when messages exist
- All external links open in new window
- API key stored in localStorage (`anthropic-api-key`) with error handling
- Board customization stored in localStorage
- Board Meeting advisor generated dynamically
- Instructions collapsed by default (click to expand)

### Advisors Available:

**Investment Board (Emerald Theme):**
- Default (9): Buffett, Lynch, Dalio, Bogle, Graham, Soros, Marks, Icahn, Wood
- Extra (6): Munger, Druckenmiller, Burry, Ackman, Pabrai, Livermore

**Business Board (Purple Theme):**
- Default (6): Hormozi, Cuban, Gary Vee, Disney, Munger, Socrates
- Extra (6): Jobs, Musk, Bezos, Blakely, Ravikant, Branson

---

## File Structure (per web app)

```
src/
├── app/
│   ├── page.tsx              # Main page (all UI, state, chat logic)
│   ├── layout.tsx            # Root layout with metadata
│   ├── globals.css           # Tailwind CSS imports
│   └── api/chat/route.ts     # Anthropic API streaming proxy
├── components/
│   ├── CustomizeModal.tsx    # Toggle advisors on/off
│   └── HelpModal.tsx         # Help accordion + video + troubleshooting
└── lib/
    └── advisors.ts           # ALL_ADVISORS, DEFAULT_ADVISOR_IDS, generateBoardMeetingAdvisor()
```

---

## Deployment Commands

```bash
# IMPORTANT: Always cd to the correct directory first!

# Investment Board
cd /Users/brettlechtenberg/Documents/agent-girl/advisory-boards/investment-board-web
npm run build && git add -A && git commit -m "message" && git push

# Business Board
cd /Users/brettlechtenberg/Documents/agent-girl/advisory-boards/business-board-web
npm run build && git add -A && git commit -m "message" && git push
```

**Note:** Vercel auto-deploys on push to main - no need to run `vercel --prod` manually.

---

## Known Quirks & Gotchas

1. **Directory confusion:** When running parallel Bash commands, always use explicit `cd` paths
2. **Build lock files:** If build fails with lock error, run `rm -f .next/lock`
3. **Build cache errors:** If ENOTEMPTY errors, run `rm -rf .next` then rebuild
4. **Shell resets:** The shell often resets to advisory-board2 after commands
5. **Corrupted node_modules:** If package config errors, run `rm -rf node_modules .next && npm install`

---

## Session History

### January 29, 2026 - Session 3 (Latest)
- **Polished Step Cards:** Replaced plain numbered list with beautifully styled step cards
- **Numbered Circles:** Theme-colored circles for each step number
- **Step 4 Highlighted:** Key API key creation step has brighter background
- **Hover Effects:** Cards highlight border on hover
- **Time Estimate Badge:** Added "~5 min" badge to Quick Setup Guide header
- **Skip to Step 4:** Callout box for users with existing Claude accounts
- **Welcome Intro in Dropdown:** Added intro section matching Help Modal style
- **Both apps committed and pushed:**
  - investment-board-web: `52b4078` - Upgrade setup instructions to polished step cards
  - business-board-web: `35997ab` - Upgrade setup instructions to polished step cards

### January 29, 2026 - Session 2
- **Collapsible Instructions:** Converted 8-step setup instructions to accordion with BookOpen icon, collapsed by default
- **Welcome Intro in Help Modal:** Added themed intro section explaining what the app is with example questions
- **Troubleshooting Tips:** Added "Key Not Saving?" section with tips for private browsing, blocked storage, clearing data, different devices
- **API Key Persistence Fix:** Added try-catch error handling, verification that key was saved, user-friendly error messages

### January 29, 2026 - Session 1
- **Expanded conversation window:** Changed from `calc(100vh - 700px)` with `minHeight: 150px` to `calc(100vh - 400px)` with `minHeight: 500px`
- Committed and pushed to both repos
- Both Vercel deployments auto-updated

### January 24, 2026 (Previous Session)
- Added Welcome Section with 8-step instructions
- Added Customize Your Board button
- Added dynamic chat box border colors
- Fixed scroll-to-top on page load
- Created initial CLAUDE.md and RESTART_PROMPT.md

---

## To Resume This Project

1. **Read this file** and `/Users/brettlechtenberg/Documents/agent-girl/advisory-boards/CLAUDE.md`
2. **Focus on web apps** — CLI apps are legacy/not actively maintained
3. **Both apps are live** on Vercel and code is on GitHub
4. **User (Brett)** typically requests UI tweaks, text changes, and new features
5. **After changes:** Build, commit, push (Vercel auto-deploys)
6. **Always use explicit `cd` paths** to avoid directory confusion
7. **Testers see changes immediately** after refreshing the browser

---

## Quick Commands Reference

```bash
# Go to advisory boards project
cd /Users/brettlechtenberg/Documents/agent-girl/advisory-boards

# Check status of all repos
cd investment-board-web && git status && cd ../business-board-web && git status

# Run dev server (investment)
cd /Users/brettlechtenberg/Documents/agent-girl/advisory-boards/investment-board-web && npm run dev

# Run dev server (business)
cd /Users/brettlechtenberg/Documents/agent-girl/advisory-boards/business-board-web && npm run dev

# Fix corrupted packages
rm -rf node_modules .next && npm install
```

---

## Key Files to Edit for Common Tasks

| Task | File(s) |
|------|---------|
| Change UI/layout | `src/app/page.tsx` |
| Change advisor prompts | `src/lib/advisors.ts` |
| Change help content | `src/components/HelpModal.tsx` |
| Change customize modal | `src/components/CustomizeModal.tsx` |
| Change API behavior | `src/app/api/chat/route.ts` |
| Change metadata/title | `src/app/layout.tsx` |

---

## Key Code Patterns

### Styled Step Cards (page.tsx)
```tsx
{/* Step Card */}
<div className="flex gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 transition-colors">
  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold shrink-0">1</div>
  <p className="text-sm text-white/70 leading-relaxed">Step content here...</p>
</div>

{/* Highlighted Step */}
<div className="flex gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold shrink-0">4</div>
  <div className="text-sm text-white/70">Key step content...</div>
</div>
```

### Safe localStorage (page.tsx)
```tsx
const saveApiKey = () => {
  if (!apiKeyInput.trim()) return;
  try {
    localStorage.setItem('anthropic-api-key', apiKeyInput.trim());
    const verified = localStorage.getItem('anthropic-api-key');
    if (verified === apiKeyInput.trim()) {
      setApiKey(apiKeyInput.trim());
      setShowApiKeyModal(false);
    } else {
      throw new Error('Verification failed');
    }
  } catch (e) {
    setError('Failed to save API key. Your browser may be blocking storage.');
  }
};
```

### Collapsible Instructions (page.tsx)
```tsx
const [showInstructions, setShowInstructions] = useState(false);

<button onClick={() => setShowInstructions(!showInstructions)} className="...">
  <BookOpen className="h-5 w-5" />
  <span>Setup Instructions</span>
  <ChevronDown className={`transition-transform ${showInstructions ? 'rotate-180' : ''}`} />
</button>

{showInstructions && (
  <div className="...">
    {/* Welcome intro + step cards */}
  </div>
)}
```

---

**Remember:** The web apps are the production focus. Both use client-side API keys (user provides their own Anthropic key). The setup instructions are now beautifully polished with styled step cards, numbered circles, and a professional appearance!
