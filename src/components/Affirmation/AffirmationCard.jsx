const CATEGORY_LABELS = {
  career:        'Career & work',
  relationships: 'Relationships',
  health:        'Health & body',
  money:         'Money & finances',
  confidence:    'Self-confidence',
  mindfulness:   'Mindfulness & peace',
  creativity:    'Creativity',
  purpose:       'Purpose & direction',
}

function ShareIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  )
}

export default function AffirmationCard({ affirmation, onShare }) {
  if (!affirmation) return null

  const categories = affirmation.categories.map(
    c => CATEGORY_LABELS[c] ?? c
  )

  return (
    <div className="bg-white border border-stone-200 rounded-2xl px-8 py-10 md:px-12 md:py-14 shadow-sm w-full">

      <div className="flex flex-wrap gap-x-3 gap-y-1 mb-10">
        {categories.map(label => (
          <span
            key={label}
            className="text-xs font-medium tracking-widest uppercase text-stone-400"
          >
            {label}
          </span>
        ))}
      </div>

      <p className="text-3xl md:text-4xl font-light text-stone-800 leading-relaxed text-center">
        {affirmation.text}
      </p>

      <div className="flex items-center justify-between mt-10">
        <span className="text-xs tracking-widest uppercase text-stone-400">
          {affirmation.tone}
        </span>

        <button
          type="button"
          onClick={onShare}
          className="text-stone-400 hover:text-stone-700 transition-colors duration-150 p-1 -mr-1"
          aria-label="Share this affirmation"
        >
          <ShareIcon />
        </button>
      </div>

    </div>
  )
}
