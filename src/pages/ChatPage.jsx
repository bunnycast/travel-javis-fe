import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom'; // useLocation 임포트 추가
import { v4 as uuidv4 } from 'uuid';
import Header from '../components/layout/Header';
import MessageList from '../components/chat/MessageList';
import ChatInput from '../components/chat/ChatInput';
import Sidebar from '../components/layout/Sidebar';

const ChatPage = () => {
  const API_BASE = (import.meta.env?.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL.trim())
      ? import.meta.env.VITE_API_BASE_URL.trim().replace(/\/$/, '')
      : '/api';
  const url = (path) => `${API_BASE}${path}`;
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentConversationTitle, setCurrentConversationTitle] = useState('새 채팅');
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const location = useLocation(); // useLocation 훅 사용

  // JWT 토큰을 가져오는 헬퍼 함수
  const getAuthHeaders = () => {
    const token = localStorage.getItem('jwt_token');
    const headers = {
      'accept': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  // 컴포넌트 마운트 시 URL에서 토큰 추출 및 저장
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('jwt_token', token);
      // URL에서 토큰 제거 (히스토리 스택에 새 엔트리 추가하지 않음)
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);


  // 현재 대화의 제목을 불러오는 함수
  const fetchCurrentConversationTitle = async () => {
    if (conversationId) {
      try {
        const response = await fetch(url(`/conversations/${conversationId}`), {
          method: 'GET',
          headers: getAuthHeaders(), // 인증 헤더 추가
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCurrentConversationTitle(data.title || '새 채팅');
      } catch (err) {
        console.error(`대화 제목 불러오기 실패: ${conversationId}`, err);
        setCurrentConversationTitle('새 채팅');
      }
    } else {
      setCurrentConversationTitle('새 채팅');
    }
  };

  // 대화 목록을 불러오는 함수
  const fetchConversations = async () => {
    try {
      const response = await fetch(url(`/conversations/`), {
        method: 'GET',
        headers: getAuthHeaders(), // 인증 헤더 추가
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setConversations(data.conversations || []);
    } catch (err) {
      console.error("대화 목록 불러오기 실패:", err);
    }
  };

  // 새로운 대화 시작 함수
  const startNewConversation = async () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }

    try {
      const response = await fetch(url(`/conversations/`), {
        method: 'POST',
        headers: {
          ...getAuthHeaders(), // 인증 헤더 추가
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      console.log(response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const newId = data.conversation_id;

      navigate(`/chat/${newId}`);
      setMessages([]);
      setInputValue('');
      console.log("새 대화 생성 성공:", data);
      fetchConversations();
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
      handleResize();

      return () => {
        window.visualViewport.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  // conversationId가 변경될 때마다 해당 대화 로드 (API 호출)
  useEffect(() => {
    const fetchMessagesAndTitle = async () => {
      if (conversationId) {
        console.log(`Loading conversation: ${conversationId}`);
        try {
          // 1. 대화 메시지 가져오기
          const messagesResponse = await fetch(url(`/conversations/${conversationId}/full`), {
            method: 'GET',
            headers: getAuthHeaders(), // 인증 헤더 추가
          });

          if (messagesResponse.status === 404) {
            setMessages([]);
          } else if (!messagesResponse.ok) {
            throw new Error(`HTTP error! status: ${messagesResponse.status}`);
          }

          const messagesData = await messagesResponse.json();
          const typedMessages = (Array.isArray(messagesData.messages) ? messagesData.messages : []).map(msg => {
            if (msg.image_url) {
              return { ...msg, type: 'image' };
            }
            return { ...msg, type: msg.type || 'text' };
          });
          setMessages(typedMessages || []);
          console.log(`Messages for ${conversationId}:`, typedMessages);

          // 2. 대화 제목 가져오기
          const titleResponse = await fetch(url(`/conversations/${conversationId}`), {
            method: 'GET',
            headers: getAuthHeaders(), // 인증 헤더 추가
          });

          if (!titleResponse.ok) {
            throw new Error(`HTTP error! status: ${titleResponse.status}`);
          }

          const titleData = await titleResponse.json();
          setCurrentConversationTitle(titleData.title || '새 채팅');

        } catch (err) {
          console.error(`Failed to load conversation ${conversationId}:`, err);
          alert(`대화 정보를 불러오는데 실패했습니다: ${err.message}`);
          setMessages([]);
          setCurrentConversationTitle('새 채팅');
        }
      } else {
        setMessages([]);
        setCurrentConversationTitle('새 채팅');
      }
    };

    fetchMessagesAndTitle();
    fetchCurrentConversationTitle();
  }, [conversationId]);

  // 컴포넌트 마운트 시 대화 목록 초기 로드
  useEffect(() => {
    fetchConversations();
  }, []);

  const handleSendMessage = async (text, imageFile = null) => {
    if (text.trim() === '' && !imageFile) return;

    // conversationId가 없으면 새 대화를 시작합니다.
    let currentConvId = conversationId;
    if (!currentConvId) {
      try {
        const response = await fetch(url(`/conversations/`), {
          method: 'POST',
          headers: {
            ...getAuthHeaders(), // 인증 헤더 추가
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        currentConvId = data.conversation_id;
        navigate(`/chat/${currentConvId}`);
        console.log("새 대화 생성 및 ID 설정:", currentConvId);
      } catch (err) {
        console.error("새 대화 생성 실패:", err);
        alert(`새 대화 생성 실패: ${err.message}`);
        return;
      }
    }

    // 1. 사용자 메시지를 화면에 즉시 표시
    const newMessage = {
      id: uuidv4(),
      content: text,
      sender: 'user',
      type: imageFile ? 'image' : 'text',
      image_url: imageFile ? URL.createObjectURL(imageFile) : null,
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputValue('');

    // 2. API 호출
    let endpoint = '';
    let options = {};

    if (imageFile) {
      // 이미지가 있는 경우: /analyze/ API 호출
      endpoint = url(`/analyze/`);
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('question', text);
      formData.append('conversation_id', currentConvId);

      options = {
        method: 'POST',
        body: formData,
        headers: getAuthHeaders(), // 인증 헤더 추가 (FormData는 Content-Type 자동 설정)
      };

    } else {
      // 텍스트만 있는 경우: /chat/ API 호출
      endpoint = url(`/chat/`);
      options = {
        method: 'POST',
        headers: {
          ...getAuthHeaders(), // 인증 헤더 추가
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: text,
          conversation_id: currentConvId,
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
      const botMessageContent = data.answer || data.content;
      let botMessage = null;

      if (data.route_data) {
        botMessage = {
          id: uuidv4(),
          sender: 'bot',
          type: 'route',
          route_data: data.route_data,
          content: botMessageContent,
        };
      } else {
        botMessage = {
          id: uuidv4(),
          sender: 'bot',
          type: 'text',
          content: botMessageContent,
        };
      }

      if (botMessage) {
        setMessages(prevMessages => [...prevMessages, botMessage]);
      } else {
        console.error('봇 메시지 생성 실패: ', data);
      }

      fetchConversations();
      fetchCurrentConversationTitle();
    } catch (err) {
      console.error("API 호출 실패:", err);
      alert(`메시지 전송에 실패했습니다: ${err.message}`);
    }
  };

  return (
      <div
          className="w-full h-screen bg-white overflow-hidden relative"
          style={{ '--keyboard-height': `${keyboardHeight}px` }}
      >
        <Header title={currentConversationTitle === '새 채팅' ? ' 여행자비스' : currentConversationTitle} onMenuClick={() => { setIsSidebarOpen(true); fetchConversations(); }} onNewChatClick={startNewConversation} />
        <MessageList messages={messages} />
        <ChatInput
            value={inputValue}
            onChange={(val) => {
              if (typeof val === 'string') {
                setInputValue(val);
              } else if (val && val.target) {
                setInputValue(val.target.value);
              }
            }}
            onSend={(text, image) => handleSendMessage(text, image)}
        />
        <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            conversations={conversations}
            fetchConversations={fetchConversations}
            fetchCurrentConversationTitle={fetchCurrentConversationTitle}
            onSummarizeConversation={(convId) => {
              console.log(`대화 요약 요청: ${convId}`);
              alert(`대화 ${convId} 요약 기능은 아직 구현 중입니다.`);
            }}
        />

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
