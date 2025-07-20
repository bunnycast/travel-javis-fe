import React, { useState, useEffect } from 'react';
import ImageModal from './ImageModal'; // ImageModal 임포트

/**
 * 개별 메시지 컴포넌트
 * @param {object} props
 * @param {object} props.message - 메시지 객체 { id, text, sender, type, image } (image는 File 객체)
 */
const Message = ({ message }) => {
  const { content, sender, type, text, image } = message; // text와 image 필드 추가
  const [isModalOpen, setIsModalOpen] = useState(false); // 이미지 모달 상태
  const [modalImageUrl, setModalImageUrl] = useState(null); // 모달에 표시할 이미지 URL
  const [displayText, setDisplayText] = useState(''); // 표시할 텍스트

  const isUser = sender === 'user';

  // 메시지 타입에 따른 스타일 분기
  const userBubbleStyle = 'bg-primary-blue text-white self-end'; // 사용자 메시지 색상
  const botBubbleStyle = 'bg-light-gray-bg text-dark-gray self-start'; // 봇 메시지 색상

  const bubbleClasses = `max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl break-words ${isUser ? userBubbleStyle : botBubbleStyle}`;

  // content에서 이미지 URL과 텍스트를 파싱
  useEffect(() => {
    if (type === 'image') {
      if (content) { // 백엔드에서 온 메시지 (content에 [이미지] URL 텍스트)
        const imageRegex = /\[이미지\]\s*(https?:\/\/\S+)\s*(.*)/; // [이미지] URL 텍스트 패턴
        const match = content.match(imageRegex);
        if (match) {
          setModalImageUrl(match[1]); // 첫 번째 캡처 그룹: URL
          setDisplayText(match[2].trim()); // 두 번째 캡처 그룹: 나머지 텍스트
        } else {
          setModalImageUrl(content); // 패턴에 맞지 않으면 content 전체를 URL로 간주
          setDisplayText(''); // 텍스트는 없음
        }
      } else if (image) { // 프론트엔드에서 생성된 메시지 (image에 blob URL)
        setModalImageUrl(image); // image 필드를 직접 사용
        setDisplayText(text || ''); // text 필드를 사용
      }
    } else { // 이미지 타입이 아니면 content 전체를 텍스트로 사용
      setDisplayText(content || text || ''); // content 또는 text 사용
      setModalImageUrl(null);
    }
  }, [content, type, image, text]);

  const renderContent = () => {
    switch (type) {
      case 'image':
        return (
          <>
            {/* 이미지 (말풍선 없이) */}
            {modalImageUrl && (
              <div className={`flex w-full my-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
                <img
                  src={modalImageUrl} // 파싱된 이미지 URL 사용
                  alt="첨부 이미지"
                  className="rounded-md cursor-pointer"
                  onClick={() => setIsModalOpen(true)} // 이미지 클릭 시 모달 열기
                  style={{ maxWidth: '120px', height: 'auto', objectFit: 'cover' }} // 더 작게 조정
                />
              </div>
            )}
            {/* 텍스트 (말풍선 포함) - 이미지와 함께 텍스트가 있다면 */}
            {displayText && (
              <div className={`flex w-full my-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={bubbleClasses}>
                  <p>{displayText}</p>
                </div>
              </div>
            )}
            {isModalOpen && modalImageUrl && (
              <ImageModal imageUrl={modalImageUrl} onClose={() => setIsModalOpen(false)} />
            )}
          </>
        );
      case 'map':
        return (
          <div>
            <p className="mb-2">{displayText}</p> {/* text 대신 content 사용 */}
            <div className="bg-gray-300 h-40 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">네이버 지도 (Embed)</span>
            </div>
          </div>
        );
      case 'text':
      default:
        return <p>{displayText}</p>; // text 대신 content 사용
    }
  };

  return (
    <>
      {type !== 'image' && ( // 이미지 타입이 아닐 때만 말풍선 래퍼 렌더링
        <div className={`flex w-full my-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <div className={bubbleClasses}>
            {renderContent()}
          </div>
        </div>
      )}
      {type === 'image' && renderContent()} {/* 이미지 타입일 때는 renderContent만 호출 */}
    </>
  );
};

export default Message;