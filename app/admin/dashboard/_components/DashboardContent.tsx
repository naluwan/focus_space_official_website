'use client';

import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  LogOut,
  Menu,
  X,
  Plus,
  Eye,
  BarChart3,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';

interface AdminSession {
  user?: {
    name?: string | null;
    email?: string | null;
    id?: string;
    role?: string;
  };
  expires: string;
}

interface DashboardContentProps {
  session: AdminSession;
}

interface StatsData {
  overview: {
    totalCourses: number;
    totalTestimonials: number;
    totalBookings: number;
    totalRevenue: number;
    pendingBookings: number;
    confirmedBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    bookingGrowth: number;
  };
  recent: {
    bookings: Array<{
      _id: string;
      bookingNumber: string;
      customerName: string;
      bookingType: string;
      status: string;
      createdAt: string;
    }>;
  };
  activities: Array<{
    type: string;
    message: string;
    timestamp: string;
    priority: string;
  }>;
}

const DashboardContent = ({ session }: DashboardContentProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
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

  const quickActions = [
    {
      icon: Plus,
      label: '新增課程',
      href: '/admin/courses/new',
      color: 'from-blue-600 to-blue-700',
    },
    {
      icon: Plus,
      label: '新增見證',
      href: '/admin/testimonials/new',
      color: 'from-green-600 to-green-700',
    },
    {
      icon: Eye,
      label: '查看網站',
      href: '/',
      color: 'from-purple-600 to-purple-700',
      external: true,
    },
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStatsData(data);
      } else {
        console.error('Failed to fetch stats');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStats = () => {
    if (!statsData) {
      // 返回載入中的預設值
      return [
        { label: '總課程數', value: '載入中...', change: '', changeType: 'neutral' },
        { label: '總預約數', value: '載入中...', change: '', changeType: 'neutral' },
        { label: '待確認預約', value: '載入中...', change: '', changeType: 'neutral' },
        { label: '會員見證', value: '載入中...', change: '', changeType: 'neutral' },
      ];
    }
    
    return [
      { 
        label: '總課程數', 
        value: statsData.overview.totalCourses.toString(), 
        change: '+0', 
        changeType: 'neutral' as const
      },
      { 
        label: '總預約數', 
        value: statsData.overview.totalBookings.toString(), 
        change: `${statsData.overview.bookingGrowth > 0 ? '+' : ''}${statsData.overview.bookingGrowth}%`, 
        changeType: statsData.overview.bookingGrowth > 0 ? 'positive' as const : statsData.overview.bookingGrowth < 0 ? 'negative' as const : 'neutral' as const
      },
      { 
        label: '待確認預約', 
        value: statsData.overview.pendingBookings.toString(), 
        change: statsData.overview.pendingBookings > 0 ? '需處理' : '已清空', 
        changeType: statsData.overview.pendingBookings > 0 ? 'negative' as const : 'positive' as const
      },
      { 
        label: '會員見證', 
        value: statsData.overview.totalTestimonials.toString(), 
        change: '+0', 
        changeType: 'neutral' as const
      },
    ];
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/admin/login' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className='flex h-screen bg-gray-900'>
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
                {session.user?.name?.[0]?.toUpperCase() || 'A'}
              </span>
            </div>
            <div>
              <p className='text-white text-sm font-medium'>{session.user?.name || '管理員'}</p>
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
        />
      )}

      {/* Main Content */}
      <div className='flex-1 flex flex-col overflow-hidden lg:ml-0'>
        {/* Header */}
        <header className='bg-white border-b border-gray-200 px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <button
                onClick={() => setSidebarOpen(true)}
                className='lg:hidden text-gray-600 hover:text-gray-900'
              >
                <Menu size={24} />
              </button>
              <h1 className='text-2xl font-bold text-gray-900'>主控台</h1>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='text-sm text-gray-600'>
                歡迎回來，{session.user?.name || '管理員'}
              </span>
              <div className='w-2 h-2 bg-green-500 rounded-full' title='系統狀態正常'></div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className='flex-1 overflow-x-hidden overflow-y-auto bg-gray-50'>
          <div className='container mx-auto px-6 py-8'>
            {/* Stats Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
              {stats.map((stat, index) => (
                <div key={index} className='bg-white rounded-lg shadow p-6'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium text-gray-600'>{stat.label}</p>
                      <p className='text-2xl font-bold text-gray-900'>{stat.value}</p>
                    </div>
                    <div className={`text-sm ${
                      stat.changeType === 'positive' 
                        ? 'text-green-600' 
                        : stat.changeType === 'negative' 
                        ? 'text-red-600' 
                        : 'text-gray-600'
                    }`}>
                      {stat.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className='mb-8'>
              <h2 className='text-lg font-semibold text-gray-900 mb-4'>快速操作</h2>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={index}
                      href={action.href}
                      target={action.external ? '_blank' : undefined}
                      className={`bg-gradient-to-r ${action.color} text-white rounded-lg p-6 hover:shadow-lg transition-shadow`}
                    >
                      <div className='flex items-center space-x-3'>
                        <Icon size={24} />
                        <span className='font-medium'>{action.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <div className='bg-white rounded-lg shadow'>
                <div className='px-6 py-4 border-b border-gray-200'>
                  <h2 className='text-lg font-semibold text-gray-900'>最近活動</h2>
                </div>
                <div className='p-6'>
                  <div className='space-y-4'>
                    {statsData?.activities.map((activity, index) => {
                      const getActivityColor = (type: string, priority: string) => {
                        if (priority === 'high') return 'bg-red-500';
                        switch (type) {
                          case 'booking': return 'bg-blue-500';
                          case 'system': return 'bg-green-500';
                          case 'revenue': return 'bg-yellow-500';
                          default: return 'bg-gray-500';
                        }
                      };
                      
                      return (
                        <div key={index} className='flex items-center space-x-3'>
                          <div className={`w-2 h-2 rounded-full ${getActivityColor(activity.type, activity.priority)}`}></div>
                          <p className='text-sm text-gray-600 flex-1'>
                            {activity.message}
                          </p>
                          <span className='text-xs text-gray-400'>
                            {new Date(activity.timestamp).toLocaleString('zh-TW', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      );
                    }) || [
                      <div key="loading" className='flex items-center space-x-3'>
                        <div className='w-2 h-2 bg-gray-300 rounded-full animate-pulse'></div>
                        <p className='text-sm text-gray-400'>載入中...</p>
                      </div>
                    ]}
                  </div>
                </div>
              </div>
              
              <div className='bg-white rounded-lg shadow'>
                <div className='px-6 py-4 border-b border-gray-200'>
                  <h2 className='text-lg font-semibold text-gray-900'>最近預約</h2>
                </div>
                <div className='p-6'>
                  <div className='space-y-3'>
                    {statsData?.recent.bookings.slice(0, 5).map((booking) => {
                      const getStatusColor = (status: string) => {
                        switch (status) {
                          case 'pending': return 'text-yellow-600 bg-yellow-100';
                          case 'confirmed': return 'text-green-600 bg-green-100';
                          case 'cancelled': return 'text-red-600 bg-red-100';
                          case 'completed': return 'text-blue-600 bg-blue-100';
                          default: return 'text-gray-600 bg-gray-100';
                        }
                      };
                      
                      const getStatusLabel = (status: string) => {
                        switch (status) {
                          case 'pending': return '待確認';
                          case 'confirmed': return '已確認';
                          case 'cancelled': return '已取消';
                          case 'completed': return '已完成';
                          case 'no_show': return '未出席';
                          default: return status;
                        }
                      };
                      
                      return (
                        <div key={booking._id} className='flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow'>
                          <div>
                            <div className='font-medium text-sm text-gray-900'>
                              {booking.customerName}
                            </div>
                            <div className='text-xs text-gray-500'>
                              {booking.bookingNumber} • {booking.bookingType === 'trial' ? '體驗' : '課程'}
                            </div>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {getStatusLabel(booking.status)}
                          </div>
                        </div>
                      );
                    }) || [
                      <div key="no-bookings" className='text-sm text-gray-400 text-center py-8'>
                        目前沒有預約記錄
                      </div>
                    ]}
                    {statsData && statsData.recent.bookings.length > 5 && (
                      <Link href='/admin/bookings' className='block text-center text-sm text-blue-600 hover:text-blue-800 pt-2'>
                        查看所有預約
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardContent;