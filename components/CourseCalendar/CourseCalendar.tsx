'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Calendar, 
  Clock, 
  Users, 
  Star, 
  Dumbbell,
  Activity,
  Zap
} from 'lucide-react';

interface Course {
  _id: string;
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
  weekdays: number[];
  timeSlots: { startTime: string; endTime: string }[];
  displayOrder: number;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

interface CourseCalendarProps {
  category?: 'personal' | 'group' | 'all';
  className?: string;
}

const CourseCalendar = ({ category = 'all', className = '' }: CourseCalendarProps) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // 獲取課程資料
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses');
        if (response.ok) {
          const data = await response.json();
          const filteredCourses = category === 'all' 
            ? data.data || []
            : (data.data || []).filter((course: Course) => course.category === category);
          setCourses(filteredCourses);
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [category]);

  // 週次和日期設定
  const weekdays = [
    { id: 1, name: '週一', shortName: 'Mon' },
    { id: 2, name: '週二', shortName: 'Tue' },
    { id: 3, name: '週三', shortName: 'Wed' },
    { id: 4, name: '週四', shortName: 'Thu' },
    { id: 5, name: '週五', shortName: 'Fri' },
    { id: 6, name: '週六', shortName: 'Sat' },
    { id: 0, name: '週日', shortName: 'Sun' }
  ];

