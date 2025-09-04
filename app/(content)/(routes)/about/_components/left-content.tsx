import Image, { StaticImageData } from 'next/image';
import React from 'react';

interface LeftContentProps {
  img: StaticImageData;
  title: string;
  content: string;
}

const LeftContent = React.forwardRef<HTMLDivElement, LeftContentProps>(
  ({ img, title, content }, ref) => {
    return (
      <section className='relative min-h-screen flex flex-col lg:grid lg:grid-cols-2 bg-black' ref={ref}>
        {/* 品牌漸層裝飾 */}
        <div className='absolute inset-0 bg-gradient-to-bl from-yellow-500/5 via-transparent to-red-600/5' />
        
        {/* 文字內容區域 - 桌面版在左，手機版在上 */}
        <div className='relative flex items-center justify-center p-8 lg:p-16 lg:order-1'>
          <div 
            className='flex flex-col items-start justify-center max-w-full lg:max-w-[85%]'
            data-aos='fade-right'
            data-aos-delay='300'
          >
            {/* 標題 */}
            <div className='mb-8'>
              <h2 className='mb-4 bg-gradient-to-r from-yellow-500 to-red-600 bg-clip-text text-4xl font-bold text-transparent lg:text-5xl'>
                {title}
              </h2>
              <div className='h-1 w-16 bg-gradient-to-r from-yellow-500 to-red-600' />
            </div>
            
            {/* 內容文字 */}
            <p className='text-lg leading-relaxed text-gray-300 lg:text-xl mb-8'>
              {content}
            </p>
            
            {/* 服務承諾 */}
            <div className='w-full'>
              <h3 className='text-xl font-semibold text-yellow-500 mb-4'>我們的承諾</h3>
              <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                <div className='flex items-center gap-3'>
                  <div className='h-3 w-3 rounded-full bg-gradient-to-r from-yellow-500 to-red-600' />
                  <span className='text-gray-300'>無壓力環境</span>
                </div>
                <div className='flex items-center gap-3'>
                  <div className='h-3 w-3 rounded-full bg-gradient-to-r from-yellow-500 to-red-600' />
                  <span className='text-gray-300'>無綁約政策</span>
                </div>
                <div className='flex items-center gap-3'>
                  <div className='h-3 w-3 rounded-full bg-gradient-to-r from-yellow-500 to-red-600' />
                  <span className='text-gray-300'>無推銷承諾</span>
                </div>
                <div className='flex items-center gap-3'>
                  <div className='h-3 w-3 rounded-full bg-gradient-to-r from-yellow-500 to-red-600' />
                  <span className='text-gray-300'>透明收費</span>
                </div>
              </div>
            </div>
            
            {/* CTA 按鈕 */}
            <button className='group relative mt-8 overflow-hidden rounded-full bg-gradient-to-r from-yellow-500 to-red-600 p-[2px] transition-all duration-300 hover:scale-110'>
              <span className='flex items-center gap-2 rounded-full bg-black px-6 py-3 text-white transition-all duration-300 group-hover:bg-black/80'>
                <span>立即體驗</span>
                <svg className='h-4 w-4 transition-transform group-hover:translate-x-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6' />
                </svg>
              </span>
            </button>
          </div>
        </div>

        {/* 圖片區域 - 桌面版在右，手機版在下 */}
        <div className='relative w-full lg:order-2'>
          <div className='group relative overflow-hidden h-full min-h-[400px] lg:min-h-screen'>
            <Image
              src={img}
              alt='gym photo'
              fill
              className='object-cover transition-all duration-700 group-hover:scale-105'
              priority
              data-aos='fade-left'
              data-aos-delay='200'
            />
            {/* 圖片覆蓋層 */}
            <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent' />
            
            {/* 品牌邊框 */}
            <div className='absolute inset-0 border-2 border-transparent bg-gradient-to-r from-yellow-500/20 to-red-600/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100' />
          </div>
        </div>
      </section>
    );
  },
);

LeftContent.displayName = 'LeftContent';

export default LeftContent;