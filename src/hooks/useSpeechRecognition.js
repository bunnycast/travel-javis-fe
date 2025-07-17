
import { useState, useRef } from 'react';

const useSpeechRecognition = (onChange) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('죄송합니다. 현재 브라우저는 음성 인식을 지원하지 않습니다. Chrome 브라우저를 권장합니다.');
      return;
    }

    if (!recognitionRef.current) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'ko-KR';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            onChange(transcript); // 중간 결과 즉시 반영
          }
        }
        if (finalTranscript) {
          onChange(finalTranscript); // 최종 결과 반영
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('음성 인식 오류:', event.error);
        setIsListening(false);
        alert(`음성 인식 오류: ${event.error}`);
      };

      recognitionRef.current.onend = () => {
        console.log('음성 인식 종료');
        setIsListening(false);
      };
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  return { isListening, toggleListening };
};

export default useSpeechRecognition;
