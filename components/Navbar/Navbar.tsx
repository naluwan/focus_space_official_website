import Image from 'next/image';
import Link from 'next/link';
import MobileSidebar from './_components/mobile-sidebar';
import SidebarRoutes from './_components/sidebar-routes';

const Navbar = () => {
  return (
    <nav className='flexBetween max-container padding-container relative z-30 py-5'>
      <Link className='flex' href='/'>
        <Image
          src='/logo.png'
          alt='logo'
          width={60}
          height={60}
          className='h-auto w-auto'
          priority
        />
      </Link>
      <div className='hidden lg:block'>
        <SidebarRoutes device='desktop' />
      </div>
      <MobileSidebar />
    </nav>
  );
};

export default Navbar;
