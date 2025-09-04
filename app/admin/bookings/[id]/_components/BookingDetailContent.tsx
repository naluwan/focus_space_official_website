'use client';

import { useState, useEffect, useCallback } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  LogOut,
  Menu,
  X,
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  FileText,
  CheckCircle,
  XCircle,
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
  
  // 課程預約專屬欄位
  courseName?: string;
  courseId?: string;
  courseCategory?: string;
  bookingDate?: string;
  startTime?: string;
  endTime?: string;
  
  // 體驗預約專屬欄位
  customerGender?: 'male' | 'female' | 'other';
  customerAge?: number;
  hasExperience?: boolean;
  fitnessGoals?: string;
  preferredDate?: string;
  preferredTime?: string;
  
  participantCount: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  createdAt: string;
  updatedAt: string;
  
  // 課程資訊（從 populate 獲得）
  course?: {
    _id: string;
    title: string;
    weekdays: number[];
    timeSlots: {
      startTime: string;
      endTime: string;
    }[];
    startDate: string;
    endDate: string;
  };
}

interface AdminSession {
  user?: {
    name?: string | null;
    email?: string | null;
    id?: string;
    role?: string;
  };
  expires: string;
}

interface BookingDetailContentProps {
  session: AdminSession;
  bookingId: string;
}

