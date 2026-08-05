export default function QuizProgress({ currentStep, totalSteps }) {
  const percent = Math.round((currentStep / totalSteps) * 100)

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium tracking-widest uppercase text-stone-400">
          Question
        </span>
        <span className="text-xs text-stone-400">
          {currentStep} of {totalSteps}
        </span>
      </div>

      <div className="w-full bg-stone-200 rounded-full h-1">
        <div
          className="bg-violet-400 h-1 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
