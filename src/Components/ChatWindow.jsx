// 채팅 내용
import React from 'react';
import Message from './Message';
import App from "../App.jsx";

const ChatWindow = ({ messages }) => {
    return (
        <div className="flex-1 overflow-y-auto p-4">
            {messages.map(msg => (
                <Message key={msg.id} message={msg} />
            ))}
        </div>
    );
};

export default ChatWindow;