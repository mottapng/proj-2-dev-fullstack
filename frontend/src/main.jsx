import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Importação global do CSS do Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
// Importação global do JS do Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
