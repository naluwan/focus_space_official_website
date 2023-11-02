'use client';

import AboutNavigateBar from './_components/about-navigatebar';
import AboutUs from './_components/about-us';
import AboutHero from './_components/about-hero';
import AboutIntroduce from './_components/about-introduce';

import heroImg1 from '@/public/aboutHero.jpeg';
import heroImg2 from '@/public/aboutHero2.jpg';
import React from 'react';

export interface IRef {
  getCreateDiv: () => HTMLDivElement;
  getIntroduceDiv: () => HTMLDivElement;
}

const AboutPage = () => {
  const aboutRef = React.useRef<IRef>(null);
  const founderRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className='relative h-full bg-black text-white'>
      {/* TODO:導覽列 */}
      <AboutNavigateBar founderRef={founderRef} aboutRef={aboutRef} />
      <AboutHero img={heroImg1} title='about us' />
      <AboutUs ref={aboutRef} />
      <AboutHero img={heroImg2} title='founder' />
      <AboutIntroduce ref={founderRef} />
    </div>
  );
};

export default AboutPage;
