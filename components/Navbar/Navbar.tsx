'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import MobileSidebar from './_components/mobile-sidebar';
import SidebarRoutes from './_components/sidebar-routes';
import Logo from './_components/logo';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // 監聽滾動以改變導航樣式
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 載入動畫
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <nav 
      className={`
        flexBetween max-container relative px-4 py-2 transition-all duration-500 z-50
        ${scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
          : 'bg-white'
        }
        ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
      `}
    >
      {/* Logo 區域 - 添加 hover 效果 */}
      <Link 
        className='flex transform transition-all duration-300 hover:scale-105' 
        href='/'
      >
        <Logo />
      </Link>

      {/* 桌面版導航 */}
      <div className='hidden lg:flex items-center space-x-8'>
        <SidebarRoutes device='desktop' />
        
        {/* 品牌化 CTA 按鈕 */}
        <div className={`
          transform transition-all duration-700 delay-500
          ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}
        `}>
          <Link href="/booking">
            <button className="group relative overflow-hidden rounded-full bg-gradient-to-r from-red-600 to-yellow-500 p-[2px] transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-600/25">
              <span className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition-all duration-300 group-hover:bg-white/90">
                立即預約
              </span>
            </button>
          </Link>
        </div>
      </div>

      {/* 手機版選單 */}
      <MobileSidebar />

      {/* 導航底部品牌線條 */}
      <div 
        className={`
          absolute bottom-0 left-0 h-1 bg_brand_gradient transition-all duration-1000
          ${scrolled ? 'w-full opacity-100' : 'w-0 opacity-0'}
        `}
      />
    </nav>
  );
};

export default Navbar;
