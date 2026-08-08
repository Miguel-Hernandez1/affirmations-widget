function QuestionHeader({ text, subtitle }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-light text-stone-800 leading-snug">{text}</h2>
      {subtitle && (
        <p className="text-sm text-stone-400 mt-2">{subtitle}</p>
      )}
    </div>
  )
}

function TextQuestion({ question, answer, onChange }) {
  return (
    <div>
      <QuestionHeader text={question.text} subtitle={question.subtitle} />
      <input
        type="text"
        value={answer || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={question.placeholder}
        autoFocus
        className="w-full border border-stone-200 rounded-xl px-5 py-4 text-stone-800 placeholder-stone-300 bg-white text-base focus:outline-none focus:border-violet-400 transition-colors duration-150"
      />
    </div>
  )
}

function SingleQuestion({ question, answer, onChange }) {
  return (
    <div>
      <QuestionHeader text={question.text} subtitle={question.subtitle} />
      <div className="flex flex-col gap-3">
        {question.options.map(option => {
          const selected = answer === option.value
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`text-left border rounded-xl px-5 py-4 transition-all duration-150 ${
                selected
                  ? 'border-violet-400 bg-violet-50 text-stone-800'
                  : 'border-stone-200 bg-white text-stone-700 hover:border-violet-300 hover:bg-violet-50'
              }`}
            >
              <span className="block text-sm font-medium">{option.label}</span>
              {option.description && (
                <span className="block text-xs text-stone-400 mt-0.5">{option.description}</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function MultiQuestion({ question, answer, onChange }) {
  const selected = answer || []
  const hasLimit = question.maxSelections !== null
  const isAtMax  = hasLimit && selected.length >= question.maxSelections

  function toggle(value) {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value))
    } else if (!isAtMax) {
      onChange([...selected, value])
    }
  }

  return (
    <div>
      <QuestionHeader text={question.text} subtitle={question.subtitle} />
      <div className="flex flex-col gap-3">
        {question.options.map(option => {
          const isSelected = selected.includes(option.value)
          const isDisabled = !isSelected && isAtMax
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggle(option.value)}
              disabled={isDisabled}
              className={`text-left border rounded-xl px-5 py-4 transition-all duration-150 ${
                isSelected
                  ? 'border-violet-400 bg-violet-50 text-stone-800'
                  : isDisabled
                  ? 'border-stone-100 bg-stone-50 text-stone-300 cursor-not-allowed'
                  : 'border-stone-200 bg-white text-stone-700 hover:border-violet-300 hover:bg-violet-50'
              }`}
            >
              <span className="block text-sm font-medium">{option.label}</span>
              {option.description && (
                <span className="block text-xs text-stone-400 mt-0.5">{option.description}</span>
              )}
            </button>
          )
        })}
      </div>
      {hasLimit && (
        <p className="text-xs text-stone-400 mt-3">
          {selected.length} of {question.maxSelections} selected
        </p>
      )}
    </div>
  )
}

export default function QuizQuestion({ question, answer, onChange }) {
  if (question.type === 'text')  return <TextQuestion  question={question} answer={answer} onChange={onChange} />
  if (question.type === 'single') return <SingleQuestion question={question} answer={answer} onChange={onChange} />
  if (question.type === 'multi')  return <MultiQuestion  question={question} answer={answer} onChange={onChange} />
  return null
}
