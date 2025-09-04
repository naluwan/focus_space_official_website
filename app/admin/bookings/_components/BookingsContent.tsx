'use client';

import { useState, useEffect, useCallback } from 'react';
import { signOut } from 'next-auth/react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  LogOut,
  Menu,
  X,
  Search,
  Eye,
  Calendar,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Phone,
  BarChart3,
} from 'lucide-react';
import Link from 'next/link';

interface Booking {
  _id: string;
  bookingNumber: string;
  bookingType: 'trial' | 'course';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerNote?: string;
  courseName?: string;
  courseCategory?: 'personal' | 'group' | 'special';
  bookingDate?: string;
  startTime?: string;
  endTime?: string;
  participantCount: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  createdAt: string;
  updatedAt: string;
}

interface AdminSession {
  user?: {
    name?: string | null;
    email?: string | null;
    id?: string;
  };
  expires: string;
}

interface BookingsContentProps {
  session: AdminSession;
}

const BookingsContent = ({ session }: BookingsContentProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: '主控台',
      href: '/admin/dashboard',
      active: false,
    },
    {
      icon: Calendar,
      label: '預約管理',
      href: '/admin/bookings',
      active: true,
    },
    {
      icon: BookOpen,
      label: '課程管理',
      href: '/admin/courses',
      active: false,
    },
    {
      icon: Users,
      label: '會員見證',
      href: '/admin/testimonials', 
      active: false,
    },
    {
      icon: BarChart3,
      label: '分析報告',
      href: '/admin/analytics',
      active: false,
    },
  ];

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter) params.append('status', statusFilter);
      if (typeFilter) params.append('type', typeFilter);
      
      const response = await fetch(`/api/admin/bookings?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setBookings(Array.isArray(data) ? data : data.bookings || []);
      } else {
        console.error('Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, typeFilter]);

  // 載入預約資料
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/admin/login' });
  };

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchBookings(); // 重新載入預約列表
      } else {
        alert('更新狀態失敗');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('更新狀態失敗');
    }
  };

  const getStatusBadge = (status: string) => {
    const badgeClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
      no_show: 'bg-gray-100 text-gray-800',
    };
    
    const labels = {
      pending: '待確認',
      confirmed: '已確認',
      cancelled: '已取消',
      completed: '已完成',
      no_show: '未出席',
    };
    
    return {
      class: badgeClasses[status as keyof typeof badgeClasses] || 'bg-gray-100 text-gray-800',
      label: labels[status as keyof typeof labels] || status,
    };
  };

  const getTypeBadge = (type: string) => {
    const badgeClasses = {
      trial: 'bg-purple-100 text-purple-800',
      course: 'bg-blue-100 text-blue-800',
    };
    
    const labels = {
      trial: '體驗預約',
      course: '課程預約',
    };
    
    return {
      class: badgeClasses[type as keyof typeof badgeClasses] || 'bg-gray-100 text-gray-800',
      label: labels[type as keyof typeof labels] || type,
    };
  };

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
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  item.active
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
              <p className='text-white text-sm font-medium'>{session.user?.name}</p>
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
              <h1 className='text-2xl font-bold text-gray-900'>預約管理</h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className='flex-1 overflow-x-hidden overflow-y-auto bg-gray-50'>
          <div className='container mx-auto px-6 py-8'>
            
            {/* Filters */}
            <div className='bg-white rounded-lg shadow-sm mb-6 p-6 border border-gray-200'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div>
                  <label htmlFor="search-input" className='block text-sm font-medium text-gray-700 mb-2'>搜尋</label>
                  <div className='relative'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={20} />
                    <input
                      id="search-input"
                      type='text'
                      placeholder='搜尋客戶姓名、電話或預約編號...'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500'
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="status-filter" className='block text-sm font-medium text-gray-700 mb-2'>狀態篩選</label>
                  <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900'
                  >
                    <option value=''>所有狀態</option>
                    <option value='pending'>待確認</option>
                    <option value='confirmed'>已確認</option>
                    <option value='cancelled'>已取消</option>
                    <option value='completed'>已完成</option>
                    <option value='no_show'>未出席</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="type-filter" className='block text-sm font-medium text-gray-700 mb-2'>類型篩選</label>
                  <select
                    id="type-filter"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900'
                  >
                    <option value=''>所有類型</option>
                    <option value='trial'>體驗預約</option>
                    <option value='course'>課程預約</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bookings List */}
            <div className='bg-white rounded-lg shadow-sm border border-gray-200'>

              {loading ? (
                <div className='flex items-center justify-center py-12'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-red-500'></div>
                  <span className='ml-2 text-gray-600'>載入中...</span>
                </div>
              ) : bookings.length === 0 ? (
                <div className='text-center py-12'>
                  <Calendar className='mx-auto h-12 w-12 text-gray-400' />
                  <h3 className='mt-2 text-sm font-medium text-gray-900'>沒有預約記錄</h3>
                  <p className='mt-1 text-sm text-gray-500'>
                    {searchTerm || statusFilter || typeFilter
                      ? '沒有符合篩選條件的預約'
                      : '目前還沒有任何預約記錄'}
                  </p>
                </div>
              ) : (
                <div className='overflow-x-auto'>
                  <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-100'>
                      <tr>
                        <th className='px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider'>
                          預約資訊
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider'>
                          客戶資訊
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider'>
                          預約內容
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider'>
                          狀態
                        </th>
                        <th className='px-6 py-3 text-right text-xs font-bold text-gray-900 uppercase tracking-wider'>
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      {bookings.map((booking) => {
                        const statusBadge = getStatusBadge(booking.status);
                        const typeBadge = getTypeBadge(booking.bookingType);
                        
                        return (
                          <tr key={booking._id} className='hover:bg-blue-50'>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div>
                                <div className='text-sm font-medium text-gray-900'>
                                  {booking.bookingNumber}
                                </div>
                                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeBadge.class} mt-1`}>
                                  {typeBadge.label}
                                </div>
                                <div className='text-xs text-gray-500 mt-1'>
                                  {new Date(booking.createdAt).toLocaleDateString('zh-TW')}
                                </div>
                              </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div>
                                <div className='text-sm font-medium text-gray-900 flex items-center'>
                                  <User size={16} className='mr-2 text-gray-400' />
                                  {booking.customerName}
                                </div>
                                <div className='text-sm text-gray-500 flex items-center mt-1'>
                                  <Mail size={12} className='mr-1 text-gray-400' />
                                  {booking.customerEmail}
                                </div>
                                <div className='text-sm text-gray-500 flex items-center mt-1'>
                                  <Phone size={12} className='mr-1 text-gray-400' />
                                  {booking.customerPhone}
                                </div>
                              </div>
                            </td>
                            <td className='px-6 py-4'>
                              <div className='text-sm'>
                                {booking.bookingType === 'course' ? (
                                  <div>
                                    <div className='font-medium text-gray-900'>
                                      {booking.courseName}
                                    </div>
                                    {booking.bookingDate && (
                                      <div className='text-gray-500 mt-1'>
                                        <div>{new Date(booking.bookingDate).toLocaleDateString('zh-TW')}</div>
                                        <div>{booking.startTime} - {booking.endTime}</div>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className='text-gray-500'>體驗課程預約</div>
                                )}
                                <div className='text-sm text-gray-500 mt-1'>
                                  人數: {booking.participantCount} | 金額: NT${booking.totalPrice}
                                </div>
                              </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.class}`}>
                                {statusBadge.label}
                              </span>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                              <div className='flex items-center space-x-2'>
                                {booking.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                                      className='text-green-600 hover:text-green-900'
                                      title='確認預約'
                                    >
                                      <CheckCircle size={18} />
                                    </button>
                                    <button
                                      onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                                      className='text-red-600 hover:text-red-900'
                                      title='取消預約'
                                    >
                                      <XCircle size={18} />
                                    </button>
                                  </>
                                )}
                                <Link
                                  href={`/admin/bookings/${booking._id}`}
                                  className='text-indigo-600 hover:text-indigo-900'
                                  title='查看詳情'
                                >
                                  <Eye size={18} />
                                </Link>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BookingsContent;