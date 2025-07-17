import React, { useState } from 'react';
import ImageModal from './ImageModal'; // ImageModal 임포트

/**
 * 개별 메시지 컴포넌트
 * @param {object} props
 * @param {object} props.message - 메시지 객체 { id, text, sender, type, image }
 */
const Message = ({ message }) => {
    const { text, sender, type, image } = message;
    const [isModalOpen, setIsModalOpen] = useState(false); // 이미지 모달 상태

    const isUser = sender === 'user';

    // 메시지 타입에 따른 스타일 분기
    const userBubbleStyle = 'bg-primary-blue text-white self-end'; // 사용자 메시지 색상
    const botBubbleStyle = 'bg-light-gray-bg text-dark-gray self-start'; // 봇 메시지 색상

    const bubbleClasses = `max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl break-words ${isUser ? userBubbleStyle : botBubbleStyle}`;

    const renderContent = () => {
        switch (type) {
            case 'image':
                return (
                    <div>
                        {text && <p className="mb-2">{text}</p>} {/* 텍스트가 있으면 표시 */}
                        <img
                            src={image}
                            alt="첨부 이미지"
                            className="max-w-full h-auto rounded-md cursor-pointer"
                            onClick={() => setIsModalOpen(true)} // 이미지 클릭 시 모달 열기
                            style={{ maxWidth: '320px', maxHeight: '120px', objectFit: 'cover' }} // 썸네일 크기
                        />
                        {isModalOpen && (
                            <ImageModal imageUrl={image} onClose={() => setIsModalOpen(false)} />
                        )}
                    </div>
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
        <div className={`flex w-full my-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={bubbleClasses}>
                {renderContent()}
            </div>
        </div>
    );
};

export default Message;
