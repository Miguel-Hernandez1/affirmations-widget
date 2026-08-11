import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { migrateLocalStorage } from '../lib/db'

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!supabase) { navigate('/affirmation', { replace: true }); return }

    // Check if the URL hash contains an error (expired or invalid link)
    const hash = window.location.hash
    if (hash.includes('error=')) {
      const params = new URLSearchParams(hash.replace('#', ''))
      const description = params.get('error_description') ?? 'The sign-in link is invalid or has expired.'
      setError(description.replace(/\+/g, ' '))
      return
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        if (!localStorage.getItem('supabase_migrated')) {
          await migrateLocalStorage(session.user.id)
        }
        navigate('/affirmation', { replace: true })
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  if (error) {
    return (
      <div className="max-w-sm mx-auto px-6 py-24 text-center">
        <p className="text-sm font-medium text-stone-800 mb-3">
          That link has expired
        </p>
        <p className="text-sm text-stone-500 leading-relaxed mb-8">
          Sign-in links can only be used once and expire after an hour.
          Request a new one below.
        </p>
        <Link
          to="/login"
          className="inline-block bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium px-6 py-3 rounded-full transition-colors duration-200"
        >
          Get a new link
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-sm mx-auto px-6 py-24 text-center">
      <p className="text-sm text-stone-500">Signing you in...</p>
    </div>
  )
}
