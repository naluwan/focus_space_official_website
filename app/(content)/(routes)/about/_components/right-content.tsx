import Image, { StaticImageData } from 'next/image';
import React from 'react';

interface RightContentProps {
  img: StaticImageData;
  title: string;
  content: string;
}

const RightContent = React.forwardRef<HTMLDivElement, RightContentProps>(
  ({ img, title, content }, ref) => {
    return (
      <section className='relative min-h-screen flex flex-col lg:grid lg:grid-cols-2 bg-black' ref={ref}>
        {/* 品牌漸層裝飾 */}
        <div className='absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-yellow-500/5' />
        
        {/* 圖片區域 - 桌面版在左，手機版在上 */}
        <div className='relative w-full lg:order-1'>
          <div className='group relative overflow-hidden h-full min-h-[400px] lg:min-h-screen'>
            <Image
              src={img}
              alt='gym photo'
              fill
              className='object-cover transition-all duration-700 group-hover:scale-105'
              priority
              data-aos='fade-right'
              data-aos-delay='200'
            />
            {/* 圖片覆蓋層 */}
            <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent' />
            
            {/* 品牌邊框 */}
            <div className='absolute inset-0 border-2 border-transparent bg-gradient-to-r from-red-600/20 to-yellow-500/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100' />
          </div>
        </div>

        {/* 文字內容區域 - 桌面版在右，手機版在下 */}
        <div className='relative flex items-center justify-center p-8 lg:p-16 lg:order-2'>
          <div 
            className='flex flex-col items-start justify-center max-w-full lg:max-w-[85%]'
            data-aos='fade-left'
            data-aos-delay='300'
          >
            {/* 標題 */}
            <div className='mb-8'>
              <h2 className='mb-4 bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-4xl font-bold text-transparent lg:text-5xl'>
                {title}
              </h2>
              <div className='h-1 w-16 bg-gradient-to-r from-red-600 to-yellow-500' />
            </div>
            
            {/* 內容文字 */}
            <p className='text-lg leading-relaxed text-gray-300 lg:text-xl mb-8'>
              {content}
            </p>
            
            {/* 品牌特色點 */}
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2 w-full'>
              <div className='flex items-center gap-3'>
                <div className='h-3 w-3 rounded-full bg-gradient-to-r from-red-600 to-yellow-500' />
                <span className='text-gray-300'>專業運動空間</span>
              </div>
              <div className='flex items-center gap-3'>
                <div className='h-3 w-3 rounded-full bg-gradient-to-r from-red-600 to-yellow-500' />
                <span className='text-gray-300'>交通便利位置</span>
              </div>
              <div className='flex items-center gap-3'>
                <div className='h-3 w-3 rounded-full bg-gradient-to-r from-red-600 to-yellow-500' />
                <span className='text-gray-300'>寬敞舒適環境</span>
              </div>
              <div className='flex items-center gap-3'>
                <div className='h-3 w-3 rounded-full bg-gradient-to-r from-red-600 to-yellow-500' />
                <span className='text-gray-300'>專業教練指導</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  },
);

RightContent.displayName = 'RightContent';

export default RightContent;