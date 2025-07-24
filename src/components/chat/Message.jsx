import React, { useState } from 'react';
import ImageModal from './ImageModal';
// MapMessage는 더 이상 직접 사용하지 않으므로 임포트 제거 (필요시)
// import MapMessage from './MapMessage';

/**
 * 개별 메시지 컴포넌트
 * @param {object} props
 * @param {object} props.message - 메시지 객체 { id, content, sender, type, image_url }
 */
const Message = ({ message }) => {
  const { content, sender, type, image_url } = message; // route_data 제거
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isUser = sender === 'user';

  const userBubbleStyle = 'bg-primary-blue text-white self-end';
  const botBubbleStyle = 'bg-light-gray-bg text-dark-gray self-start';

  const bubbleClasses = `max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl break-words ${isUser ? userBubbleStyle : botBubbleStyle}`;

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
                    <p>{renderContentWithLinks(content)}</p> {/* 링크 렌더링 함수 적용 */}
                  </div>
              )}
              {isModalOpen && image_url && (
                  <ImageModal imageUrl={image_url} onClose={() => setIsModalOpen(false)} />
              )}
            </>
        );
      case 'text': // 이제 'route' 타입은 'text'로 처리됩니다.
      default:
        return <p>{renderContentWithLinks(content)}</p>; // 링크 렌더링 함수 적용
    }
  };

  return (
      <>
        {/* 일반 텍스트, 맵 메시지 등 말풍선 안에 들어가는 타입 */}
        {type !== 'image' && ( // 'route' 타입 조건 제거
            <div className={`flex w-full my-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={bubbleClasses}>
                {renderContent()}
              </div>
            </div>
        )}
        {/* 이미지 메시지는 말풍선 없이 직접 정렬 */}
        {type === 'image' && ( // 'route' 타입 조건 제거
            <div className={`flex flex-col w-full my-2 ${isUser ? 'items-end' : 'items-start'}`}>
              {renderContent()}
            </div>
        )}
      </>
  );
};

export default Message;
