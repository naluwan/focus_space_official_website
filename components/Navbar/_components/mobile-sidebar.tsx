'use client';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import sheetLogo from '@/public/sheetLogo.png';
import { NAV_LINKS } from '@/public/constants';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { Sheet, SheetClose, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const MobileSidebar = () => {
  const routes = NAV_LINKS;
  const pathName = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger 
        className='pr-4 transition-all duration-300 hover:scale-110 lg:hidden group'
        onClick={() => setIsOpen(true)}
      >
        <div className="relative">
          <Menu className="h-6 w-6 text-gray-700 group-hover:text-brand-red-600 transition-colors duration-300" />
          <div className="absolute inset-0 bg_brand_gradient opacity-0 group-hover:opacity-20 rounded-full transition-opacity duration-300" />
        </div>
      </SheetTrigger>
      
      <SheetContent side='right' className='bg-white p-0 w-80'>
        <SheetTitle className="sr-only">導航選單</SheetTitle>
        <SheetDescription className="sr-only">網站主要導航選單</SheetDescription>
        <div className='flex h-full flex-col overflow-y-auto bg-gradient-to-b from-white to-gray-50'>
          
          {/* 頂部區域 - 品牌化 */}
          <div className='relative p-6 bg_brand_gradient'>
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <Image
                src={sheetLogo}
                width={140}
                height={40}
                className='h-[96px] w-[192px] filter brightness-0 invert'
                alt='Focus Space Logo'
              />
              <h2 className="text-white font-bold text-lg mt-2">Focus Space</h2>
              <p className="text-white/90 text-sm">專心練健身房</p>
            </div>
          </div>

          {/* 導航選單 */}
          <div className='flex-1 px-6 py-8'>
            <div className='flex w-full flex-col space-y-4'>
              {routes.map((route, index) => {
                const isActive =
                  (pathName === '/' && route.href === '/') ||
                  pathName === route.href ||
                  pathName?.startsWith(`${route.href}/`);

                return (
                  <SheetClose asChild key={route.key}>
                    <Link
                      href={route.href}
                      className={cn(
                        'group relative flex items-center py-4 px-4 rounded-xl transition-all duration-300 transform hover:scale-105',
                        'hover:bg-gray-100 active:scale-95',
                        isActive && 'bg-gray-100 shadow-sm'
                      )}
                      style={{
                        animationDelay: `${index * 100}ms`
                      }}
                    >
                      {/* 左側品牌指示器 */}
                      <div
                        className={cn(
                          'w-1 h-8 bg_brand_gradient rounded-full transition-all duration-300 mr-4',
                          isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0 group-hover:opacity-70 group-hover:scale-100'
                        )}
                      />
                      
                      {/* 文字內容 */}
                      <div className={cn(
                        'font-semibold text-lg transition-all duration-300',
                        isActive ? 'text_brand_gradient' : 'text-gray-700 group-hover:text-gray-900'
                      )}>
                        {route.label}
                      </div>

                      {/* 右側箭頭 */}
                      <div className={cn(
                        'ml-auto transform transition-all duration-300 text-gray-400',
                        'group-hover:translate-x-1 group-hover:text-brand-red-600'
                      )}>
                        →
                      </div>

                      {/* 背景 hover 效果 */}
                      <div className={cn(
                        'absolute inset-0 bg_brand_gradient opacity-0 transition-all duration-300 rounded-xl',
                        'group-hover:opacity-5',
                        isActive && 'opacity-5'
                      )} />
                    </Link>
                  </SheetClose>
                );
              })}
            </div>

            {/* 預約按鈕 */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <SheetClose asChild>
                <Link href="/booking">
                  <button className="btn_brand_primary w-full justify-center">
                    立即預約
                  </button>
                </Link>
              </SheetClose>
            </div>
          </div>

          {/* 底部版權資訊 - 品牌化 */}
          <div className='bg-gray-100 px-6 py-4 border-t border-gray-200'>
            <div className='text-center space-y-1'>
              <p className='text-sm font-semibold text_brand_gradient'>Focus Space 專心練</p>
              <p className='text-xs text-gray-600'>專心練股份有限公司 版權所有</p>
              <p className='text-xs text-gray-500'>
                Copyright 2023 © FOCUS_SPACE Co. Ltd.
              </p>
              <div className="flex justify-center space-x-4 mt-3">
                <div className="w-8 h-0.5 bg_brand_gradient rounded-full"></div>
                <div className="w-4 h-0.5 bg_brand_gradient rounded-full opacity-60"></div>
                <div className="w-2 h-0.5 bg_brand_gradient rounded-full opacity-30"></div>
              </div>
              <p className='text-xs text-gray-400 mt-3'>
                Powered by{' '}
                <a 
                  href='https://www.triplen.design' 
                  target='_blank' 
                  rel='noopener noreferrer'
                  className='text-gray-500 hover:text_brand_gradient transition-colors duration-300 font-medium'
                >
                  仨恩網頁設計工作室
                </a>
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
