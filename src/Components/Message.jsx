// 개별 메시지
import React from "react";
import App from "../App.jsx";

const Message = ({ message }) => {
    const { text, sender } = message;
    const isUser = sender === 'user';

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div
                className={`max-w-md p-3 rounded-lg ${
                    isUser ? 'bg-blue-600' : 'bg-gray-700'
                }`}
            >
            <p>{text}</p>
            </div>
        </div>
    );
};

export default Message;