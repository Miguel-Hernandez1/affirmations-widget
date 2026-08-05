import QuizProgress from '../components/Quiz/QuizProgress'

export default function QuizPage() {
  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <QuizProgress currentStep={3} totalSteps={10} />
      <p className="text-stone-400 mt-8 text-sm">Quiz questions coming soon.</p>
    </div>
  )
}