  const timeSlots = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
    '19:00', '20:00', '21:00', '22:00', '23:00'
  ];

  // 取得指定日期和時間的課程
  const getCourseForSlot = (weekday: number, timeSlot: string) => {
    return courses.filter(course => {
      return course.weekdays.includes(weekday) && 
             course.timeSlots.some(slot => slot.startTime === timeSlot);
    });
  };

  // 取得課程圖示
  const getCourseIcon = (category: string) => {
    switch (category) {
      case 'personal': return <Dumbbell className='w-4 h-4' />;
      case 'group': return <Zap className='w-4 h-4' />;
      case 'special': return <Activity className='w-4 h-4' />;
      default: return <Star className='w-4 h-4' />;
    }
  };

  // 格式化日期顯示
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // 檢查課程是否在進行中 - 簡化邏輯
  const isCourseActive = (course: Course) => {
    // 如果課程在資料庫中標記為不活躍，則不活躍
    if (course.isActive === false) return false;
    
    // 如果沒有日期資訊，預設為活躍
    if (!course.startDate || !course.endDate) return true;
    
    const now = new Date();
    const start = new Date(course.startDate);
    const end = new Date(course.endDate);
    
    // 將結束日期設為當天結束時間，避免時區問題
    const endOfDay = new Date(end);
    endOfDay.setHours(23, 59, 59, 999);
    
    return now >= start && now <= endOfDay;
  };

  // 取得課程狀態文字
  const getCourseStatus = (course: Course) => {
    if (!course.startDate || !course.endDate) return null;
    
    const now = new Date();
    const start = new Date(course.startDate);
    const end = new Date(course.endDate);
    
    // 設定結束日期到當天的 23:59:59，避免時區問題
    end.setHours(23, 59, 59, 999);
    
    if (now < start) return '即將開課';
    if (now > end) return '課程結束';
    return '開課中';
  };

  // 取得課程狀態顏色
  const getStatusColor = (course: Course) => {
    const status = getCourseStatus(course);
    switch (status) {
      case '即將開課': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case '開課中': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case '課程結束': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  // 取得課程類別文字
  const getCategoryText = (category: string) => {
    switch (category) {
      case 'personal': return '個人';
      case 'group': return '團體';
      case 'special': return '特殊';
      default: return category;
    }
  };

  // 取得難度顏色
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'advanced': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className={`bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 ${className}`}>
        <div className='animate-pulse'>
          <div className='h-8 bg-gray-700 rounded mb-4'></div>
          <div className='grid grid-cols-7 gap-2'>
            {Array.from({ length: 7 * 8 }).map((_, i) => (
              <div key={i} className='h-20 bg-gray-800 rounded'></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 如果沒有課程資料，返回null，讓父組件決定是否顯示靜態內容
  if (courses.length === 0) {
    return null;
  }

  return (
    <div className={`bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 ${className}`}>
      {/* 日曆標題 */}
      <div className='p-6 border-b border-gray-800'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-2xl font-bold bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent'>
            課程時間表
          </h3>
          <div className='flex items-center gap-2 text-sm text-gray-400'>
            <Calendar className='w-4 h-4' />
            <span>每週課程安排</span>
          </div>
        </div>
      </div>

      {/* 日曆網格 */}
      <div className='p-3 md:p-6 md:overflow-x-visible overflow-x-auto'>
        {/* 手機版提示 */}
        <div className='block md:hidden text-xs text-gray-400 mb-3 text-center'>
          ← 左右滑動查看完整課表 →
        </div>
        
        {/* 日曆容器 - 在手機版設定最小寬度 */}
        <div className='min-w-[600px] md:min-w-0'>
          {/* 星期標題 */}
          <div className='grid grid-cols-8 gap-1 md:gap-2 mb-4'>
            <div className='text-center text-xs md:text-sm font-semibold text-gray-400 p-1 md:p-2'>
              時間
            </div>
            {weekdays.map(day => (
              <div key={day.id} className='text-center text-xs md:text-sm font-semibold text-white p-1 md:p-2'>
                <div className='hidden md:block'>{day.name}</div>
                <div className='block md:hidden'>{day.shortName}</div>
              </div>
            ))}
        </div>

          {/* 時間格子 */}
          <div className='space-y-1'>
            {timeSlots.map(timeSlot => (
              <div key={timeSlot} className='grid grid-cols-8 gap-1 md:gap-2'>
                {/* 時間列 */}
                <div className='flex items-center justify-center text-[10px] md:text-xs font-semibold text-gray-400 p-1 md:p-2 bg-gray-800/50 rounded'>
                  {timeSlot}
                </div>

              {/* 每個星期的格子 */}
              {weekdays.map(day => {
                const coursesInSlot = getCourseForSlot(day.id, timeSlot);
                
                return (
                  <div key={`${day.id}-${timeSlot}`} className='min-h-[50px] md:min-h-[60px] p-0.5 md:p-1 bg-gray-800/30 rounded border border-gray-700/50'>
                    {coursesInSlot.map(course => {
                      const status = getCourseStatus(course);
                      const isActive = isCourseActive(course);
                      
                      return (
                        <div 
                          key={course._id}
                          className={`
                            group relative p-1 md:p-2 mb-1 rounded border cursor-pointer
                            transition-all duration-300 hover:scale-105 hover:shadow-lg hover:z-20
                            ${isActive ? getDifficultyColor(course.difficulty) : 'bg-gray-600/20 text-gray-400 border-gray-600/30'}
                            hover:bg-gradient-to-r hover:from-red-600/20 hover:to-yellow-500/20
                            ${!isActive ? 'opacity-60' : ''}
                          `}
                          style={{ pointerEvents: 'auto', position: 'relative' }}
                          title={`${course.title} - ${course.instructor || '專業教練'} ${!isActive ? '(課程已結束)' : ''}`}
                          onClick={() => setSelectedCourse(course)}
                        >
                          <div className='flex items-center justify-between gap-1 mb-1'>
                            <div className='flex items-center gap-1 flex-1 min-w-0'>
                              {getCourseIcon(course.category)}
                              <span className='text-[10px] md:text-xs font-semibold truncate'>
                                {course.title}
                              </span>
                            </div>
                            {status && (
                              <span className={`text-[8px] px-1 py-0.5 rounded ${getStatusColor(course)}`}>
                                {status}
                              </span>
                            )}
                          </div>
                          
                          <div className='text-[10px] text-gray-300 space-y-0.5'>
                            <div className='flex items-center gap-1'>
                              <Clock className='w-3 h-3' />
                              <span>{course.duration}min</span>
                            </div>
                            
                            {course.maxParticipants && (
                              <div className='flex items-center gap-1'>
                                <Users className='w-3 h-3' />
                                <span>{course.maxParticipants}人</span>
                              </div>
                            )}
                            
                            {course.startDate && course.endDate && (
                              <div className='text-[9px] text-gray-400'>
                                {formatDate(course.startDate)} ~ {formatDate(course.endDate)}
                              </div>
                            )}
                          </div>

                          {/* 懸浮詳情 */}
                          <div className='absolute left-full top-0 ml-2 w-64 bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-300 z-50'>
                            <h4 className='font-semibold text-white mb-2'>{course.title}</h4>
                            <p className='text-xs text-gray-300 mb-2'>{course.description}</p>
                            {course.startDate && course.endDate && (
                              <p className='text-xs text-gray-400 mb-2'>
                                開課期間：{formatDate(course.startDate)} ~ {formatDate(course.endDate)}
                              </p>
                            )}
                            <div className='flex items-center justify-between text-xs'>
                              <span className='text-gray-400'>{getCategoryText(course.category)}</span>
                              <span className='text-yellow-500 font-semibold'>NT$ {course.price}</span>
                            </div>
                            <div className='mt-2 text-[10px] text-blue-300'>
                              點擊查看詳情
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
          </div>
        </div>

        {/* 圖例 */}
        <div className='mt-6 pt-4 border-t border-gray-800'>
          <div className='grid grid-cols-2 gap-4 text-center'>
            <div>
              <h4 className='text-sm font-semibold text-gray-300 mb-2'>難度等級</h4>
              <div className='flex flex-wrap gap-2 justify-center'>
                <div className='flex items-center gap-1'>
                  <div className='w-3 h-3 bg-green-500/20 border border-green-500/30 rounded'></div>
                  <span className='text-xs text-gray-300'>初級</span>
                </div>
                <div className='flex items-center gap-1'>
                  <div className='w-3 h-3 bg-yellow-500/20 border border-yellow-500/30 rounded'></div>
                  <span className='text-xs text-gray-300'>中級</span>
                </div>
                <div className='flex items-center gap-1'>
                  <div className='w-3 h-3 bg-red-500/20 border border-red-500/30 rounded'></div>
                  <span className='text-xs text-gray-300'>高級</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className='text-sm font-semibold text-gray-300 mb-2'>課程狀態</h4>
              <div className='flex flex-wrap gap-2 justify-center'>
                <div className='flex items-center gap-1'>
                  <div className='w-3 h-3 bg-blue-500/20 border border-blue-500/30 rounded'></div>
                  <span className='text-xs text-gray-300'>即將開課</span>
                </div>
                <div className='flex items-center gap-1'>
                  <div className='w-3 h-3 bg-green-500/20 border border-green-500/30 rounded'></div>
                  <span className='text-xs text-gray-300'>開課中</span>
                </div>
                <div className='flex items-center gap-1'>
                  <div className='w-3 h-3 bg-gray-500/20 border border-gray-500/30 rounded'></div>
                  <span className='text-xs text-gray-300'>已結束</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 課程詳情彈窗 */}
      {selectedCourse && (
        <div 
          className='fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4'
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedCourse(null);
            }
          }}
        >
          <div className='bg-gray-900 border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='p-6'>
              {/* 課程標題 */}
              <div className='flex items-center justify-between mb-6'>
                <div>
                  <h2 className='text-2xl font-bold bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent'>
                    {selectedCourse.title}
                  </h2>
                  <div className='flex items-center gap-3 mt-2'>
                    <span className={`px-2 py-1 rounded text-sm ${getDifficultyColor(selectedCourse.difficulty)}`}>
                      {selectedCourse.difficulty === 'beginner' ? '初級' : 
                       selectedCourse.difficulty === 'intermediate' ? '中級' : '高級'}
                    </span>
                    <span className='text-gray-400'>{getCategoryText(selectedCourse.category)}</span>
                    {getCourseStatus(selectedCourse) && (
                      <span className={`px-2 py-1 rounded text-sm ${getStatusColor(selectedCourse)}`}>
                        {getCourseStatus(selectedCourse)}
                      </span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCourse(null)}
                  className='text-gray-400 hover:text-white transition-colors p-2'
                >
                  <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </button>
              </div>

              {/* 課程圖片 */}
              {selectedCourse.imageUrl && (
                <div className='mb-6 rounded-lg overflow-hidden'>
                  <Image 
                    src={selectedCourse.imageUrl} 
                    alt={selectedCourse.title}
                    width={600}
                    height={192}
                    className='w-full h-48 object-cover'
                  />
                </div>
              )}

              {/* 課程描述 */}
              <div className='mb-6'>
                <h3 className='text-lg font-semibold text-white mb-3'>課程介紹</h3>
                <p className='text-gray-300 leading-relaxed'>{selectedCourse.description}</p>
              </div>

              {/* 課程資訊 */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                <div>
                  <h3 className='text-lg font-semibold text-white mb-3'>課程資訊</h3>
                  <div className='space-y-3'>
                    <div className='flex items-center gap-3'>
                      <Clock className='w-5 h-5 text-red-500' />
                      <span className='text-gray-300'>課程時長：{selectedCourse.duration} 分鐘</span>
                    </div>
                    {selectedCourse.maxParticipants && (
                      <div className='flex items-center gap-3'>
                        <Users className='w-5 h-5 text-red-500' />
                        <span className='text-gray-300'>人數限制：{selectedCourse.maxParticipants} 人</span>
                      </div>
                    )}
                    {selectedCourse.instructor && (
                      <div className='flex items-center gap-3'>
                        <Star className='w-5 h-5 text-red-500' />
                        <span className='text-gray-300'>指導教練：{selectedCourse.instructor}</span>
                      </div>
                    )}
                    <div className='flex items-center gap-3'>
                      <Calendar className='w-5 h-5 text-red-500' />
                      <span className='text-gray-300'>
                        上課時間：{weekdays.filter(day => selectedCourse.weekdays.includes(day.id)).map(day => day.name).join('、')} 
                        {' '}{selectedCourse.timeSlots.map(slot => `${slot.startTime}-${slot.endTime}`).join('、')}
                      </span>
                    </div>
                    {selectedCourse.startDate && selectedCourse.endDate && (
                      <div className='flex items-center gap-3'>
                        <Calendar className='w-5 h-5 text-red-500' />
                        <span className='text-gray-300'>
                          開課期間：{formatDate(selectedCourse.startDate)} ~ {formatDate(selectedCourse.endDate)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className='text-lg font-semibold text-white mb-3'>課程費用</h3>
                  <div className='bg-gradient-to-r from-red-600/20 to-yellow-500/20 border border-red-500/30 rounded-lg p-4'>
                    <div className='text-3xl font-bold text-yellow-500 mb-2'>
                      NT$ {selectedCourse.price}
                    </div>
                    <p className='text-sm text-gray-300'>單堂課程費用</p>
                  </div>
                </div>
              </div>

              {/* 課程特色 */}
              {selectedCourse.features && selectedCourse.features.length > 0 && (
                <div className='mb-6'>
                  <h3 className='text-lg font-semibold text-white mb-3'>課程特色</h3>
                  <div className='flex flex-wrap gap-2'>
                    {selectedCourse.features.map((feature, index) => (
                      <span 
                        key={index}
                        className='bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm'
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 行動按鈕 */}
              <div className='flex gap-3 pt-4'>
                <button className='flex-1 bg-gradient-to-r from-red-600 to-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform duration-300'>
                  立即預約課程
                </button>
                <button 
                  onClick={() => setSelectedCourse(null)}
                  className='px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors duration-300'
                >
                  關閉
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseCalendar;