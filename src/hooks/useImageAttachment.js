
import { useState, useRef } from 'react';

const useImageAttachment = () => {
  const [selectedImageFile, setSelectedImageFile] = useState(null); // 원본 이미지 파일 객체 저장
  const [selectedImageThumbnail, setSelectedImageThumbnail] = useState(null); // 썸네일 Data URL 저장
  const fileInputRef = useRef(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImageFile(file); // 원본 파일 객체 저장

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // 썸네일 크기 설정 (320x120px 권장)
          const targetWidth = 320;
          const targetHeight = 120;

          // 비율 유지하며 크롭 (가운데 기준)
          const aspectRatio = img.width / img.height;
          let sx, sy, sWidth, sHeight;

          if (aspectRatio > targetWidth / targetHeight) {
            // 원본 이미지가 타겟보다 가로로 길 때
            sHeight = img.height;
            sWidth = sHeight * (targetWidth / targetHeight);
            sx = (img.width - sWidth) / 2;
            sy = 0;
          } else {
            // 원본 이미지가 타겟보다 세로로 길 때
            sWidth = img.width;
            sHeight = sWidth * (targetHeight / targetWidth);
            sy = (img.height - sHeight) / 2;
            sx = 0;
          }

          canvas.width = targetWidth;
          canvas.height = targetHeight;

          ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight);
          setSelectedImageThumbnail(canvas.toDataURL('image/jpeg', 0.8)); // JPEG 형식으로 변환
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
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
    setSelectedImageFile, // 외부에서 초기화할 수 있도록 추가
    setSelectedImageThumbnail, // 외부에서 초기화할 수 있도록 추가
  };
};

export default useImageAttachment;
