'use client';

import React, { useState, useEffect } from 'react';
import {
  MicroButton,
  useButtonLoading,
} from '@/components/MicroInteractions/MicroInteractions';
import { ArrowDown, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Hero = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // 使用微互動系統的按鈕載入狀態
  const {
    isLoading: isBookingLoading,
    startLoading: startBooking,
    stopLoading: stopBooking,
  } = useButtonLoading();

  const typingTexts = React.useMemo(
    () => ['Focus Space', '專心練', 'Your Training Space', '健身房'],
    [],
  );

  // 組件載入動畫
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // 真正的打字機效果
  useEffect(() => {
    const fullText = typingTexts[currentTextIndex];

    const timer = setTimeout(
      () => {
        if (isDeleting) {
          // 刪除字符
          setCurrentText(fullText.substring(0, currentText.length - 1));

          if (currentText === '') {
            setIsDeleting(false);
            setCurrentTextIndex((prev) => (prev + 1) % typingTexts.length);
          }
        } else {
          // 添加字符
          setCurrentText(fullText.substring(0, currentText.length + 1));

          if (currentText === fullText) {
            setTimeout(() => setIsDeleting(true), 1500); // 完整顯示1.5秒後開始刪除
          }
        }
      },
      isDeleting ? 50 : 100,
    ); // 刪除快於打字

    return () => clearTimeout(timer);
  }, [currentText, currentTextIndex, isDeleting, typingTexts]);

  return (
    <div className='relative h-[90vh] overflow-hidden'>
      {/* 背景動畫粒子 */}
      <div className='absolute inset-0 bg-black'>
        <div className='bg_brand_gradient absolute inset-0 opacity-10'></div>
        {/* 浮動幾何圖形 */}
        <div className='absolute left-1/4 top-1/4 h-32 w-32 animate-pulse rounded-full bg-brand-red-600 opacity-20'></div>
        <div className='absolute right-1/3 top-1/2 h-24 w-24 animate-bounce rounded-full bg-brand-yellow-500 opacity-20'></div>
        <div className='absolute bottom-1/3 left-1/2 h-16 w-16 rotate-45 animate-spin bg-brand-red-300 opacity-30'></div>
      </div>

      {/* 主要內容 */}
      <div className='relative z-10 h-full p-6 text-white'>
        <div
          className={`flex h-full flex-col pt-12 font-bebas_neue text-5xl transition-all duration-1000 max-md:items-center max-md:pb-32 md:pt-16 md:text-7xl lg:pb-40 lg:pt-8 lg:text-6xl xl:pt-12 xl:text-7xl ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          {/* Focus On - 滑入動畫 */}
          <div
            className={`transform py-2 transition-all delay-300 duration-1000 md:py-4 lg:py-0 xl:py-6 ${
              isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
            }`}
          >
            <h1 className='relative'>
              <span className='text_brand_gradient font-bold tracking-wider drop-shadow-lg'>
                Focus
              </span>{' '}
              <span className='text-white drop-shadow-lg'>On</span>
            </h1>
          </div>

          {/* Your Own - 中央縮放動畫 */}
          <div
            className={`delay-600 flex transform justify-center py-2 transition-all duration-1000 md:py-4 lg:py-0 xl:py-6 ${
              isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            }`}
          >
            <h1 className='tracking-wide text-white drop-shadow-lg'>Your Own</h1>
          </div>

          {/* Training Space - 滑入動畫 */}
          <div
            className={`delay-900 flex transform justify-end py-2 transition-all duration-1000 md:py-4 lg:py-0 xl:py-6 ${
              isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            }`}
          >
            <h1 className='relative'>
              <span className='text-white drop-shadow-lg'>Training</span>{' '}
              <span className='text_brand_gradient font-bold tracking-wider drop-shadow-lg'>
                Space
              </span>
            </h1>
          </div>
        </div>
        {/* 打字機效果和CTA按鈕區域 */}
        <div
          className={`delay-1200 absolute bottom-24 left-1/2 w-full -translate-x-1/2 transform px-4 text-center transition-all duration-1000 max-md:bottom-20 lg:bottom-32 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className='text_brand_gradient mb-4 flex min-h-[3rem] items-center justify-center text-xl font-semibold max-md:mb-3 max-md:min-h-[2.5rem] max-md:text-lg md:text-3xl lg:text-3xl xl:text-4xl'>
            <span className='break-words'>{currentText}</span>
            <span className='animate-blink ml-2 inline-block h-6 w-0.5 flex-shrink-0 bg-brand-yellow-500 max-md:h-5 md:h-8 lg:h-8 xl:h-10'></span>
          </div>
          <p className='mx-auto mb-6 max-w-2xl text-base leading-relaxed text-gray-300 max-md:mb-4 max-md:text-sm md:text-lg lg:text-xl xl:text-2xl'>
            板橋最專業的健身空間，專注於您的個人訓練目標
          </p>

          <MicroButton
            variant='primary'
            size='lg'
            loading={isBookingLoading}
            onClick={() => {
              startBooking();
              // 導航到預約頁面
              setTimeout(() => {
                stopBooking();
                router.push('/booking');
              }, 1000);
            }}
            withIcon
            sparkle
            className='min-w-[200px] px-8 py-4 text-lg'
          >
            <Calendar className='h-5 w-5' />
            立即預約體驗
          </MicroButton>
        </div>
      </div>

      {/* 滾動提示 */}
      <div
        className={`delay-2000 absolute bottom-4 left-1/2 -translate-x-1/2 transform text-white transition-all duration-1000 max-md:bottom-2 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className='group flex cursor-pointer flex-col items-center transition-colors duration-300 hover:text-brand-yellow-400'>
          <span className='mb-2 text-xs transition-transform duration-200 group-hover:scale-105 max-md:text-[10px] md:text-sm'>
            向下滾動探索更多
          </span>
          <ArrowDown className='h-5 w-5 animate-bounce transition-transform duration-300 group-hover:scale-110 group-hover:animate-pulse max-md:h-4 max-md:w-4 md:h-6 md:w-6' />

          {/* 脈動環效果 */}
          <div className='animate-pulse-ring absolute -inset-2 rounded-full border border-brand-yellow-500/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100'></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
