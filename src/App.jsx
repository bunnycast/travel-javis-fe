import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Routes, Route 임포트
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <div 
      className="max-w-md mx-auto overflow-hidden h-full"
    >
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/chat/:conversationId" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;
