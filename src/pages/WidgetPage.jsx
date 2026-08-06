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

      <p className="text-sm text-stone-500 leading-relaxed mb-12">
        Four steps. Takes about 2 minutes. Requires the free Scriptable app.
      </p>

      <div className="flex flex-col gap-8">

        <Step number="1" title="Get Scriptable">
          <p className="text-sm text-stone-600 leading-relaxed">
            Download the free <span className="font-medium text-stone-800">Scriptable</span> app
            from the App Store. It runs JavaScript on your iPhone and powers the widget.
          </p>
        </Step>

        <Step number="2" title="Copy your profile key">
          <p className="text-sm text-stone-600 leading-relaxed mb-3">
            This key encodes your quiz answers so the widget knows which affirmations to pick for you.
          </p>
          <div className="bg-stone-100 rounded-xl px-4 py-3 font-mono text-xs text-stone-500 break-all mb-3 leading-relaxed">
            {profileKey}
          </div>
          <button
            onClick={copyKey}
            className="text-sm font-medium text-violet-400 hover:text-violet-500 transition-colors duration-150"
          >
            {copied ? 'Copied' : 'Copy key'}
          </button>
        </Step>

        <Step number="3" title="Add the widget script">
          <p className="text-sm text-stone-600 leading-relaxed">
            <a
              href="/widget.js"
              download
              className="font-medium text-stone-800 underline underline-offset-2 hover:text-violet-400 transition-colors duration-150"
            >
              Download widget.js
            </a>
            , open Scriptable, create a new script, and paste the contents.
            Find the{' '}
            <code className="font-mono bg-stone-100 px-1.5 py-0.5 rounded text-xs text-stone-600">
              PROFILE_KEY = ""
            </code>{' '}
            line and paste your key between the quotes.
          </p>
        </Step>

        <Step number="4" title="Add to your home screen">
          <p className="text-sm text-stone-600 leading-relaxed">
            Long-press your home screen, tap <span className="font-medium text-stone-800">+</span>,
            search for Scriptable, choose Small or Medium, then select your affirmation script.
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
