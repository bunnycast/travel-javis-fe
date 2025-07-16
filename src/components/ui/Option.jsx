
import React from 'react';

/**
 * 옵션 리스트 아이템 컴포넌트 (예: 카메라, 사진)
 * @param {object} props
 * @param {string} props.text - 옵션 텍스트
 * @param {string} props.iconSrc - 옵션 아이콘 경로
 * @param {function} props.onClick - 클릭 이벤트 핸들러
 */
const Option = ({ text, iconSrc, onClick }) => {
  return (
    <div 
      className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100 rounded-lg"
      onClick={onClick}
    >
      <span className="text-dark-gray text-base font-medium">{text}</span>
      {iconSrc && <img src={iconSrc} alt={text} className="w-5 h-5 text-medium-gray" />}
    </div>
  );
};

export default Option;
