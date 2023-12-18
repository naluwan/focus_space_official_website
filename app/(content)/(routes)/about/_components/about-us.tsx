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
        title='品牌理念'
        content='FOCUS_SPACE 專心練運動空間提供所有會員「在好的運動空間專心練」，主打交通便利的大坪數的空間，無壓力、無綁約、無推銷，以寬敞舒適的環境、公開透明的收費、友善親切的服務、專業細心的教學，來幫助會員在每一次的巡練及課程中達到自我理想獲得強健的身心。'
        ref={introduceRef}
      />
    </>
  );
});

AboutUs.displayName = 'AboutUs';

export default AboutUs;
