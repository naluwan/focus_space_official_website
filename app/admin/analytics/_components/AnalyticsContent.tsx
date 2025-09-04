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
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  BarChart3,
  Target,
  Activity,
} from 'lucide-react';
import Link from 'next/link';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import StatsCard from './StatsCard';
import { AnalyticsResponse } from '@/types/analytics';

interface AdminSession {
  user?: {
    name?: string | null;
    email?: string | null;
    id?: string;
    role?: string;
  };
  expires: string;
}

interface AnalyticsContentProps {
  session: AdminSession;
}

const AnalyticsContent = ({ session }: AnalyticsContentProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsResponse | null>(null);
  const [period, setPeriod] = useState('30');

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

  const fetchAnalyticsData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/analytics?period=${period}`);
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data.data);
      } else {
        console.error('Failed to fetch analytics data');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/admin/login' });
  };

  // 圖表顏色
  const COLORS = ['#DC2626', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];

  // 準備預約趨勢圖表資料
  const trendChartData = analyticsData?.bookingTrend?.map(item => ({
    date: new Date(item.date).toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' }),
    預約數: item.count,
  })) || [];

  // 準備預約狀態圓餅圖資料
  const statusPieData = analyticsData ? [
    { name: '待確認', value: analyticsData.bookingStatusDistribution.pending },
    { name: '已確認', value: analyticsData.bookingStatusDistribution.confirmed },
    { name: '已完成', value: analyticsData.bookingStatusDistribution.completed },
    { name: '已取消', value: analyticsData.bookingStatusDistribution.cancelled },
    { name: '未出席', value: analyticsData.bookingStatusDistribution.noShow },
  ].filter(item => item.value > 0) : [];

  // 準備課程類別圓餅圖資料
  const categoryPieData = analyticsData ? [
    { name: '個人課程', value: analyticsData.courseCategoryDistribution.personal },
    { name: '團體課程', value: analyticsData.courseCategoryDistribution.group },
    { name: '特殊課程', value: analyticsData.courseCategoryDistribution.special },
  ].filter(item => item.value > 0) : [];

  // 準備課程表現長條圖資料
  const courseBarData = analyticsData?.coursePerformance?.slice(0, 5).map(course => ({
    name: course.courseName.length > 10 ? course.courseName.substring(0, 10) + '...' : course.courseName,
    預約數: course.bookingCount,
    收益: course.revenue,
  })) || [];

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
            const isActive = item.href === '/admin/analytics';
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
              <h1 className='text-2xl font-bold text-gray-900'>分析報告</h1>
            </div>
            {/* Period Selector */}
            <div className='flex items-center space-x-2'>
              <label htmlFor="period-select" className='text-sm text-gray-600'>資料範圍：</label>
              <select
                id="period-select"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className='px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-red-500'
              >
                <option value='7'>過去 7 天</option>
                <option value='30'>過去 30 天</option>
                <option value='90'>過去 90 天</option>
              </select>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className='flex-1 overflow-x-hidden overflow-y-auto bg-gray-50'>
          <div className='container mx-auto px-6 py-8'>
            {loading ? (
              <div className='flex items-center justify-center h-64'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-red-500'></div>
              </div>
            ) : analyticsData ? (
              <>
                {/* Stats Cards */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
                  <StatsCard
                    title='今日預約'
                    value={analyticsData.todayStats.bookings}
                    icon={Calendar}
                    iconBgColor='bg-blue-100'
                    iconColor='text-blue-600'
                  />
                  <StatsCard
                    title='本月預約'
                    value={analyticsData.monthlyStats.bookings}
                    icon={TrendingUp}
                    iconBgColor='bg-green-100'
                    iconColor='text-green-600'
                  />
                  <StatsCard
                    title='待確認預約'
                    value={analyticsData.bookingStats.pending}
                    icon={Clock}
                    iconBgColor='bg-yellow-100'
                    iconColor='text-yellow-600'
                  />
                  <StatsCard
                    title='本月收益'
                    value={`NT$${analyticsData.monthlyStats.revenue.toLocaleString()}`}
                    icon={DollarSign}
                    iconBgColor='bg-purple-100'
                    iconColor='text-purple-600'
                  />
                </div>

                {/* Charts Section */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
                  {/* 預約趨勢圖 */}
                  <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
                    <h3 className='text-lg font-semibold text-gray-900 mb-4'>預約趨勢</h3>
                    <ResponsiveContainer width='100%' height={300}>
                      <LineChart data={trendChartData}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='date' />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type='monotone' 
                          dataKey='預約數' 
                          stroke='#DC2626' 
                          strokeWidth={2}
                          dot={{ fill: '#DC2626' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* 預約狀態分布 */}
                  <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
                    <h3 className='text-lg font-semibold text-gray-900 mb-4'>預約狀態分布</h3>
                    <ResponsiveContainer width='100%' height={300}>
                      <PieChart>
                        <Pie
                          data={statusPieData}
                          cx='50%'
                          cy='50%'
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill='#8884d8'
                          dataKey='value'
                        >
                          {statusPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* 課程表現 */}
                  <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
                    <h3 className='text-lg font-semibold text-gray-900 mb-4'>熱門課程表現</h3>
                    <ResponsiveContainer width='100%' height={300}>
                      <BarChart data={courseBarData}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='name' />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey='預約數' fill='#DC2626' />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* 課程類別分布 */}
                  <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
                    <h3 className='text-lg font-semibold text-gray-900 mb-4'>課程類別分布</h3>
                    <ResponsiveContainer width='100%' height={300}>
                      <PieChart>
                        <Pie
                          data={categoryPieData}
                          cx='50%'
                          cy='50%'
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill='#8884d8'
                          dataKey='value'
                        >
                          {categoryPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Additional Stats */}
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                  <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
                    <div className='flex items-center justify-between mb-4'>
                      <h3 className='text-lg font-semibold text-gray-900'>預約完成率</h3>
                      <CheckCircle className='w-5 h-5 text-green-600' />
                    </div>
                    <div className='flex items-end justify-between'>
                      <div>
                        <p className='text-3xl font-bold text-gray-900'>
                          {analyticsData.monthlyStats.completionRate}%
                        </p>
                        <p className='text-sm text-gray-600 mt-1'>本月完成率</p>
                      </div>
                      <div className='text-right'>
                        <p className='text-sm text-gray-600'>
                          {analyticsData.bookingStats.completed}/{analyticsData.bookingStats.total}
                        </p>
                        <p className='text-xs text-gray-500'>完成/總數</p>
                      </div>
                    </div>
                  </div>

                  <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
                    <div className='flex items-center justify-between mb-4'>
                      <h3 className='text-lg font-semibold text-gray-900'>預約類型</h3>
                      <Target className='w-5 h-5 text-blue-600' />
                    </div>
                    <div className='space-y-3'>
                      <div className='flex justify-between items-center'>
                        <span className='text-sm text-gray-600'>體驗預約</span>
                        <span className='text-sm font-medium text-gray-900'>
                          {analyticsData.bookingTypeDistribution.trial}
                        </span>
                      </div>
                      <div className='flex justify-between items-center'>
                        <span className='text-sm text-gray-600'>課程預約</span>
                        <span className='text-sm font-medium text-gray-900'>
                          {analyticsData.bookingTypeDistribution.course}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
                    <div className='flex items-center justify-between mb-4'>
                      <h3 className='text-lg font-semibold text-gray-900'>熱門課程</h3>
                      <Activity className='w-5 h-5 text-red-600' />
                    </div>
                    <div className='space-y-3'>
                      {analyticsData.popularCourses.slice(0, 3).map((course, index) => (
                        <div key={course.courseId} className='flex justify-between items-center'>
                          <span className='text-sm text-gray-600 truncate flex-1 mr-2'>
                            {index + 1}. {course.courseName}
                          </span>
                          <span className='text-sm font-medium text-gray-900'>
                            {course.bookingCount} 次
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className='text-center py-12'>
                <p className='text-gray-500'>暫無資料</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AnalyticsContent;