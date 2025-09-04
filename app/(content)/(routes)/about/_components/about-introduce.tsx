import Image from 'next/image';
import React from 'react';
import founder from '@/public/founder.jpg';

const AboutIntroduce = React.forwardRef<HTMLDivElement, unknown>((props, ref) => {
  return (
    <div className='relative bg-black text-white' ref={ref}>
      {/* 品牌漸層背景 */}
      <div className='bg_brand_gradient absolute inset-0 opacity-10'></div>
      
      <section className='max-container relative flex flex-col items-center py-16 px-6'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl w-full'>
          
          {/* 創辦人資訊 - 左側 */}
          <div className='space-y-8 lg:order-1' data-aos='fade-right' data-aos-delay='300'>
            {/* 標題區 */}
            <div>
              <h2 className='mb-2 text-xl text-gray-400'>創辦人</h2>
              <h1 className='mb-2 font-bebas_neue text-5xl md:text-6xl text-white'>
                唐世昌
              </h1>
              <p className='text-2xl text-brand-yellow-500 mb-4'>「角蚌」教練</p>
              <div className='bg_brand_gradient h-1 w-20'></div>
            </div>

            {/* 經歷與證照 */}
            <div className='space-y-8'>
              {/* 經歷 */}
              <div>
                <h3 className='text-xl font-semibold text-white mb-4'>經歷</h3>
                <div className='space-y-2 text-gray-300'>
                  <p>中國文化大學-國術系-散打搏擊隊</p>
                  <p>中和衛生所健康體重管理配合教練</p>
                  <p>連鎖俱樂部團課教練</p>
                  <p>板橋運動中心-體適能指導教練</p>
                  <p>新莊運動中心-體適能指導教練</p>
                  <p>新五泰運動中心-體適能指導主管</p>
                  <p>中和運動中心-體適能指導主管</p>
                </div>
              </div>

              {/* 證照 */}
              <div>
                <h3 className='text-xl font-semibold text-white mb-4'>證照</h3>
                <div className='space-y-2 text-gray-300'>
                  <p>NASM美國國家運動醫學-CPT</p>
                  <p>IHFI國際康體體適能指導員</p>
                  <p>IHFI國際康體私人教練</p>
                  <p>美國SPINNING國際室內自行車教練✭一星認證</p>
                  <p>SMART CORE筋膜訓練</p>
                  <p>TRX-STC懸吊式訓練師研習證明</p>
                  <p>RED CORE ATLIVE紅繩訓練</p>
                  <p>M.E.T Level 1動作訓練</p>
                  <p>LMU美國地雷管螺旋肌力研習</p>
                  <p>POWER PLATE震動訓練研習</p>
                </div>
              </div>
            </div>
          </div>

          {/* 創辦人照片 - 右側 */}
          <div className='flex justify-center lg:order-2' data-aos='fade-left' data-aos-delay='200'>
            <div className='relative w-full max-w-md'>
              <Image
                src={founder}
                alt='創辦人 唐世昌'
                width={400}
                height={400}
                className='w-full h-auto object-cover rounded-2xl transition-transform duration-500 hover:scale-105'
                priority
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-2xl'></div>
              
              {/* 底部標籤 */}
              <div className='absolute bottom-6 left-6 text-white'>
                <p className='text-sm text-gray-300'>FOCUS_SPACE 專心練運動空間</p>
                <p className='text-lg font-bold'>執行長</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});

AboutIntroduce.displayName = 'AboutIntroduce';

export default AboutIntroduce;