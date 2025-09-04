'use client';
import { ArrowUp } from 'lucide-react';
import React from 'react';
import { createPortal } from 'react-dom';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      
      setScrollProgress(progress);
      setIsVisible(scrollTop > 300); // 滾動超過300px才顯示
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible || !mounted) return null;

  const buttonElement = (
    <button
      className={`group fixed bottom-8 right-4 md:right-8 z-[999999] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-yellow-500 p-[2px] shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-red-600/25 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
      onClick={scrollToTop}
      aria-label="回到頂部"
      style={{ 
        position: 'fixed', 
        bottom: '2rem', 
        right: '1rem',
        zIndex: 999999,
        pointerEvents: 'auto'
      }}
    >
      {/* 進度環 */}
      <div className="absolute inset-0 rounded-full">
        <svg className="h-full w-full -rotate-90 transform">
          <circle
            cx="50%"
            cy="50%"
            r="22"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="2"
          />
          <circle
            cx="50%"
            cy="50%"
            r="22"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 22}`}
            strokeDashoffset={`${2 * Math.PI * 22 * (1 - scrollProgress / 100)}`}
            className="transition-all duration-300"
          />
        </svg>
      </div>
      
      {/* 按鈕內容 */}
      <div className="flex h-full w-full items-center justify-center rounded-full bg-black transition-all duration-300 group-hover:bg-black/80">
        <ArrowUp className="h-5 w-5 text-white transition-transform duration-300 group-hover:-translate-y-0.5" />
      </div>
      
      {/* Hover效果光暈 */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-600/20 to-yellow-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 blur-xl" />
    </button>
  );

  return createPortal(buttonElement, document.body);
};

export default ScrollToTop;