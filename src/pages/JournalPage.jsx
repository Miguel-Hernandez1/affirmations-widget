import { Link } from 'react-router-dom'

function formatEntryDate(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long',
    month:   'long',
    day:     'numeric',
  })
}

export default function JournalPage() {
  let entries = []
  try {
    entries = JSON.parse(localStorage.getItem('journal_entries') || '[]')
  } catch {}

  return (
    <div className="max-w-xl mx-auto px-6 py-16">

      <div className="flex items-baseline justify-between mb-8">
        <p className="text-xs font-medium tracking-widest uppercase text-stone-400">
          Journal
        </p>
        <Link
          to="/affirmation"
          className="text-xs text-stone-400 hover:text-stone-600 underline underline-offset-2 transition-colors duration-150"
        >
          Back to today
        </Link>
      </div>

      {entries.length === 0 ? (
        <p className="text-sm text-stone-400 italic">
          Your reflections will appear here after you write your first one.
        </p>
      ) : (
        <div className="flex flex-col gap-8">
          {entries.map(entry => (
            <div key={entry.id} className="border-t border-stone-100 pt-6">
              <p className="text-xs text-stone-400 mb-3">
                {formatEntryDate(entry.date)}
              </p>
              <p className="text-sm font-light text-stone-500 italic mb-4 leading-relaxed">
                {entry.affirmationText}
              </p>
              {entry.mood && (
                <span className="inline-block text-xs text-stone-400 border border-stone-200 rounded-full px-3 py-1 mb-3">
                  {entry.mood}
                </span>
              )}
              {entry.reflection && (
                <p className="text-sm text-stone-700 leading-relaxed">
                  {entry.reflection}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
