import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const STEPS = [
  {
    number: '01',
    title:  'Answer a few questions',
    body:   'We learn what you care about, what you want more of, and what kind of words actually land for you. Takes about two minutes.',
  },
  {
    number: '02',
    title:  'Get your daily affirmation',
    body:   'One affirmation, matched to your answers. The same one stays with you all day, then quietly rotates.',
  },
  {
    number: '03',
    title:  'Reflect',
    body:   'Write a few words about how it lands. Keep a journal. Build a habit of noticing.',
  },
]

export default function HomePage() {
  const navigate   = useNavigate()
  const hasProfile = Boolean(localStorage.getItem('affirmation_profile'))

  useEffect(() => {
    if (hasProfile) navigate('/affirmation', { replace: true })
  }, [hasProfile, navigate])

  return (
    <div className="max-w-2xl mx-auto px-6 py-20 md:py-32">

      {/* Hero */}
      <div className="animate-question">
        <p className="text-xs font-medium tracking-widest uppercase text-violet-500 mb-6">
          Personalized daily affirmations
        </p>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-stone-800 leading-tight mb-8">
          Words that fit<br />where you are.
        </h1>

        <div className="w-10 h-px bg-stone-200 mb-8" />

        <p className="text-base text-stone-600 leading-relaxed mb-10 max-w-sm">
          A short quiz builds your profile. Each day, one affirmation
          chosen specifically for you. Not random inspiration — something
          that matches your life right now.
        </p>

        <Link
          to="/quiz"
          className="inline-block bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium px-8 py-3 rounded-full transition-colors duration-200"
        >
          Start your quiz
        </Link>

        <p className="text-xs text-stone-400 mt-5">
          Takes about 2 minutes. No account needed.
        </p>
      </div>

      {/* How it works */}
      <div className="mt-24 border-t border-stone-100 pt-16">
        <p className="text-xs font-medium tracking-widest uppercase text-stone-400 mb-12">
          How it works
        </p>

        <div className="flex flex-col gap-10">
          {STEPS.map(step => (
            <div key={step.number} className="flex gap-6">
              <span className="text-sm font-medium text-violet-400 w-6 shrink-0 pt-0.5">
                {step.number}
              </span>
              <div>
                <p className="text-base font-medium text-stone-800 mb-1">
                  {step.title}
                </p>
                <p className="text-sm text-stone-500 leading-relaxed">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
