import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const location = useLocation()
  const onAffirmation = location.pathname === '/affirmation'
  const showRetake    = onAffirmation || location.pathname === '/results'

  return (
    <header className="w-full border-b border-stone-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          to="/"
          className="text-stone-800 font-medium text-sm tracking-wide hover:text-stone-600 transition-colors duration-150"
        >
          Affirmations
        </Link>

        <div className="flex items-center gap-5">
          {onAffirmation && (
            <Link
              to="/journal"
              className="text-stone-500 hover:text-stone-800 text-sm transition-colors duration-150"
            >
              Journal
            </Link>
          )}
          {showRetake && (
            <Link
              to="/quiz?retake=true"
              className="text-stone-500 hover:text-stone-800 text-sm transition-colors duration-150 hover:underline underline-offset-2"
            >
              Retake quiz
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
