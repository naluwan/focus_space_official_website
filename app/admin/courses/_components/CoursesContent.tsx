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
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Clock,
  DollarSign,
  BarChart3,
} from 'lucide-react';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// 定義本地的介面，避免直接導入 CourseModel
interface ICourse {
  _id?: string;
  title: string;
  description: string;
  category: 'personal' | 'group' | 'special';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  price: number;
  maxParticipants?: number;
  instructor?: string;
  imageUrl?: string;
  features: string[];
  requirements?: string;
  startDate: Date;
  endDate: Date;
  weekdays: number[];
  timeSlots: {
    startTime: string;
    endTime: string;
  }[];
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

// 本地輔助函數，避免從 CourseModel 導入
const CourseHelpers = {
  weekdayToString: (weekday: number): string => {
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    return weekdays[weekday] || '未知';
  },

  weekdaysToString: (weekdays: number[]): string => {
    // 正確排序：星期一到星期日
    const sortedWeekdays = weekdays
      .map(day => day === 0 ? 7 : day) // 將星期日轉為7
      .sort((a, b) => a - b)
      .map(day => day === 7 ? 0 : day); // 轉回原來的0
    
    return sortedWeekdays.map(day => CourseHelpers.weekdayToString(day)).join('、');
  },

  formatTimeSlot: (timeSlot: { startTime: string; endTime: string }): string => {
    return `${timeSlot.startTime} - ${timeSlot.endTime}`;
  },
};

interface AdminSession {
  user?: {
    name?: string | null;
    email?: string | null;
    id?: string;
  };
  expires: string;
}

interface CoursesContentProps {
  session: AdminSession;
}

const CoursesContent = ({ session }: CoursesContentProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

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
      active: false,
    },
    {
      icon: BookOpen,
      label: '課程管理',
      href: '/admin/courses',
      active: true,
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

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (categoryFilter) params.append('category', categoryFilter);
      if (statusFilter) params.append('isActive', statusFilter);
      
      const response = await fetch(`/api/admin/courses?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setCourses(data.data.courses || []);
      } else {
        console.error('Failed to fetch courses');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, categoryFilter, statusFilter]);

  // 載入課程資料
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/admin/login' });
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchCourses(); // 重新載入課程列表
      } else {
        alert('刪除失敗，請稍後再試');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('刪除失敗，請稍後再試');
    }
  };

  const getCategoryBadge = (category: string) => {
    const badgeClasses = {
      personal: 'bg-blue-100 text-blue-800',
      group: 'bg-green-100 text-green-800',
      special: 'bg-purple-100 text-purple-800',
    };
    
    const labels = {
      personal: '個人課程',
      group: '團體課程',
      special: '特殊課程',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeClasses[category as keyof typeof badgeClasses] || 'bg-gray-100 text-gray-800'}`}>
        {labels[category as keyof typeof labels] || category}
      </span>
    );
  };

  const getDifficultyBadge = (difficulty: string) => {
    const badgeClasses = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800',
    };
    
    const labels = {
      beginner: '初級',
      intermediate: '中級',
      advanced: '高級',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeClasses[difficulty as keyof typeof badgeClasses] || 'bg-gray-100 text-gray-800'}`}>
        {labels[difficulty as keyof typeof labels] || difficulty}
      </span>
    );
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
              <h1 className='text-2xl font-bold text-gray-900'>課程管理</h1>
            </div>
            <Link
              href='/admin/courses/new'
              className='bg-gradient-to-r from-red-600 to-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-shadow flex items-center space-x-2'
            >
              <Plus size={20} />
              <span>新增課程</span>
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className='flex-1 overflow-x-hidden overflow-y-auto bg-gray-50'>
          <div className='container mx-auto px-6 py-8'>
            {/* 搜尋和篩選 */}
            <div className='bg-white rounded-lg shadow p-6 mb-6'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={20} />
                  <input
                    type='text'
                    placeholder='搜尋課程...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900'
                  />
                </div>
                
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900'
                >
                  <option value=''>所有分類</option>
                  <option value='personal'>個人課程</option>
                  <option value='group'>團體課程</option>
                  <option value='special'>特殊課程</option>
                </select>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900'
                >
                  <option value=''>所有狀態</option>
                  <option value='true'>啟用中</option>
                  <option value='false'>已停用</option>
                </select>
              </div>
            </div>

            {/* 課程列表 */}
            <div className='bg-white rounded-lg shadow'>
              {loading ? (
                <div className='p-8 text-center'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto'></div>
                  <p className='text-gray-600 mt-2'>載入中...</p>
                </div>
              ) : courses.length === 0 ? (
                <div className='p-8 text-center'>
                  <BookOpen className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                  <p className='text-gray-600'>暫無課程資料</p>
                  <Link
                    href='/admin/courses/new'
                    className='mt-4 inline-block bg-gradient-to-r from-red-600 to-yellow-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-shadow'
                  >
                    新增第一個課程
                  </Link>
                </div>
              ) : (
                <div className='overflow-x-auto'>
                  <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-100'>
                      <tr>
                        <th className='px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider'>
                          課程資訊
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider'>
                          分類 / 難度
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider'>
                          時間安排
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider'>
                          價格
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
                      {courses.map((course) => (
                        <tr key={course._id} className='hover:bg-blue-50'>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <div>
                              <div className='text-sm font-medium text-gray-900'>
                                {course.title}
                              </div>
                              <div className='text-sm text-gray-600'>
                                {course.description.length > 60 
                                  ? `${course.description.substring(0, 60)}...` 
                                  : course.description}
                              </div>
                              {course.instructor && (
                                <div className='text-xs text-gray-600 mt-1'>
                                  教練: {course.instructor}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <div className='space-y-1'>
                              {getCategoryBadge(course.category)}
                              {getDifficultyBadge(course.difficulty)}
                            </div>
                          </td>
                          <td className='px-6 py-4'>
                            <div className='text-sm text-gray-900'>
                              <div className='flex items-center space-x-1 mb-1'>
                                <Calendar size={14} />
                                <span>{CourseHelpers.weekdaysToString(course.weekdays)}</span>
                              </div>
                              <div className='flex items-center space-x-1'>
                                <Clock size={14} />
                                <span>
                                  {course.timeSlots.map(slot => 
                                    CourseHelpers.formatTimeSlot(slot)
                                  ).join(', ')}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <div className='flex items-center space-x-1'>
                              <DollarSign size={16} className='text-green-600' />
                              <span className='text-sm font-medium text-gray-900'>
                                {course.price}
                              </span>
                            </div>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              course.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {course.isActive ? '啟用' : '停用'}
                            </span>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                            <div className='flex items-center justify-end space-x-2'>
                              <button
                                onClick={() => window.location.href = `/admin/courses/${course._id}`}
                                className='text-blue-600 hover:text-blue-900'
                                title='查看'
                              >
                                <Eye size={16} />
                              </button>
                              <Link
                                href={`/admin/courses/${course._id}/edit`}
                                className='text-yellow-600 hover:text-yellow-900'
                                title='編輯'
                              >
                                <Edit size={16} />
                              </Link>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <button
                                    className='text-red-600 hover:text-red-900'
                                    title='刪除'
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>確認刪除課程</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      您確定要刪除課程「{course.title}」嗎？此操作將會停用課程，但不會永久刪除資料。
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>取消</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteCourse(course._id!)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      確定刪除
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </td>
                        </tr>
                      ))}
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

export default CoursesContent;