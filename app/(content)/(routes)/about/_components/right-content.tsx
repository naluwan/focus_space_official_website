import Image, { StaticImageData } from 'next/image';
import React from 'react';

interface RightContentProps {
  img: StaticImageData;
  title: string;
  content: string;
}

const RightContent = React.forwardRef<HTMLDivElement, RightContentProps>(
  ({ img, title, content }, ref) => {
    return (
      <div className='flex flex-col bg-black md:grid md:grid-cols-2' ref={ref}>
        <div className='hidden w-full md:block'>
          <Image
            src={img}
            alt='gym photo'
            width={300}
            height={300}
            className='aspect-square h-auto max-h-[800px] w-full object-cover'
            priority
          />
        </div>

        <div className='flex w-full items-center justify-center p-6'>
          <div className='flex flex-col items-start justify-center xl:max-w-[50%]'>
            <h1 className='mb-4 text-4xl'>{title}</h1>
            <p className='leading-loose'>{content}</p>
          </div>
        </div>
      </div>
    );
  },
);

RightContent.displayName = 'RightContent';

export default RightContent;
