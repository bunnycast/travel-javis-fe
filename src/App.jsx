import React from 'react'; // useState, useEffect 제거
import { Routes, Route, Navigate } from 'react-router-dom';
import SocialLoginPage from './pages/SocialLoginPage';
import ChatPage from './pages/ChatPage';


function App() {
  // isLoggedIn 상태 제거

  // 보호 라우트
  const ProtectedRoute = ({ children }) => {
    const isLoggedIn = !!localStorage.getItem('accessToken'); // localStorage에서 직접 확인
    if (!isLoggedIn) return <Navigate to="/" replace />;
    return children;
  };

  return (
      <div
          className="max-w-md mx-auto overflow-hidden h-full"
      >
        <Routes>
          {/* 루트 경로를 SocialLoginPage로 설정 */}
          <Route
            path="/"
            element={!!localStorage.getItem('accessToken') ? <Navigate to="/chat" replace /> : <SocialLoginPage />}
          />

          {/* 로그인된 사용자만 접근 가능한 페이지 */}
          <Route
              path="/chat/:conversationId"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
          />
          {/* /chat 경로도 ProtectedRoute로 감싸서 로그인 없이는 접근 불가하도록 설정 */}
          <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
          />
          
          {/* 정의되지 않은 모든 경로를 루트 페이지로 리디렉션 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
  );
}

export default App;