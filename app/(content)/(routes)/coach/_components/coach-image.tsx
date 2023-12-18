import Image, { StaticImageData } from 'next/image';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

import Aos from 'aos';
import React from 'react';

interface CoachImageProps {
  img: StaticImageData;
  delay: number;
}

const CoachImage = ({ img, delay }: CoachImageProps) => {
  React.useEffect(() => {
    Aos.init();
  }, []);

  return (
    <Dialog>
      <Image
        src={img}
        alt='coach image'
        height={300}
        width={400}
        className='block h-auto w-auto transition-all duration-500 hover:scale-110 md:hidden'
        data-aos='fade-up'
        data-aos-anchor-placement='center-bottom'
        data-aos-once
        priority
        placeholder='blur'
      />
      <DialogTrigger asChild className='hidden md:block'>
        <button>
          <Image
            src={img}
            alt='coach image'
            height={300}
            width={400}
            className='h-auto w-auto transition-all duration-500 hover:scale-110'
            data-aos='flip-up'
            data-aos-delay={delay}
            data-aos-once
            priority
            placeholder='blur'
          />
        </button>
      </DialogTrigger>
      <DialogContent className='flex max-h-[750px] max-w-[970px] items-center justify-center data-[state=open]:duration-500 max-md:hidden '>
        <Image
          src={img}
          alt='coach image'
          height={200}
          width={300}
          className='h-auto w-auto md:h-[700px] md:w-[900px]'
          priority
        />
      </DialogContent>
    </Dialog>
  );
};

export default CoachImage;
