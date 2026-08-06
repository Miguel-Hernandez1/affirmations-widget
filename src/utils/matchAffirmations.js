import { affirmations, questions } from '../data'

const POOL_SIZE        = 20
const MIN_SCORE        = 2   // affirmations scoring below this are excluded from the pool
const STYLE_MATCH_PTS  = 4   // style is the strongest signal — raised from 2
const CATEGORY_PTS     = 3   // direct category match
const BOOST_PTS        = 2   // category boosted by challenge/wantMore answers
const TONE_PTS         = 1
const LENGTH_PTS       = 1

function getBoostedCategories(profile) {
  const boosted = new Set()

  const challengeQ = questions.find(q => q.key === 'challenge')
  if (challengeQ && profile.challenge) {
    const opt = challengeQ.options.find(o => o.value === profile.challenge)
    if (opt?.boosts) opt.boosts.forEach(b => boosted.add(b))
  }

  const wantMoreQ = questions.find(q => q.key === 'wantMore')
  if (wantMoreQ && Array.isArray(profile.wantMore)) {
    profile.wantMore.forEach(val => {
      const opt = wantMoreQ.options.find(o => o.value === val)
      if (opt?.boosts) opt.boosts.forEach(b => boosted.add(b))
    })
  }

  return boosted
}

function scoreAffirmation(affirmation, profile, boosted) {
  let score = 0
  const profileCategories = Array.isArray(profile.categories) ? profile.categories : []

  affirmation.categories.forEach(cat => {
    if (profileCategories.includes(cat)) score += CATEGORY_PTS
    if (boosted.has(cat))               score += BOOST_PTS
  })

  if (affirmation.style  === profile.style)  score += STYLE_MATCH_PTS
  if (affirmation.tone   === profile.tone)   score += TONE_PTS
  if (affirmation.length === profile.length) score += LENGTH_PTS

  return score
}

// Shuffle affirmations that share the same score so ties are broken
// randomly (seeded per day) rather than by JSON file order.
function shuffleTies(scored, seed) {
  const groups = new Map()
  scored.forEach(a => {
    const bucket = groups.get(a.score) || []
    bucket.push(a)
    groups.set(a.score, bucket)
  })

  let rng = seed
  function next() {
    rng = (rng * 1664525 + 1013904223) & 0xffffffff
    return (rng >>> 0) / 0xffffffff
  }

  const result = []
  Array.from(groups.keys())
    .sort((a, b) => b - a)
    .forEach(score => {
      const bucket = groups.get(score)
      for (let i = bucket.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1))
        ;[bucket[i], bucket[j]] = [bucket[j], bucket[i]]
      }
      result.push(...bucket)
    })

  return result
}

export function matchAffirmations(profile, daySeed = 0) {
  const boosted = getBoostedCategories(profile)

  const scored = affirmations.map(a => ({
    ...a,
    score: scoreAffirmation(a, profile, boosted),
  }))

  return shuffleTies(scored, daySeed)
}

function buildSeedString(cadence) {
  const now = new Date()

  if (cadence === 'weekly') {
    const startOfYear = new Date(now.getFullYear(), 0, 1)
    const week = Math.ceil(((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7)
    return `${now.getFullYear()}-W${week}`
  }

  if (cadence === 'every3days') {
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000)
    return `${now.getFullYear()}-${Math.floor(dayOfYear / 3)}`
  }

  return now.toDateString()
}

function hashSeed(str) {
  let n = 0
  for (let i = 0; i < str.length; i++) {
    n = (n * 31 + str.charCodeAt(i)) % 1_000_000
  }
  return n
}

export function getDailyAffirmation(profile) {
  const seedStr  = buildSeedString(profile.cadence || 'daily')
  const daySeed  = hashSeed(seedStr)
  const ranked   = matchAffirmations(profile, daySeed)

  // Build pool: prefer affirmations above the minimum score threshold.
  // If not enough qualify, fall back to top-ranked regardless of score.
  const qualified = ranked.filter(a => a.score >= MIN_SCORE)
  const pool = (qualified.length >= 5 ? qualified : ranked).slice(0, POOL_SIZE)

  const idx          = daySeed % pool.length
  const daily        = pool[idx]
  const alternatives = pool.filter((_, i) => i !== idx).slice(0, 4)

  return { daily, alternatives, poolSize: pool.length }
}
