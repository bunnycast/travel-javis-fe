import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SocialLoginPage from './pages/SocialLoginPage';
import ChatPage from './pages/ChatPage';

function App() {
  // isLoggedIn 상태를 localStorage의 토큰 존재 여부에 따라 초기화
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('accessToken') ? true : false;
  });

  // ProtectedRoute 컴포넌트 정의 (App.jsx 내부에 두거나 별도 파일로 분리)
  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/" replace />; // 로그인되지 않았다면 루트 페이지(로그인 페이지)로 리디렉션
    }
    return children;
  };

  // SocialLoginPage에서 setIsLoggedIn이 호출될 때 상태 업데이트 확인용
  useEffect(() => {
    console.log("isLoggedIn 상태 변경됨:", isLoggedIn);
  }, [isLoggedIn]);


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
