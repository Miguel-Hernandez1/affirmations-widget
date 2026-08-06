# Affirmations Widget

**Live:** [affirmations-widget.vercel.app](https://affirmations-widget.vercel.app)

A personalized daily affirmations web app. Take a short quiz and get one affirmation per day chosen specifically for where you are in life, not random inspiration, but something that actually fits.

## How it works

1. **Take the quiz** - 10 questions about which areas of life you're working on, how you feel, and what style of affirmation resonates with you.
2. **Get your affirmation** - the app builds a profile from your answers and surfaces the best-matched affirmation for today.
3. **Come back daily** - the affirmation rotates every day, always chosen from your personalized pool.

No account needed. Everything is saved locally in your browser.

## Features

- 10-question personalization quiz covering 8 life areas (career, relationships, health, money, confidence, mindfulness, creativity, purpose)
- Scoring algorithm that matches affirmations to your profile by category, style, tone, and length
- Date-seeded daily pick; the same affirmation shows all day, then rotates
- Minimal, calm design with no clutter between you and your affirmation
- iOS home screen widget via the free Scriptable app *(coming soon)*

## Tech stack

- [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- [TailwindCSS v4](https://tailwindcss.com/)
- [React Router v7](https://reactrouter.com/)
- Plain JavaScript — no TypeScript
- localStorage for persistence — no backend required

## Running locally

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

## Project structure

```
src/
├── data/           # Affirmations dataset + quiz questions
├── pages/          # Full-page route components
├── components/     # Reusable UI components
│   ├── Layout/     # Header, Footer
│   ├── Quiz/       # Quiz progress bar, question renderer
│   └── Affirmation/# Affirmation card
└── utils/          # Matching algorithm, daily seed logic
```
