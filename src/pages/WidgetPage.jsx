import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Step({ number, title, children }) {
  return (
    <div className="flex gap-5">
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-violet-50 flex items-center justify-center">
        <span className="text-xs font-medium text-violet-400">{number}</span>
      </div>
      <div className="flex-1 pt-0.5">
        <h2 className="text-sm font-medium text-stone-800 mb-2">{title}</h2>
        {children}
      </div>
    </div>
  )
}

export default function WidgetPage() {
  const navigate = useNavigate()
  const raw      = localStorage.getItem('affirmation_profile')
  const profile  = raw ? JSON.parse(raw) : null

  useEffect(() => {
    if (!profile) navigate('/quiz', { replace: true })
  }, [profile, navigate])

  const [copied, setCopied] = useState(false)
  const profileKey = raw ? btoa(raw) : ''

  async function copyKey() {
    try {
      await navigator.clipboard.writeText(profileKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  if (!profile) return null

  return (
    <div className="max-w-xl mx-auto px-6 py-16">

      <p className="text-xs font-medium tracking-widest uppercase text-stone-400 mb-6">
        iOS Widget
      </p>

      <h1 className="text-3xl font-light text-stone-800 mb-2">
        Your affirmation on your home screen.
      </h1>

      <p className="text-sm text-stone-500 mb-12">
        Takes about 2 minutes. You will need the free Scriptable app.
      </p>

      <div className="flex flex-col gap-8">

        <Step number="1" title="Get Scriptable">
          <p className="text-sm text-stone-600">
            Download{' '}
            <a
              href="https://apps.apple.com/us/app/scriptable/id1405459188"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-stone-800 underline underline-offset-2 hover:text-violet-400 transition-colors duration-150"
            >
              Scriptable
            </a>
            {' '}from the App Store. It is free.
          </p>
        </Step>

        <Step number="2" title="Copy your profile key">
          <p className="text-sm text-stone-600 mb-3">
            This tells the widget which affirmations to pick for you.
          </p>
          <div className="flex items-center gap-3 bg-stone-100 rounded-xl px-4 py-3">
            <span className="font-mono text-xs text-stone-400 flex-1 truncate">
              {profileKey}
            </span>
            <button
              onClick={copyKey}
              className="flex-shrink-0 text-xs font-medium text-violet-400 hover:text-violet-500 transition-colors duration-150"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </Step>

        <Step number="3" title="Add the widget script">
          <p className="text-sm text-stone-600">
            <a
              href="/widget.js"
              download
              className="font-medium text-stone-800 underline underline-offset-2 hover:text-violet-400 transition-colors duration-150"
            >
              Download widget.js
            </a>
            , open it in Scriptable, and paste your profile key where it says{' '}
            <code className="font-mono bg-stone-100 px-1.5 py-0.5 rounded text-xs text-stone-600">
              PROFILE_KEY = ""
            </code>.
          </p>
        </Step>

        <Step number="4" title="Add to your home screen">
          <p className="text-sm text-stone-600">
            Long-press your home screen, tap <span className="font-medium text-stone-800">+</span>,
            search Scriptable, pick a size, and select your script.
          </p>
        </Step>

      </div>

      <div className="mt-12 pt-8 border-t border-stone-100">
        <Link
          to="/affirmation"
          className="text-sm text-stone-400 hover:text-stone-600 underline underline-offset-2 transition-colors duration-150"
        >
          Back to my affirmation
        </Link>
      </div>

    </div>
  )
}
