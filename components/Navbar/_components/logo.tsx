import Image from 'next/image';
import logo from '@/public/logo2.png';

const Logo = () => {
  return (
    <Image
      src={logo}
      alt='logo'
      width={180}
      height={60}
      className='aspect-auto h-[100px] w-[190px]'
      priority
    />
  );
};

export default Logo;
