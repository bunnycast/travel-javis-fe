import React, { useState } from 'react'
import ChatWindow from './Components/ChatWindow';
import MessageInput from './Components/MessageInput';
import axios from 'axios';

function App() {
    const [messages, setMessages] = useState([
        {id: 1, text: "안녕하세요! 무엇을 도와드릴까요?", sender: 'bot' }
    ]);

    const handleSendMessage = async(text) => {
        const newMessage = { id: messages.length + 1, text, sender: 'user' };
        setMessages(prev => [ ...prev, newMessage]);

        // Todo Mock API 연동 -> 실제 API 연동 수정
        try {
            const response = await axios.post('/api/chat', { message: text });
            const botResponse = response.data;
            setMessages(prev => [ ...prev, botResponse]);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="bg-gray-800 h-screen flex flex-col font-sans text-white">
            <header className="bg-gray-900 p-4 text-center text-lg font-semibold">
                여행Javis
            </header>
            <ChatWindow messages={messages} />
            <MessageInput onSendMessage={handleSendMessage} />
        </div>
    );
}

export default App;