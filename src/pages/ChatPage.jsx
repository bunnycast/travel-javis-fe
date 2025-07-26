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
  const [currentConversationTitle, setCurrentConversationTitle] = useState('새 채팅'); // 현재 대화 제목 상태 추가
  const navigate = useNavigate(); // useNavigate 훅 사용
  const { conversationId } = useParams(); // URL 파라미터 읽기

  // 현재 대화의 제목을 불러오는 함수
  const fetchCurrentConversationTitle = async () => {
    if (conversationId) {
      try {
        const response = await fetch(`https://javis.shop/api/conversations/${conversationId}`, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCurrentConversationTitle(data.title || '새 채팅');
      } catch (err) {
        console.error(`대화 제목 불러오기 실패: ${conversationId}`, err);
        setCurrentConversationTitle('새 채팅'); // 실패 시 기본 제목으로 설정
      }
    } else {
      setCurrentConversationTitle('새 채팅'); // conversationId가 없으면 기본 제목
    }
  };

  // 대화 목록을 불러오는 함수
  const fetchConversations = async () => {
    try {
      const response = await fetch(`https://javis.shop/api/conversations`, {
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
      const response = await fetch(`https://javis.shop/api/conversations`, { // 백엔드 엔드포인트
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
    const fetchMessagesAndTitle = async () => { // 함수 이름 변경
      if (conversationId) {
        console.log(`Loading conversation: ${conversationId}`);
        try {
          // 1. 대화 메시지 가져오기
          const messagesResponse = await fetch(`https://javis.shop/api/conversations/${conversationId}/full`, {
            method: 'GET',
            headers: {
              'accept': 'application/json',
            },
          });

          if (messagesResponse.status === 404) {
            setMessages([]);
          } else if (!messagesResponse.ok) {
            throw new Error(`HTTP error! status: ${messagesResponse.status}`);
          }

          const messagesData = await messagesResponse.json();
          const typedMessages = (Array.isArray(messagesData.messages) ? messagesData.messages : []).map(msg => {
            // 백엔드에서 이미 type 필드를 보내주므로 그대로 사용
            // image_url이 있으면 type을 'image'로 강제하고, 없으면 백엔드 type 사용
            if (msg.image_url) {
              return { ...msg, type: 'image' }; // image 필드 대신 image_url 사용
            }
            return { ...msg, type: msg.type || 'text' }; // 백엔드에서 받은 type을 사용하거나 기본값 'text'
          });
          setMessages(typedMessages || []);
          console.log(`Messages for ${conversationId}:`, typedMessages);

          // 2. 대화 제목 가져오기
          const titleResponse = await fetch(`https://javis.shop/api/conversations/${conversationId}`, {
            method: 'GET',
            headers: {
              'accept': 'application/json',
            },
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
    fetchCurrentConversationTitle(); // 대화 ID 변경 시 제목도 함께 가져옴
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
        const response = await fetch(`https://javis.shop/api/conversations`, {
          method: 'POST',
          headers: {
            'accept': 'application/json',
          },
          body: JSON.stringify({}),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        currentConvId = data.conversation_id;
        navigate(`/chat/${currentConvId}`); // 새 ID로 URL 업데이트
        console.log("새 대화 생성 및 ID 설정:", currentConvId);
      } catch (err) {
        console.error("새 대화 생성 실패:", err);
        alert(`새 대화 생성 실패: ${err.message}`);
        return; // 새 대화 생성 실패 시 메시지 전송 중단
      }
    }

    // 1. 사용자 메시지를 화면에 즉시 표시
    const newMessage = {
      id: uuidv4(), // 고유 ID 생성
      content: text, // <-- text 대신 content 필드 사용
      sender: 'user',
      type: imageFile ? 'image' : 'text',
      image_url: imageFile ? URL.createObjectURL(imageFile) : null, // image 대신 image_url 필드 사용
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputValue('');

    // 2. API 호출
    let endpoint = '';
    let options = {};

    if (imageFile) {
      // 이미지가 있는 경우: /analyze/ API 호출
      endpoint = `https://javis.shop/api/analyze`;
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('question', text);
      formData.append('conversation_id', currentConvId); // 업데이트된 ID 사용

      options = {
        method: 'POST',
        body: formData,
        // multipart/form-data의 경우 Content-Type 헤더를 브라우저가 자동으로 설정하도록 둡니다.
      };

    } else {
      // 텍스트만 있는 경우: /chat/ API 호출
      endpoint = `https://javis.shop/api/chat/`;
      options = {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: text,
          conversation_id: currentConvId, // 업데이트된 ID 사용
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
      const botMessageContent = data.answer || data.content; // 백엔드 응답에서 answer 또는 content 필드 사용
      let botMessage = null;

      // 백엔드에서 route_data를 파싱해서 보내주므로, 여기서는 data.route_data를 직접 사용
      if (data.route_data) { // data.route_data가 있는지 확인
        botMessage = {
          id: uuidv4(),
          sender: 'bot',
          type: 'route',
          route_data: data.route_data,
          content: botMessageContent,
        };
      } else {
        // route_data가 없는 경우 (일반 텍스트 응답)
        botMessage = {
          id: uuidv4(),
          sender: 'bot',
          type: 'text',
          content: botMessageContent,
        };
      }

      // 최종적으로 구성된 봇 메시지를 상태에 추가
      if (botMessage) {
        setMessages(prevMessages => [...prevMessages, botMessage]);
      } else {
        console.error('봇 메시지 생성 실패: ', data);
      }

      // 대화 목록 및 현재 대화 제목 갱신
      fetchConversations();
      fetchCurrentConversationTitle();
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
        <Header title={currentConversationTitle === '새 채팅' ? '🛫 여행자비스' : currentConversationTitle} onMenuClick={() => { setIsSidebarOpen(true); fetchConversations(); }} onNewChatClick={startNewConversation} /> {/* onMenuClick, onNewChatClick prop 추가 */}
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
        <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            conversations={conversations}
            fetchConversations={fetchConversations}
            fetchCurrentConversationTitle={fetchCurrentConversationTitle}
            onSummarizeConversation={(convId) => {
                // 여기에 대화 요약 API 호출 로직을 추가합니다.
                // convId는 Sidebar에서 전달받은 selectedConversationId가 됩니다.
                console.log(`대화 요약 요청: ${convId}`);
                alert(`대화 ${convId} 요약 기능은 아직 구현 중입니다.`);
                // 실제 API 호출: fetch('/api/summarize', { method: 'POST', body: JSON.stringify({ conversation_id: convId }) });
            }}
        />

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