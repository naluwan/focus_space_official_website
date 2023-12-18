'use client';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import sheetLogo from '@/public/sheetLogo.png';
import { NAV_LINKS } from '@/public/constants';
import { usePathname } from 'next/navigation';

import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const MobileSidebar = () => {
  const routes = NAV_LINKS;
  const pathName = usePathname();

  return (
    <Sheet>
      <SheetTrigger className='pr-4 transition hover:opacity-75 lg:hidden'>
        <Menu />
      </SheetTrigger>
      <SheetContent side='right' className='bg-white p-0'>
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
          <div className='flex h-full w-full flex-col'>
            <div className={cn('flex w-full flex-col items-start gap-y-2')}>
              {routes.map((route) => {
                const isActive =
                  (pathName === '/' && route.href === '/') ||
                  pathName === route.href ||
                  pathName?.startsWith(`${route.href}/`);

                const ItemContent = (
                  <>
                    <div
                      className={cn(
                        'mr-auto h-full border-2 border-slate-400 opacity-0 transition-all duration-500',
                        isActive && 'opacity-100',
                      )}
                    />
                    <div className='flex justify-start pl-2'>{route.label}</div>
                  </>
                );

                return (
                  <SheetClose asChild key={route.key}>
                    <Link
                      href={route.href}
                      type='button'
                      className={cn(
                        'flex h-full flex-row items-center text-lg font-[500] text-black outline-none transition-all duration-500 hover:text-slate-600',
                        isActive && 'text-slate-700 hover:text-slate-600',
                      )}
                    >
                      {ItemContent}
                    </Link>
                  </SheetClose>
                );
              })}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
