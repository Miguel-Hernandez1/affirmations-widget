import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-20 md:py-32">
      <div className="max-w-xl w-full">

        <p className="text-xs font-medium tracking-widest uppercase text-stone-400 mb-8">
          Personalized daily affirmations
        </p>

        <h1 className="text-4xl md:text-5xl font-light text-stone-800 leading-snug mb-6">
          Words that fit<br />where you are.
        </h1>

        <p className="text-base text-stone-500 leading-relaxed mb-10 max-w-sm">
          A short quiz builds your profile. Each day, one affirmation
          chosen specifically for you — not random inspiration, but
          something that matches your life right now.
        </p>

        <Link
          to="/quiz"
          className="inline-block bg-violet-400 hover:bg-violet-500 text-white text-sm font-medium px-8 py-3 rounded-full transition-colors duration-200"
        >
          Start your quiz
        </Link>

        <p className="text-xs text-stone-400 mt-5">
          Takes about 2 minutes. No account needed.
        </p>

      </div>
    </div>
  )
}
