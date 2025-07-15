import React from 'react';
import IconButton from '../ui/IconButton';

import menuIcon from '../../assets/icons/menu.svg';
import newChatIcon from '../../assets/icons/chat.svg';

const Header = ({ title = '🛫 여행자비스' }) => {
  return (
    <header className="fixed top-0 left-0 right-0 w-full flex items-center justify-between pt-4 pr-4 pb-6 pl-6 bg-white border-b z-10">
      <IconButton onClick={() => alert('메뉴 클릭')}>
        <img src={menuIcon} alt="메뉴" className="h-6 w-6" />
      </IconButton>
      <h3 className="flex-1 text-center text-base font-extrabold text-dark-gray font-['Pretendard_GOV'] tracking-tight">{title}</h3>
      <IconButton onClick={() => alert('새 채팅 클릭')}>
        <img src={newChatIcon} alt="새 채팅" className="h-6 w-6" />
      </IconButton>
    </header>
  );
};

export default Header;
