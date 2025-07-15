
import React from 'react';

/**
 * 아이콘 버튼을 위한 범용 컴포넌트
 * @param {object} props
 * @param {function} props.onClick - 클릭 이벤트 핸들러
 * @param {React.ReactNode} props.children - 내부에 표시될 아이콘 SVG 등
 * @param {string} [props.className] - 추가적인 Tailwind CSS 클래스
 * @param {boolean} [props.disabled=false] - 비활성화 여부
 */
const IconButton = ({ onClick, children, className = '', disabled = false }) => {
  const baseStyle = 'flex items-center justify-center p-2 rounded-full transition-colors';
  const disabledStyle = 'opacity-50 cursor-not-allowed';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${disabled ? disabledStyle : 'hover:bg-gray-100'} ${className}`}
    >
      {children}
    </button>
  );
};

export default IconButton;
