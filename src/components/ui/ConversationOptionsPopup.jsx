import React from 'react';
import Option from './Option'; // Option 컴포넌트 임포트
import editTitleIcon from '../../assets/icons/edit_title.svg';
import trashIcon from '../../assets/icons/trash.svg';
import summaryIcon from '../../assets/icons/document.svg';

const ConversationOptionsPopup = ({ position, onClose, onEditTitle, onDeleteConversation, onSummarizeConversation }) => {
  const popupStyle = {
    top: position.y,
    left: position.x,
  };

  return (
    <div
      className="fixed inset-0 z-30"
      onClick={onClose}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div
        className="absolute bg-white rounded-lg shadow-lg p-1 z-40 min-w-[120px]"
        style={popupStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <Option text="제목 수정" iconSrc={editTitleIcon} onClick={onEditTitle} />
        <Option text="대화 요약" iconSrc={summaryIcon} onClick={onSummarizeConversation} />
        <Option text="대화 삭제" iconSrc={trashIcon} onClick={onDeleteConversation} textColorClass="text-red-600" />
      </div>
    </div>
  );
};

export default ConversationOptionsPopup;
