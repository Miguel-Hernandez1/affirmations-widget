import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import AffirmationCard from '../components/Affirmation/AffirmationCard'
import { getDailyAffirmation, useShare } from '../utils'

function formatDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month:   'long',
    day:     'numeric',
  })
}

export default function AffirmationPage() {
  const navigate = useNavigate()
  const raw     = localStorage.getItem('affirmation_profile')
  const profile = raw ? JSON.parse(raw) : null

  useEffect(() => {
    if (!profile) navigate('/quiz', { replace: true })
  }, [profile, navigate])

  const { daily, alternatives } = useMemo(
    () => (profile ? getDailyAffirmation(profile) : { daily: null, alternatives: [] }),
    [raw]
  )

  const pool = useMemo(
    () => (daily ? [daily, ...alternatives] : []),
    [daily, alternatives]
  )

  const [activeIndex, setActiveIndex] = useState(0)
  const { share, copied } = useShare()

  if (!profile || !daily) return null

  const current = pool[activeIndex]
  const isOnDaily = activeIndex === 0

  return (
    <div className="max-w-xl mx-auto px-6 py-16">

      <div className="flex items-baseline justify-between mb-8">
        <p className="text-xs font-medium tracking-widest uppercase text-stone-400">
          {profile.name ? `Your affirmation, ${profile.name}` : 'Your affirmation'}
        </p>
        <p className="text-xs text-stone-400">{formatDate()}</p>
      </div>

      <div key={activeIndex} className="animate-question">
        <AffirmationCard
          affirmation={current}
          onShare={() => share(current.text)}
          copied={copied}
        />
      </div>

      <div className="mt-8 flex flex-col items-center gap-4">

        {!isOnDaily && (
          <button
            onClick={() => setActiveIndex(0)}
            className="text-xs text-stone-400 hover:text-stone-600 underline underline-offset-2 transition-colors duration-150"
          >
            Back to today's pick
          </button>
        )}

        <div className="flex items-center gap-5">
          <span className="text-xs text-stone-400">
            {activeIndex + 1} of {pool.length}
          </span>

          {activeIndex < pool.length - 1 ? (
            <button
              onClick={() => setActiveIndex(i => i + 1)}
              className="text-stone-600 hover:text-stone-800 text-sm font-medium underline underline-offset-2 transition-colors duration-150"
            >
              Next affirmation
            </button>
          ) : (
            <span className="text-xs text-stone-400 italic">
              That is all for today
            </span>
          )}
        </div>

      </div>

    </div>
  )
}
