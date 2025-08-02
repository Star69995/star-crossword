import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { CrosswordProvider } from './providers/CrosswordContext'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CrosswordProvider>
      <App />
    </CrosswordProvider>
  </StrictMode>,
)
