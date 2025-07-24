import { useState, useRef } from 'react';

const useImageAttachment = () => {
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [selectedImageThumbnail, setSelectedImageThumbnail] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (eventOrFile) => {
    let file = null;
    if (eventOrFile.target && eventOrFile.target.files && eventOrFile.target.files[0]) {
      file = eventOrFile.target.files[0]; // 파일 인풋에서 온 경우
    } else if (eventOrFile instanceof File) {
      file = eventOrFile; // File 객체가 직접 전달된 경우 (카메라 캡처)
    }

    if (file) {
      setSelectedImageFile(file);
      // 썸네일 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 150;
          const scaleFactor = MAX_WIDTH / img.width;
          const canvasWidth = MAX_WIDTH;
          const canvasHeight = img.height * scaleFactor;

          canvas.width = canvasWidth;
          canvas.height = canvasHeight;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
          setSelectedImageThumbnail(canvas.toDataURL('image/jpeg', 0.8)); // JPEG 형식으로 압축
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedImageFile(null);
      setSelectedImageThumbnail(null);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImageFile(null);
    setSelectedImageThumbnail(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // 파일 인풋 초기화
    }
  };

  return {
    selectedImageFile,
    selectedImageThumbnail,
    fileInputRef,
    handleImageChange,
    handleRemoveImage,
    setSelectedImageFile,
    setSelectedImageThumbnail,
  };
};

export default useImageAttachment;
