'use client';

import { cn } from '@/lib/utils';
import SidebarItem from './sidebar-item';
import { NAV_LINKS } from '@/public/constants';

interface SidebarRoutesProps {
  device: string;
}

const SidebarRoutes = ({ device }: SidebarRoutesProps) => {
  const routes = NAV_LINKS;
  return (
    <div
      className={cn(
        'flex w-full flex-col items-start gap-y-2',
        device === 'desktop' && 'flex-row justify-center gap-x-4',
      )}
    >
      {routes.map((route) => (
        <SidebarItem
          key={route.key}
          label={route.label}
          href={route.href}
          device={device}
        />
      ))}
    </div>
  );
};

export default SidebarRoutes;
