import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) { setLoading(false); return }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signIn(email) {
    if (!supabase) return { error: new Error('Supabase not configured') }
    return supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  async function signInWithPassword(email, password) {
    if (!supabase) return { error: new Error('Supabase not configured') }
    return supabase.auth.signInWithPassword({ email, password })
  }

  async function signUp(email, password) {
    if (!supabase) return { error: new Error('Supabase not configured') }
    return supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  async function resetPassword(email) {
    if (!supabase) return { error: new Error('Supabase not configured') }
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    })
  }

  async function updatePassword(newPassword) {
    if (!supabase) return { error: new Error('Supabase not configured') }
    return supabase.auth.updateUser({ password: newPassword })
  }

  async function signOut() {
    if (!supabase) return
    await supabase.auth.signOut()
    setUser(null)
  }

  return { user, loading, signIn, signInWithPassword, signUp, resetPassword, updatePassword, signOut }
}
