import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import closeIcon from '../assets/icons/close.svg'; // X 아이콘 임포트

const Mypage = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null); // 사용자 정보
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = (import.meta.env?.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL.trim())
      ? import.meta.env.VITE_API_BASE_URL.trim().replace(/\/$/, '')
      : '/api';
  const url = (path) => `${API_BASE}${path}`;

  const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'accept': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  useEffect(() => {
    if (!isOpen) { // 모달이 닫혀있으면 데이터 로드 안함
      return;
    }

    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url('/auth/accounts/me'), {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        const data = await response.json();
        setUserProfile(data);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [isOpen]); // isOpen 상태가 변경될 때마다 실행

  const handleLogout = () => {
    localStorage.removeItem('accessToken'); // 토큰 삭제
    navigate('/', { replace: true }); // 로그인 페이지로 리디렉션
    onClose(); // 마이페이지 모달 닫기
  };

  // 가입일 포맷팅 함수
  const formatJoinDate = (dateString) => {
    if (!dateString) return '정보 없음';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!isOpen) return null; // 모달이 닫혀있으면 아무것도 렌더링하지 않음

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-end justify-center">
      <div
        className={`bg-white w-full max-w-md h-3/4 rounded-t-3xl shadow-lg p-6 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Close Button */}
        <div className="flex justify-end mb-4">
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
            <img src={closeIcon} alt="닫기" className="h-6 w-6" />
          </button>
        </div>

        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <p>사용자 정보를 불러오는 중...</p>
          </div>
        )}

        {error && (
          <div className="flex-1 flex items-center justify-center flex-col">
            <p className="text-red-500 mb-2">오류 발생: {error}</p>
            <button onClick={onClose} className="px-4 py-2 bg-blue-500 text-white rounded">
              닫기
            </button>
          </div>
        )}

        {userProfile && !loading && !error && (
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* Profile Image */}
            <img
              src={userProfile.profileImage || 'https://via.placeholder.com/150'}
              alt="프로필 이미지"
              className="w-24 h-24 rounded-full mb-4 object-cover"
            />
            {/* Nickname */}
            <span className="text-xl font-semibold mb-2">닉네임: {userProfile.nickname || '정보 없음'}</span>
            {/* Name (추가된 부분) */}
            <p className="text-gray-700 mb-1">이름: {userProfile.name || '이름 없음'}</p>
            {/* Email */}
            <p className="text-gray-700 mb-1">이메일: {userProfile.email || '정보 없음'}</p>
            {/* Join Date */}
            <p className="text-gray-700 mb-4">가입일: {formatJoinDate(userProfile.created_at)}</p>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="mt-6 px-6 py-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-colors"
            >
              로그아웃
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mypage;