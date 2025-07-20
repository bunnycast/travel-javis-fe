import React, { useState, useEffect } from 'react';
import ImageModal from './ImageModal';
import MapMessage from './MapMessage'; // MapMessage 임포트

/**
 * 개별 메시지 컴포넌트
 * @param {object} props
 * @param {object} props.message - 메시지 객체 { id, content, sender, type, text, image, route_data }
 */
const Message = ({ message }) => {
  const { content, sender, type, text, image, route_data } = message;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState(null);
  const [displayText, setDisplayText] = useState('');

  const isUser = sender === 'user';

  const userBubbleStyle = 'bg-primary-blue text-white self-end';
  const botBubbleStyle = 'bg-light-gray-bg text-dark-gray self-start';

  const bubbleClasses = `max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl break-words ${isUser ? userBubbleStyle : botBubbleStyle}`;

  useEffect(() => {
    if (type === 'image') {
      if (content) {
        const imageRegex = /\[이미지\]\s*(https?:\/\/\S+)\s*(.*)/;
        const match = content.match(imageRegex);
        if (match) {
          setModalImageUrl(match[1]);
          setDisplayText(match[2].trim());
        } else {
          setModalImageUrl(content);
          setDisplayText('');
        }
      } else if (image) {
        setModalImageUrl(image);
        setDisplayText(text || '');
      }
    } else {
      setDisplayText(content || text || '');
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
                  <img
                      src={modalImageUrl}
                      alt="첨부 이미지"
                      className="rounded-md cursor-pointer my-2" // my-2 추가하여 수직 간격 유지
                      onClick={() => setIsModalOpen(true)}
                      style={{ maxWidth: '120px', height: 'auto', objectFit: 'cover' }}
                  />
              )}
              {/* 텍스트 (말풍선 포함) - 이미지와 함께 텍스트가 있다면 */}
              {displayText && (
                  <div className={bubbleClasses}> {/* 이 div는 말풍선 자체의 스타일을 담당 */}
                    <p>{displayText}</p>
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
              <p className="mb-2">{displayText}</p>
              <div className="bg-gray-300 h-40 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">네이버 지도 (Embed)</span>
              </div>
            </div>
        );
      case 'route':
        return (
            <MapMessage
                route_url={route_data?.route_url}
                distance={route_data?.distance}
                duration={route_data?.duration}
                transport_mode={route_data?.transport_mode}
            />
        );
      case 'text':
      default:
        return <p>{displayText}</p>;
    }
  };

  return (
      <>
        {/* 일반 텍스트, 맵 메시지 등 말풍선 안에 들어가는 타입 */}
        {type !== 'image' && type !== 'route' && (
            <div className={`flex w-full my-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={bubbleClasses}>
                {renderContent()}
              </div>
            </div>
        )}
        {/* 이미지와 경로 메시지는 말풍선 없이 직접 정렬 */}
        {(type === 'image' || type === 'route') && (
            <div className={`flex flex-col w-full my-2 ${isUser ? 'items-end' : 'items-start'}`}>
              {renderContent()}
            </div>
        )}
      </>
  );
};

export default Message;
