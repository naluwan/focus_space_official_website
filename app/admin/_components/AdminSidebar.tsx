'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  LogOut,
  Menu,
  X,
  BarChart3,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';

interface AdminSession {
  user?: {
    name?: string | null;
    email?: string | null;
    id?: string;
  };
  expires: string;
}

interface AdminSidebarProps {
  session: AdminSession;
}

const AdminSidebar = ({ session }: AdminSidebarProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: '主控台',
      href: '/admin/dashboard',
    },
    {
      icon: Calendar,
      label: '預約管理',
      href: '/admin/bookings',
    },
    {
      icon: BookOpen,
      label: '課程管理',
      href: '/admin/courses',
    },
    {
      icon: Users,
      label: '會員見證',
      href: '/admin/testimonials',
    },
    {
      icon: BarChart3,
      label: '分析報告',
      href: '/admin/analytics',
    },
  ];

  const handleSignOut = () => {
    signOut({ callbackUrl: '/admin/login' });
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className='lg:hidden fixed top-4 left-4 z-50 text-gray-600 hover:text-gray-900 bg-white rounded-md p-2 shadow-md'
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0`}>
        <div className='flex items-center justify-between h-16 px-6 bg-gray-900'>
          <div className='flex items-center space-x-3'>
            <div className='w-8 h-8 bg-gradient-to-r from-red-600 to-yellow-500 rounded-full flex items-center justify-center'>
              <span className='text-white font-bold text-sm'>FS</span>
            </div>
            <span className='text-white font-semibold text-lg'>Focus Space</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className='lg:hidden text-gray-400 hover:text-white'
          >
            <X size={24} />
          </button>
        </div>

        <nav className='mt-8'>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-white bg-gray-700 border-r-2 border-red-500'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Icon size={20} className='mr-3' />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className='absolute bottom-0 w-full p-6 bg-gray-900'>
          <div className='flex items-center space-x-3 mb-4'>
            <div className='w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center'>
              <span className='text-white text-sm font-medium'>
                {session?.user?.name?.[0]?.toUpperCase() || 'A'}
              </span>
            </div>
            <div>
              <p className='text-white text-sm font-medium'>{session?.user?.name || '管理員'}</p>
              <p className='text-gray-400 text-xs'>管理員</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className='flex items-center w-full px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors'
          >
            <LogOut size={16} className='mr-3' />
            登出
          </button>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 z-40 bg-gray-900 bg-opacity-50 lg:hidden'
          onClick={() => setSidebarOpen(false)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default AdminSidebar;