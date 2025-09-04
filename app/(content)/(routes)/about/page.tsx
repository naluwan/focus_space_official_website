'use client';

import AboutNavigateBar from './_components/about-navigatebar';
import AboutUs from './_components/about-us';
import AboutHero from './_components/about-hero';
import AboutIntroduce from './_components/about-introduce';

import heroImg1 from '@/public/aboutHero.jpeg';
import heroImg2 from '@/public/aboutHero2.jpg';
import React from 'react';
import ScrollToTop from '@/components/ScrollToTop';

export interface IRef {
  getCreateDiv: () => HTMLDivElement;
  getIntroduceDiv: () => HTMLDivElement;
}

const AboutPage = () => {
  const aboutRef = React.useRef<IRef>(null);
  const founderRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // 初始化AOS動畫
    if (typeof window !== 'undefined') {
      const AOS = require('aos');
      require('aos/dist/aos.css');
      AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
      });
    }
  }, []);

  return (
    <div className='relative min-h-screen bg-black text-white'>
      {/* 品牌漸層背景 */}
      <div className='absolute inset-0 bg-gradient-to-br from-red-600/5 via-black to-yellow-500/5' />
      
      <div className='relative'>
        {/* TODO:導覽列 */}
        <AboutNavigateBar founderRef={founderRef} aboutRef={aboutRef} />
        <AboutHero img={heroImg1} title='about us' />
        <AboutUs ref={aboutRef} />
        <AboutHero img={heroImg2} title='founder' />
        <AboutIntroduce ref={founderRef} />
      </div>
      <ScrollToTop />
    </div>
  );
};

export default AboutPage;