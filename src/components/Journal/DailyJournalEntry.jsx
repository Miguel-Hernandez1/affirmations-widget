import { useState } from 'react'

export default function DailyJournalEntry({ onSaved }) {
  const [body, setBody] = useState('')

  function handleSave() {
    const trimmed = body.trim()
    if (!trimmed) return
    const now = new Date().toISOString()
    onSaved({
      id:        String(Date.now()),
      date:      now.split('T')[0],
      body:      trimmed,
      createdAt: now,
      updatedAt: now,
    })
    setBody('')
  }

  return (
    <div className="mb-10 pb-8 border-b border-stone-100">
      <p className="text-xs font-medium tracking-widest uppercase text-stone-600 mb-4">
        New entry
      </p>
      <textarea
        value={body}
        onChange={e => setBody(e.target.value)}
        placeholder="Write anything..."
        rows={4}
        className="w-full text-sm text-stone-700 placeholder:text-stone-300 bg-transparent border border-stone-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-stone-400 transition-colors duration-150"
      />
      <button
        type="button"
        onClick={handleSave}
        disabled={!body.trim()}
        className="mt-3 text-xs text-stone-400 hover:text-stone-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150 underline underline-offset-2"
      >
        Save
      </button>
    </div>
  )
}
