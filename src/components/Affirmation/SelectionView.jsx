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

function SelectionCard({ affirmation, onPick }) {
  const categories = affirmation.categories.map(c => CATEGORY_LABELS[c] ?? c)

  return (
    <button
      type="button"
      onClick={() => onPick(affirmation)}
      className="w-full text-left bg-white border border-stone-200 rounded-xl px-6 py-5 hover:bg-stone-50 hover:border-stone-300 transition-colors duration-150"
    >
      <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
        {categories.map(label => (
          <span
            key={label}
            className="text-xs font-medium tracking-widest uppercase text-violet-500"
          >
            {label}
          </span>
        ))}
      </div>
      <p className="text-base font-light text-stone-800 leading-relaxed">
        {affirmation.text}
      </p>
    </button>
  )
}

export default function SelectionView({ pool, onPick }) {
  return (
    <div>
      <p className="text-sm text-stone-600 mb-5">
        Choose the one that feels right today.
      </p>
      <div className="flex flex-col gap-3">
        {pool.map(affirmation => (
          <SelectionCard key={affirmation.id} affirmation={affirmation} onPick={onPick} />
        ))}
      </div>
    </div>
  )
}
