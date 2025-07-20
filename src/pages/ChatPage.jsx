import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // useNavigate, useParams 임포트
import { v4 as uuidv4 } from 'uuid'; // uuid 임포트
import Header from '../components/layout/Header';
import MessageList from '../components/chat/MessageList';
import ChatInput from '../components/chat/ChatInput';
import Sidebar from '../components/layout/Sidebar'; // Sidebar 임포트

const ChatPage = () => {
  const [messages, setMessages] = useState([]); // 초기 메시지 빈 배열로 설정
  const [inputValue, setInputValue] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar 상태 추가
  const [conversations, setConversations] = useState([]); // 대화 목록 상태 추가
  const navigate = useNavigate(); // useNavigate 훅 사용
  const { conversationId } = useParams(); // URL 파라미터 읽기

  // 대화 목록을 불러오는 함수
  const fetchConversations = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${API_BASE_URL}/conversations/`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setConversations(data.conversations || []); // conversations 상태 업데이트
    } catch (err) {
      console.error("대화 목록 불러오기 실패:", err);
      // 사용자에게 에러를 알리거나 다른 방식으로 처리할 수 있습니다.
    }
  };

  // 새로운 대화 시작 함수
  const startNewConversation = async () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false); // 사이드바가 열려있으면 닫기
    }

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${API_BASE_URL}/conversations/`, { // 백엔드 엔드포인트
        method: 'POST',
        headers: {
          'accept': 'application/json',
        },
        body: JSON.stringify({}), // 빈 바디 전송
      });

      console.log(response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const newId = data.conversation_id; // 백엔드에서 반환하는 새로운 대화 ID

      navigate(`/chat/${newId}`); // 새로운 대화 ID를 포함한 URL로 이동
      setMessages([]); // 새 대화이므로 메시지 초기화
      setInputValue('');
      console.log("새 대화 생성 성공:", data);
      fetchConversations(); // 새 대화 생성 후 대화 목록 갱신
    } catch (err) {
      console.error("새 대화 생성 실패:", err);
      alert(`새 대화 생성 실패: ${err.message}`);
    }
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
    const fetchMessages = async () => {
      if (conversationId) {
        console.log(`Loading conversation: ${conversationId}`);
        try {
          const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
          const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`, { // 메시지 가져오는 엔드포인트
            method: 'GET',
            headers: {
              'accept': 'application/json',
            },
          });

          if (response.status === 404) {
            // 새 대화이거나 메시지가 없는 경우, 오류가 아니므로 메시지 목록을 비웁니다.
            setMessages([]);
            return; // 404는 정상 케이스이므로 여기서 함수 종료
          }

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          // 백엔드 응답 구조에 따라 messages 배열을 설정합니다.
          setMessages(data.messages || []); 
          console.log(`Messages for ${conversationId}:`, data.messages);
        } catch (err) {
          console.error(`Failed to load messages for ${conversationId}:`, err);
          alert(`대화 메시지를 불러오는데 실패했습니다: ${err.message}`);
          setMessages([]); // 오류 발생 시 메시지 초기화
        }
      } else {
        // conversationId가 없으면 (예: / 경로) 메시지 목록 비우기
        setMessages([]);
      }
    };

    fetchMessages();
  }, [conversationId]); // conversationId가 변경될 때마다 실행

  // 컴포넌트 마운트 시 대화 목록 초기 로드
  useEffect(() => {
    fetchConversations();
  }, []);

  const handleSendMessage = async (text, imageFile = null) => {
    if (text.trim() === '' && !imageFile) return;

    // 1. 사용자 메시지를 화면에 즉시 표시
    const newMessage = {
      id: uuidv4(), // 고유 ID 생성
      text: text,
      sender: 'user',
      type: imageFile ? 'image' : 'text',
      image: imageFile ? URL.createObjectURL(imageFile) : null, // 미리보기를 위한 URL 생성
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputValue('');

    // 2. API 호출
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
    let endpoint = '';
    let options = {};

    if (imageFile) {
      // 이미지가 있는 경우: /analyze/ API 호출
      endpoint = `${API_BASE_URL}/analyze/`;
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('question', text);
      formData.append('conversation_id', conversationId);
      
      options = {
        method: 'POST',
        body: formData,
        // multipart/form-data의 경우 Content-Type 헤더를 브라우저가 자동으로 설정하도록 둡니다.
      };

    } else {
      // 텍스트만 있는 경우: /chat/ API 호출
      endpoint = `${API_BASE_URL}/chat/`;
      options = {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: text,
          conversation_id: conversationId,
        }),
      };
    }

    console.log('endpoint:', endpoint);

    try {
      const response = await fetch(endpoint, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API 응답:', data);

      // 3. 봇의 응답 메시지를 화면에 표시
      const botMessageText = data.answer || data.content;
      if (botMessageText) {
        const botMessage = {
          id: uuidv4(),
          text: botMessageText,
          sender: 'bot',
          type: 'text',
        };
        setMessages(prevMessages => [...prevMessages, botMessage]);
      } else {
        console.error('API 응답에 content 또는 answer 필드가 없습니다:', data);
      }
      fetchConversations(); // 메시지 전송 후 대화 목록 갱신
    } catch (err) {
      console.error("API 호출 실패:", err);
      alert(`메시지 전송에 실패했습니다: ${err.message}`);
      // TODO: 실패 시 메시지 상태 변경 (예: '전송 실패' 표시)
    }
  };

  return (
      <div
          className="w-full h-screen bg-white overflow-hidden relative"
          style={{ '--keyboard-height': `${keyboardHeight}px` }}
      >
        <Header onMenuClick={() => { setIsSidebarOpen(true); fetchConversations(); }} onNewChatClick={startNewConversation} /> {/* onMenuClick, onNewChatClick prop 추가 */}
        <MessageList messages={messages} />
        <ChatInput
            value={inputValue}
            onChange={(val) => {
              // val이 이벤트 객체인지 문자열인지 확인하여 처리
              if (typeof val === 'string') {
                setInputValue(val);
              } else if (val && val.target) {
                setInputValue(val.target.value);
              }
            }}
            onSend={(text, image) => handleSendMessage(text, image)} // onSend prop 변경
        />
        {/* Sidebar 컴포넌트 추가 */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} conversations={conversations} fetchConversations={fetchConversations} />

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