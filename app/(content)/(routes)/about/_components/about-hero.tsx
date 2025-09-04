import Image, { StaticImageData } from 'next/image';

interface AboutHeroProps {
  img: StaticImageData;
  title: string;
}

const AboutHero = ({ img, title }: AboutHeroProps) => {
  return (
    <div className='relative z-0 text-white overflow-hidden'>
      {/* 圖片容器加入品牌色彩覆蓋 */}
      <div className='relative'>
        <Image
          src={img}
          width={1440}
          height={400}
          className='h-[500px] w-full object-cover max-md:h-[300px]'
          alt='about hero'
          priority
        />
        {/* 品牌漸層覆蓋 */}
        <div className='absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60' />
      </div>
      
      <div className='flex h-auto w-full flex-col'>
        {/* 標題卡片加入品牌邊框 */}
        <div 
          className='absolute bottom-24 right-20 group max-md:bottom-5 max-md:right-5'
          data-aos='fade-left'
          data-aos-delay='300'
        >
          <div className='relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 to-yellow-500 p-[2px]'>
            <div className='flex h-auto w-full flex-col items-center justify-center rounded-3xl bg-black/80 px-8 py-6 backdrop-blur-xl transition-all duration-300 group-hover:bg-black/70'>
              <h1 className='bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text font-bebas_neue text-5xl tracking-widest text-transparent max-md:text-3xl'>
                {title}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutHero;
