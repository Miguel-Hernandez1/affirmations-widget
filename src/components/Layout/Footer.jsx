export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-stone-200 bg-white">
      <div className="max-w-2xl mx-auto px-6 h-12 flex items-center justify-between">
        <span className="text-xs text-stone-400 tracking-wide">
          Affirmations Widget
        </span>
        <span className="text-xs text-stone-400">
          {year}
        </span>
      </div>
    </footer>
  )
}
