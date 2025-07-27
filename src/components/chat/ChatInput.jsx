import React, { useState, useRef, Fragment } from 'react';
import IconButton from '../ui/IconButton';
import AttachmentOptions from './AttachmentOptions';
import useSpeechRecognition from '../../hooks/useSpeechRecognition';
import useImageAttachment from '../../hooks/useImageAttachment';

import attachmentIcon from '../../assets/icons/plus.svg';
import micIcon from '../../assets/icons/microphone.svg';
import sendIcon from '../../assets/icons/send.svg';
import switchCameraIcon from '../../assets/icons/switch_camera.svg'; // 카메라 전환 아이콘 임포트

/**
 * 하단 채팅 입력창 컴포넌트
 * @param {object} props
 * @param {string} props.value - 입력창의 현재 값
 * @param {function} props.onChange - 입력창 값 변경 핸들러
 * @param {function} props.onSend - 메시지 전송 핸들러
 */
const ChatInput = ({ value, onChange, onSend }) => {
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);

  const {
    selectedImageFile,
    selectedImageThumbnail,
    fileInputRef,
    handleImageChange,
    handleRemoveImage,
    setSelectedImageFile,
    setSelectedImageThumbnail,
  } = useImageAttachment();

  const { isListening, toggleListening } = useSpeechRecognition(onChange);

  const isInputEmpty = value.trim() === '';

  const handleAttachmentClick = () => {
    setShowAttachmentOptions(prev => !prev);
  };

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [showCameraPreview, setShowCameraPreview] = useState(false);
  const [currentFacingMode, setCurrentFacingMode] = useState('user'); // 'user' (전면) 또는 'environment' (후면)

  const startCamera = async (facingMode) => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('카메라를 사용할 수 없는 환경입니다. 브라우저가 이 기능을 지원하는지 확인해주세요.');
      return;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error('카메라 접근 오류:', err);
      setShowCameraPreview(false);
      if (err.name === 'NotAllowedError') {
        alert('카메라 접근이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요.');
      } else if (err.name === 'NotFoundError') {
        alert('카메라를 찾을 수 없습니다.');
      } else {
        alert(`카메라 접근 중 오류 발생: ${err.message}`);
      }
    }
  };

  const handleSelectCamera = () => {
    setShowAttachmentOptions(false);
    setShowCameraPreview(true);
    startCamera(currentFacingMode);
  };

  const handleToggleCameraFacing = () => {
    const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
    setCurrentFacingMode(newFacingMode);
    startCamera(newFacingMode);
  };

  const handleCapturePhoto = () => {
    if (videoRef.current && streamRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) {
          const capturedFile = new File([blob], `captured_image_${Date.now()}.jpeg`, { type: 'image/jpeg' });
          handleImageChange(capturedFile);
        }
      }, 'image/jpeg');

      streamRef.current.getTracks().forEach(track => track.stop());
      setShowCameraPreview(false);
    }
  };

  const handleCancelCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setShowCameraPreview(false);
  };

  const handleSelectPhoto = () => {
    console.log('사진 선택 - 실제 사진첩 권한 팝업은 브라우저가 처리');
    fileInputRef.current.click();
    setShowAttachmentOptions(false);
  };

  const handleSend = () => {
    console.log('메시지 전송 (이미지 포함):', value, selectedImageFile, selectedImageThumbnail);
    onSend(value, selectedImageFile, selectedImageThumbnail);
    setSelectedImageFile(null);
    setSelectedImageThumbnail(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Fragment>
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

          <IconButton onClick={toggleListening}>
            <img
                src={micIcon}
                alt="음성 입력"
                className={`h-6 w-6 ${isListening ? 'text-red-500 animate-pulse' : 'text-blue-500'}`}
            />
          </IconButton>

          <IconButton
              onClick={handleSend}
              disabled={isInputEmpty}
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

      {/* 카메라 미리보기 UI */}
      {showCameraPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50">
          <video ref={videoRef} className="max-w-full max-h-3/4 bg-gray-800" autoPlay playsInline></video>
          <div className="mt-4 flex space-x-4">
            <button
              onClick={handleCapturePhoto}
              className="bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-blue-600 transition-colors"
            >
              촬영
            </button>
            <IconButton
              onClick={handleToggleCameraFacing}
              className="bg-gray-500 text-white px-3 py-3 rounded-full shadow-lg hover:bg-gray-600 transition-colors"
            >
              <img src={switchCameraIcon} alt="카메라 전환" className="h-6 w-6" />
            </IconButton>
            <button
              onClick={handleCancelCamera}
              className="bg-gray-500 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-gray-600 transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default ChatInput;