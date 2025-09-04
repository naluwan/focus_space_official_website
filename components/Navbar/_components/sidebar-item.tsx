'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface SidebarItemProps {
  label: string;
  href: string;
  device: string;
}

const SidebarItem = ({ label, href, device }: SidebarItemProps) => {
  const pathName = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  const isActive =
    (pathName === '/' && href === '/') ||
    pathName === href ||
    pathName?.startsWith(`${href}/`);

  const ItemContent =
    device === 'desktop' ? (
      <>
        <div className={cn(
          'flex items-center font-medium transition-all duration-300 relative',
          isActive 
            ? 'text-gray-900' 
            : 'text-gray-600',
          isHovered && 'text-gray-900'
        )}>
          {label}
          {/* 桌面版：簡潔的底部線條 */}
          <div
            className={cn(
              'absolute -bottom-1 left-0 h-0.5 bg-gray-900 transition-all duration-300',
              isActive ? 'w-full opacity-100' : isHovered ? 'w-full opacity-60' : 'w-0 opacity-0'
            )}
          />
        </div>
      </>
    ) : (
      <>
        {/* 手機版：左側簡潔線條 */}
        <div
          className={cn(
            'mr-auto h-full w-1 bg-gray-900 transition-all duration-300',
            isActive ? 'opacity-100' : isHovered ? 'opacity-60' : 'opacity-0'
          )}
        />
        <div className={cn(
          'flex justify-start pl-3 font-medium transition-all duration-300',
          isActive 
            ? 'text-gray-900' 
            : 'text-gray-600',
          isHovered && 'text-gray-900'
        )}>
          {label}
        </div>
      </>
    );

  return (
    <Link
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'group relative flex items-center outline-none transition-all duration-300 transform',
        'hover:scale-105 active:scale-95',
        device === 'desktop' 
          ? 'flex-col text-center py-2 px-4 rounded-lg hover:bg-gray-100' 
          : 'flex-row py-3 px-2 rounded-r-lg hover:bg-gray-100',
        isActive && 'bg-gray-100'
      )}
    >
      {ItemContent}
    </Link>
  );
};

export default SidebarItem;
