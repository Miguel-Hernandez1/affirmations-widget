import { affirmations, questions } from '../data'

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
    if (profileCategories.includes(cat)) score += 3
    if (boosted.has(cat)) score += 2
  })

  if (affirmation.style === profile.style)   score += 2
  if (affirmation.tone === profile.tone)     score += 1
  if (affirmation.length === profile.length) score += 1

  return score
}

export function matchAffirmations(profile) {
  const boosted = getBoostedCategories(profile)

  return [...affirmations]
    .map(a => ({ ...a, score: scoreAffirmation(a, profile, boosted) }))
    .sort((a, b) => b.score - a.score)
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

function seedToIndex(seedStr, poolSize) {
  let n = 0
  for (let i = 0; i < seedStr.length; i++) {
    n = (n * 31 + seedStr.charCodeAt(i)) % 1_000_000
  }
  return n % poolSize
}

export function getDailyAffirmation(profile) {
  const ranked = matchAffirmations(profile)
  const pool = ranked.slice(0, 20)

  const seed = buildSeedString(profile.cadence || 'daily')
  const idx  = seedToIndex(seed, pool.length)

  const daily        = pool[idx]
  const alternatives = pool.filter((_, i) => i !== idx).slice(0, 4)

  return { daily, alternatives }
}