const BookingDetailContent = ({ session, bookingId }: BookingDetailContentProps) => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  // 顯示時間段的函數
  const getTimeSlotDisplay = (booking: Booking): string => {
    const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
    
    // 如果是體驗課程，顯示偏好時間
    if (booking.bookingType === 'trial') {
      if (booking.preferredTime) {
        return booking.preferredTime;
      }
      return '將安排合適時間';
    }

    // 如果是課程預約且有課程資訊
    if (booking.bookingType === 'course' && booking.course) {
      // 自定義排序：星期一到六，星期日放最後
      const sortWeekdays = (weekdays: number[]): number[] => {
        return weekdays.sort((a, b) => {
          // 如果 a 是星期日 (0)，放到最後
          if (a === 0 && b !== 0) return 1;
          // 如果 b 是星期日 (0)，a 放到前面
          if (b === 0 && a !== 0) return -1;
          // 其他情況按正常順序
          return a - b;
        });
      };

      // 組合星期幾
      const weekdayText = sortWeekdays(booking.course.weekdays)
        .map(day => `星期${dayNames[day]}`)
        .join('、');
      
      // 組合時間段
      const timeText = booking.course.timeSlots
        .map(slot => `${slot.startTime}-${slot.endTime}`)
        .join('、');
      
      // 組合時間段和星期
      const scheduleText = `每週${weekdayText} ${timeText}`;
      
      return scheduleText;
    }

    // 個人課程的情況
    if (booking.bookingType === 'course' && booking.courseCategory === 'personal') {
      if (booking.startTime && booking.endTime) {
        const bookingDate = booking.bookingDate ? new Date(booking.bookingDate) : null;
        const dayName = bookingDate ? dayNames[bookingDate.getDay()] : '';
        return dayName ? `星期${dayName} ${booking.startTime}-${booking.endTime}` : `${booking.startTime}-${booking.endTime}`;
      }
    }

    // 默認情況
    return '將安排合適時間';
  };

  // 顯示課程期間的函數
  const getCoursePeriodDisplay = (booking: Booking): string => {
    if (booking.bookingType === 'course' && booking.course) {
      try {
        const startDate = new Date(booking.course.startDate);
        const endDate = new Date(booking.course.endDate);
        
        // 檢查日期是否有效
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          return '課程期間待確定';
        }
        
        const formattedStartDate = startDate.toLocaleDateString('zh-TW');
        const formattedEndDate = endDate.toLocaleDateString('zh-TW');
        
        return `${formattedStartDate} ~ ${formattedEndDate}`;
      } catch (error) {
        console.error('Date parsing error:', error);
        return '課程期間待確定';
      }
    }
    return '';
  };

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

  const fetchBooking = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching booking with ID:', bookingId);
      const response = await fetch(`/api/admin/bookings/${bookingId}`);
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Booking data received:', data);
        setBooking(data.booking);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch booking:', response.status, errorData);
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchBooking();
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
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
      no_show: 'bg-gray-100 text-gray-800',
    };

    const statusLabels = {
      pending: '待確認',
      confirmed: '已確認',
      completed: '已完成',
      cancelled: '已取消',
      no_show: '未出席',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClasses[status as keyof typeof badgeClasses] || 'bg-gray-100 text-gray-800'}`}>
        {statusLabels[status as keyof typeof statusLabels] || status}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const badgeClasses = {
      trial: 'bg-purple-100 text-purple-800',
      course: 'bg-blue-100 text-blue-800',
    };

    const typeLabels = {
      trial: '體驗課程',
      course: '正式課程',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClasses[type as keyof typeof badgeClasses] || 'bg-gray-100 text-gray-800'}`}>
        {typeLabels[type as keyof typeof typeLabels] || type}
      </span>
    );
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

  if (!booking) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">預約不存在</h1>
          <Link href="/admin/bookings" className="text-blue-400 hover:text-blue-300">
            返回預約管理
          </Link>
        </div>
      </div>
    );
  }

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
            const isActive = item.href === '/admin/bookings';
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
              <p className='text-white text-sm font-medium'>{session.user?.name}</p>
              <p className='text-gray-400 text-xs'>{session.user?.role}</p>
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
              <button
                onClick={() => router.back()}
                className='flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 rounded-md hover:bg-gray-100'
              >
                <ArrowLeft size={16} />
                返回預約列表
              </button>
            </div>
            <h1 className='text-2xl font-bold text-gray-900'>預約詳情</h1>
          </div>
        </header>

        {/* Content */}
        <main className='flex-1 overflow-x-hidden overflow-y-auto bg-gray-50'>
          <div className='container mx-auto px-6 py-8'>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
              {/* Main Info */}
              <div className='lg:col-span-2'>
                <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6'>
                  <div className='flex items-center justify-between mb-6'>
                    <div>
                      <h2 className='text-xl font-semibold text-gray-900'>{booking.bookingNumber}</h2>
                      <div className='flex items-center space-x-3 mt-2'>
                        {getTypeBadge(booking.bookingType)}
                        {getStatusBadge(booking.status)}
                      </div>
                    </div>
                    <div className='text-right'>
                      <p className='text-2xl font-bold text-gray-900'>NT${booking.totalPrice}</p>
                      <p className='text-sm text-gray-600'>總金額</p>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className='border-t border-gray-200 pt-6'>
                    <h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center'>
                      <User size={20} className='mr-2' />
                      客戶資訊
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='flex items-center space-x-3'>
                        <User size={16} className='text-gray-400' />
                        <div>
                          <p className='text-sm text-gray-600'>姓名</p>
                          <p className='font-medium text-gray-900'>{booking.customerName}</p>
                        </div>
                      </div>
                      <div className='flex items-center space-x-3'>
                        <Mail size={16} className='text-gray-400' />
                        <div>
                          <p className='text-sm text-gray-600'>電子信箱</p>
                          <p className='font-medium text-gray-900'>{booking.customerEmail}</p>
                        </div>
                      </div>
                      <div className='flex items-center space-x-3'>
                        <Phone size={16} className='text-gray-400' />
                        <div>
                          <p className='text-sm text-gray-600'>聯絡電話</p>
                          <p className='font-medium text-gray-900'>{booking.customerPhone}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Booking Content */}
                  <div className='border-t border-gray-200 pt-6 mt-6'>
                    <h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center'>
                      <BookOpen size={20} className='mr-2' />
                      預約內容
                    </h3>
                    
                    {booking.bookingType === 'trial' ? (
                      // 體驗預約內容
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='flex items-center space-x-3'>
                          <BookOpen size={16} className='text-gray-400' />
                          <div>
                            <p className='text-sm text-gray-600'>預約類型</p>
                            <p className='font-medium text-gray-900'>場館體驗</p>
                          </div>
                        </div>
                        <div className='flex items-center space-x-3'>
                          <Calendar size={16} className='text-gray-400' />
                          <div>
                            <p className='text-sm text-gray-600'>偏好日期</p>
                            <p className='font-medium text-gray-900'>
                              {booking.preferredDate || '彈性安排'}
                            </p>
                          </div>
                        </div>
                        <div className='flex items-center space-x-3'>
                          <Clock size={16} className='text-gray-400' />
                          <div>
                            <p className='text-sm text-gray-600'>偏好時間</p>
                            <p className='font-medium text-gray-900'>
                              {booking.preferredTime || '彈性安排'}
                            </p>
                          </div>
                        </div>
                        <div className='flex items-center space-x-3'>
                          <Users size={16} className='text-gray-400' />
                          <div>
                            <p className='text-sm text-gray-600'>參與人數</p>
                            <p className='font-medium text-gray-900'>{booking.participantCount} 人</p>
                          </div>
                        </div>
                        {booking.fitnessGoals && (
                          <div className='flex items-start space-x-3 md:col-span-2'>
                            <FileText size={16} className='text-gray-400 mt-1' />
                            <div>
                              <p className='text-sm text-gray-600'>健身目標</p>
                              <p className='font-medium text-gray-900'>{booking.fitnessGoals}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      // 課程預約內容
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='flex items-center space-x-3'>
                          <BookOpen size={16} className='text-gray-400' />
                          <div>
                            <p className='text-sm text-gray-600'>課程名稱</p>
                            <p className='font-medium text-gray-900'>{booking.courseName || '未指定'}</p>
                          </div>
                        </div>
                        <div className='flex items-center space-x-3'>
                          <Calendar size={16} className='text-gray-400' />
                          <div>
                            <p className='text-sm text-gray-600'>預約日期</p>
                            <p className='font-medium text-gray-900'>
                              {booking.bookingDate 
                                ? new Date(booking.bookingDate).toLocaleDateString('zh-TW') 
                                : '未指定'}
                            </p>
                          </div>
                        </div>
                        {booking.bookingType === 'course' && getCoursePeriodDisplay(booking) && (
                          <div className='flex items-center space-x-3'>
                            <Calendar size={16} className='text-gray-400' />
                            <div>
                              <p className='text-sm text-gray-600'>課程期間</p>
                              <p className='font-medium text-gray-900'>{getCoursePeriodDisplay(booking)}</p>
                            </div>
                          </div>
                        )}
                        <div className='flex items-start space-x-3'>
                          <Clock size={16} className='text-gray-400 mt-1' />
                          <div>
                            <p className='text-sm text-gray-600'>時間段</p>
                            <div className='font-medium text-gray-900'>
                              {getTimeSlotDisplay(booking)}
                            </div>
                          </div>
                        </div>
                        <div className='flex items-center space-x-3'>
                          <Users size={16} className='text-gray-400' />
                          <div>
                            <p className='text-sm text-gray-600'>參與人數</p>
                            <p className='font-medium text-gray-900'>{booking.participantCount} 人</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  {booking.customerNote && (
                    <div className='border-t border-gray-200 pt-6 mt-6'>
                      <h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center'>
                        <FileText size={20} className='mr-2' />
                        備註
                      </h3>
                      <div className='bg-gray-50 rounded-lg p-4'>
                        <p className='text-gray-700'>{booking.customerNote}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Panel */}
              <div className='lg:col-span-1'>
                <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
                  <h3 className='text-lg font-medium text-gray-900 mb-4'>操作</h3>
                  
                  {booking.status === 'pending' && (
                    <div className='space-y-3 mb-6'>
                      <button
                        onClick={() => handleStatusUpdate('confirmed')}
                        className='w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
                      >
                        <CheckCircle size={16} className='mr-2' />
                        確認預約
                      </button>
                      <button
                        onClick={() => handleStatusUpdate('cancelled')}
                        className='w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
                      >
                        <XCircle size={16} className='mr-2' />
                        取消預約
                      </button>
                    </div>
                  )}

                  {booking.status === 'confirmed' && (
                    <div className='space-y-3 mb-6'>
                      <button
                        onClick={() => handleStatusUpdate('completed')}
                        className='w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                      >
                        <CheckCircle size={16} className='mr-2' />
                        標記完成
                      </button>
                      <button
                        onClick={() => handleStatusUpdate('no_show')}
                        className='w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors'
                      >
                        <XCircle size={16} className='mr-2' />
                        標記未出席
                      </button>
                    </div>
                  )}

                  <div className='border-t border-gray-200 pt-6'>
                    <h4 className='text-sm font-medium text-gray-900 mb-3'>預約資訊</h4>
                    <div className='space-y-2 text-sm'>
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>建立時間</span>
                        <span className='text-gray-900'>
                          {new Date(booking.createdAt).toLocaleString('zh-TW')}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>最後更新</span>
                        <span className='text-gray-900'>
                          {new Date(booking.updatedAt).toLocaleString('zh-TW')}
                        </span>
                      </div>
                    </div>
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

export default BookingDetailContent;