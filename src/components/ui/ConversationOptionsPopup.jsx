import React from 'react';
import editTitleIcon from '../../assets/icons/edit_title.svg'; // 아이콘 임포트
import trashIcon from '../../assets/icons/trash.svg'; // 아이콘 임포트
import summaryIcon from '../../assets/icons/document.svg'; // 대화 요약 아이콘 임포트

const ConversationOptionsPopup = ({ position, onClose, onEditTitle, onDeleteConversation, onSummarizeConversation }) => { // onSummarizeConversation prop 추가
  // 팝업 위치 스타일
  const popupStyle = {
    top: position.y,
    left: position.x,
  };

  return (
    <div
      className="fixed inset-0 z-30" // 전체 화면을 덮는 오버레이
      onClick={onClose} // 오버레이 클릭 시 팝업 닫기
      onContextMenu={(e) => e.preventDefault()} // 오른쪽 클릭 메뉴 방지
    >
      <div
        className="absolute bg-white rounded-lg shadow-lg p-1 z-40 min-w-[120px]" // p-2 -> p-1, min-w 추가
        style={popupStyle}
        onClick={(e) => e.stopPropagation()} // 팝업 내부 클릭 시 오버레이로 이벤트 전파 방지
      >
        <button
          className="flex items-center w-full text-left px-2 py-1 text-gray-800 hover:bg-gray-100 rounded-md text-xs whitespace-nowrap" // px-4 py-2 -> px-2 py-1, text-sm -> text-xs, whitespace-nowrap 추가
          onClick={onEditTitle}
        >
          <img src={editTitleIcon} alt="제목 수정" className="w-3 h-3 mr-1" /> {/* 아이콘 크기 및 간격 조정 */}
          제목 수정
        </button>
        {/* 대화 요약 버튼 추가 */}
        <button
          className="flex items-center w-full text-left px-2 py-1 text-gray-800 hover:bg-gray-100 rounded-md text-xs whitespace-nowrap"
          onClick={onSummarizeConversation}
        >
          <img src={summaryIcon} alt="대화 요약" className="w-3 h-3 mr-1" />
          대화 요약
        </button>
        <button
          className="flex items-center w-full text-left px-2 py-1 text-red-600 hover:bg-red-50 rounded-md text-xs whitespace-nowrap" // px-4 py-2 -> px-2 py-1, text-sm -> text-xs, whitespace-nowrap 추가
          onClick={onDeleteConversation}
        >
          <img src={trashIcon} alt="대화 삭제" className="w-3 h-3 mr-1" /> {/* 아이콘 크기 및 간격 조정 */}
          대화 삭제
        </button>
      </div>
    </div>
  );
};

export default ConversationOptionsPopup;
