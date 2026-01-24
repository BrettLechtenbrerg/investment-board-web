# Advisory Boards - Project Restart Prompt

**Last Updated:** January 24, 2026
**Session Summary:** Complete web app build-out with welcome sections, customizable boards, and full deployment pipeline.

---

## Quick Context for AI Assistant

You are continuing work on the **Advisory Boards** project — two AI-powered web apps that let users chat with legendary investors (Investment Board) and business minds (Business Board) using the Anthropic Claude API. Both are Next.js 16 apps deployed to Vercel.

---

## Project Locations

```
/Users/brettlechtenberg/Documents/agent-girl/advisory-boards/
├── investment-board-web/     # Next.js web app (PRODUCTION)
├── business-board-web/       # Next.js web app (PRODUCTION)
├── investment-board-of-advisors/  # Python CLI (legacy, not actively maintained)
├── business-board-of-advisors/    # Python CLI (legacy, not actively maintained)
├── pictures/                 # Source app icon images
├── CLAUDE.md                 # Full project documentation
└── RESTART_PROMPT.md         # This file
```

---

## Production URLs

- **Investment Board:** https://investment-board-web.vercel.app
- **Business Board:** https://business-board-web.vercel.app

## GitHub Repos

- **Investment Board:** https://github.com/BrettLechtenbrerg/investment-board-web
- **Business Board:** https://github.com/BrettLechtenbrerg/business-board-web

---

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Icons:** lucide-react
- **AI:** Anthropic Claude API (user provides their own API key, stored in localStorage)
- **Deployment:** Vercel (separate projects per board)
- **Streaming:** Server-Sent Events (SSE) via `/api/chat` route

---

## Current Feature Set (as of Jan 24, 2026)

### Page Layout (top to bottom):
1. **Header** — App title, Help button (accordion modal), API Key button (pulsing when not set, 3-step modal)
2. **Welcome Section** — "Welcome To Your Personal [Investment/Business] Board of Advisors" title, app icon image (`/icon.png`), 8-step setup instructions with clickable links (anthropic.com, platform.claude.com/dashboard, YouTube tutorial)
3. **Advisor Grid** — Clickable emoji buttons for each active advisor
4. **Instruction Button** — "Talk to an individual advisor by clicking their name above or call a board meeting by clicking the button below."
5. **Board Meeting Button** — Yellow themed, calls all active advisors
6. **Customize Your Board Button** — Emerald (investment) / Purple (business) themed, opens CustomizeModal
7. **Selected Advisor Info** — Shows name/title when advisor selected, Clear button when messages exist
8. **Chat Area** — Dynamic border color matching selected advisor, compact height (`calc(100vh - 700px)`, minHeight 150px), streaming message display with input box

### Key Behaviors:
- Page scrolls to top on load (`window.scrollTo(0, 0)`)
- Auto-scroll to bottom ONLY when messages exist (not on mount)
- All external links open in new window (`target="_blank" rel="noopener noreferrer"`)
- Help modal does NOT auto-open on first visit (user reads welcome instructions first)
- API key stored in localStorage (`anthropic-api-key`)
- Board customization stored in localStorage (`investment-board-advisors` / `business-board-advisors`)
- Board Meeting advisor generated dynamically via `generateBoardMeetingAdvisor()` based on active advisors
- Minimum 2 advisors required for board customization

### Investment Board (Emerald Theme):
- **9 default advisors:** Buffett, Lynch, Dalio, Bogle, Graham, Soros, Marks, Icahn, Wood
- **6 extra advisors:** Munger, Druckenmiller, Burry, Ackman, Pabrai, Livermore
- **15 total** available

### Business Board (Purple Theme):
- **6 default advisors:** Hormozi, Cuban, Gary Vee, Disney, Munger, Socrates
- **6 extra advisors:** Jobs, Musk, Bezos, Blakely, Ravikant, Branson
- **12 total** available

---

## File Structure (per web app)

```
src/
├── app/
│   ├── page.tsx              # Main page (all UI, state, chat logic)
│   ├── layout.tsx            # Root layout with metadata
│   ├── globals.css           # Tailwind CSS imports
│   ├── favicon.ico           # App icon
│   └── api/chat/route.ts     # Anthropic API streaming proxy
├── components/
│   ├── CustomizeModal.tsx    # Toggle advisors on/off, save to localStorage
│   └── HelpModal.tsx         # 5-section accordion + Quick Links + YouTube embed
└── lib/
    └── advisors.ts           # ALL_ADVISORS, DEFAULT_ADVISOR_IDS, generateBoardMeetingAdvisor()
```

