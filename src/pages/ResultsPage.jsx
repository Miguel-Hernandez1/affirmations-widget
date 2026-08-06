import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { questions } from '../data'

function labelFor(questionKey, value) {
  const question = questions.find(q => q.key === questionKey)
  if (!question || !question.options) return value
  if (Array.isArray(value)) {
    return value.map(v => {
      const opt = question.options.find(o => o.value === v)
      return opt ? opt.label : v
    })
  }
  const opt = question.options.find(o => o.value === value)
  return opt ? opt.label : value
}

function Row({ label, children }) {
  return (
    <div className="flex flex-col gap-1 py-4 border-b border-stone-100 last:border-0">
      <span className="text-xs font-medium tracking-widest uppercase text-stone-400">
        {label}
      </span>
      <span className="text-sm text-stone-700">{children}</span>
    </div>
  )
}

export default function ResultsPage() {
  const navigate = useNavigate()
  const raw = localStorage.getItem('affirmation_profile')
  const profile = raw ? JSON.parse(raw) : null

  useEffect(() => {
    if (!profile) navigate('/quiz', { replace: true })
  }, [profile, navigate])

  if (!profile) return null

  const categories  = labelFor('categories', profile.categories)
  const challenge   = labelFor('challenge', profile.challenge)
  const wantMore    = labelFor('wantMore', profile.wantMore)
  const style       = profile.style
  const tone        = labelFor('tone', profile.tone)
  const length      = labelFor('length', profile.length)

  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <p className="text-xs font-medium tracking-widest uppercase text-stone-400 mb-6">
        Your profile
      </p>

      <h1 className="text-3xl font-light text-stone-800 mb-2">
        {profile.name ? `Nice to meet you, ${profile.name}.` : 'Your profile is ready.'}
      </h1>

      <p className="text-sm text-stone-500 mb-10">
        Here is what we will use to find your affirmations.
      </p>

      <div className="bg-white border border-stone-200 rounded-2xl px-6 mb-10">
        <Row label="Focused on">
          {Array.isArray(categories) ? categories.join(', ') : categories}
        </Row>
        <Row label="Biggest challenge">{challenge}</Row>
        <Row label="Want more of">
          {Array.isArray(wantMore) ? wantMore.join(', ') : wantMore}
        </Row>
        <Row label="Affirmation style">{style}</Row>
        <Row label="Tone">{tone}</Row>
        <Row label="Length">{length}</Row>
      </div>

      <Link
        to="/affirmation"
        className="inline-block bg-violet-400 hover:bg-violet-500 text-white text-sm font-medium px-8 py-3 rounded-full transition-colors duration-200"
      >
        See my affirmation
      </Link>

      <p className="text-xs text-stone-400 mt-5">
        Not right?{' '}
        <Link
          to="/quiz?retake=true"
          className="underline underline-offset-2 hover:text-stone-600 transition-colors duration-150"
        >
          Start over
        </Link>
      </p>
    </div>
  )
}
