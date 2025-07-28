import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import naverLogo from '../assets/images/Naver_Logo.png';
import welcomeImage from '../assets/images/welcome_image.png';

const SocialLoginPage = () => { // setIsLoggedIn prop 제거
  const navigate = useNavigate();
  const location = useLocation();

  const API_BASE = (import.meta.env?.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL.trim())
      ? import.meta.env.VITE_API_BASE_URL.trim().replace(/\/$/, '')
      : '/api';

  const handleNaverLogin = () => {
    window.location.href = `${API_BASE}/auth/login`;
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('accessToken', token);
      // setIsLoggedIn(true); // 제거
      navigate('/chat');
    }
  }, [location, navigate]); // setIsLoggedIn 제거

  return (
      <div className="fixed inset-0 bg-blue-600">
        <div className="flex flex-col items-center justify-between w-full h-screen p-4">
          <div className="w-full max-w-sm text-center text-white text-3xl sm:text-4xl md:text-[40px] font-normal font-Jalnan_2 leading-tight
  sm:leading-normal md:leading-[40px] tracking-[0.01em] mt-16">
            여행자의 좋은 친구<br/>여행자비스 입니다!
          </div>

          <div onClick={handleNaverLogin} className="w-80 h-12 px-5 bg-green-600 rounded-[5px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.20)] inline-flex
  justify-center items-center gap-2.5 overflow-hidden">
            <div className="flex justify-start items-center gap-2.5">
              <img src={naverLogo} alt="네이버로고"/>
              <div
                  className="text-center justify-center text-white text-base font-extrabold font-['Pretendard_GOV'] tracking-tight">네이버로 간편 로그인
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-y-8">
            <img src={welcomeImage} alt="웰컴이미지" className="max-w-full h-auto"/>
          </div>
        </div>
      </div>
  );
};

export default SocialLoginPage;