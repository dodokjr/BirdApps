# BirdChat — React + Tailwind starter

BirdChat is a frontend prototype for a public, cross-country community platform.

## Requirements
- Node.js 18+ (Node 20 LTS recommended)
- npm

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite, usually http://localhost:5173.

## Production build
```bash
npm run build
npm run preview
```

## What's included
- Futuristic dark dashboard with responsive layout
- Country selector (Indonesia, Malaysia, Japan, Global)
- Topic categories and searchable feed
- Demo posts, likes, bookmarks, sort modes
- Post composer and `@ChatGPT`, `@Gemini`, `@Claude` UI selectors
- Trending topics and community join buttons
- Toast feedback for prototype interactions

## Important: prototype limitations
This is frontend-only. Posts live in React state and reset when the page reloads. Sign-in, durable database, real-time group chat, uploads, moderation workflows, notifications, and actual AI answers are not connected yet.

Never put provider API keys in React/browser code. For real AI integration, create a backend API route that keeps keys in environment variables and calls the provider server-side. Use each provider's official API and terms. For public communities, add authentication, rate limiting, content reporting, spam controls, and privacy rules before launch.

## Suggested next steps
1. Add backend and authentication (e.g. Node.js + Express).
2. Add a database for users, communities, posts, comments, and reactions.
3. Add real-time chat (e.g. Socket.IO).
4. Add server-side AI provider adapters and usage limits.
5. Add moderation, reporting, and deployment configuration.
# BirdApps
