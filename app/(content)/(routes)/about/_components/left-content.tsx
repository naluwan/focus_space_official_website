import Image, { StaticImageData } from 'next/image';
import React from 'react';

interface LeftContentProps {
  img: StaticImageData;
  title: string;
  content: string;
}

const LeftContent = React.forwardRef<HTMLDivElement, LeftContentProps>(
  ({ img, title, content }, ref) => {
    return (
      <div className='flex flex-col bg-black md:grid md:grid-cols-2'>
        <div className='w-full md:order-2' ref={ref}>
          <Image
            src={img}
            alt='gym photo'
            width={300}
            height={300}
            className='aspect-square h-auto max-h-[800px] w-full object-cover'
            priority
          />
        </div>

        <div className='flex w-full items-center justify-center p-6 md:order-1'>
          <div className='flex flex-col items-start justify-center xl:max-w-[50%]'>
            <h1 className='mb-4 text-4xl'>{title}</h1>
            <p className='leading-loose'>{content}</p>
          </div>
        </div>
      </div>
    );
  },
);

LeftContent.displayName = 'LeftContent';

export default LeftContent;
