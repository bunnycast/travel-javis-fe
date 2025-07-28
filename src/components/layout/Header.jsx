import React from 'react';
import IconButton from '../ui/IconButton';

import menuIcon from '../../assets/icons/menu.svg';
import newChatIcon from '../../assets/icons/chat.svg';

const Header = ({ title = '🛫 여행자비스', onMenuClick, onNewChatClick }) => {
  return (
    <header className="fixed top-0 inset-x-0 mx-auto max-w-md flex items-center justify-between px-4 py-[6px] bg-white border-b z-20">
      <IconButton onClick={onMenuClick}>
        <img src={menuIcon} alt="메뉴" className="h-6 w-6" />
      </IconButton>
      <h3 className="flex-1 text-center text-base font-extrabold text-dark-gray font-sans tracking-tight">{title}</h3> {/* font-['Pretendard_GOV'] 대신 font-sans 사용 */}
      <IconButton onClick={onNewChatClick}>
        <img src={newChatIcon} alt="새 채팅" className="h-6 w-6" />
      </IconButton>
    </header>
  );
};

export default Header;
