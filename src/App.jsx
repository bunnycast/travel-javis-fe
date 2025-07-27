import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ChatPage from './pages/ChatPage';
import SocialLoginPage from './pages/SocialLoginPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리

  // 로그인 여부에 따라 페이지 접근을 제어하는 컴포넌트
  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/" replace />; // 로그인되지 않았다면 루트 페이지(로그인 페이지)로 리디렉션
    }
    return children;
  };

  return (
    <div 
      className="max-w-md mx-auto overflow-hidden h-full"
    >
      <Routes>
        {/* 루트 경로를 SocialLoginPage로 설정 */}
        <Route path="/" element={<SocialLoginPage setIsLoggedIn={setIsLoggedIn} />} />

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
