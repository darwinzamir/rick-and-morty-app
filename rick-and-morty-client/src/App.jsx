import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import DetailPage from './pages/DetailPage'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="bg-gray-900 border-b border-green-500 py-4 px-6 flex items-center gap-3">
        <h1 className="text-green-400 text-2xl font-bold tracking-wide">
          🛸 Rick & Morty — Portal Directory
        </h1>
      </header>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/character/:id" element={<DetailPage />} />
      </Routes>
    </div>
  )
}