import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// הסר את AuthProvider מכאן כי הוא כבר ב-main.jsx

// Components
import Navbar from './components/layout/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import CrosswordSolver from './pages/CrosswordSolver'
import CrosswordCreator from './pages/CrosswordCreator'
import MyCrosswords from './pages/MyCrosswords'
import MyWordLists from './pages/MyWordLists'
import WordListsBrowser from './pages/WordListsBrowser'
import WordListCreator from './pages/WordListCreator'
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container-fluid">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/crossword/:id" element={<CrosswordSolver />} />

            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

            <Route path="/create-crossword" element={
              <ProtectedRoute requiresContentCreator>
                <CrosswordCreator />
              </ProtectedRoute>
            } />

            <Route path="/my-crosswords" element={
              <ProtectedRoute>
                <MyCrosswords />
              </ProtectedRoute>
            } />

            <Route path="/my-wordlists" element={
              <ProtectedRoute>
                <MyWordLists />
              </ProtectedRoute>
            } />

            <Route path="/wordlists" element={<WordListsBrowser />} />

            <Route path="/create-wordlist" element={
              <ProtectedRoute>
                <WordListCreator />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App