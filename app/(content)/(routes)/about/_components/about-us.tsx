import React from 'react';
import LeftContent from './left-content';
import RightContent from './right-content';
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
    <>
      <RightContent
        img={gymPhoto1}
        title='創立初衷'
        content='FOCUS_SPACE 專心練運動空間開幕於2023年4月30日，旨在推廣大眾強身、健體之觀念，在運動的同時給予專業的建議和正確的觀念與姿勢，藉此保護所有運動員的安全與提升運動效果。'
        ref={createRef}
      />
      <LeftContent
        img={gymPhoto2}
        title='健身房簡介'
        content='FOCUS_SPACE 專心練運動空間擁有300坪大空間重量訓練區、齊全的有氧設備並附有淋浴區及休息區，專屬的APP條碼入場，不綁約、單次入場、分鐘入場，讓你更靈活的安排運動時間。'
        ref={introduceRef}
      />
    </>
  );
});

AboutUs.displayName = 'AboutUs';

export default AboutUs;
