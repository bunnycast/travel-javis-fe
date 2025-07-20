import React from 'react';

const ConversationOptionsPopup = ({ position, onClose, onEditTitle, onDeleteConversation }) => {
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
        className="absolute bg-white rounded-lg shadow-lg p-2 z-40"
        style={popupStyle}
        onClick={(e) => e.stopPropagation()} // 팝업 내부 클릭 시 오버레이로 이벤트 전파 방지
      >
        <button
          className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-md"
          onClick={onEditTitle}
        >
          제목 수정
        </button>
        <button
          className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-md"
          onClick={onDeleteConversation}
        >
          대화 삭제
        </button>
      </div>
    </div>
  );
};

export default ConversationOptionsPopup;
