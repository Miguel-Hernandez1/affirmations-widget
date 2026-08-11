import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DailyJournalEntry from '../components/Journal/DailyJournalEntry'
import { useAuth } from '../hooks/useAuth'
import { loadJournalEntries, loadDailyEntries, saveDailyEntry } from '../lib/db'

const TODAY = new Date().toISOString().split('T')[0]

function entryTimestamp(entry) {
  if (!entry.createdAt) return null
  const date    = new Date(entry.createdAt)
  const isToday = entry.date === TODAY
  const edited  = entry.updatedAt && entry.updatedAt !== entry.createdAt

  const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  const label = isToday
    ? time
    : date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) + ' at ' + time

  return edited ? `${label} · edited` : label
}

function formatDateHeader(isoDate) {
  if (isoDate === TODAY) return 'Today'
  const [y, m, d] = isoDate.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })
}

function loadLocal() {
  try {
    return {
      free:        JSON.parse(localStorage.getItem('daily_journal')   || '[]'),
      reflections: JSON.parse(localStorage.getItem('journal_entries') || '[]'),
    }
  } catch {
    return { free: [], reflections: [] }
  }
}

export default function JournalPage() {
  const { user } = useAuth()
  const local = loadLocal()

  const [freeEntries, setFreeEntries]   = useState(local.free)
  const [reflections]                   = useState(local.reflections)
  const [editingId, setEditingId]       = useState(null)
  const [editBody, setEditBody]         = useState('')

  useEffect(() => {
    if (!user) return
    Promise.all([loadJournalEntries(user.id), loadDailyEntries(user.id)]).then(
      ([, f]) => { if (f) setFreeEntries(f) }
    )
  }, [user])

  function handleNewEntry(entry) {
    const updated = [entry, ...freeEntries]
    localStorage.setItem('daily_journal', JSON.stringify(updated))
    if (user) saveDailyEntry(user.id, entry)
    setFreeEntries(updated)
  }

  function startEdit(entry) {
    setEditingId(entry.id)
    setEditBody(entry.body)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditBody('')
  }

  function saveEdit(id) {
    const trimmed = editBody.trim()
    if (!trimmed) return
    const now     = new Date().toISOString()
    const updated = freeEntries.map(e =>
      e.id === id ? { ...e, body: trimmed, updatedAt: now } : e
    )
    localStorage.setItem('daily_journal', JSON.stringify(updated))
    const saved = updated.find(e => e.id === id)
    if (user) saveDailyEntry(user.id, saved)
    setFreeEntries(updated)
    setEditingId(null)
    setEditBody('')
  }

  // Build date-grouped view
  const allDates = [...new Set([
    ...freeEntries.map(e => e.date),
    ...reflections.map(e => e.date),
  ])].sort().reverse()

  const isEmpty = freeEntries.length === 0 && reflections.length === 0

  return (
    <div className="max-w-xl mx-auto px-6 py-16">

      <div className="flex items-baseline justify-between mb-8">
        <p className="text-sm font-medium text-stone-800 tracking-wide">Journal</p>
        <Link
          to="/affirmation"
          className="text-xs text-stone-500 hover:text-stone-700 underline underline-offset-2 transition-colors duration-150"
        >
          Back to today
        </Link>
      </div>

      <DailyJournalEntry onSaved={handleNewEntry} />

      {isEmpty ? (
        <p className="text-sm text-stone-500 italic">
          Your entries will appear here after you write your first one.
        </p>
      ) : (
        <div className="flex flex-col gap-10">
          {allDates.map(date => {
            const dayFree        = freeEntries.filter(e => e.date === date)
            const dayReflection  = reflections.find(e => e.date === date)

            return (
              <div key={date}>
                <p className="text-xs font-medium text-stone-500 mb-5">
                  {formatDateHeader(date)}
                </p>

                <div className="flex flex-col gap-6">
                  {dayFree.map(entry => (
                    <div key={entry.id}>
                      {editingId === entry.id ? (
                        <div>
                          <textarea
                            value={editBody}
                            onChange={e => setEditBody(e.target.value)}
                            rows={4}
                            autoFocus
                            className="w-full text-sm text-stone-700 bg-transparent border border-stone-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-stone-400 transition-colors duration-150"
                          />
                          <div className="flex items-center gap-4 mt-2">
                            <button
                              type="button"
                              onClick={() => saveEdit(entry.id)}
                              disabled={!editBody.trim()}
                              className="text-xs text-stone-500 hover:text-stone-700 underline underline-offset-2 disabled:opacity-40 transition-colors duration-150"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={cancelEdit}
                              className="text-xs text-stone-400 hover:text-stone-500 transition-colors duration-150"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="group">
                          {entryTimestamp(entry) && (
                            <p className="text-xs text-stone-400 mb-2">
                              {entryTimestamp(entry)}
                            </p>
                          )}
                          <div className="flex items-start justify-between gap-4">
                            <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-wrap flex-1">
                              {entry.body}
                            </p>
                            <button
                              type="button"
                              onClick={() => startEdit(entry)}
                              className="text-xs text-stone-400 hover:text-stone-600 underline underline-offset-2 shrink-0 transition-colors duration-150 mt-0.5"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {dayReflection && (
                    <div className={dayFree.length > 0 ? 'pt-4 border-t border-stone-100' : ''}>
                      <p className="text-sm font-light text-stone-500 italic mb-3 leading-relaxed">
                        {dayReflection.affirmationText}
                      </p>
                      {dayReflection.mood && (
                        <span className="inline-block text-xs text-stone-500 border border-stone-200 rounded-full px-3 py-1 mb-3">
                          {dayReflection.mood}
                        </span>
                      )}
                      {dayReflection.reflection && (
                        <p className="text-sm text-stone-700 leading-relaxed">
                          {dayReflection.reflection}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}
