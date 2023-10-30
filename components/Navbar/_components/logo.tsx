import Image from 'next/image';

const Logo = () => {
  return (
    <Image
      src='/logo2.png'
      alt='logo'
      width={180}
      height={60}
      className='aspect-auto h-auto w-auto'
      priority
    />
  );
};

export default Logo;
