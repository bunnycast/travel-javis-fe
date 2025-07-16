import React, { useState, useEffect } from 'react';
import IconButton from '../ui/IconButton';
import { useNavigate } from 'react-router-dom'; // useNavigate 임포트
import Fuse from 'fuse.js'; // Fuse 임포트

// 임시 아이콘 경로 (나중에 실제 에셋으로 교체)
import searchIcon from '../../assets/icons/search.svg';
import profileDefaultImage from '../../assets/images/default-profile.svg'; // 기본 프로필 이미지
import dotMenuIcon from '../../assets/icons/dot_menu.svg';

const Sidebar = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(''); // 디바운싱된 검색어
  const navigate = useNavigate(); // useNavigate 훅 사용

  // 임시 대화 목록 데이터
  const conversations = [
      { id: 1, title: '제주도 여행 계획', lastMessage: '숙소 추천해줘' },
      { id: 2, title: '유럽 배낭여행 예산', lastMessage: '항공권 가격은?' },
      { id: 3, title: '일본 맛집 탐방', lastMessage: '오사카 맛집 리스트' },
      { id: 4, title: '동남아 해변 휴양', lastMessage: '푸켓 리조트 어때?' },
      { id: 5, title: '미국 서부 로드트립', lastMessage: 'LA 출발 일정 공유해줘' },
      { id: 6, title: '유럽 크리스마스 마켓', lastMessage: '독일 베를린 일정 짜줘' },
      { id: 7, title: '아이와 함께 해외여행', lastMessage: '추천 도시 있을까?' },
      { id: 8, title: '호주 워킹홀리데이', lastMessage: '시드니 숙소 정보?' },
      { id: 9, title: '중남미 배낭여행', lastMessage: '치안 괜찮은 지역은?' },
      { id: 10, title: '캐나다 단풍 여행', lastMessage: '몬트리올 일정 어떠케짜?' }
  ];

  /**
   * Fuse.js 설정 객체
   * - `keys`: 검색을 수행할 필드들을 배열로 지정합니다. 여기에 지정된 필드들에서만 검색이 이루어집니다.
   * - `threshold`: 일치 임계값입니다. **0.0 (완벽 일치)부터 1.0 (어떤 것이든 일치) 사이의 값**을 가집니다.
   *   - **값이 낮을수록 (0.0에 가까울수록):** 더 엄격한 검색 결과를 반환합니다. 검색어와 거의 완벽하게 일치하는 항목만 찾습니다. 오타나 불일치를 거의 허용하지 않습니다.
   *   - **값이 높을수록 (1.0에 가까울수록):** 더 많은 (덜 정확한) 결과를 반환합니다. 검색어와 유사성이 낮은 항목도 포함될 수 있으며, 오타나 불일치를 더 많이 허용합니다.
   *   - 일반적으로 0.3 ~ 0.6 사이의 값이 좋은 균형을 제공합니다.
   * - `includeScore`: 검색 결과에 각 항목의 일치 점수(0.0 ~ 1.0)를 포함할지 여부를 결정합니다.
   *   점수가 낮을수록 더 정확한 일치를 의미합니다.
   * - `includeMatches`: 검색된 텍스트의 어느 부분이 일치하는지 상세 정보를 포함할지 여부를 결정합니다.
   *   디버깅이나 일치하는 부분을 강조 표시할 때 유용합니다.
   */
  const fuse = new Fuse(conversations, {
    keys: ['title', 'lastMessage'], // 대화 제목과 마지막 메시지에서 검색
    threshold: 0.5, // 0.3: 어느 정도의 오타나 불일치를 허용하면서도 관련성 높은 결과 유지
    includeScore: true, // 각 결과의 일치 점수를 확인하여 검색 품질을 평가할 수 있도록 포함
    includeMatches: true, // 어떤 부분이 일치했는지 상세 정보를 포함 (디버깅 및 강조 표시용)
  });

  /**
   * 검색어 디바운싱 (Debouncing) 처리
   * 사용자가 `searchTerm`을 입력할 때마다 바로 검색을 실행하지 않고,
   * 일정 시간(300ms) 동안 추가 입력이 없을 경우에만 `debouncedSearchTerm`을 업데이트합니다.
   * 이를 통해 불필요한 검색 연산(특히 백엔드 API 호출)을 줄여 성능을 최적화합니다.
   * 
   * - `searchTerm`이 변경될 때마다 `setTimeout` 타이머를 설정합니다.
   * - `useEffect`의 클린업 함수(`return () => { ... }`)는 이전 타이머를 취소하여,
   *   사용자가 빠르게 타이핑할 경우 이전 타이머가 만료되기 전에 새로운 타이머가 설정되도록 합니다.
   * - 최종적으로 사용자가 입력을 멈춘 후에만 `debouncedSearchTerm`이 업데이트되고,
   *   이를 기반으로 `filteredConversations`가 재계산됩니다.
   */
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms 지연

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  // 필터링된 대화 목록 (Fuse.js 사용)
  // `debouncedSearchTerm`이 비어있지 않으면 Fuse.js로 검색을 수행하고,
  // 결과에서 `item` (원본 데이터)만 추출합니다.
  // 검색어가 없으면 전체 `conversations` 목록을 반환합니다.
  const filteredConversations = debouncedSearchTerm
    ? fuse.search(debouncedSearchTerm).map(result => {
        console.log('Fuse.js Search Result:', result); // 검색 결과 디버깅용 로그
        return result.item;
      })
    : conversations; // 검색어가 없으면 전체 목록 반환

  const handleConversationClick = (conversationId) => {
    navigate(`/chat/${conversationId}`); // 해당 대화 경로로 이동
    onClose(); // 사이드바 닫기
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
            <img src={searchIcon} alt="검색"
                 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"/>
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredConversations.map(conv => (
              <div
                  key={conv.id}
                  className="p-3 mb-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleConversationClick(conv.id)} // 클릭 이벤트 추가
              >
                <h4 className="font-semibold text-dark-gray">{conv.title}</h4>
                <p className="text-sm text-medium-gray truncate">{conv.lastMessage}</p>
              </div>
          ))}
        </div>

        {/* Sidebar Footer (Profile) */}
        <div className="p-4 border-t flex items-center justify-between">
          <div className="flex items-center">
            <img src={profileDefaultImage} alt="프로필" className="w-10 h-10 rounded-full mr-2"/>
            <span className="font-semibold text-dark-gray">Javis Kim</span>
          </div>
          <IconButton onClick={() => console.log('마이페이지 이동')}>
            <img src={dotMenuIcon} alt="마이페이지" className="h-5 w-5 text-medium-gray"/>
          </IconButton>
        </div>
      </div>
  );
}

export default Sidebar;
