import Image from 'next/image';
import SidebarRoutes from './sidebar-routes';
import sheetLogo from '@/public/sheetLogo.png';

const Sidebar = () => {
  return (
    <div className='flex h-full flex-col overflow-y-auto border-r bg-white shadow-sm'>
      <div className='p-6'>
        <Image
          src={sheetLogo}
          width={140}
          height={40}
          className='h-[96px] w-[192px]'
          alt='sheet-logo'
        />
      </div>
      <div className='flex w-full flex-col'>
        <SidebarRoutes device='mobile' />
      </div>
    </div>
  );
};

export default Sidebar;
