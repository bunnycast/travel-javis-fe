import React, { useState, useEffect, useMemo, useRef } from 'react'; // useRef 임포트
import IconButton from '../ui/IconButton';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';

import searchIcon from '../../assets/icons/search.svg';
import profileDefaultImage from '../../assets/images/default-profile.svg';
import dotMenuIcon from '../../assets/icons/dot_menu.svg';

// ConversationOptionsPopup 컴포넌트 임포트 (새로 생성할 파일)
import ConversationOptionsPopup from '../ui/ConversationOptionsPopup';

const Sidebar = ({ isOpen, onClose, conversations, fetchConversations }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const navigate = useNavigate();

    // 팝업 관련 상태
    const [showPopup, setShowPopup] = useState(false);
    const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const longPressTimer = useRef(null); // 길게 누르기 타이머

    // 컴포넌트 마운트 시 대화 목록 불러오기
    useEffect(() => {
        fetchConversations();
    }, []);

    // Fuse.js 설정
    const fuse = useMemo(() => {
        return new Fuse(conversations, {
            keys: ['title', 'path'],
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

    // 대화 항목 클릭 (짧게 클릭)
    const handleConversationClick = (convId) => {
        // 길게 누르기 이벤트가 발생하지 않았을 때만 페이지 이동
        if (!longPressTimer.current) { // 타이머가 설정되지 않았거나 이미 클리어된 경우
            navigate(`/chat/${convId}`);
            onClose();
        }
        clearTimeout(longPressTimer.current); // 혹시 모를 타이머 클리어
    };

    // 팝업 닫기
    const handleClosePopup = () => {
        setShowPopup(false);
        setSelectedConversationId(null);
    };

    // 제목 수정 기능 (백엔드 API 호출 필요)
    const handleEditTitle = async () => { // async 키워드 추가
    if (selectedConversationId) {
      const newTitle = prompt("새로운 대화 제목을 입력하세요:", "새 제목");
      if (newTitle !== null && newTitle.trim() !== '') {
        try {
          const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
          const response = await fetch(`${API_BASE_URL}/conversations/${selectedConversationId}`, {
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

          // API 호출 성공 후 대화 목록 갱신
          fetchConversations();
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
    const handleDeleteConversation = async () => { // async 키워드 추가
    if (selectedConversationId && window.confirm("정말로 이 대화를 삭제하시겠습니까?")) {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
        const response = await fetch(`${API_BASE_URL}/conversations/${selectedConversationId}`, {
          method: 'DELETE',
          headers: {
            'accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // API 호출 성공 후 대화 목록 갱신
        fetchConversations();
        alert("대화가 성공적으로 삭제되었습니다.");

        // 현재 보고 있는 대화가 삭제된 경우, 메인 페이지로 이동
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
                        onMouseDown={(e) => handleLongPressStart(e, conv.id)} // 마우스 길게 누르기
                        onMouseUp={handleLongPressEnd}
                        onMouseLeave={handleLongPressCancel} // 마우스가 요소를 벗어날 때 취소
                        onTouchStart={(e) => handleLongPressStart(e, conv.id)} // 터치 길게 누르기
                        onTouchEnd={handleLongPressEnd}
                        onTouchCancel={handleLongPressCancel}
                    >
                        <h4 className="font-semibold text-dark-gray">{conv.title}</h4>
                        <p className="text-sm text-medium-gray truncate">{conv.path}</p>
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
