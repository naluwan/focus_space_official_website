'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarItemProps {
  label: string;
  href: string;
  device: string;
}
const SidebarItem = ({ label, href, device }: SidebarItemProps) => {
  const pathName = usePathname();

  const isActive =
    (pathName === '/' && href === '/') ||
    pathName === href ||
    pathName?.startsWith(`${href}/`);

  const ItemContent =
    device === 'desktop' ? (
      <>
        <div className='flex items-center'>{label}</div>
        <div
          className={cn(
            'mt-auto w-full border-2 border-slate-400 opacity-0 transition-all duration-500',
            isActive && 'opacity-100',
          )}
        />
      </>
    ) : (
      <>
        <div
          className={cn(
            'mr-auto h-full border-2 border-slate-400 opacity-0 transition-all duration-500',
            isActive && 'opacity-100',
          )}
        />
        <div className='flex justify-start pl-2'>{label}</div>
      </>
    );

  return (
    <Link
      href={`${href}`}
      type='button'
      className={cn(
        'flex flex-row items-center text-lg font-[500] text-black outline-none transition-all duration-500 hover:text-slate-600',
        isActive && 'text-slate-700 hover:text-slate-600',
        device === 'desktop' && 'flex-col',
      )}
    >
      {ItemContent}
    </Link>
  );
};

export default SidebarItem;
