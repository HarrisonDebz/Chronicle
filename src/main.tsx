import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ToastProvider } from './hooks/useToast.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'
import { Analytics } from '@vercel/analytics/react'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <App />
        <Analytics />
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
)

