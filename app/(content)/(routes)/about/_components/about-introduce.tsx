import Image from 'next/image';
import React from 'react';

const AboutIntroduce = React.forwardRef<HTMLDivElement, unknown>((props, ref) => {
  return (
    <div className='max-container mt-8 flex flex-col bg-black p-6 md:flex-row'>
      <div className='flex w-full flex-col items-center justify-center gap-y-2 p-0 md:order-2 md:p-4'>
        <Image
          src='/founder.jpg'
          alt='gym photo'
          width={300}
          height={300}
          className='aspect-square w-full object-contain'
        />
        <p className='text-xs md:text-base'>FOCUS_SPACE 專心練運動空間 執行長</p>
      </div>

      <div className='flex w-full items-start justify-center p-4 md:order-1' ref={ref}>
        <div className='flex flex-col items-start justify-center'>
          <h1 className='mb-2 text-xl'>創辦人</h1>
          <h1 className='mb-4 text-4xl font-bold'>
            唐世昌 <span className='text-2xl'>「角蚌」教練</span>
          </h1>
          <div className='flex flex-col gap-2 md:flex-row'>
            <div className='flex flex-col items-start gap-y-2 text-sm'>
              <h1 className='my-2 text-xl'>經歷</h1>
              <p>中國文化大學-國術系-散打搏擊隊</p>
              <p>中和衛生所健康體重管理配合教練</p>
              <p>連鎖俱樂部團課教練</p>
              <p>板橋運動中心-體適能指導教練</p>
              <p>新莊運動中心-體適能指導教練</p>
              <p>新五泰運動中心-體適能指導主管</p>
              <p>中和運動中心-體適能指導主管</p>
            </div>

            <div className='flex flex-col items-start gap-y-2 text-sm'>
              <h1 className='my-2 text-xl'>證照</h1>
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
    </div>
  );
});

AboutIntroduce.displayName = 'AboutIntroduce';

export default AboutIntroduce;
