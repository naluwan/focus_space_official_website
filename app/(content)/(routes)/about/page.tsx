'use client';

import AboutNavigateBar from './_components/about-navigatebar';
import AboutUs from './_components/about-us';
import AboutHero from './_components/about-hero';
import AboutIntroduce from './_components/about-introduce';

import heroImg1 from '@/public/aboutHero.jpeg';
import heroImg2 from '@/public/aboutHero2.jpg';
import React from 'react';
import { ArrowUpFromLine } from 'lucide-react';

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
      <button
        className='sticky bottom-4 left-[95%] flex items-center justify-center rounded-full bg-[#FFD531] p-3'
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          })
        }
      >
        <ArrowUpFromLine className='h-8 w-8' />
      </button>
    </div>
  );
};

export default AboutPage;
