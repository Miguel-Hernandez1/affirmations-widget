import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { migrateLocalStorage } from '../lib/db'

export default function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    if (!supabase) { navigate('/affirmation', { replace: true }); return }

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

  return (
    <div className="max-w-sm mx-auto px-6 py-24 text-center">
      <p className="text-sm text-stone-500">Signing you in...</p>
    </div>
  )
}
