# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React 19 + Vite, TailwindCSS v4, React Router v7, plain JavaScript, localStorage for persistence. Deployed to Vercel. No backend for MVP.

## Users

Primary: growth-focused individuals actively investing in themselves — someone who journals, attends therapy, does self-improvement work, and wants an intentional daily habit rather than passive scrolling. They are deliberate about how they start their day. They've tried other apps but found generic affirmations hollow or irrelevant to where they actually are right now.

## Product Purpose

A personalized daily affirmation app that starts with a short quiz to understand the user's life focus areas, current emotional state, and affirmation preferences. The quiz output builds a profile that the app uses to surface one affirmation per day — chosen specifically for that person, not random. The goal is a quiet, consistent habit: open the app, read your affirmation, carry it into the day.

## Positioning

Three things a generic affirmation site cannot claim:

1. **It actually knows you.** The quiz captures where you are right now — which areas of life you're working on, how you feel, what you want more of — and every affirmation shown reflects that profile. Not one-size-fits-all inspiration.

2. **It meets you where you are.** Most affirmation apps push positivity at you unconditionally. This one starts by understanding your current emotional state and builds up from there, choosing affirmations that feel true and reachable rather than aspirationally hollow.

3. **It builds a habit, not a scroll.** One affirmation per day, chosen just for you. Not a feed to skim and forget. The same affirmation is shown all day (date-seeded), so the user can return to it and let it sink in.

## Operating Context

Users visit once per day, typically in the morning. They spend 10–30 seconds with their affirmation. New users spend 3–5 minutes on the quiz once. The quiz result is saved in localStorage so returning users go straight to their affirmation. Returning users who want to refresh their profile can retake the quiz at any time.

## Capabilities and Constraints

- Quiz: 10 questions, covering life focus areas, emotional baseline, affirmation style (I am / I have / I choose / I attract), tone (powerful / peaceful / loving / energizing), and length preference.
- Affirmations dataset: 150–200 curated affirmations, each tagged with categories, style, tone, and length.
- Personalization: scoring algorithm weights each affirmation by profile match; daily seed picks the top match deterministically per day.
- No user accounts, no backend, no email in MVP. All state lives in localStorage.
- Stretch goal: iOS home screen widget via Scriptable app (user installs free app, pastes a JS snippet, fetches their affirmation from a Vercel API endpoint).

## Brand Commitments

- Working name: **Affirmations Widget** (repo: affirmations-widget)
- Voice: warm, grounded, direct. Never preachy or toxic-positive. Reads like a thoughtful friend, not a self-help poster.
- Words to avoid: "hustle," "grind," "manifest," "vibe," "journey" (overused wellness clichés). No exclamation marks in affirmations themselves.
- Words that fit: calm, clear, intentional, personal, quiet, real, grounded.

## Evidence on Hand

- No testimonials, customer data, or press assets yet (early-stage project).
- Affirmations content will be written by hand, not pulled from a third-party API, to ensure quality and category accuracy.

## Product Principles

1. **Personalization over volume.** One well-matched affirmation beats a hundred generic ones.
2. **Calm over stimulation.** Every design decision should reduce friction and noise, not add it.
3. **Habit-friendly.** Fast to load, fast to read, zero clutter between the user and their affirmation.
4. **Honest positivity.** Affirmations should feel true and reachable, not aspirationally hollow.
5. **Private by default.** No accounts, no tracking, no sharing required. The experience is yours alone.

## Accessibility & Inclusion

Minimum: WCAG 2.1 AA contrast ratios. Keyboard-navigable quiz. Legible type at all sizes. Affirmation text large enough to read without zooming on mobile.
