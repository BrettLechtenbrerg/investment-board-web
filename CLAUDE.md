# Advisory Boards - AI Board of Advisors Suite

## Project Overview
AI advisory board applications that simulate conversations with legendary investors and business minds using the Anthropic API (Claude Sonnet). Available as both CLI (Python) and Web (Next.js) applications. Users can consult individual advisors, call full "board meetings" where all advisors weigh in, and customize their board membership.

## Project Location
```
/Users/brettlechtenberg/Documents/agent-girl/advisory-boards/
```

## Web Applications (Primary - Production)

### Investment Board Web (`investment-board-web/`)
- **Production URL:** https://investment-board-web.vercel.app
- **GitHub:** https://github.com/BrettLechtenbrerg/investment-board-web
- **Framework:** Next.js 16 + TypeScript + Tailwind CSS 4
- **Theme:** Emerald green

### Business Board Web (`business-board-web/`)
- **Production URL:** https://business-board-web.vercel.app
- **GitHub:** https://github.com/BrettLechtenbrerg/business-board-web
- **Framework:** Next.js 16 + TypeScript + Tailwind CSS 4
- **Theme:** Purple

### Web App Architecture
Both web apps share identical architecture:
```
src/
├── app/
│   ├── page.tsx              # Main page (welcome section, advisor grid, chat)
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Tailwind CSS imports
│   └── api/chat/route.ts     # Anthropic API proxy (streaming SSE)
├── components/
│   ├── CustomizeModal.tsx    # Board customization UI (toggle advisors on/off)
│   └── HelpModal.tsx         # Help system with accordion steps, video & troubleshooting
└── lib/
    └── advisors.ts           # Advisor data, colors, prompts, board meeting generator
```

### Web App Features
1. **Welcome Section** - App icon, title, and collapsible setup instructions
2. **Collapsible Instructions** - Polished accordion with:
   - Welcome intro explaining what the app is
   - Example question with advisor recommendations
   - "Quick Setup Guide" header with ~5 min time estimate
   - "Skip to step 4" callout for existing users
   - 8 styled step cards with numbered circles
   - Step 4 highlighted as the key action step
   - Hover effects on each card
3. **Individual Advisors** - Click any advisor to chat one-on-one
4. **Board Meeting** - All active advisors respond in character with synthesis
5. **Customize Board** - Toggle advisors on/off from 15 (investment) or 12 (business) options
6. **Dynamic Chat Box** - Border color matches selected advisor's theme color
7. **API Key Modal** - 3-step setup with error handling and verification
8. **Help Modal** - Accordion-style guide with:
   - Welcome intro explaining what the app is
   - 5-step setup guide with expandable sections
   - Troubleshooting tips for API key issues
   - Quick Links and embedded video tutorial
9. **Streaming Responses** - Server-Sent Events for real-time AI responses
10. **localStorage Persistence** - API key and board customization with error handling
11. **Expanded Chat Window** - `calc(100vh - 400px)` with `minHeight: 500px`
12. **All external links** - Open in new window (`target="_blank"`)
13. **Scroll to top** - Page loads at top, auto-scroll only when messages exist

### Investment Board Advisors (15 total, 9 default)
**Default:** Warren Buffett, Peter Lynch, Ray Dalio, John Bogle, Benjamin Graham, George Soros, Howard Marks, Carl Icahn, Cathie Wood
**Extra:** Charlie Munger, Stanley Druckenmiller, Michael Burry, Bill Ackman, Mohnish Pabrai, Jesse Livermore

### Business Board Advisors (12 total, 6 default)
**Default:** Alex Hormozi, Mark Cuban, Gary Vaynerchuk, Walt Disney, Charlie Munger, Socrates
**Extra:** Steve Jobs, Elon Musk, Jeff Bezos, Sara Blakely, Naval Ravikant, Richard Branson

### Key Functions in `advisors.ts`
- `ALL_ADVISORS` - Complete array of all advisors (default + extra)
- `DEFAULT_ADVISOR_IDS` - Array of default advisor IDs
- `generateBoardMeetingAdvisor(activeAdvisors)` - Dynamically creates board meeting prompt from active advisors

