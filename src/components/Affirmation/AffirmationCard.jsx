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

const CARD_THEMES = {
  default: { card: 'bg-white border-stone-200' },
  warm:    { card: 'bg-amber-50 border-amber-200' },
  sage:    { card: 'bg-emerald-50 border-emerald-200' },
  dusk:    { card: 'bg-violet-50 border-violet-200' },
}

const FONT_CLASSES = {
  sans:  { family: 'font-sans',  weight: 'font-light',  size: 'text-3xl md:text-4xl' },
  serif: { family: 'font-serif', weight: 'font-light',  size: 'text-3xl md:text-4xl' },
  mono:  { family: 'font-mono',  weight: 'font-normal', size: 'text-2xl md:text-3xl' },
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

export default function AffirmationCard({ affirmation, onShare, copied = false, fontStyle = 'sans', cardTheme = 'default' }) {
  if (!affirmation) return null

  const categories = affirmation.categories.map(c => CATEGORY_LABELS[c] ?? c)
  const theme = CARD_THEMES[cardTheme] ?? CARD_THEMES.default
  const font  = FONT_CLASSES[fontStyle]  ?? FONT_CLASSES.sans

  return (
    <div className={`${theme.card} border rounded-2xl px-8 py-12 md:px-12 md:py-16 shadow-sm w-full`}>

      <div className="flex flex-wrap gap-x-3 gap-y-1 mb-12">
        {categories.map(label => (
          <span
            key={label}
            className="text-xs font-medium tracking-widest uppercase text-stone-400"
          >
            {label}
          </span>
        ))}
      </div>

      <p className={`${font.size} ${font.weight} ${font.family} text-stone-800 leading-relaxed text-center`}>
        {affirmation.text}
      </p>

      <div className="flex items-center justify-between mt-12">
        <span className="text-xs tracking-widest uppercase text-stone-400">
          {affirmation.tone}
        </span>

        {copied ? (
          <span className="text-xs text-violet-400 font-medium transition-opacity duration-200">
            Copied
          </span>
        ) : (
          <button
            type="button"
            onClick={onShare}
            className="text-stone-400 hover:text-stone-700 transition-colors duration-150 p-2 -mr-2"
            aria-label="Share this affirmation"
          >
            <ShareIcon />
          </button>
        )}
      </div>

    </div>
  )
}
