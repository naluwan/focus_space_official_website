'use client';

import React, { useState, useEffect } from 'react';
import { Dumbbell, Users, Star, Clock, DollarSign, Calendar } from 'lucide-react';

interface Course {
  _id: string;
  title: string;
  description: string;
  category: 'personal' | 'group' | 'special';
  duration: number;
  price: number;
  maxParticipants?: number;
  instructor?: string;
  startDate: string;
  endDate: string;
  weekdays: number[];
  timeSlots: {
    startTime: string;
    endTime: string;
  }[];
  allowLateEnrollment?: boolean;
  requirements?: string;
  features: string[];
}

import type { BookingComponentProps } from '@/types/booking';

interface CourseSelectionProps extends BookingComponentProps {}

const CourseSelection: React.FC<CourseSelectionProps> = ({
  bookingData,
  setBookingData,
  errors,
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      if (response.ok) {
        const data = await response.json();
        const allCourses = data.data || [];
        
        // 篩選可預約的課程
        const today = new Date();
        today.setHours(0, 0, 0, 0); // 設置為今天的開始
        
        const availableCourses = allCourses.filter((course: Course) => {
          // 個人課程永遠可預約
          if (course.category === 'personal') {
            return true;
          }
          
          const courseStartDate = new Date(course.startDate);
          const courseEndDate = new Date(course.endDate);
          
          // 課程已結束，不顯示
          if (today > courseEndDate) {
            return false;
          }
          
          // 課程尚未開始，可以預約
          if (today < courseStartDate) {
            return true;
          }
          
          // 課程已開始，檢查是否允許插班
          return course.allowLateEnrollment === true;
        });
        
        setCourses(availableCourses);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = (course: Course) => {
    setBookingData({
      ...bookingData,
      courseId: course._id,
      courseName: course.title,
      courseCategory: course.category,
      duration: course.duration,
      totalPrice: course.price * (bookingData.participantCount || 1),
      // 為團體課程添加時間資訊
      courseStartDate: course.startDate,
      courseEndDate: course.endDate,
      courseWeekdays: course.weekdays,
      courseTimeSlots: course.timeSlots,
      allowLateEnrollment: course.allowLateEnrollment || false,
      // 課程詳細資訊
      courseRequirements: course.requirements,
      courseFeatures: course.features
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'personal':
        return <Dumbbell className="w-5 h-5" />;
      case 'group':
        return <Users className="w-5 h-5" />;
      case 'special':
        return <Star className="w-5 h-5" />;
      default:
        return <Dumbbell className="w-5 h-5" />;
    }
  };

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
  
  const getCourseStatus = (course: Course) => {
    if (course.category === 'personal') {
      return null; // 個人課程不需要狀態標籤
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const courseStartDate = new Date(course.startDate);
    
    if (today >= courseStartDate && course.allowLateEnrollment) {
      return { text: '可插班', color: 'orange' };
    } else if (today < courseStartDate) {
      return { text: '即將開課', color: 'green' };
    }
    return null;
  };

  const weekdayToString = (weekday: number): string => {
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    return weekdays[weekday] || '未知';
  };

  const sortWeekdays = (weekdays: number[]): number[] => {
    // 將星期日(0)轉換為7，這樣可以正確排序：1(一) 2(二) ... 6(六) 7(日)
    return weekdays
      .map(day => day === 0 ? 7 : day)
      .sort((a, b) => a - b)
      .map(day => day === 7 ? 0 : day);
  };

  const formatWeekdays = (weekdays: number[]): string => {
    return sortWeekdays(weekdays).map(day => weekdayToString(day)).join('、');
  };

  const formatTimeSlot = (timeSlot: { startTime: string; endTime: string }): string => {
    return `${timeSlot.startTime} - ${timeSlot.endTime}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const filteredCourses = selectedCategory === 'all' 
    ? courses 
    : courses.filter(course => course.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">載入課程中...</div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">選擇您想預約的課程</h2>
      
      {/* 分類篩選 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'personal', 'group', 'special'].map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`
              px-4 py-2 rounded-full font-semibold transition-all duration-300
              ${selectedCategory === category 
                ? 'bg_brand_gradient text-white shadow-lg' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
            `}
          >
            {category === 'all' ? '全部課程' : getCategoryText(category)}
          </button>
        ))}
      </div>

      {/* 課程列表 */}
      <div className="grid gap-4 max-h-96 overflow-y-auto pr-2">
        {filteredCourses.map((course) => (
          <button
            key={course._id}
            type="button"
            onClick={() => handleCourseSelect(course)}
            className={`
              p-4 border rounded-xl cursor-pointer transition-all duration-300 w-full text-left
              hover:shadow-lg hover:-translate-y-1
              ${bookingData.courseId === course._id 
                ? 'border-brand-red-300 bg-red-50 shadow-md' 
                : 'border-gray-200 hover:border-gray-300'}
            `}
          >
            <div className="flex items-start gap-4">
              {/* 課程圖標 */}
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0
                ${bookingData.courseId === course._id 
                  ? 'bg_brand_gradient text-white' 
                  : 'bg-gray-100 text-gray-600'}
              `}>
                {getCategoryIcon(course.category)}
              </div>
              
              {/* 課程資訊 */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{course.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                  </div>
                  <div className="flex gap-2 items-start">
                    {/* 課程狀態標籤 */}
                    {(() => {
                      const status = getCourseStatus(course);
                      if (status) {
                        return (
                          <span className={`
                            px-2 py-1 rounded-full text-xs font-semibold
                            ${status.color === 'orange' ? 'bg-orange-100 text-orange-800' : ''}
                            ${status.color === 'green' ? 'bg-green-100 text-green-800' : ''}
                          `}>
                            {status.text}
                          </span>
                        );
                      }
                      return null;
                    })()}
                    
                    {/* 課程類別標籤 */}
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-semibold
                      ${course.category === 'personal' ? 'bg-blue-100 text-blue-800' : ''}
                      ${course.category === 'group' ? 'bg-green-100 text-green-800' : ''}
                      ${course.category === 'special' ? 'bg-purple-100 text-purple-800' : ''}
                    `}>
                      {getCategoryText(course.category)}
                    </span>
                  </div>
                </div>
                
                {/* 課程詳情 */}
                <div className="space-y-2 mt-3">
                  {/* 第一行：基本資訊 */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-800">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{course.duration}分鐘</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="font-bold text-brand-red-600">NT$ {course.price}</span>
                    </div>
                    {course.instructor && (
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">教練：{course.instructor}</span>
                      </div>
                    )}
                    {course.maxParticipants && (
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">限{course.maxParticipants}人</span>
                      </div>
                    )}
                  </div>

                  {/* 第二行：課程時程 */}
                  {course.startDate && course.endDate && (
                    <div className="flex flex-wrap gap-4 text-sm text-gray-800">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">課程期間：{formatDate(course.startDate)} ~ {formatDate(course.endDate)}</span>
                      </div>
                    </div>
                  )}

                  {/* 第三行：上課時間 */}
                  {course.weekdays && course.weekdays.length > 0 && (
                    <div className="flex flex-wrap gap-4 text-sm text-gray-800">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">上課時間：每{formatWeekdays(course.weekdays)}</span>
                      </div>
                    </div>
                  )}

                  {/* 第四行：時段 */}
                  {course.timeSlots && course.timeSlots.length > 0 && (
                    <div className="flex flex-wrap gap-4 text-sm text-gray-800">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">時段：{course.timeSlots.map(slot => formatTimeSlot(slot)).join('、')}</span>
                      </div>
                    </div>
                  )}

                  {/* 課程特色 */}
                  {course.features && course.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {course.features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 參加要求 */}
                  {course.requirements && (
                    <div className="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                      <div className="flex items-start gap-2">
                        <Star className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-yellow-800">參加要求：</p>
                          <p className="text-sm text-yellow-700 mt-1">{course.requirements}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* 錯誤提示 */}
      {errors.course && (
        <p className="text-red-500 text-sm mt-2">{errors.course}</p>
      )}
    </div>
  );
};

export default CourseSelection;