import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function humanizeError(message = '') {
  if (message.includes('Invalid login credentials')) return 'Email or password is incorrect.'
  if (message.includes('already registered'))        return 'An account with this email already exists. Sign in instead.'
  if (message.includes('Password should be at least')) return 'Password must be at least 6 characters.'
  if (message.includes('invalid format'))            return 'Please enter a valid email address.'
  if (message.includes('rate limit'))                return 'Too many attempts. Please wait a moment and try again.'
  return 'Something went wrong. Please try again.'
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { signInWithPassword, signUp, resetPassword } = useAuth()

  const [mode, setMode]         = useState('signin') // 'signin' | 'signup' | 'forgot'
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [sent, setSent]         = useState(false)

  function switchMode(next) {
    setMode(next)
    setError('')
    setSent(false)
    setPassword('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (mode === 'signin') {
      const { error: err } = await signInWithPassword(email.trim(), password)
      setLoading(false)
      if (err) setError(humanizeError(err.message))
      else navigate('/affirmation', { replace: true })
    }

    if (mode === 'signup') {
      const { data, error: err } = await signUp(email.trim(), password)
      setLoading(false)
      if (err) setError(humanizeError(err.message))
      else if (data.session) navigate('/affirmation', { replace: true })
      else setSent(true)
    }

    if (mode === 'forgot') {
      const { error: err } = await resetPassword(email.trim())
      setLoading(false)
      if (err) setError(humanizeError(err.message))
      else setSent(true)
    }
  }

  if (sent && mode === 'signup') {
    return (
      <div className="max-w-sm mx-auto px-6 py-24 text-center">
        <p className="text-sm font-medium text-stone-800 mb-3">Check your email</p>
        <p className="text-sm text-stone-500 leading-relaxed">
          We sent a confirmation link to{' '}
          <span className="text-stone-700">{email}</span>.
          Click it to finish creating your account.
        </p>
      </div>
    )
  }

  if (sent && mode === 'forgot') {
    return (
      <div className="max-w-sm mx-auto px-6 py-24 text-center">
        <p className="text-sm font-medium text-stone-800 mb-3">Check your email</p>
        <p className="text-sm text-stone-500 leading-relaxed mb-6">
          We sent a password reset link to{' '}
          <span className="text-stone-700">{email}</span>.
        </p>
        <button
          type="button"
          onClick={() => switchMode('signin')}
          className="text-xs text-stone-500 hover:text-stone-700 underline underline-offset-2 transition-colors duration-150"
        >
          Back to sign in
        </button>
      </div>
    )
  }

  const TITLES = {
    signin: 'Sign in',
    signup: 'Create an account',
    forgot: 'Reset your password',
  }

  const SUBTITLES = {
    signin: 'Your affirmations and journal will sync across all your devices.',
    signup: 'Save your affirmations and journal across all your devices.',
    forgot: 'Enter your email and we will send you a reset link.',
  }

  return (
    <div className="max-w-sm mx-auto px-6 py-24">
      <p className="text-sm font-medium text-stone-800 mb-2">{TITLES[mode]}</p>
      <p className="text-sm text-stone-500 leading-relaxed mb-8">{SUBTITLES[mode]}</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email address"
          required
          autoFocus
          className="w-full text-sm text-stone-700 placeholder:text-stone-300 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:border-stone-400 transition-colors duration-150"
        />
        {mode !== 'forgot' && (
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder={mode === 'signup' ? 'Password (min. 6 characters)' : 'Password'}
            required
            minLength={mode === 'signup' ? 6 : undefined}
            className="w-full text-sm text-stone-700 placeholder:text-stone-300 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:border-stone-400 transition-colors duration-150"
          />
        )}
        <button
          type="submit"
          disabled={loading || !email.trim() || (mode !== 'forgot' && !password)}
          className="bg-violet-500 hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-6 py-3 rounded-full transition-colors duration-200"
        >
          {loading
            ? '...'
            : mode === 'signin' ? 'Sign in'
            : mode === 'signup' ? 'Create account'
            : 'Send reset link'}
        </button>
      </form>

      {error && <p className="text-xs text-red-400 mt-4">{error}</p>}

      <div className="flex flex-col gap-3 mt-8">
        {mode === 'signin' && (
          <>
            <button type="button" onClick={() => switchMode('signup')}
              className="text-xs text-stone-600 hover:text-stone-800 underline underline-offset-2 transition-colors duration-150 text-left">
              No account yet? Create one
            </button>
            <button type="button" onClick={() => switchMode('forgot')}
              className="text-xs text-stone-400 hover:text-stone-600 underline underline-offset-2 transition-colors duration-150 text-left">
              Forgot your password?
            </button>
          </>
        )}
        {mode === 'signup' && (
          <button type="button" onClick={() => switchMode('signin')}
            className="text-xs text-stone-600 hover:text-stone-800 underline underline-offset-2 transition-colors duration-150 text-left">
            Already have an account? Sign in
          </button>
        )}
        {mode === 'forgot' && (
          <button type="button" onClick={() => switchMode('signin')}
            className="text-xs text-stone-600 hover:text-stone-800 underline underline-offset-2 transition-colors duration-150 text-left">
            Back to sign in
          </button>
        )}
      </div>

      <p className="text-xs text-stone-400 mt-8">
        Just want to browse?{' '}
        <Link to="/affirmation"
          className="underline underline-offset-2 hover:text-stone-600 transition-colors duration-150">
          Continue without an account
        </Link>
      </p>
    </div>
  )
}
