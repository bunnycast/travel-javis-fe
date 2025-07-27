import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // useLocation 추가

const SocialLoginPage = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const location = useLocation(); // useLocation 훅 사용

  const API_BASE = (import.meta.env?.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL.trim())
    ? import.meta.env.VITE_API_BASE_URL.trim().replace(/\/$/, '')
    : '/api';

  // 네이버 로그인 시작 (백엔드 리디렉션)
  const handleNaverLogin = () => {
    window.location.href = `${API_BASE}/auth/naver/login`;
  };

  // 콜백 URL 처리
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const state = params.get('state');

    if (code && state) {
      // 백엔드 콜백 API 호출
      const handleNaverCallback = async () => {
        try {
          const response = await fetch(`${API_BASE}/auth/naver/callback`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, state }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          // 백엔드에서 토큰을 'access_token' 필드로 반환한다고 가정
          if (data.access_token) {
            localStorage.setItem('accessToken', data.access_token); // 토큰 저장
            setIsLoggedIn(true); // 로그인 상태 업데이트
            navigate('/chat'); // 채팅 페이지로 리디렉션
          } else {
            alert('로그인 실패: 토큰을 받지 못했습니다.');
          }
        } catch (error) {
          console.error('네이버 콜백 처리 중 오류 발생:', error);
          alert(`로그인 처리 중 오류 발생: ${error.message}`);
          // 오류 발생 시 로그인 페이지에 머무르거나 적절한 처리
        }
      };
      handleNaverCallback();
    }
  }, [location, navigate, setIsLoggedIn, API_BASE]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-dark-gray mb-8">소셜 로그인</h1>
      <button
        onClick={handleNaverLogin}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out"
      >
        네이버로 로그인
      </button>
      {/* 다른 소셜 로그인 버튼들을 여기에 추가할 수 있습니다. */}
    </div>
  );
};

export default SocialLoginPage;
