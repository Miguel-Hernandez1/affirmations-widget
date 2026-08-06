import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AffirmationCard from '../components/Affirmation/AffirmationCard'
import { getDailyAffirmation } from '../utils'

export default function AffirmationPage() {
  const navigate = useNavigate()
  const raw = localStorage.getItem('affirmation_profile')
  const profile = raw ? JSON.parse(raw) : null

  useEffect(() => {
    if (!profile) navigate('/quiz', { replace: true })
  }, [profile, navigate])

  if (!profile) return null

  const { daily } = getDailyAffirmation(profile)

  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <p className="text-xs font-medium tracking-widest uppercase text-stone-400 mb-8">
        {profile.name ? `Your affirmation, ${profile.name}` : 'Your affirmation'}
      </p>
      <AffirmationCard affirmation={daily} onShare={() => {}} />
      <p className="text-xs text-stone-400 mt-6 text-center">
        More options and daily rotation coming soon.
      </p>
    </div>
  )
}
