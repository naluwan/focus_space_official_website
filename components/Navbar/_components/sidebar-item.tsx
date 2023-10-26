'use client';

import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';

interface SidebarItemProps {
  label: string;
  href: string;
  device: string;
}
const SidebarItem = ({ label, href, device }: SidebarItemProps) => {
  const pathName = usePathname();
  const router = useRouter();

  const isActive =
    (pathName === '/' && href === '/') ||
    pathName === href ||
    pathName?.startsWith(`${href}/`);

  const onClick = () => {
    router.push(href);
  };

  const ItemContent =
    device === 'desktop' ? (
      <>
        <div className='flex items-center'>{label}</div>
        <div
          className={cn(
            'mt-auto w-full border-2 border-slate-400 opacity-0 transition-all',
            isActive && 'opacity-100',
          )}
        />
      </>
    ) : (
      <>
        <div
          className={cn(
            'mr-auto h-full border-2 border-slate-400 opacity-0 transition-all',
            isActive && 'opacity-100',
          )}
        />
        <div className='flex justify-start pl-2'>{label}</div>
      </>
    );

  return (
    <button
      onClick={onClick}
      type='button'
      className={cn(
        'flex flex-row items-center px-3 text-lg font-[500] text-black transition-all duration-500 hover:text-slate-600',
        isActive && 'text-slate-700 hover:text-slate-600',
        device === 'desktop' && 'flex-col',
      )}
    >
      {ItemContent}
    </button>
  );
};

export default SidebarItem;
