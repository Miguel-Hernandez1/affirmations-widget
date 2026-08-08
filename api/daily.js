import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { questions } from '../src/data/questions.js'

const __dirname  = dirname(fileURLToPath(import.meta.url))
const affirmations = JSON.parse(
  readFileSync(join(__dirname, '../src/data/affirmations.json'), 'utf-8')
)

// --- scoring constants (mirrors src/utils/matchAffirmations.js) ---
const POOL_SIZE       = 20
const MIN_SCORE       = 2
const STYLE_MATCH_PTS = 4
const CATEGORY_PTS    = 3
const BOOST_PTS       = 2
const TONE_PTS        = 1
const LENGTH_PTS      = 1

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
  const cats = Array.isArray(profile.categories) ? profile.categories : []
  affirmation.categories.forEach(cat => {
    if (cats.includes(cat))  score += CATEGORY_PTS
    if (boosted.has(cat))    score += BOOST_PTS
  })
  const styles = Array.isArray(profile.style) ? profile.style : (profile.style ? [profile.style] : [])
  if (styles.includes(affirmation.style))    score += STYLE_MATCH_PTS
  if (affirmation.tone   === profile.tone)   score += TONE_PTS
  if (affirmation.length === profile.length) score += LENGTH_PTS
  return score
}

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

function hashSeed(str) {
  let n = 0
  for (let i = 0; i < str.length; i++) {
    n = (n * 31 + str.charCodeAt(i)) % 1_000_000
  }
  return n
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

function getDailyAffirmation(profile) {
  const seedStr = buildSeedString(profile.cadence || 'daily')
  const daySeed = hashSeed(seedStr)
  const scored  = affirmations.map(a => ({ ...a, score: scoreAffirmation(a, profile, getBoostedCategories(profile)) }))
  const ranked  = shuffleTies(scored, daySeed)
  const qualified = ranked.filter(a => a.score >= MIN_SCORE)
  const pool    = (qualified.length >= 5 ? qualified : ranked).slice(0, POOL_SIZE)
  const idx     = daySeed % pool.length
  return pool[idx]
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { profile: profileParam } = req.query
  if (!profileParam) {
    res.status(400).json({ error: 'Missing profile parameter. Pass ?profile=<base64-encoded profile JSON>.' })
    return
  }

  let profile
  try {
    profile = JSON.parse(Buffer.from(profileParam, 'base64').toString('utf-8'))
  } catch {
    res.status(400).json({ error: 'Invalid profile — must be base64-encoded JSON.' })
    return
  }

  const affirmation = getDailyAffirmation(profile)

  res.status(200).json({
    affirmation: {
      id:         affirmation.id,
      text:       affirmation.text,
      categories: affirmation.categories,
      style:      affirmation.style,
      tone:       affirmation.tone,
      length:     affirmation.length,
    },
    date: new Date().toDateString(),
  })
}
