import React, { useState, useEffect } from 'react';
import ImageModal from './ImageModal'; // ImageModal 임포트

/**
 * 개별 메시지 컴포넌트
 * @param {object} props
 * @param {object} props.message - 메시지 객체 { id, text, sender, type, image } (image는 File 객체)
 */
const Message = ({ message }) => {
  const { text, sender, type, image } = message;
  const [isModalOpen, setIsModalOpen] = useState(false); // 이미지 모달 상태
  const [modalImageUrl, setModalImageUrl] = useState(null); // 모달에 표시할 이미지 URL

  const isUser = sender === 'user';

  // 메시지 타입에 따른 스타일 분기
  const userBubbleStyle = 'bg-primary-blue text-white self-end'; // 사용자 메시지 색상
  const botBubbleStyle = 'bg-light-gray-bg text-dark-gray self-start'; // 봇 메시지 색상

  const bubbleClasses = `max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl break-words ${isUser ? userBubbleStyle : botBubbleStyle}`;

  // image (File 객체)가 변경될 때마다 URL.createObjectURL을 사용하여 URL 생성
  useEffect(() => {
    if (type === 'image' && image instanceof File) {
      const url = URL.createObjectURL(image);
      setModalImageUrl(url);

      // 컴포넌트 언마운트 시 URL 해제하여 메모리 누수 방지
      return () => {
        URL.revokeObjectURL(url);
      };
    } else if (type === 'image' && typeof image === 'string') {
      // 이미 Data URL (Base64)이거나 외부 URL인 경우
      setModalImageUrl(image);
    }
  }, [image, type]);

  const renderContent = () => {
    switch (type) {
      case 'image':
        return (
          <>
            {/* 이미지 (말풍선 없이) */}
            <div className={`flex w-full my-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
              <img
                src={image instanceof File ? URL.createObjectURL(image) : image} // 썸네일은 File 객체에서 직접 생성
                alt="첨부 이미지"
                className="rounded-md cursor-pointer"
                onClick={() => setIsModalOpen(true)} // 이미지 클릭 시 모달 열기
                style={{ maxWidth: '120px', height: 'auto', objectFit: 'cover' }} // 더 작게 조정
              />
            </div>
            {/* 텍스트 (말풍선 포함) */}
            {text && (
              <div className={`flex w-full my-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={bubbleClasses}>
                  <p>{text}</p>
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
            <p className="mb-2">{text}</p>
            <div className="bg-gray-300 h-40 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">네이버 지도 (Embed)</span>
            </div>
          </div>
        );
      case 'text':
      default:
        return <p>{text}</p>;
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