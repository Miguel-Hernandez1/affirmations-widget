import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Layout/Header'
import Footer from './components/Layout/Footer'
import HomePage from './pages/HomePage'
import QuizPage from './pages/QuizPage'
import ResultsPage from './pages/ResultsPage'
import AffirmationPage from './pages/AffirmationPage'
import WidgetPage from './pages/WidgetPage'
import JournalPage from './pages/JournalPage'
import LoginPage from './pages/LoginPage'
import AuthCallbackPage from './pages/AuthCallbackPage'

export default function App() {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Header />
      <main key={location.pathname} className="flex-1 animate-page">
        <Routes>
          <Route path="/"               element={<HomePage />} />
          <Route path="/quiz"           element={<QuizPage />} />
          <Route path="/results"        element={<ResultsPage />} />
          <Route path="/affirmation"    element={<AffirmationPage />} />
          <Route path="/widget"         element={<WidgetPage />} />
          <Route path="/journal"        element={<JournalPage />} />
          <Route path="/login"          element={<LoginPage />} />
          <Route path="/auth/callback"  element={<AuthCallbackPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
