import React from 'react';
import { IRef } from '../page';

interface AboutNavigateBarProps {
  aboutRef: React.RefObject<IRef | null>;
  founderRef: React.RefObject<HTMLDivElement | null>;
}

const AboutNavigateBar = ({ aboutRef, founderRef }: AboutNavigateBarProps) => {
  const [activeSection, setActiveSection] = React.useState('create');

  // 監聽滾動事件，自動更新活躍section
  React.useEffect(() => {
    const handleScroll = () => {
      const createDiv = aboutRef.current?.getCreateDiv();
      const introduceDiv = aboutRef.current?.getIntroduceDiv();
      const founderDiv = founderRef.current;

      if (!createDiv || !introduceDiv || !founderDiv) return;

      const scrollPosition = window.scrollY + 150; // 固定偏移量
      
      const introduceTop = introduceDiv.offsetTop;
      const founderTop = founderDiv.offsetTop;

      // 簡化邏輯：根據滾動位置判斷當前section
      if (scrollPosition >= founderTop) {
        setActiveSection('founder');
      } else if (scrollPosition >= introduceTop) {
        setActiveSection('introduce');
      } else {
        setActiveSection('create');
      }
    };

    window.addEventListener('scroll', handleScroll);
    // 初始化檢查
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [aboutRef, founderRef]);

  const scrollToCreate = () => {
    aboutRef.current?.getCreateDiv().scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToIntroduce = () => {
    aboutRef.current?.getIntroduceDiv().scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToFounder = () => {
    founderRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const navItems = [
    { id: 'create', label: '創立初衷', onClick: scrollToCreate },
    { id: 'introduce', label: '品牌理念', onClick: scrollToIntroduce },
    { id: 'founder', label: '創辦人介紹', onClick: scrollToFounder },
  ];

  return (
    <nav className='sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-gray-800'>
      <div className='max-container flex items-center justify-center py-4'>
        <div className='flex gap-x-2 rounded-full bg-gray-900/50 p-2 backdrop-blur-sm border border-gray-800'>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`relative overflow-hidden rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 hover:scale-105 ${
                activeSection === item.id
                  ? 'bg-gradient-to-r from-red-600 to-yellow-500 text-white scale-105'
                  : 'text-gray-300 hover:text-white'
              }`}
              onClick={item.onClick}
            >
              {/* 背景動畫 */}
              {activeSection !== item.id && (
                <div className='absolute inset-0 rounded-full bg-gradient-to-r from-red-600/20 to-yellow-500/20 opacity-0 transition-opacity duration-300 hover:opacity-100' />
              )}
              <span className='relative z-10'>{item.label}</span>
              
              {/* 活躍指示器 */}
              {activeSection === item.id && (
                <div className='absolute -bottom-1 left-1/2 h-1 w-6 -translate-x-1/2 rounded-full bg-white opacity-80' />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default AboutNavigateBar;