---

## Key Code Patterns

### Color System (in page.tsx):
- `colorMap` — Default advisor button styles (border + bg + hover per color)
- `selectedColorMap` — Selected advisor button styles (border + bg + ring per color)
- `chatBoxColorMap` — Chat container border color when advisor is selected

### Board Meeting Generation (in advisors.ts):
```typescript
export function generateBoardMeetingAdvisor(activeAdvisors: Advisor[]): Advisor {
  // Builds prompt dynamically from active advisors
  // Returns Advisor with id: 'board_meeting', color: 'gold'
}
```

### API Route (api/chat/route.ts):
- Receives: `{ messages, systemPrompt, apiKey }` via POST
- Streams Anthropic response back as SSE (text/event-stream)
- No server-side API key needed

---

## Deployment Commands

```bash
# IMPORTANT: Always cd to the correct directory first!

# Investment Board
cd /Users/brettlechtenberg/Documents/agent-girl/advisory-boards/investment-board-web
npm run build && git add -A && git commit -m "message" && git push
vercel --prod --yes

# Business Board
cd /Users/brettlechtenberg/Documents/agent-girl/advisory-boards/business-board-web
npm run build && git add -A && git commit -m "message" && git push
vercel --prod --yes
```

**CRITICAL:** Always explicitly `cd` to the correct directory for EACH command. The shell defaults to investment-board-web if you don't specify, causing duplicate deploys to the wrong project.

---

## Known Quirks & Gotchas

1. **Directory issue:** When running parallel Bash commands, the second command often runs from investment-board-web instead of business-board-web. ALWAYS use explicit `cd` for each command.
2. **Build lock files:** If build fails with "Unable to acquire lock", run `rm -f .next/lock` first.
3. **Build cache errors:** If ENOTEMPTY errors occur, run `rm -rf .next` then rebuild.
4. **Git "nothing to commit":** Sometimes the build+commit chain reports exit code 1 even though the commit went through. Always verify with `git log --oneline -1`.

---

## Welcome Section Instructions (8 steps on landing page)

1. If you do not have an Anthropic / Claude AI account follow the link to set up your FREE account -> https://www.anthropic.com/
2. When you are on the anthropic page simply click the black button in the top right corner that says Try Claude.
3. Follow the simple instructions and you will have a FREE Claude account be up and running in approximately 2 min.
4. After you set up your Claude/Anthropic account, you will create an anthropic API key so you can talk to your board. Follow the link -> https://platform.claude.com/dashboard to create an API key. This will take about 3 minutes. If you need further help then watch the 1 minute video by clicking here (links to YouTube: y3Jx8sIwYQs).
5. Once you have created and named your API key. Click the pulsing "Set API Key" in the top right hand corner of this screen - paste your key in the box - and hit save.
6. Give the system 30 seconds to activate and you can begin asking your board questions.
7. You can ask individual board member questions or Call a Board Meeting and ask them all at once.
8. If you want to customize your board then simply click the Customize Your Board button and make changes by following the instructions. Please remember to hit the big green Save Board button or your changes will not take effect.

**Sub-header:** "If you already have an Anthropic/Claude account you can skip to step 4."

---

## What Was Completed This Session

1. Added prominent "Customize Your Board" button below Board Meeting button (both boards)
2. Shrunk chat area by 75% to appropriate size
3. Added Welcome Section with app icon + 8-step instructions (both boards)
4. Verified all external links open in new windows
5. Updated instruction language (steps 2, 3, 4, 5) multiple times per user feedback
6. Added instruction button between advisor grid and Board Meeting button
7. Removed "Select an Advisor Above" empty state box
8. Disabled help modal auto-open on first visit
9. Added dynamic chat box border color matching selected advisor
10. Fixed page scroll to top on load (guarded auto-scroll with messages.length > 0)
11. Added platform.claude.com/dashboard link to step 4
12. Full audit: verified git repos, Vercel deployments, file structure, configs
13. Rewrote CLAUDE.md with complete current project documentation

---

## To Resume This Project

1. Read this file and `/Users/brettlechtenberg/Documents/agent-girl/advisory-boards/CLAUDE.md`
2. The web apps are the primary focus (CLI apps are legacy)
3. Both apps are live on Vercel and code is on GitHub
4. User (Brett) typically requests UI tweaks, text changes, and new features
5. Always build, commit, push, and deploy after changes
6. Always use explicit `cd` paths to avoid the directory confusion issue
