import React from 'react';
import Image from 'next/image';
import gymPhoto1 from '@/public/aboutGym.jpg';
import gymPhoto2 from '@/public/aboutGym2.jpg';
import { IRef } from '../page';

const AboutUs = React.forwardRef<IRef>((props, ref) => {
  const createRef = React.useRef<HTMLDivElement>(null);
  const introduceRef = React.useRef<HTMLDivElement>(null);

  React.useImperativeHandle(ref, () => ({
    getCreateDiv() {
      return createRef.current as HTMLDivElement;
    },
    getIntroduceDiv() {
      return introduceRef.current as HTMLDivElement;
    },
  }));

  return (
    <div className='relative bg-black text-white'>
      {/* 品牌漸層背景 */}
      <div className='bg_brand_gradient absolute inset-0 opacity-10'></div>
      
      {/* 創立初衷 */}
      <section className='max-container relative flex flex-col items-center py-16 px-6' ref={createRef}>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl w-full'>
          {/* 圖片 - 左側 */}
          <div className='relative lg:order-1' data-aos='fade-right' data-aos-delay='200'>
            <div className='relative aspect-[4/3] w-full overflow-hidden rounded-2xl'>
              <Image
                src={gymPhoto1}
                alt='FOCUS_SPACE 健身房環境'
                fill
                className='object-cover transition-transform duration-500 hover:scale-105'
                priority
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent'></div>
            </div>
          </div>

          {/* 內容 - 右側 */}
          <div className='space-y-6 lg:order-2' data-aos='fade-left' data-aos-delay='300'>
            <div>
              <h2 className='mb-4 font-bebas_neue text-5xl md:text-6xl text-white'>
                創立初衷
              </h2>
              <div className='bg_brand_gradient h-1 w-20 mb-6'></div>
            </div>
            
            <p className='text-lg leading-relaxed text-gray-300'>
              FOCUS_SPACE 專心練運動空間開幕於2023年4月30日，旨在推廣大眾強身、健體之觀念，在運動的同時給予專業的建議和正確的觀念與姿勢，藉此保護所有運動員的安全與提升運動效果。
            </p>
          </div>
        </div>
      </section>

      {/* 品牌理念 */}
      <section className='max-container relative flex flex-col items-center py-16 px-6' ref={introduceRef}>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl w-full'>
          {/* 內容 - 左側 */}
          <div className='space-y-6 lg:order-1' data-aos='fade-right' data-aos-delay='300'>
            <div>
              <h2 className='mb-4 font-bebas_neue text-5xl md:text-6xl text-white'>
                品牌理念
              </h2>
              <div className='bg_brand_gradient h-1 w-20 mb-6'></div>
            </div>
            
            <p className='text-lg leading-relaxed text-gray-300'>
              FOCUS_SPACE 專心練運動空間提供所有會員「在好的運動空間專心練」，主打交通便利的大坪數的空間，無壓力、無綁約、無推銷，以寬敞舒適的環境、公開透明的收費、友善親切的服務、專業細心的教學，來幫助會員在每一次的巡練及課程中達到自我理想獲得強健的身心。
            </p>
          </div>

          {/* 圖片 - 右側 */}
          <div className='relative lg:order-2' data-aos='fade-left' data-aos-delay='200'>
            <div className='relative aspect-[4/3] w-full overflow-hidden rounded-2xl'>
              <Image
                src={gymPhoto2}
                alt='FOCUS_SPACE 健身房設備'
                fill
                className='object-cover transition-transform duration-500 hover:scale-105'
                priority
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent'></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});

AboutUs.displayName = 'AboutUs';

export default AboutUs;