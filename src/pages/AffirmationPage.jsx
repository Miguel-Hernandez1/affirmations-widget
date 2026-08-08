import { useEffect, useState, useMemo } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import AffirmationCard from '../components/Affirmation/AffirmationCard'
import AffirmationLoading from '../components/Affirmation/AffirmationLoading'
import SelectionView from '../components/Affirmation/SelectionView'
import JournalPrompt from '../components/Journal/JournalPrompt'
import { getDailyAffirmation, useShare } from '../utils'

function formatDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month:   'long',
    day:     'numeric',
  })
}

function getSavedChoiceFromPool(pool) {
  if (!pool.length) return null
  try {
    const saved = localStorage.getItem('affirmation_choice')
    if (!saved) return null
    const choice = JSON.parse(saved)
    if (choice.date !== new Date().toDateString()) return null
    return pool.find(a => a.id === choice.id) ?? null
  } catch {
    return null
  }
}

export default function AffirmationPage() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const isFresh   = location.state?.fresh === true
  const raw       = localStorage.getItem('affirmation_profile')
  const profile   = raw ? JSON.parse(raw) : null

  const [isReady, setIsReady] = useState(!isFresh)

  useEffect(() => {
    if (!profile) navigate('/quiz', { replace: true })
  }, [profile, navigate])

  useEffect(() => {
    if (!isFresh) return
    const t = setTimeout(() => setIsReady(true), 400)
    return () => clearTimeout(t)
  }, [isFresh])

  const { daily, alternatives } = useMemo(
    () => (profile ? getDailyAffirmation(profile) : { daily: null, alternatives: [] }),
    [raw]
  )

  const dailyCount = profile ? Math.min(parseInt(profile.dailyCount) || 5, 5) : 5

  const pool = useMemo(
    () => (daily ? [daily, ...alternatives].slice(0, dailyCount) : []),
    [daily, alternatives, dailyCount]
  )

  const savedChoice = useMemo(() => getSavedChoiceFromPool(pool), [pool])

  const [pickedAffirmation, setPickedAffirmation] = useState(null)
  const chosenAffirmation = pickedAffirmation ?? savedChoice ?? (dailyCount === 1 ? daily : null)

  useEffect(() => {
    if (dailyCount === 1 && daily && !savedChoice) {
      localStorage.setItem('affirmation_choice', JSON.stringify({
        date: new Date().toDateString(),
        id:   daily.id,
      }))
    }
  }, [dailyCount, daily, savedChoice])

  const { share, copied } = useShare()

  function handlePick(affirmation) {
    localStorage.setItem('affirmation_choice', JSON.stringify({
      date: new Date().toDateString(),
      id:   affirmation.id,
    }))
    setPickedAffirmation(affirmation)
  }

  if (!profile || !daily) return null

  return (
    <div className="max-w-xl mx-auto px-6 py-16">

      <div className="flex items-baseline justify-between mb-8">
        <p className="text-xs font-medium tracking-widest uppercase text-stone-400">
          {profile.name ? `Your affirmation, ${profile.name}` : 'Your affirmation'}
        </p>
        <p className="text-xs text-stone-400">{formatDate()}</p>
      </div>

      {!isReady ? (
        <AffirmationLoading />
      ) : chosenAffirmation ? (
        <div key={chosenAffirmation.id} className="animate-question">
          <AffirmationCard
            affirmation={chosenAffirmation}
            onShare={() => share(chosenAffirmation.text)}
            copied={copied}
            fontStyle={profile.fontStyle}
            cardTheme={profile.cardTheme}
          />
        </div>
      ) : (
        <SelectionView pool={pool} onPick={handlePick} />
      )}

      {chosenAffirmation && isReady && (
        <JournalPrompt affirmation={chosenAffirmation} />
      )}

      <div className="mt-12 flex items-center justify-center gap-6">
        <Link
          to="/journal"
          className="text-xs text-stone-300 hover:text-stone-400 transition-colors duration-150"
        >
          Journal
        </Link>
        <Link
          to="/widget"
          className="text-xs text-stone-300 hover:text-stone-400 transition-colors duration-150"
        >
          Set up iOS widget
        </Link>
      </div>

    </div>
  )
}
