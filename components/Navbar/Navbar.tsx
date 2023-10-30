import Image from 'next/image';
import Link from 'next/link';
import MobileSidebar from './_components/mobile-sidebar';
import SidebarRoutes from './_components/sidebar-routes';

const Navbar = () => {
  return (
    <nav className='flexBetween max-container padding-container relative bg-white'>
      <Link className='flex' href='/'>
        <Image
          src='/logo2.png'
          alt='logo'
          width={180}
          height={60}
          className='aspect-auto h-auto w-auto'
          priority
        />
      </Link>
      <div className='hidden lg:flex'>
        <SidebarRoutes device='desktop' />
      </div>
      <MobileSidebar />
    </nav>
  );
};

export default Navbar;
