import React, { useState } from 'react';
import ImageModal from './ImageModal';
// MapMessage는 더 이상 직접 사용하지 않으므로 임포트 제거 (필요시)
// import MapMessage from './MapMessage';

// 스피커 아이콘 임포트 (예시, 실제 아이콘 경로로 변경 필요)
import speakerIcon from '../../assets/icons/speaker.svg'; // 스피커 아이콘 경로
import loadingIcon from '../../assets/icons/loading.svg'; // 로딩 스피너 아이콘 경로 (선택 사항)

/**
 * 개별 메시지 컴포넌트
 * @param {object} props
 * @param {object} props.message - 메시지 객체 { id, content, sender, type, image_url }
 */
const Message = ({ message }) => {
  const { content, sender, type, image_url } = message;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlayingTts, setIsPlayingTts] = useState(false); // TTS 재생 상태
  const [isLoadingTts, setIsLoadingTts] = useState(false); // TTS 로딩 상태

  const isUser = sender === 'user';

  const userBubbleStyle = 'bg-primary-blue text-white self-end';
  // botBubbleStyle에서 relative, pl-7, pb-7 제거 (★★ 수정 ★★)
  const botBubbleStyle = 'bg-light-gray-bg text-dark-gray self-start'; 

  // 말풍선 자체의 기본 스타일 (패딩은 renderContent에서 내용에 적용)
  const bubbleClasses = `max-w-xs md:max-w-md lg:max-w-lg rounded-2xl break-words ${isUser ? userBubbleStyle : botBubbleStyle}`;

  // Markdown 링크를 HTML <a> 태그로 변환하는 함수
  const renderContentWithLinks = (text) => {
    const linkRegex = /\[(.*?)\]\((.*?)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      const [fullMatch, linkText, url] = match;
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      parts.push(
          <a key={match.index} href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            {linkText}
          </a>
      );
      lastIndex = linkRegex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    return parts;
  };

  // TTS API 호출 및 음성 재생 핸들러
  const handleTtsClick = async () => {
    if (isPlayingTts || isLoadingTts) return; // 이미 재생 중이거나 로딩 중이면 중복 호출 방지

    setIsLoadingTts(true);
    try {
      const ttsApiUrl = 'https://49.50.129.123:5000/tts'; // TTS API 엔드포인트
      const response = await fetch(ttsApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: content }), // 챗봇 응답 메시지 내용을 body로 전달
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === 'success' && data.url) {
        const audio = new Audio(data.url);
        audio.play();
        setIsPlayingTts(true);
        audio.onended = () => {
          setIsPlayingTts(false); // 재생 종료 시 상태 업데이트
        };
        audio.onerror = (e) => {
          console.error('오디오 재생 오류:', e);
          setIsPlayingTts(false);
          alert('음성 재생 중 오류가 발생했습니다.');
        };
      } else {
        alert('TTS 음성 URL을 받아오지 못했습니다.');
      }
    } catch (error) {
      console.error('TTS API 호출 오류:', error);
      alert(`TTS 기능 사용 중 오류 발생: ${error.message}`);
    } finally {
      setIsLoadingTts(false); // 로딩 상태 해제
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'image':
        return (
            <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
              {/* 이미지가 있는 경우 */}
              {image_url && (
                  <img
                      src={image_url}
                      alt="첨부 이미지"
                      className="rounded-lg cursor-pointer my-2 shadow-md"
                      onClick={() => setIsModalOpen(true)}
                      style={{ maxWidth: '150px', height: 'auto', objectFit: 'cover' }}
                  />
              )}
              {/* 텍스트가 있는 경우 (별도의 말풍선) */}
              {content && (
                  <div className={`${bubbleClasses} mt-1`}>
                    <div className="p-3">
                      <p>{renderContentWithLinks(content)}</p>
                    </div>
                  </div>
              )}
              {isModalOpen && image_url && (
                  <ImageModal imageUrl={image_url} onClose={() => setIsModalOpen(false)} />
              )}
            </div>
        );
      case 'text': // 이제 'route' 타입은 'text'로 처리됩니다。
      default:
        return <div className="p-3"><p>{renderContentWithLinks(content)}</p></div>; // 내용에 패딩 적용
    }
  };

  return (
      <div className={`flex w-full my-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
        {/* 일반 텍스트, 맵 메시지 등 말풍선 안에 들어가는 타입 */}
        {type !== 'image' && (
            <div className="flex flex-col items-start"> {/* 봇 메시지 말풍선과 버튼을 세로로 정렬 (★★ 수정 ★★) */}
                <div className={bubbleClasses}> {/* 이 div가 말풍선 자체 */}
                    {renderContent()}
                </div>
                {/* 봇 메시지일 경우에만 TTS 버튼 표시 (★★ 위치 및 스타일 조정 ★★) */}
                {!isUser && (
                    <div className="mt-1 ml-1"> {/* 말풍선 아래, 좌측에 1px 간격으로 배치 */}
                        <button
                            onClick={handleTtsClick}
                            className={`p-1 rounded-full ${isLoadingTts ? 'bg-gray-300' : 'bg-blue-100'} text-blue-500 hover:bg-blue-200 transition-colors`}
                            disabled={isLoadingTts || isPlayingTts}
                        >
                            {isLoadingTts ? (
                                <img src={loadingIcon} alt="로딩 중" className="h-4 w-4 animate-spin" />
                            ) : (
                                <img src={speakerIcon} alt="음성 재생" className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                )}
            </div>
        )}
        {/* 이미지 메시지는 말풍선 없이 직접 정렬 */}
        {type === 'image' && (
            <div className={`flex flex-col w-full my-2 ${isUser ? 'items-end' : 'items-start'}`}>
              {renderContent()}
            </div>
        )}
      </div>
  );
};

export default Message;