### Deployment
```bash
# Navigate to web app
cd investment-board-web  # or business-board-web

# Development
npm run dev          # localhost:3000

# Build
npm run build

# Deploy (Vercel auto-deploys on git push)
git add -A && git commit -m "message" && git push
```

### API Key Flow
- Users provide their own Anthropic API key (stored in browser localStorage)
- Key is saved with try-catch error handling and verification
- Key is sent to `/api/chat` route which proxies to Anthropic API
- No server-side API key required - fully client-driven

---

## CLI Applications (Legacy)

### Investment Board CLI (`investment-board-of-advisors/`)
9 legendary investors (Python CLI)

### Business Board CLI (`business-board-of-advisors/`)
6 business minds (Python CLI)

### CLI Architecture
- `main.py` - CLI app with interactive mode, single advisor, and board meeting modes
- `personas/` - Individual advisor persona prompts
- `personas/__init__.py` - ADVISORS dict mapping keys to names, titles, emojis, and prompts
- Uses `anthropic` Python SDK with `claude-sonnet-4-20250514` model
- Requires `ANTHROPIC_API_KEY` in `.env` file

### CLI Setup
```bash
cd investment-board-of-advisors  # or business-board-of-advisors
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
echo "ANTHROPIC_API_KEY=your-key-here" > .env
```

### CLI Usage
```bash
python main.py                    # Interactive mode
python main.py --list             # List advisors
python main.py -a warren_buffett -q "Should I invest in index funds?"
python main.py -b -q "Is the market overvalued?" --synthesize
```

---

## Directory Structure
```
advisory-boards/
├── CLAUDE.md                          # This file
├── RESTART_PROMPT.md                  # Quick restart guide
├── pictures/                          # App icon source images
├── investment-board-web/              # Next.js web app (PRODUCTION)
│   ├── src/                           # Source code
│   ├── public/icon.png                # Investment board app icon
│   ├── package.json                   # Dependencies
│   └── ...
├── business-board-web/                # Next.js web app (PRODUCTION)
│   ├── src/                           # Source code
│   ├── public/icon.png                # Business board app icon
│   ├── package.json                   # Dependencies
│   └── ...
├── investment-board-of-advisors/      # Python CLI (legacy)
└── business-board-of-advisors/        # Python CLI (legacy)
```

## Recent Updates (January 29, 2026)

### Session 3 - Polished Step Cards & Visual Upgrade
1. **Polished Step Cards** - Replaced plain numbered list with styled step cards
2. **Numbered Circles** - Theme-colored circles (emerald/purple) for each step
3. **Step 4 Highlighted** - Key action step has brighter background
4. **Hover Effects** - Cards highlight on hover
5. **Time Estimate Badge** - "~5 min" badge in header
6. **Skip to Step 4** - Callout box for existing users
7. **Welcome Intro in Dropdown** - Matching the Help Modal style

### Session 2 - UI/UX Improvements
1. **Collapsible Instructions** - Converted 8-step setup instructions to accordion (hidden by default, click to expand)
2. **Welcome Intro in Help Modal** - Added explanation of what the app is with example questions
3. **Troubleshooting Tips** - Added "Key Not Saving?" section with common issues (private browsing, blocked storage, etc.)
4. **API Key Persistence Fix** - Added try-catch, verification, and user-friendly error messages for localStorage operations
5. **Expanded Conversation Window** - Changed from cramped 150px min to spacious 500px min

### Session 1 - Initial Improvements
- Added Welcome Section with 8-step instructions
- Added Customize Your Board button
- Added dynamic chat box border colors
- Fixed scroll-to-top on page load
- Created CLAUDE.md and RESTART_PROMPT.md

## Important Notes
- **ALWAYS** `cd` to the correct web app directory before running commands
- Web apps use client-side API keys (no .env needed for deployment)
- Both web apps are independently deployed Vercel projects
- The `pictures/` folder contains source app icon images
- Board Meeting advisor is generated dynamically based on active advisors (not static)
- Vercel auto-deploys on push to main branch
