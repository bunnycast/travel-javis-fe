
import React from 'react';

/**
 * 개별 메시지 컴포넌트
 * @param {object} props
 * @param {object} props.message - 메시지 객체 { id, text, sender, type }
 */
const Message = ({ message }) => {
  const { text, sender, type } = message;

  const isUser = sender === 'user';

  // 메시지 타입에 따른 스타일 분기
  const userBubbleStyle = 'bg-blue-500 text-white self-end'; // 사용자 메시지 색상
  const botBubbleStyle = 'bg-gray-200 text-gray-800 self-start'; // 봇 메시지 색상

  const bubbleClasses = `max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl break-words ${isUser ? userBubbleStyle : botBubbleStyle}`;

  const renderContent = () => {
    switch (type) {
      case 'map':
        return (
          <div>
            <p className="mb-2">{text}</p>
            <div className="bg-gray-300 h-40 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">네이버 지도 (Embed)</span>
            </div>
          </div>
        );
      case 'text':
      default:
        return <p>{text}</p>;
    }
  };

  return (
    <div className={`flex w-full my-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div className={bubbleClasses}>
            {renderContent()}
        </div>
    </div>
  );
};

export default Message;
