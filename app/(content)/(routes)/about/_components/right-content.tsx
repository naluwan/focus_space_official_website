import Image, { StaticImageData } from 'next/image';

interface RightContentProps {
  img: StaticImageData;
  title: string;
  content: string;
}

const RightContent = ({ img, title, content }: RightContentProps) => {
  return (
    <div className='flex flex-col bg-black md:grid md:grid-cols-2'>
      <div className='hidden w-full md:block'>
        <Image
          src={img}
          alt='gym photo'
          width={300}
          height={300}
          className='aspect-square h-auto max-h-[800px] w-full object-cover'
        />
      </div>

      <div className='flex w-full items-center justify-center p-6'>
        <div className='flex flex-col items-start justify-center xl:max-w-[50%]'>
          <h1 className='mb-4 text-4xl'>{title}</h1>
          <p>{content}</p>
        </div>
      </div>
    </div>
  );
};

export default RightContent;
