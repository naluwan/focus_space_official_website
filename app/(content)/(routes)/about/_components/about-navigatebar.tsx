import React from 'react';
import { IRef } from '../page';

interface AboutNavigateBarProps {
  aboutRef: React.RefObject<IRef>;
  founderRef: React.RefObject<HTMLDivElement>;
}

const AboutNavigateBar = ({ aboutRef, founderRef }: AboutNavigateBarProps) => {
  const scrollToCreate = () => {
    aboutRef.current?.getCreateDiv().scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToIntroduce = () => {
    aboutRef.current?.getIntroduceDiv().scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToFounder = () => {
    founderRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className='sticky top-0 z-10 flex items-center justify-center bg-black py-4'>
      <div className='flex gap-x-8 text-lg font-bold'>
        <button
          className='transition-all delay-200 duration-500 hover:scale-110'
          onClick={scrollToCreate}
        >
          創立初衷
        </button>
        <button
          className='transition-all delay-200 duration-500 hover:scale-110'
          onClick={scrollToIntroduce}
        >
          品牌理念
        </button>
        <button
          className='transition-all delay-200 duration-500 hover:scale-110'
          onClick={scrollToFounder}
        >
          創辦人介紹
        </button>
      </div>
    </nav>
  );
};

export default AboutNavigateBar;
