import { useState } from 'react'

const TODAY = new Date().toISOString().split('T')[0]

function readTodayEntry() {
  try {
    const entries = JSON.parse(localStorage.getItem('daily_journal') || '[]')
    return entries.find(e => e.date === TODAY) ?? null
  } catch {
    return null
  }
}

export default function DailyJournalEntry() {
  const [entry, setEntry]       = useState(() => readTodayEntry())
  const [body, setBody]         = useState('')
  const [isEditing, setIsEditing] = useState(false)

  function beginEdit() {
    setBody(entry ? entry.body : '')
    setIsEditing(true)
  }

  function cancelEdit() {
    setIsEditing(false)
    setBody('')
  }

  function handleSave() {
    const trimmed = body.trim()
    if (!trimmed) return
    const newEntry = { id: String(Date.now()), date: TODAY, body: trimmed }
    const all = JSON.parse(localStorage.getItem('daily_journal') || '[]')
    localStorage.setItem(
      'daily_journal',
      JSON.stringify([newEntry, ...all.filter(e => e.date !== TODAY)])
    )
    setEntry(newEntry)
    setIsEditing(false)
    setBody('')
  }

  if (entry && !isEditing) {
    return (
      <div className="mb-10 pb-8 border-b border-stone-100">
        <div className="flex items-baseline justify-between mb-3">
          <p className="text-xs font-medium tracking-widest uppercase text-stone-400">
            Today
          </p>
          <button
            type="button"
            onClick={beginEdit}
            className="text-xs text-stone-300 hover:text-stone-500 underline underline-offset-2 transition-colors duration-150"
          >
            Edit
          </button>
        </div>
        <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-wrap">
          {entry.body}
        </p>
      </div>
    )
  }

  return (
    <div className="mb-10 pb-8 border-b border-stone-100">
      <p className="text-xs font-medium tracking-widest uppercase text-stone-400 mb-4">
        Today
      </p>
      <textarea
        value={body}
        onChange={e => setBody(e.target.value)}
        placeholder="Write anything..."
        rows={4}
        className="w-full text-sm text-stone-700 placeholder:text-stone-300 bg-transparent border border-stone-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-stone-400 transition-colors duration-150"
      />
      <div className="flex items-center gap-4 mt-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={!body.trim()}
          className="text-xs text-stone-400 hover:text-stone-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150 underline underline-offset-2"
        >
          Save
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={cancelEdit}
            className="text-xs text-stone-300 hover:text-stone-400 transition-colors duration-150"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}
