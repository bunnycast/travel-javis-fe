import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // useNavigate, useParams 임포트
import { v4 as uuidv4 } from 'uuid'; // uuid 임포트
import Header from '../components/layout/Header';
import MessageList from '../components/chat/MessageList';
import ChatInput from '../components/chat/ChatInput';
import Sidebar from '../components/layout/Sidebar'; // Sidebar 임포트

const ChatPage = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: '안녕하세요! 첫 번째 메시지입니다.', sender: 'bot', type: 'text' },
    { id: 2, text: '네, 안녕하세요! 사용자의 메시지입니다.', sender: 'user', type: 'text' },
    { id: 3, text: '이곳에 지도를 표시할 수 있습니다.', sender: 'bot', type: 'map' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar 상태 추가
  const navigate = useNavigate(); // useNavigate 훅 사용
  const { conversationId } = useParams(); // URL 파라미터 읽기

  // 새로운 대화 시작 함수
  const startNewConversation = () => {
    const newId = uuidv4(); // 난수 ID 생성
    navigate(`/chat/${newId}`); // 난수 ID를 포함한 URL로 이동
    setMessages([]); // 새 대화이므로 메시지 초기화
    setInputValue('');
    // TODO: 백엔드에 새 대화 생성 요청 (newId 전달)
  };

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

  // conversationId가 변경될 때마다 해당 대화 로드 (API 호출)
  useEffect(() => {
    if (conversationId) {
      console.log(`Loading conversation: ${conversationId}`);
      // TODO: 백엔드 API를 호출하여 해당 conversationId의 메시지 로드
      // setMessages(loadedMessages);
    } else {
      // conversationId가 없으면 (예: / 경로) 새 대화 시작
      // startNewConversation(); // 필요하다면 자동으로 새 대화 시작
    }
  }, [conversationId]); // conversationId가 변경될 때마다 실행

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
      className="w-full h-screen bg-white overflow-hidden relative"
      style={{ '--keyboard-height': `${keyboardHeight}px` }}
    >
      <Header onMenuClick={() => setIsSidebarOpen(true)} onNewChatClick={startNewConversation} /> {/* onMenuClick, onNewChatClick prop 추가 */}
      <MessageList messages={messages} />
      <ChatInput 
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onSend={handleSendMessage}
      />
      {/* Sidebar 컴포넌트 추가 */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Sidebar 오버레이 (투명) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-transparent z-10"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default ChatPage;
