'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, Calendar, Clock, DollarSign, Users, Star } from 'lucide-react';

interface Course {
  _id: string
  title: string
  description: string
  category: 'personal' | 'group' | 'special'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number
  price: number
  maxParticipants?: number
  instructor?: string
  imageUrl?: string
  features: string[]
  requirements?: string
  startDate: string
  endDate: string
  weekdays: number[]
  timeSlots: { startTime: string; endTime: string }[]
  allowLateEnrollment?: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
  displayOrder: number
}

interface CourseDetailContentProps {
  courseId: string
}

const CourseDetailContent = ({ courseId }: CourseDetailContentProps) => {
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCourse = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/courses/${courseId}`);
      if (response.ok) {
        const data = await response.json();
        setCourse(data.data);
      } else {
        console.error('獲取課程失敗');
        alert('獲取課程資料失敗');
        router.push('/admin/courses');
      }
    } catch (error) {
      console.error('獲取課程失敗:', error);
      alert('獲取課程資料失敗');
      router.push('/admin/courses');
    } finally {
      setIsLoading(false);
    }
  }, [courseId, router]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'personal': return '個人課程';
      case 'group': return '團體課程';
      case 'special': return '特殊課程';
      default: return category;
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '初級';
      case 'intermediate': return '中級';
      case 'advanced': return '高級';
      default: return difficulty;
    }
  };

  const getWeekdayText = (weekdays: number[]) => {
    const dayMap: { [key: number]: string } = {
      0: '星期日',
      1: '星期一',
      2: '星期二',
      3: '星期三',
      4: '星期四',
      5: '星期五',
      6: '星期六'
    };
    return weekdays
      .map(day => day === 0 ? 7 : day)
      .sort((a, b) => a - b)
      .map(day => day === 7 ? 0 : day)
      .map(day => dayMap[day] || `Day ${day}`)
      .join('、');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">載入中...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">課程不存在</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push('/admin/courses')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          返回課程列表
        </Button>
        <Button
          onClick={() => router.push(`/admin/courses/${course._id}/edit`)}
          className="bg-yellow-600 hover:bg-yellow-700 text-white flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          編輯課程
        </Button>
      </div>

      {/* 基本資訊 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center justify-between">
            {course.title}
            <Badge className={course.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
              {course.isActive ? '啟用中' : '已停用'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {getCategoryText(course.category)}
              </Badge>
              <Badge variant="outline">
                {getDifficultyText(course.difficulty)}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span>課程時長: {course.duration} 分鐘</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <DollarSign className="h-4 w-4" />
                <span>價格: NT$ {course.price}</span>
              </div>
              {course.maxParticipants && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>最大人數: {course.maxParticipants} 人</span>
                </div>
              )}
              {course.instructor && (
                <div className="flex items-center gap-2 text-gray-600">
                  <span>教練: {course.instructor}</span>
                </div>
              )}
              {course.category === 'group' && (
                <div className="flex items-center gap-2 text-gray-600">
                  <span>插班設定: {course.allowLateEnrollment ? '✅ 允許插班' : '❌ 不允許插班'}</span>
                </div>
              )}
            </div>
          </div>

          {course.imageUrl && (
            <div>
              <Image 
                src={course.imageUrl} 
                alt={course.title}
                width={400}
                height={192}
                className="w-full h-48 object-cover rounded-lg border border-gray-300"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* 課程描述 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900">課程描述</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-800 whitespace-pre-wrap leading-relaxed break-words">
            {course.description}
          </div>
        </CardContent>
      </Card>

      {/* 時間安排 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            時間安排
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">開始日期</label>
              <div className="text-gray-900">{formatDate(course.startDate)}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">結束日期</label>
              <div className="text-gray-900">{formatDate(course.endDate)}</div>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700">上課日</label>
            <div className="text-gray-900">{getWeekdayText(course.weekdays)}</div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">上課時間</label>
            <div className="space-y-1">
              {course.timeSlots.map((slot, index) => (
                <div key={index} className="text-gray-900">
                  {slot.startTime} - {slot.endTime}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 課程特色 */}
      {course.features.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Star className="h-5 w-5" />
              課程特色
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {course.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-800">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 參加要求 */}
      {course.requirements && (
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900">參加要求</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
              {course.requirements}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 系統資訊 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900">系統資訊</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <label className="text-gray-700">建立時間</label>
            <div className="text-gray-900">{formatDate(course.createdAt)}</div>
          </div>
          <div>
            <label className="text-gray-700">最後更新</label>
            <div className="text-gray-900">{formatDate(course.updatedAt)}</div>
          </div>
          <div>
            <label className="text-gray-700">顯示順序</label>
            <div className="text-gray-900">{course.displayOrder}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseDetailContent;