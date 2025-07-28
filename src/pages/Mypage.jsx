import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Mypage = () => {
  const { userId } = useParams(); // URL에서 userId 파라미터 가져오기
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null); // 현재 로그인된 사용자 정보
  const [displayUser, setDisplayUser] = useState(null); // 화면에 표시할 사용자 정보
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
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. 현재 로그인된 사용자 정보 가져오기
        const currentUserRes = await fetch(url('/auth/accounts/me'), {
          headers: getAuthHeaders(),
        });

        if (!currentUserRes.ok) {
          throw new Error('Failed to fetch current user info');
        }
        const currentUserData = await currentUserRes.json();
        setCurrentUser(currentUserData);

        let targetUserId = userId;

        // 2. 접근 권한 확인 및 리다이렉션
        if (targetUserId && currentUserData.id !== targetUserId && !currentUserData.is_admin) {
          // is_admin이 0인 계정이 다른 계정의 마이페이지에 접근 시 본인 페이지로 리다이렉트
          navigate('/mypage', { replace: true });
          targetUserId = currentUserData.id; // 본인 정보 로드
        } else if (!targetUserId) {
          // userId 파라미터가 없으면 본인 페이지로 간주
          targetUserId = currentUserData.id;
        }

        // 3. 화면에 표시할 사용자 정보 가져오기
        const displayUserRes = await fetch(url(`/auth/accounts/${targetUserId}`), {
          headers: getAuthHeaders(),
        });

        if (!displayUserRes.ok) {
          throw new Error('Failed to fetch display user info');
        }
        const displayUserData = await displayUserRes.json();
        setDisplayUser(displayUserData);

      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userId, navigate]); // userId가 변경될 때마다 다시 실행

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <p>사용자 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <p className="text-red-500">오류 발생: {error}</p>
        <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  if (!displayUser) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <p>사용자 정보를 찾을 수 없습니다.</p>
        <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">마이페이지</h1>
      <img
        src={displayUser.profileImage || 'https://via.placeholder.com/150'} // 기본 이미지 추가
        alt="프로필 이미지"
        className="w-32 h-32 rounded-full mb-4 object-cover"
      />
      <p className="text-xl font-semibold mb-2">닉네임: {displayUser.nickname || '정보 없음'}</p>
      <p className="text-gray-700 mb-2">이메일: {displayUser.email || '정보 없음'}</p>
      <p className="text-gray-700 mb-2">전화번호: {displayUser.phone || '정보 없음'}</p>
      <p className="text-gray-700 mb-2">관리자 여부: {displayUser.is_admin ? '예' : '아니오'}</p>
      {currentUser && currentUser.id === displayUser.id && (
        <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded">
          내 정보 수정 (구현 예정)
        </button>
      )}
    </div>
  );
};

export default Mypage;