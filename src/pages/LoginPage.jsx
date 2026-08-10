import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const { signIn } = useAuth()
  const [email, setEmail]   = useState('')
  const [sent, setSent]     = useState(false)
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')
    const { error: err } = await signIn(email.trim())
    setLoading(false)
    if (err) {
      setError('Something went wrong. Check your email address and try again.')
    } else {
      setSent(true)
    }
  }

  if (sent) {
    return (
      <div className="max-w-sm mx-auto px-6 py-24 text-center">
        <p className="text-sm font-medium text-stone-800 mb-3">Check your email</p>
        <p className="text-sm text-stone-500 leading-relaxed">
          We sent a sign-in link to <span className="text-stone-700">{email}</span>.
          Click it to continue. You can close this tab.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-sm mx-auto px-6 py-24">

      <p className="text-sm font-medium text-stone-800 mb-2">
        Sign in to sync your journal
      </p>
      <p className="text-sm text-stone-500 leading-relaxed mb-8">
        We will send you a link — no password needed. Your affirmations
        and journal will be saved across all your devices.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Your email address"
          required
          autoFocus
          className="w-full text-sm text-stone-700 placeholder:text-stone-300 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:border-stone-400 transition-colors duration-150"
        />
        <button
          type="submit"
          disabled={loading || !email.trim()}
          className="bg-violet-500 hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-6 py-3 rounded-full transition-colors duration-200"
        >
          {loading ? 'Sending...' : 'Send sign-in link'}
        </button>
      </form>

      {error && (
        <p className="text-xs text-red-400 mt-4">{error}</p>
      )}

      <p className="text-xs text-stone-400 mt-8">
        Just want to use the app without an account?{' '}
        <Link to="/affirmation" className="underline underline-offset-2 hover:text-stone-600 transition-colors duration-150">
          Continue without signing in
        </Link>
      </p>

    </div>
  )
}
