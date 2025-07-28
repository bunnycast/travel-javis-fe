import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'; // BrowserRouter 임포트

// async function enableMocking() {
//   if (process.env.NODE_ENV !== 'development') {
//     return
//   }
//
//   const { worker } = await import('./mocks/browser.js')
//
//   // `worker.start()` returns a Promise that resolves
//   // once the Service Worker is up and running.
//   return worker.start()
// }

const url = new URL(window.location.href)
const token = url.searchParams.get('token')

if (token) {
    // App.jsx와 동일한 키 이름 사용
    localStorage.setItem('accessToken', token)

    // 주소창에서 token 파라미터 제거
    url.searchParams.delete('token')

    // /chat?token=... 으로 왔다면 파라미터만 제거
    if (url.pathname.startsWith('/chat')) {
        window.history.replaceState({}, '', url.toString())
    } else {
        // 그 외 경로로 왔다면 /chat으로 정리
        window.history.replaceState({}, '', '/chat')
    }
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter> {/* BrowserRouter로 App 감싸기 */}
            <App />
        </BrowserRouter>
    </StrictMode>,
)
