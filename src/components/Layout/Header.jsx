import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Header() {
  const location   = useLocation()
  const navigate   = useNavigate()
  const { user, signOut } = useAuth()

  const onAffirmation = location.pathname === '/affirmation'
  const showRetake    = onAffirmation || location.pathname === '/results'

  async function handleSignOut() {
    await signOut()
    navigate('/', { replace: true })
  }

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
          {user ? (
            <button
              onClick={handleSignOut}
              className="text-stone-400 hover:text-stone-600 text-sm transition-colors duration-150"
            >
              Sign out
            </button>
          ) : (
            <Link
              to="/login"
              className="text-stone-500 hover:text-stone-800 text-sm transition-colors duration-150"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
