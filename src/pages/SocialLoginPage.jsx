import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // useLocation 추가
import naverLogo from '../assets/images/Naver_Logo.png';
import welcomeImage from '../assets/images/welcome_Image.png';

const SocialLoginPage = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const location = useLocation(); // useLocation 훅 사용

  const API_BASE = (import.meta.env?.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL.trim())
      ? import.meta.env.VITE_API_BASE_URL.trim().replace(/\/$/, '')
      : '/api';

  // 네이버 로그인 시작 (백엔드 리디렉션)
  const handleNaverLogin = () => {
    window.location.href = `${API_BASE}/auth/login`;
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
          const response = await fetch(`${API_BASE}/auth/callback`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({code, state}),
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
      <div className="fixed inset-0 bg-blue-600"> {/* 배경색만 전체 화면에 칠하도록 fixed inset-0 */}
        <div className="flex flex-col items-center justify-between w-full h-screen p-4"> {/* 기존 콘텐츠 컨테이너 */}
          {/* 텍스트 박스 - 상단에 배치하고 mt-16으로 여백 */}
          <div className="w-full max-w-sm text-center text-white text-3xl sm:text-4xl md:text-[40px] font-normal font-['Jalnan_2'] leading-tight
  sm:leading-normal md:leading-[40px] tracking-[0.01em] mt-16">
            여행자의 좋은 친구<br/>여행자비스 입니다!
          </div>

          {/* 웰컴 이미지와 로그인 버튼을 감싸는 컨테이너 - 남은 공간을 채우고 중앙 정렬 */}
          {/* 네이버 로그인 버튼 */}
          <div onClick={handleNaverLogin} className="w-80 h-12 px-5 bg-green-600 rounded-[5px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.20)] inline-flex
  justify-center items-center gap-2.5 overflow-hidden">
            <div className="flex justify-start items-center gap-2.5">
              <img src={naverLogo} alt="네이버로고"/>
              <div
                  className="text-center justify-center text-white text-base font-extrabold font-['Pretendard_GOV'] tracking-tight">네이버로 간편 로그인
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-y-8"> {/* gap-y-8로 이미지와 버튼 사이 간격 추가 */}
            {/* 웰컴 이미지 */}
            <img src={welcomeImage} alt="웰컴이미지" className="max-w-full h-auto"/>

          </div>
        </div>
      </div>
  );
};

export default SocialLoginPage;
