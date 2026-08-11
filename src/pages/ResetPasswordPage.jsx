import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const { updatePassword } = useAuth()
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    const { error: err } = await updatePassword(password)
    setLoading(false)
    if (err) setError('Something went wrong. Please try again.')
    else navigate('/affirmation', { replace: true })
  }

  return (
    <div className="max-w-sm mx-auto px-6 py-24">
      <p className="text-sm font-medium text-stone-800 mb-2">Set a new password</p>
      <p className="text-sm text-stone-500 leading-relaxed mb-8">
        Choose a new password for your account.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="New password (min. 6 characters)"
          required
          minLength={6}
          autoFocus
          className="w-full text-sm text-stone-700 placeholder:text-stone-300 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:border-stone-400 transition-colors duration-150"
        />
        <button
          type="submit"
          disabled={loading || password.length < 6}
          className="bg-violet-500 hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-6 py-3 rounded-full transition-colors duration-200"
        >
          {loading ? '...' : 'Set password'}
        </button>
      </form>
      {error && <p className="text-xs text-red-400 mt-4">{error}</p>}
    </div>
  )
}
