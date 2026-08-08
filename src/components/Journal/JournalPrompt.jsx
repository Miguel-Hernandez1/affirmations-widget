import { useState } from 'react'

const MOODS = ['hopeful', 'calm', 'grateful', 'energized', 'at peace']

function getTodayEntry() {
  try {
    const entries = JSON.parse(localStorage.getItem('journal_entries') || '[]')
    const today = new Date().toISOString().split('T')[0]
    return entries.find(e => e.date === today) ?? null
  } catch {
    return null
  }
}

export default function JournalPrompt({ affirmation }) {
  const [existingEntry] = useState(() => getTodayEntry())
  const [reflection, setReflection]   = useState('')
  const [mood, setMood]               = useState('')
  const [saved, setSaved]             = useState(false)

  function handleSave() {
    if (!reflection.trim() && !mood) return
    const today = new Date().toISOString().split('T')[0]
    const entry = {
      id:              String(Date.now()),
      date:            today,
      affirmationId:   affirmation.id,
      affirmationText: affirmation.text,
      reflection:      reflection.trim(),
      mood,
    }
    const existing = JSON.parse(localStorage.getItem('journal_entries') || '[]')
    localStorage.setItem('journal_entries', JSON.stringify([entry, ...existing]))
    setSaved(true)
  }

  if (existingEntry) {
    return (
      <div className="mt-10 border-t border-stone-100 pt-8">
        <p className="text-xs font-medium tracking-widest uppercase text-stone-600 mb-4">
          Today's reflection
        </p>
        {existingEntry.mood && (
          <span className="inline-block text-xs text-stone-400 border border-stone-200 rounded-full px-3 py-1 mb-3">
            {existingEntry.mood}
          </span>
        )}
        {existingEntry.reflection && (
          <p className="text-sm text-stone-600 leading-relaxed">
            {existingEntry.reflection}
          </p>
        )}
      </div>
    )
  }

  if (saved) {
    return (
      <div className="mt-10 border-t border-stone-100 pt-8">
        <p className="text-xs text-stone-400 italic">Saved.</p>
      </div>
    )
  }

  return (
    <div className="mt-10 border-t border-stone-100 pt-8">
      <p className="text-xs font-medium tracking-widest uppercase text-stone-600 mb-4">
        Reflect
      </p>
      <textarea
        value={reflection}
        onChange={e => setReflection(e.target.value)}
        placeholder="How does this make you feel?"
        rows={3}
        className="w-full text-sm text-stone-700 placeholder:text-stone-300 bg-transparent border border-stone-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-stone-400 transition-colors duration-150"
      />
      <div className="flex flex-wrap gap-2 mt-3">
        {MOODS.map(m => (
          <button
            key={m}
            type="button"
            onClick={() => setMood(mood === m ? '' : m)}
            className={`text-xs rounded-full px-3 py-1 border transition-colors duration-150 ${
              mood === m
                ? 'border-violet-300 text-violet-500 bg-violet-50'
                : 'border-stone-200 text-stone-400 hover:border-stone-300'
            }`}
          >
            {m}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={handleSave}
        disabled={!reflection.trim() && !mood}
        className="mt-4 text-xs text-stone-400 hover:text-stone-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150 underline underline-offset-2"
      >
        Save reflection
      </button>
    </div>
  )
}
