'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, Star, Calendar, User, Briefcase, Clock, Target } from 'lucide-react';
import Image from 'next/image';

interface Testimonial {
  _id: string
  memberName: string
  age?: number
  occupation?: string
  content: string
  rating: number
  imageUrl?: string
  beforeImageUrl?: string
  afterImageUrl?: string
  isPublished: boolean
  tags: string[]
  trainingPeriod?: string
  achievements: string[]
  createdAt: string
  updatedAt: string
  publishedAt?: string
  sortOrder: number
}

interface TestimonialDetailContentProps {
  testimonialId: string
}

const TestimonialDetailContent = ({ testimonialId }: TestimonialDetailContentProps) => {
  const router = useRouter();
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTestimonial = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/testimonials/${testimonialId}`);
      if (response.ok) {
        const data = await response.json();
        setTestimonial(data.testimonial);
      } else {
        console.error('獲取見證失敗');
        alert('獲取見證資料失敗');
        router.push('/admin/testimonials');
      }
    } catch (error) {
      console.error('獲取見證失敗:', error);
      alert('獲取見證資料失敗');
      router.push('/admin/testimonials');
    } finally {
      setIsLoading(false);
    }
  }, [testimonialId, router]);

  useEffect(() => {
    fetchTestimonial();
  }, [fetchTestimonial]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => {
      const fillPercentage = Math.min(100, Math.max(0, (rating - i) * 100));
      
      return (
        <div key={i} className="relative h-5 w-5">
          <Star className="h-5 w-5 text-gray-300 absolute" />
          <div className="absolute overflow-hidden" style={{ width: `${fillPercentage}%` }}>
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
          </div>
        </div>
      );
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">載入中...</div>
      </div>
    );
  }

  if (!testimonial) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">見證不存在</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 標題區域 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/admin/testimonials')}
            className="text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回列表
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{testimonial.memberName} 的見證</h1>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant={testimonial.isPublished ? 'default' : 'secondary'}>
                {testimonial.isPublished ? '已發布' : '未發布'}
              </Badge>
              <div className="flex items-center">
                {renderStars(testimonial.rating)}
                <span className="ml-2 text-sm text-gray-900 font-medium">{testimonial.rating}/5</span>
              </div>
            </div>
          </div>
        </div>
        <Button
          onClick={() => router.push(`/admin/testimonials/${testimonial._id}/edit`)}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          <Edit className="h-4 w-4 mr-2" />
          編輯見證
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 主要內容 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 會員照片 */}
          {testimonial.imageUrl && (
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  會員照片
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Image 
                  src={testimonial.imageUrl} 
                  alt={testimonial.memberName}
                  width={300}
                  height={300}
                  className="w-full max-w-md mx-auto rounded-lg shadow-md"
                />
              </CardContent>
            </Card>
          )}

          {/* 訓練前後對比 */}
          {(testimonial.beforeImageUrl || testimonial.afterImageUrl) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">訓練前後對比</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testimonial.beforeImageUrl && (
                    <div>
                      <h4 className="text-gray-700 font-medium mb-2">訓練前</h4>
                      <Image 
                        src={testimonial.beforeImageUrl} 
                        alt="訓練前"
                        width={300}
                        height={300}
                        className="w-full rounded-lg shadow-md"
                      />
                    </div>
                  )}
                  {testimonial.afterImageUrl && (
                    <div>
                      <h4 className="text-gray-700 font-medium mb-2">訓練後</h4>
                      <Image 
                        src={testimonial.afterImageUrl} 
                        alt="訓練後"
                        width={300}
                        height={300}
                        className="w-full rounded-lg shadow-md"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 見證內容 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">見證內容</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-800 whitespace-pre-wrap leading-relaxed break-words overflow-wrap-anywhere">
                {testimonial.content}
              </div>
            </CardContent>
          </Card>

          {/* 訓練成就 */}
          {testimonial.achievements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  訓練成就
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {testimonial.achievements.map((achievement, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-3 bg-green-50 px-4 py-3 rounded-lg"
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-800">{achievement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 側邊欄資訊 */}
        <div className="space-y-6">
          {/* 基本資訊 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <User className="h-5 w-5" />
                基本資訊
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-gray-600">會員姓名</div>
                <div className="text-gray-900 font-medium">{testimonial.memberName}</div>
              </div>
              
              {testimonial.age && (
                <div>
                  <div className="text-sm text-gray-600">年齡</div>
                  <div className="text-gray-900">{testimonial.age} 歲</div>
                </div>
              )}
              
              {testimonial.occupation && (
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-600">職業</div>
                    <div className="text-gray-900">{testimonial.occupation}</div>
                  </div>
                </div>
              )}
              
              {testimonial.trainingPeriod && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-600">訓練期間</div>
                    <div className="text-gray-900">{testimonial.trainingPeriod}</div>
                  </div>
                </div>
              )}

              <div>
                <div className="text-sm text-gray-600">顯示順序</div>
                <div className="text-gray-900">{testimonial.sortOrder}</div>
              </div>
            </CardContent>
          </Card>

          {/* 標籤 */}
          {testimonial.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">標籤</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {testimonial.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 時間資訊 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                時間資訊
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm text-gray-600">建立時間</div>
                <div className="text-gray-900 text-sm">{formatDate(testimonial.createdAt)}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600">最後更新</div>
                <div className="text-gray-900 text-sm">{formatDate(testimonial.updatedAt)}</div>
              </div>
              
              {testimonial.publishedAt && (
                <div>
                  <div className="text-sm text-gray-600">發布時間</div>
                  <div className="text-gray-900 text-sm">{formatDate(testimonial.publishedAt)}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TestimonialDetailContent;