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
    <main className="absolute top-9 bottom-[72px] left-0 right-0 overflow-y-auto p-4">
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
