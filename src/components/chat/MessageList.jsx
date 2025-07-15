import React, { useRef, useEffect } from 'react';
import Message from './Message';

/**
 * 메시지 목록을 표시하는 컴포넌트
 * @param {object} props
 * @param {Array<object>} props.messages - 메시지 객체 배열
 */
const MessageList = ({ messages = [] }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // 메시지가 업데이트될 때마다 스크롤

  return (
    <main className="flex-1 overflow-y-auto p-4 pt-16 pb-[calc(5rem+var(--keyboard-height))]"> {/* 헤더, 입력창에 가려지지 않도록 패딩 조정 */}
      {messages.length > 0 ? (
        messages.map(msg => <Message key={msg.id} message={msg} />)
      ) : (
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-400">Javis에게 무엇이든 물어보세요.</p>
        </div>
      )}
      <div ref={messagesEndRef} /> {/* 스크롤 위치를 위한 빈 div */}
    </main>
  );
};

export default MessageList;