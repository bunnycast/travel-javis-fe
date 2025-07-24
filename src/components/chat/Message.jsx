import React, { useState, useEffect } from 'react';
import ImageModal from './ImageModal';
import MapMessage from './MapMessage';

/**
 * 개별 메시지 컴포넌트
 * @param {object} props
 * @param {object} props.message - 메시지 객체 { id, content, sender, type, image_url, ... }
 */
const Message = ({ message }) => {
  // API 응답 구조에 맞게 props를 구조 분해합니다.
  const { content, sender, type, image_url, route_data } = message;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isUser = sender === 'user';

  const userBubbleStyle = 'bg-primary-blue text-white self-end';
  const botBubbleStyle = 'bg-light-gray-bg text-dark-gray self-start';

  const bubbleClasses = `max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl break-words ${isUser ? userBubbleStyle : botBubbleStyle}`;

  const renderContent = () => {
    switch (type) {
      case 'image':
        return (
          <>
            {/* 이미지가 있는 경우 (말풍선 없이) */}
            {image_url && (
              <img
                src={image_url}
                alt="첨부 이미지"
                className="rounded-md cursor-pointer my-2"
                onClick={() => setIsModalOpen(true)}
                style={{ maxWidth: '120px', height: 'auto', objectFit: 'cover' }}
              />
            )}
            {/* 텍스트가 있는 경우 (말풍선 포함) */}
            {content && (
              <div className={bubbleClasses}>
                <p>{content}</p>
              </div>
            )}
            {isModalOpen && image_url && (
              <ImageModal imageUrl={image_url} onClose={() => setIsModalOpen(false)} />
            )}
          </>
        );
      case 'map':
        return (
          <div>
            <p className="mb-2">{content}</p>
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
        return <p>{content}</p>;
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