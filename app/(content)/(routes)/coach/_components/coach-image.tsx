'use client';
import Image, { StaticImageData } from 'next/image';
import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface CoachImageProps {
  img: StaticImageData;
  delay: number;
}

const CoachImage = ({ img, delay }: CoachImageProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const openModal = () => {
    setIsOpen(true);
    // 防止背景滾動並確保彈窗在最上層
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'relative';
    document.body.style.zIndex = '0';
    
    // 延遲一幀讓DOM更新後再觸發動畫
    requestAnimationFrame(() => {
      setIsAnimating(true);
    });
  };

  const closeModal = () => {
    setIsAnimating(false);
    // 等待動畫完成後關閉modal
    setTimeout(() => {
      setIsOpen(false);
      document.body.style.overflow = 'unset';
      document.body.style.position = '';
      document.body.style.zIndex = '';
    }, 300);
  };

  // 按ESC鍵關閉
  React.useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        closeModal();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  return (
    <>
      {/* 教練照片縮圖 */}
      <button
        onClick={openModal}
        className='group relative overflow-hidden rounded-lg transition-all duration-500 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-black'
        data-aos='flip-up'
        data-aos-delay={delay}
        data-aos-once
      >
        <Image
          src={img}
          alt='coach image'
          height={300}
          width={400}
          className='h-auto w-full object-cover transition-all duration-500 group-hover:scale-110'
          priority
          placeholder='blur'
        />
        
        {/* Hover 覆蓋層 */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
        
        {/* 點擊提示 */}
        <div className='absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
          <div className='rounded-full bg-gradient-to-r from-red-600 to-yellow-500 p-3'>
            <svg className='h-6 w-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7' />
            </svg>
          </div>
        </div>
      </button>

      {/* 全屏模態框 - 使用Portal渲染到body */}
      {isOpen && mounted && createPortal(
        <div
          className={`fixed inset-0 z-[99999] flex items-center justify-center bg-black transition-all duration-300 ${
            isAnimating ? 'bg-opacity-90' : 'bg-opacity-0'
          }`}
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label="教練照片放大檢視"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          {/* 關閉按鈕 */}
          <button
            onClick={closeModal}
            className={`absolute right-4 top-4 z-10 rounded-full bg-gradient-to-r from-red-600 to-yellow-500 p-2 text-white transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white ${
              isAnimating ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
            }`}
            style={{ transitionDelay: isAnimating ? '200ms' : '0ms' }}
          >
            <X size={24} />
          </button>

          {/* 放大的照片容器 */}
          <div
            className={`relative max-h-[90vh] max-w-[90vw] transition-all duration-500 ease-out ${
              isAnimating 
                ? 'scale-100 opacity-100' 
                : 'scale-75 opacity-0'
            }`}
            onClick={(e) => e.stopPropagation()}
            style={{ transitionDelay: isAnimating ? '100ms' : '0ms' }}
            role="img"
            aria-label="放大的教練照片"
          >
            {/* 品牌邊框 */}
            <div className='relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 to-yellow-500 p-1'>
              <div className='overflow-hidden rounded-xl bg-black p-2'>
                <Image
                  src={img}
                  alt='coach image enlarged'
                  width={900}
                  height={700}
                  className='h-auto max-h-[80vh] w-auto max-w-full rounded-lg object-contain'
                  priority
                />
              </div>
            </div>

          </div>

          {/* 背景模糊效果 */}
          <div 
            className={`absolute inset-0 -z-10 backdrop-blur-sm transition-all duration-300 ${
              isAnimating ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>,
        document.body
      )}
    </>
  );
};

export default CoachImage;