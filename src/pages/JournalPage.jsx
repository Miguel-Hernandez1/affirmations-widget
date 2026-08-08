import { Link } from 'react-router-dom'
import DailyJournalEntry from '../components/Journal/DailyJournalEntry'

const TODAY = new Date().toISOString().split('T')[0]

function formatEntryDate(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long',
    month:   'long',
    day:     'numeric',
  })
}

function loadHistory() {
  let reflections = []
  let freeEntries = []
  try {
    reflections = JSON.parse(localStorage.getItem('journal_entries') || '[]')
    freeEntries = JSON.parse(localStorage.getItem('daily_journal')   || '[]')
  } catch {}

  const pastReflections = reflections.filter(e => e.date !== TODAY)
  const pastFree        = freeEntries.filter(e => e.date !== TODAY)

  const dates = [...new Set([
    ...pastReflections.map(e => e.date),
    ...pastFree.map(e => e.date),
  ])].sort().reverse()

  return dates.map(date => ({
    date,
    free:       pastFree.find(e => e.date === date),
    reflection: pastReflections.find(e => e.date === date),
  }))
}

export default function JournalPage() {
  const history = loadHistory()

  return (
    <div className="max-w-xl mx-auto px-6 py-16">

      <div className="flex items-baseline justify-between mb-8">
        <p className="text-sm font-medium text-stone-800 tracking-wide">
          Journal
        </p>
        <Link
          to="/affirmation"
          className="text-xs text-stone-500 hover:text-stone-700 underline underline-offset-2 transition-colors duration-150"
        >
          Back to today
        </Link>
      </div>

      <DailyJournalEntry />

      {history.length === 0 ? (
        <p className="text-sm text-stone-500 italic">
          Your past entries will appear here.
        </p>
      ) : (
        <div className="flex flex-col gap-8">
          {history.map(({ date, free, reflection }) => (
            <div key={date} className="border-t border-stone-100 pt-6">
              <p className="text-xs font-medium text-stone-500 mb-4">
                {formatEntryDate(date)}
              </p>

              {free && (
                <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-wrap mb-4">
                  {free.body}
                </p>
              )}

              {reflection && (
                <div className={free ? 'pt-4 border-t border-stone-100' : ''}>
                  <p className="text-sm font-light text-stone-500 italic mb-3 leading-relaxed">
                    {reflection.affirmationText}
                  </p>
                  {reflection.mood && (
                    <span className="inline-block text-xs text-stone-500 border border-stone-200 rounded-full px-3 py-1 mb-3">
                      {reflection.mood}
                    </span>
                  )}
                  {reflection.reflection && (
                    <p className="text-sm text-stone-700 leading-relaxed">
                      {reflection.reflection}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
