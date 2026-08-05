import { useState } from 'react'
import QuizProgress from '../components/Quiz/QuizProgress'
import QuizQuestion from '../components/Quiz/QuizQuestion'
import { questions } from '../data'

export default function QuizPage() {
  const [previewIndex, setPreviewIndex] = useState(0)
  const [answer, setAnswer] = useState(null)

  const question = questions[previewIndex]

  function next() {
    setAnswer(null)
    setPreviewIndex(i => Math.min(i + 1, questions.length - 1))
  }

  function prev() {
    setAnswer(null)
    setPreviewIndex(i => Math.max(i - 1, 0))
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <QuizProgress currentStep={previewIndex + 1} totalSteps={questions.length} />

      <div className="mt-10">
        <QuizQuestion question={question} answer={answer} onChange={setAnswer} />
      </div>

      <div className="flex gap-3 mt-8">
        {previewIndex > 0 && (
          <button
            onClick={prev}
            className="text-stone-500 hover:text-stone-800 text-sm transition-colors duration-150 hover:underline underline-offset-2"
          >
            Back
          </button>
        )}
        <button
          onClick={next}
          disabled={!answer && answer !== 0}
          className="ml-auto bg-violet-400 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-6 py-2.5 rounded-full transition-colors duration-200"
        >
          {previewIndex === questions.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  )
}
