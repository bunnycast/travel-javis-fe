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

          const MAX_SIZE = 150; // 최대 길이 (px)

          let width = img.width;
          let height = img.height;

          // 이미지의 가장 긴 변을 MAX_SIZE에 맞추고, 다른 변은 비율에 맞춰 조정
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // 이미지를 캔버스에 그리기 (크롭 없이 리사이징)
          ctx.drawImage(img, 0, 0, width, height);

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