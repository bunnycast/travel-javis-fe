import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import MessageList from '../components/chat/MessageList';
import ChatInput from '../components/chat/ChatInput';

const ChatPage = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: '안녕하세요! 첫 번째 메시지입니다.', sender: 'bot', type: 'text' },
    { id: 2, text: '네, 안녕하세요! 사용자의 메시지입니다.', sender: 'user', type: 'text' },
    { id: 3, text: '이곳에 지도를 표시할 수 있습니다.', sender: 'bot', type: 'map' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (window.visualViewport) {
      const handleResize = () => {
        const viewportHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        const currentKeyboardHeight = windowHeight - viewportHeight;
        setKeyboardHeight(currentKeyboardHeight > 0 ? currentKeyboardHeight : 0);
      };

      window.visualViewport.addEventListener('resize', handleResize);
      handleResize(); // 초기 로드 시 한 번 실행

      return () => {
        window.visualViewport.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const newMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      type: 'text',
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputValue('');
  };

  return (
    <div 
      className="w-full h-screen bg-white overflow-hidden flex flex-col"
      style={{ '--keyboard-height': `${keyboardHeight}px` }}
    >
      <Header />
      <MessageList messages={messages} />
      <ChatInput 
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onSend={handleSendMessage}
      />
    </div>
  );
};

export default ChatPage;
