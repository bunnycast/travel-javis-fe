import React, { useState, useRef } from 'react';
import IconButton from '../ui/IconButton';
import AttachmentOptions from './AttachmentOptions'; // AttachmentOptions 임포트
import useSpeechRecognition from '../../hooks/useSpeechRecognition'; // useSpeechRecognition 훅 임포트
import useImageAttachment from '../../hooks/useImageAttachment'; // useImageAttachment 훅 임포트

import attachmentIcon from '../../assets/icons/plus.svg';
import micIcon from '../../assets/icons/microphone.svg';
import sendIcon from '../../assets/icons/send.svg';

/**
 * 하단 채팅 입력창 컴포넌트
 * @param {object} props
 * @param {string} props.value - 입력창의 현재 값
 * @param {function} props.onChange - 입력창 값 변경 핸들러
 * @param {function} props.onSend - 메시지 전송 핸들러
 */
const ChatInput = ({ value, onChange, onSend }) => {
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);

  // useImageAttachment 훅 사용
  const {
    selectedImageFile,
    selectedImageThumbnail,
    fileInputRef,
    handleImageChange,
    handleRemoveImage,
    setSelectedImageFile,
    setSelectedImageThumbnail,
  } = useImageAttachment();

  // useSpeechRecognition 훅 사용
  const { isListening, toggleListening } = useSpeechRecognition(onChange);

  const isInputEmpty = value.trim() === '';

  const handleAttachmentClick = () => {
    setShowAttachmentOptions(prev => !prev);
  };

  const handleSelectCamera = async () => {
    console.log('카메라 선택 - 실제 카메라 권한 팝업은 브라우저가 처리');
    setShowAttachmentOptions(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      console.log('카메라 스트림 획득:', stream);
      alert('카메라 접근 권한이 승인되었습니다. (실제 미리보기/촬영 기능은 추후 구현)');
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.error('카메라 접근 오류:', err);
      if (err.name === 'NotAllowedError') {
        alert('카메라 접근이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요.');
      } else if (err.name === 'NotFoundError') {
        alert('카메라를 찾을 수 없습니다.');
      } else {
        alert(`카메라 접근 중 오류 발생: ${err.message}`);
      }
    }
  };

  const handleSelectPhoto = () => {
    console.log('사진 선택 - 실제 사진첩 권한 팝업은 브라우저가 처리');
    fileInputRef.current.click(); // 숨겨진 파일 인풋 클릭
    setShowAttachmentOptions(false);
  };

  const handleSend = () => {
    // 이미지와 함께 메시지 전송 로직
    console.log('메시지 전송 (이미지 포함):', value, selectedImageFile, selectedImageThumbnail);
    onSend(value, selectedImageFile, selectedImageThumbnail); // onSend prop에 원본 파일과 썸네일 데이터 모두 전달
    setSelectedImageFile(null);
    setSelectedImageThumbnail(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
      <footer className="fixed bottom-0 inset-x-0 mx-auto max-w-md p-4 bg-white border-t pb-[calc(1rem+var(--keyboard-height, 0px))] z-20">
        {selectedImageThumbnail && (
            <div className="relative mb-2 w-full flex items-center justify-between p-2 bg-gray-100 rounded-lg">
              <img src={selectedImageThumbnail} alt="미리보기" className="max-w-full h-24 object-contain rounded-md" />
              <button
                  onClick={handleRemoveImage}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
              >
                X
              </button>
            </div>
        )}

        <div className="relative flex items-center bg-light-gray-bg rounded-full px-2 py-1 shadow-sm">
          <IconButton onClick={handleAttachmentClick}>
            <img src={attachmentIcon} alt="파일 첨부" className="h-6 w-6 text-blue-500" />
          </IconButton>

          <input
              type="text"
              placeholder="Javis에게 물어보세요"
              value={value}
              onChange={onChange}
              className="flex-1 mx-2 bg-transparent text-base text-gray-800 placeholder-gray-400 focus:outline-none"
          />

          <IconButton onClick={toggleListening}> {/* 훅에서 가져온 toggleListening 사용 */}
            <img
                src={micIcon}
                alt="음성 입력"
                className={`h-6 w-6 ${isListening ? 'text-red-500 animate-pulse' : 'text-blue-500'}`}
            />
          </IconButton>

          <IconButton
              onClick={handleSend} // handleSend 함수 호출
              disabled={isInputEmpty} // 텍스트가 비어있으면 비활성화 (이미지 유무 상관없이)
              className={`ml-1 ${isInputEmpty ? 'bg-gray-200' : 'bg-blue-500'}`}
          >
            <img src={sendIcon} alt="전송" className={`h-6 w-6 ${isInputEmpty ? 'text-gray-400' : 'text-white'}`} />
          </IconButton>

          {showAttachmentOptions && (
              <AttachmentOptions
                  onSelectCamera={handleSelectCamera}
                  onSelectPhoto={handleSelectPhoto}
              />
          )}
        </div>
        {/* 숨겨진 파일 인풋 */}
        <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
        />
      </footer>
  );
};

export default ChatInput;
