import React from 'react';
import IconButton from '../ui/IconButton';

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
  const isInputEmpty = value.trim() === '';

  return (
    <footer className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t pb-[calc(1rem+var(--keyboard-height, 0px))] z-20">
      <div className="flex items-center bg-light-gray-bg rounded-full px-2 py-1 shadow-sm">
        <IconButton onClick={() => console.log('파일 첨부 클릭')}>
          <img src={attachmentIcon} alt="파일 첨부" className="h-6 w-6 text-blue-500" />
        </IconButton>
        
        <input
          type="text"
          placeholder="Javis에게 물어보세요"
          value={value}
          onChange={onChange}
          className="flex-1 mx-2 bg-transparent text-base text-gray-800 placeholder-gray-400 focus:outline-none"
        />

        <IconButton onClick={() => console.log('음성 입력 클릭')}>
          <img src={micIcon} alt="음성 입력" className="h-6 w-6 text-blue-500" />
        </IconButton>

        <IconButton 
          onClick={onSend} 
          disabled={isInputEmpty}
          className={`ml-1 ${isInputEmpty ? 'bg-gray-200' : 'bg-blue-500'}`}
        >
          <img src={sendIcon} alt="전송" className={`h-6 w-6 ${isInputEmpty ? 'text-gray-400' : 'text-white'}`} />
        </IconButton>
      </div>
    </footer>
  );
};

export default ChatInput;