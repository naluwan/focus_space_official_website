import Image, { StaticImageData } from 'next/image';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface CoachImageProps {
  img: StaticImageData;
}

const CoachImage = ({ img }: CoachImageProps) => {
  return (
    <Dialog>
      <Image
        src={img}
        alt='coach image'
        height={200}
        width={300}
        className='block h-[300px] w-[400px] transition-all duration-500 hover:scale-110 md:hidden'
        priority
      />
      <DialogTrigger asChild className='hidden md:block'>
        <button>
          <Image
            src={img}
            alt='coach image'
            height={200}
            width={300}
            className='h-[300px] w-[400px] transition-all duration-500 hover:scale-110'
            priority
          />
        </button>
      </DialogTrigger>
      <DialogContent className='flex max-h-[750px] max-w-[970px] items-center justify-center data-[state=open]:duration-500 max-md:hidden '>
        <Image
          src={img}
          alt='coach image'
          height={200}
          width={300}
          className='h-auto w-[90%] md:h-[700px] md:w-[900px]'
          priority
        />
      </DialogContent>
    </Dialog>
  );
};

export default CoachImage;
