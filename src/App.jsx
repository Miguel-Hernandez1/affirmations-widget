import { Routes, Route } from 'react-router-dom'

function Home() {
  return <div className="p-8 text-2xl text-stone-700">Home — coming soon</div>
}

function Quiz() {
  return <div className="p-8 text-2xl text-stone-700">Quiz — coming soon</div>
}

function Affirmation() {
  return <div className="p-8 text-2xl text-stone-700">Affirmation — coming soon</div>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/affirmation" element={<Affirmation />} />
    </Routes>
  )
}
