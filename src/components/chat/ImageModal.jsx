
import React from 'react';

/**
 * 전체 이미지를 표시하는 모달 컴포넌트
 * @param {object} props
 * @param {string} props.imageUrl - 표시할 이미지 URL
 * @param {function} props.onClose - 모달 닫기 함수
 */
const ImageModal = ({ imageUrl, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose} // 모달 외부 클릭 시 닫기
    >
      <div className="relative max-w-full max-h-full p-4" onClick={(e) => e.stopPropagation()}> {/* 이벤트 버블링 방지 */}
        <img src={imageUrl} alt="전체 이미지" className="max-w-full max-h-full object-contain" />
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-white text-2xl font-bold bg-gray-800 bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default ImageModal;
