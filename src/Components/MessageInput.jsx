// 메시지 입력창
import React, { useState } from "react";

const MessageInput = ({ onSendMessage }) => {
    const [ text, setText ] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) {
            onSendMessage(text);
            setText('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-gray-900">
            <div className="flex items-center bg-gray-800 rounded-lg p-2">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="메시지를 입력하세요..."
                className="flex-1 bg-transparent focus:outline-none px-2"
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white
      font-bold py-2 px-4 rounded-lg">
                전송
              </button>
            </div>
        </form>
    );
};

export default MessageInput;