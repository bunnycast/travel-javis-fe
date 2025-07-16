
import React from 'react';
import Option from '../ui/Option';

import cameraIcon from '../../assets/icons/camera.svg';
import photoIcon from '../../assets/icons/photo.svg';

/**
 * 이미지 첨부 옵션 컴포넌트 (카메라, 사진)
 * @param {object} props
 * @param {function} props.onSelectCamera - 카메라 선택 시 호출될 함수
 * @param {function} props.onSelectPhoto - 사진 선택 시 호출될 함수
 */
const AttachmentOptions = ({ onSelectCamera, onSelectPhoto }) => {
  return (
    <div className="absolute bottom-full left-0 right-0 bg-white rounded-lg shadow-lg p-2 mb-2 z-40">
      <Option text="카메라" iconSrc={cameraIcon} onClick={onSelectCamera} />
      <Option text="사진" iconSrc={photoIcon} onClick={onSelectPhoto} />
    </div>
  );
};

export default AttachmentOptions;
