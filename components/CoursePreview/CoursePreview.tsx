'use client';
import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Users,
  Star,
  ArrowRight,
  Dumbbell,
  Activity,
  Zap,
  DollarSign,
} from 'lucide-react';
import Image from 'next/image';
import { MicroButton } from '@/components/MicroInteractions/MicroInteractions';
import { useRouter } from 'next/navigation';

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
}

const CoursePreview = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCourses, setVisibleCourses] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  // 獲取課程資料
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses?featured=true');
        if (response.ok) {
          const data = await response.json();
          setCourses(data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // 動畫效果
  useEffect(() => {
    if (courses.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const courseIndex = parseInt(entry.target.getAttribute('data-course') || '0');
            setVisibleCourses((prev) => [...prev, courseIndex]);
          }
        });
      },
      { threshold: 0.1 },
    );

    document.querySelectorAll('[data-course]').forEach((course) => {
      observer.observe(course);
    });

    return () => observer.disconnect();
  }, [courses]);

  // 輔助函數
  const getCategoryText = (category: string) => {
    switch (category) {
      case 'personal':
        return '個人課程';
      case 'group':
        return '團體課程';
      case 'special':
        return '特殊課程';
      default:
        return category;
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return '初級';
      case 'intermediate':
        return '中級';
      case 'advanced':
        return '高級';
      default:
        return difficulty;
    }
  };

  const getCategoryType = (category: string) => {
    switch (category) {
      case 'personal':
        return 'strength';
      case 'group':
        return 'cardio';
      case 'special':
        return 'functional';
      default:
        return 'strength';
    }
  };

  const getWeekdayText = (weekdays: number[]) => {
    const dayMap: { [key: number]: string } = {
      0: '週日',
      1: '週一',
      2: '週二',
      3: '週三',
      4: '週四',
      5: '週五',
      6: '週六',
    };
    
    // 正確排序：星期一到星期日
    const sortedWeekdays = weekdays
      .map(day => day === 0 ? 7 : day) // 將星期日轉為7
      .sort((a, b) => a - b)
      .map(day => day === 7 ? 0 : day); // 轉回原來的0
    
    return sortedWeekdays.map((day) => dayMap[day] || day).join('、');
  };

  const tabs = [
    { id: 'all', label: '全部課程', icon: <Activity className='h-4 w-4' /> },
    { id: 'personal', label: '個人課程', icon: <Dumbbell className='h-4 w-4' /> },
    { id: 'group', label: '團體課程', icon: <Zap className='h-4 w-4' /> },
    { id: 'special', label: '特殊課程', icon: <Star className='h-4 w-4' /> },
  ];

  const filteredCourses =
    activeTab === 'all'
      ? courses
      : courses.filter((course) => course.category === activeTab);

  // 根據課程數量動態決定網格排列
  const getGridCols = (courseCount: number) => {
    switch (courseCount) {
      case 1:
        return 'grid-cols-1 max-w-md mx-auto'; // 單個課程居中
      case 2:
        return 'grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto'; // 兩個課程
      case 3:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'; // 三個課程
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'; // 四個或以上
    }
  };

  // 如果沒有課程資料且載入完成，則不顯示整個組件
  if (!loading && courses.length === 0) {
    return null;
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '初級':
        return 'bg-green-100 text-green-800';
      case '中級':
        return 'bg-yellow-100 text-yellow-800';
      case '高級':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className='bg-white py-20'>
      <div className='max-container mx-auto px-6'>
        {/* 標題區 */}
        <div className='mb-16 text-center'>
          <h2 className='text_brand_gradient mb-6 font-bebas_neue text-4xl font-bold md:text-6xl'>
            專業課程預覽
          </h2>
          <p className='mx-auto mb-8 max-w-3xl text-xl text-gray-600 md:text-2xl'>
            多元化課程選擇，專業教練指導，讓您找到最適合的訓練方式
          </p>
        </div>

        {loading ? (
          <div className='py-16 text-center'>
            <div className='text-gray-500'>載入中...</div>
          </div>
        ) : (
          <>
            {/* 分類標籤 */}
            {courses.length > 0 && (
              <div className='mb-12 flex flex-wrap justify-center gap-4'>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 rounded-full px-6 py-3 font-semibold transition-all duration-300
                      ${
                        activeTab === tab.id
                          ? 'bg_brand_gradient scale-105 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            )}

            {/* 課程卡片網格 */}
            <div className={`mb-16 grid gap-8 ${getGridCols(filteredCourses.length)}`}>
              {filteredCourses.map((course, index) => (
                <div
                  key={course._id}
                  data-course={index}
                  className={`
                    group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg
                    transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl
                    ${
                      visibleCourses.includes(index)
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-10 opacity-0'
                    }
                  `}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  {/* 課程圖片 */}
                  <div className='bg_brand_gradient relative h-48 overflow-hidden'>
                    {course.imageUrl ? (
                      <Image
                        src={course.imageUrl}
                        alt={course.title}
                        fill
                        className='object-cover'
                        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
                      />
                    ) : (
                      <div className='absolute inset-0 bg-black/20' />
                    )}
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <div className='text-center text-white'>
                        <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20'>
                          {getCategoryType(course.category) === 'strength' && (
                            <Dumbbell className='h-8 w-8' />
                          )}
                          {getCategoryType(course.category) === 'cardio' && (
                            <Zap className='h-8 w-8' />
                          )}
                          {getCategoryType(course.category) === 'functional' && (
                            <Activity className='h-8 w-8' />
                          )}
                        </div>
                        <h3 className='font-bebas_neue text-2xl font-bold'>
                          {course.title}
                        </h3>
                      </div>
                    </div>

                    {/* 分類標籤 */}
                    <div className='absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1'>
                      <span className='text-sm font-semibold'>
                        {getCategoryText(course.category)}
                      </span>
                    </div>
                  </div>

                  {/* 課程內容 */}
                  <div className='p-6'>
                    {/* 難度和教練 */}
                    <div className='mb-4 flex items-center justify-between'>
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${getDifficultyColor(
                          getDifficultyText(course.difficulty),
                        )}`}
                      >
                        {getDifficultyText(course.difficulty)}
                      </span>
                      {course.instructor && (
                        <span className='text-sm text-gray-600'>
                          教練：{course.instructor}
                        </span>
                      )}
                    </div>

                    {/* 課程描述 */}
                    <p className='mb-4 leading-relaxed text-gray-600'>
                      {course.description}
                    </p>

                    {/* 課程資訊 */}
                    <div className='mb-4 grid grid-cols-2 gap-4 text-sm text-gray-600'>
                      <div className='flex items-center gap-2'>
                        <Clock className='h-4 w-4 text-brand-red-500' />
                        <span>{course.duration}分鐘</span>
                      </div>
                      {course.maxParticipants && (
                        <div className='flex items-center gap-2'>
                          <Users className='h-4 w-4 text-brand-red-500' />
                          <span>限{course.maxParticipants}人</span>
                        </div>
                      )}
                      <div className='flex items-center gap-2'>
                        <Calendar className='h-4 w-4 text-brand-red-500' />
                        <span>
                          {getWeekdayText(course.weekdays)}{' '}
                          {course.timeSlots
                            .map((slot) => `${slot.startTime}-${slot.endTime}`)
                            .join(', ')}
                        </span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <DollarSign className='h-4 w-4 text-brand-red-500' />
                        <span className='font-semibold text-brand-red-600'>
                          NT$ {course.price}
                        </span>
                      </div>
                    </div>

                    {/* 課程特色 */}
                    {course.features.length > 0 && (
                      <div className='mb-6'>
                        <div className='flex flex-wrap gap-2'>
                          {course.features.map((feature, featureIndex) => (
                            <span
                              key={featureIndex}
                              className='rounded bg-gray-100 px-2 py-1 text-xs text-gray-700'
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 預約按鈕 */}
                    <button 
                      onClick={() => router.push('/booking')}
                      className='btn_brand_primary flex w-full items-center justify-center gap-2 transition-transform duration-300 group-hover:scale-105'
                    >
                      立即預約
                      <ArrowRight className='h-4 w-4 transition-transform duration-300 group-hover:translate-x-1' />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 行動號召區 */}
            {courses.length > 0 && (
              <div className='rounded-3xl bg-gradient-to-r from-gray-50 to-gray-100 p-8 text-center md:p-12'>
                <h3 className='mb-4 font-bebas_neue text-3xl font-bold text-gray-900 md:text-4xl'>
                  想了解更多課程資訊？
                </h3>
                <p className='mb-8 text-xl text-gray-600'>
                  我們還有更多專業課程等您探索，歡迎來電或現場諮詢
                </p>
                <div className='flex flex-col justify-center gap-4 sm:flex-row'>
                  <MicroButton
                    variant='primary'
                    size='lg'
                    onClick={() => (window.location.href = '/class')}
                    withIcon
                    className='px-8 py-4 text-lg'
                  >
                    <Calendar className='h-5 w-5' />
                    查看完整課表
                  </MicroButton>
                  <MicroButton
                    variant='outline'
                    size='lg'
                    onClick={() => {
                      router.push('/booking');
                    }}
                    withIcon
                    className='px-8 py-4 text-lg hover:text-white'
                  >
                    <ArrowRight className='h-5 w-5' />
                    預約體驗課程
                  </MicroButton>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default CoursePreview;
