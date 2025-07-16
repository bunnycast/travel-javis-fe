import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'; // BrowserRouter 임포트

async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return
  }
 
  const { worker } = await import('./mocks/browser.js')
 
  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and running.
  return worker.start()
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter> {/* BrowserRouter로 App 감싸기 */}
            <App />
        </BrowserRouter>
    </StrictMode>,
)
