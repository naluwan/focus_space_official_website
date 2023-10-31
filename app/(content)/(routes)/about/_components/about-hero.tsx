import Image, { StaticImageData } from 'next/image';

interface AboutHeroProps {
  img: StaticImageData;
  title: string;
}

const AboutHero = ({ img, title }: AboutHeroProps) => {
  return (
    <div className='relative z-0 text-white'>
      <Image
        src={img}
        width={1440}
        height={400}
        className='h-[500px] w-full object-cover max-md:h-[300px]'
        alt='about hero'
      />
      <div className='flex h-auto w-full flex-col'>
        <div className='absolute bottom-24 right-20 flex h-auto w-[20%] max-w-[20%] flex-col items-center justify-center rounded-3xl bg-black/30 px-4 py-6 font-bold backdrop-blur-xl max-md:bottom-5 max-md:right-5 max-md:w-[50%] max-md:max-w-[50%]'>
          <h1 className='font-bebas_neue text-4xl tracking-widest max-md:text-2xl'>
            {title}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default AboutHero;
