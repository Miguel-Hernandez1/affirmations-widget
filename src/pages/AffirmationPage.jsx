import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import AffirmationCard from '../components/Affirmation/AffirmationCard'
import { getDailyAffirmation } from '../utils'

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

      <AffirmationCard affirmation={current} onShare={() => {}} />

    </div>
  )
}
