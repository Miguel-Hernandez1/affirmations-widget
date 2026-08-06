import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import QuizProgress from '../components/Quiz/QuizProgress'
import QuizQuestion from '../components/Quiz/QuizQuestion'
import { questions } from '../data'

const STORAGE_KEY = 'affirmation_profile'

function isAnswered(question, answers) {
  const val = answers[question.key]
  if (question.type === 'text') return typeof val === 'string' && val.trim().length > 0
  if (question.type === 'multi') return Array.isArray(val) && val.length > 0
  return val !== null && val !== undefined
}

function buildProfile(answers) {
  const profile = {}
  questions.forEach(q => {
    profile[q.mapTo] = answers[q.key] ?? null
  })
  return profile
}

export default function QuizPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isRetake = searchParams.get('retake') === 'true'
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})

  useEffect(() => {
    const existing = localStorage.getItem(STORAGE_KEY)
    if (existing && !isRetake) navigate('/affirmation', { replace: true })
  }, [isRetake, navigate])

  const question = questions[step]
  const answered = isAnswered(question, answers)
  const isLast = step === questions.length - 1

  function handleChange(value) {
    setAnswers(prev => ({ ...prev, [question.key]: value }))
  }

  function handleNext() {
    if (!answered) return
    if (!isLast) {
      setStep(s => s + 1)
      return
    }
    const profile = buildProfile(answers)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
    navigate('/results')
  }

  function handleBack() {
    setStep(s => Math.max(0, s - 1))
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <QuizProgress currentStep={step + 1} totalSteps={questions.length} />

      <div key={step} className="mt-10 animate-question">
        <QuizQuestion
          question={question}
          answer={answers[question.key] ?? null}
          onChange={handleChange}
        />
      </div>

      <div className="flex items-center mt-8">
        {step > 0 && (
          <button
            onClick={handleBack}
            className="text-stone-500 hover:text-stone-800 text-sm transition-colors duration-150 hover:underline underline-offset-2"
          >
            Back
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!answered}
          className="ml-auto bg-violet-400 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-6 py-3 rounded-full transition-colors duration-200"
        >
          {isLast ? 'See my affirmation' : 'Next'}
        </button>
      </div>
    </div>
  )
}
