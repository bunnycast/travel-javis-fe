import React, { useState, useEffect, useMemo, useRef } from 'react';
import IconButton from '../ui/IconButton';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';

import searchIcon from '../../assets/icons/search.svg';
import profileDefaultImage from '../../assets/images/default-profile.svg';
import dotMenuIcon from '../../assets/icons/dot_menu.svg'; // 점 메뉴 아이콘 임포트

// ConversationOptionsPopup 컴포넌트 임포트
import ConversationOptionsPopup from '../ui/ConversationOptionsPopup';

// 날짜 포맷팅 헬퍼 함수
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const dayOfWeek = days[date.getDay()];
    return `${year}/${month}/${day} (${dayOfWeek})`;
};

const Sidebar = ({ isOpen, onClose, conversations, fetchConversations, fetchCurrentConversationTitle }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const navigate = useNavigate();

    // 선언 누락 보완: 길게누르기 타이머
    const longPressTimer = useRef(null);

    // API 베이스 URL: .env.production 의 VITE_API_BASE_URL 사용, 없으면 '/api'
    const API_BASE = (import.meta.env?.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL.trim())
        ? import.meta.env.VITE_API_BASE_URL.trim().replace(/\/$/, '')
        : '/api';
    const url = (path) => `${API_BASE}${path}`;

    // 팝업 관련 상태
    const [showPopup, setShowPopup] = useState(false);
    const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    // longPressTimer는 이제 필요 없으므로 제거

    // 컴포넌트 마운트 시 대화 목록 불러오기
    useEffect(() => {
        fetchConversations();
    }, []);

    // Fuse.js 설정 (keys에서 'path' 제거, 'created_at' 추가)
    const fuse = useMemo(() => {
        return new Fuse(conversations, {
            keys: ['title', 'created_at'], // 'path' 대신 'created_at' 추가
            threshold: 0.5,
            includeScore: true,
            includeMatches: true,
        });
    }, [conversations]);

    // 검색어 디바운싱
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);

        return () => {
            clearTimeout(timerId);
        };
    }, [searchTerm]);

    // 필터링된 대화 목록
    const filteredConversations = useMemo(() => {
        if (!debouncedSearchTerm) {
            return conversations;
        }
        return fuse.search(debouncedSearchTerm).map(result => result.item);
    }, [debouncedSearchTerm, conversations, fuse]);

    // 길게 누르기 시작
    const handleLongPressStart = (e, convId) => {
        // 마우스 오른쪽 버튼 클릭 방지 (컨텍스트 메뉴 기본 동작)
        e.preventDefault();
        // 터치 이벤트의 경우, 기본 스크롤 동작 방지
        if (e.type === 'touchstart') {
            e.stopPropagation();
        }

        setSelectedConversationId(convId);
        // 팝업 위치 설정 (클릭/터치 위치)
        setPopupPosition({ x: e.clientX || e.touches[0].clientX, y: e.clientY || e.touches[0].clientY });

        longPressTimer.current = setTimeout(() => {
            setShowPopup(true); // 팝업 표시
        }, 500); // 500ms 이상 누르면 길게 누르기로 간주
    };

    // 길게 누르기 종료 (마우스 떼거나 터치 끝)
    const handleLongPressEnd = () => {
        clearTimeout(longPressTimer.current);
    };

    // 길게 누르기 취소 (드래그 등)
    const handleLongPressCancel = () => {
        clearTimeout(longPressTimer.current);
        setShowPopup(false); // 팝업 숨김
        setSelectedConversationId(null);
    };

    // 대화 항목 클릭 (페이지 이동)
    const handleConversationClick = (convId) => {
        navigate(`/chat/${convId}`);
        onClose();
    };

    // 점 메뉴 버튼 클릭 시 팝업 열기
    const handleOpenOptionsPopup = (e, convId) => {
        e.stopPropagation(); // 대화 항목 클릭 이벤트 전파 방지
        setSelectedConversationId(convId);
        // 버튼의 위치를 기준으로 팝업 위치 설정
        const rect = e.currentTarget.getBoundingClientRect();
        setPopupPosition({ x: rect.right, y: rect.top }); // 버튼 오른쪽 상단에 팝업 표시
        setShowPopup(true);
    };

    // 팝업 닫기
    const handleClosePopup = () => {
        setShowPopup(false);
        setSelectedConversationId(null);
    };

    // 제목 수정 기능 (백엔드 API 호출 필요)
    const handleEditTitle = async () => {
        if (selectedConversationId) {
            const newTitle = prompt("새로운 대화 제목을 입력하세요:", "새 제목");
            if (newTitle !== null && newTitle.trim() !== '') {
                try {
                    const response = await fetch(url(`/conversations/${selectedConversationId}`), {
                        method: 'PUT',
                        headers: {
                            'accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ title: newTitle }),
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

          fetchConversations(); // 대화 목록 갱신
          fetchCurrentConversationTitle(); // 현재 대화 제목 갱신
                    alert("대화 제목이 성공적으로 변경되었습니다.");
                } catch (err) {
                    console.error("대화 제목 수정 실패:", err);
                    alert(`대화 제목 수정에 실패했습니다: ${err.message}`);
                }
            }
        }
        handleClosePopup();
    };

    // 대화 삭제 기능 (백엔드 API 호출 필요)
    const handleDeleteConversation = async () => {
        if (selectedConversationId && window.confirm("정말로 이 대화를 삭제하시겠습니까?")) {
            try {
                const response = await fetch(url(`/conversations/${selectedConversationId}`), {
                    method: 'DELETE',
                    headers: { 'accept': 'application/json' },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                fetchConversations();
                alert("대화가 성공적으로 삭제되었습니다.");

                if (window.location.pathname.includes(selectedConversationId)) {
                    navigate('/');
                }
            } catch (err) {
                console.error("대화 삭제 실패:", err);
                alert(`대화 삭제에 실패했습니다: ${err.message}`);
            }
        }
        handleClosePopup();
    };

    return (
        <div
            className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-20 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            onMouseUp={handleLongPressEnd}
            onMouseLeave={handleLongPressCancel}
            onTouchEnd={handleLongPressEnd}
            onTouchCancel={handleLongPressCancel}
        >
            {/* Sidebar Header (Search Input) */}
            <div className="p-4 border-b">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="대화 검색"
                        className="w-full p-2 pl-10 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <img src={searchIcon} alt="검색" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto p-4">
                {conversations.length === 0 && (
                    <p className="text-medium-gray">대화가 없습니다.</p>
                )}
                {filteredConversations.length > 0 && filteredConversations.map(conv => (
                    <div
                        key={conv.id}
                        className="p-3 mb-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleConversationClick(conv.id)}
                        onMouseDown={(e) => handleLongPressStart(e, conv.id)}
                        onTouchStart={(e) => handleLongPressStart(e, conv.id)}
                    >
                        <div className="flex justify-between items-center"> {/* 제목과 버튼을 위한 flex 컨테이너 */}
                            <h4 className="font-semibold text-dark-gray">{conv.title}</h4>
                            <IconButton
                                onClick={(e) => handleOpenOptionsPopup(e, conv.id)}
                                className="ml-2" // 제목과의 간격
                            >
                                <img src={dotMenuIcon} alt="옵션" className="h-4 w-4 text-gray-400" /> {/* 아이콘 크기 및 색상 조정 */}
                            </IconButton>
                        </div>
                        <p className="text-sm text-medium-gray truncate">{formatDate(conv.created_at)}</p>
                    </div>
                ))}
            </div>

            {/* Sidebar Footer (Profile) */}
            <div className="p-4 border-t flex items-center justify-between">
                <div className="flex items-center">
                    <img src={profileDefaultImage} alt="프로필" className="w-10 h-10 rounded-full mr-2" />
                    <span className="font-semibold text-dark-gray">Javis Kim</span>
                </div>
                <IconButton onClick={() => console.log('마이페이지 이동')}>
                    <img src={dotMenuIcon} alt="마이페이지" className="h-5 w-5 text-medium-gray" />
                </IconButton>
            </div>

            {showPopup && (
                <ConversationOptionsPopup
                    position={popupPosition}
                    onClose={handleClosePopup}
                    onEditTitle={handleEditTitle}
                    onDeleteConversation={handleDeleteConversation}
                />
            )}
        </div>
    );
};

export default Sidebar;
