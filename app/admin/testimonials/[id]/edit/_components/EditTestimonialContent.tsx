'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadButton } from '@/lib/uploadthing';
import { Star, X, Plus } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface FormData {
  memberName: string
  age: string
  occupation: string
  content: string
  rating: number
  imageUrl: string
  beforeImageUrl: string
  afterImageUrl: string
  isPublished: boolean
  tags: string[]
  trainingPeriod: string
  achievements: string[]
  sortOrder: string
}

interface EditTestimonialContentProps {
  testimonialId: string
}

const EditTestimonialContent = ({ testimonialId }: EditTestimonialContentProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    memberName: '',
    age: '',
    occupation: '',
    content: '',
    rating: 5,
    imageUrl: '',
    beforeImageUrl: '',
    afterImageUrl: '',
    isPublished: false,
    tags: [],
    trainingPeriod: '',
    achievements: [],
    sortOrder: '0'
  });
  const [originalData, setOriginalData] = useState<FormData | null>(null);
  const [newTag, setNewTag] = useState('');
  const [newAchievement, setNewAchievement] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTestimonial = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/testimonials/${testimonialId}`);
      if (response.ok) {
        const data = await response.json();
        const testimonial = data.testimonial;
        
        const formattedData = {
          memberName: testimonial.memberName || '',
          age: testimonial.age ? testimonial.age.toString() : '',
          occupation: testimonial.occupation || '',
          content: testimonial.content || '',
          rating: testimonial.rating || 5,
          imageUrl: testimonial.imageUrl || '',
          beforeImageUrl: testimonial.beforeImageUrl || '',
          afterImageUrl: testimonial.afterImageUrl || '',
          isPublished: testimonial.isPublished || false,
          tags: testimonial.tags || [],
          trainingPeriod: testimonial.trainingPeriod || '',
          achievements: testimonial.achievements || [],
          sortOrder: testimonial.sortOrder ? testimonial.sortOrder.toString() : '0'
        };
        
        setFormData(formattedData);
        setOriginalData(formattedData);
      } else {
        console.error('獲取見證失敗');
        toast.error('獲取見證資料失敗');
        router.push('/admin/testimonials');
      }
    } catch (error) {
      console.error('獲取見證失敗:', error);
      toast.error('獲取見證資料失敗');
      router.push('/admin/testimonials');
    } finally {
      setIsLoading(false);
    }
  }, [testimonialId, router]);

  useEffect(() => {
    fetchTestimonial();
  }, [fetchTestimonial]);

  const handleInputChange = (field: keyof FormData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddAchievement = () => {
    if (newAchievement.trim() && !formData.achievements.includes(newAchievement.trim())) {
      setFormData(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }));
      setNewAchievement('');
    }
  };

  const handleRemoveAchievement = (achievementToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter(achievement => achievement !== achievementToRemove)
    }));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => {
      const fillPercentage = Math.min(100, Math.max(0, (rating - i) * 100));
      
      return (
        <div key={i} className="relative h-6 w-6">
          <Star className="h-6 w-6 text-gray-300 absolute" />
          <div className="absolute overflow-hidden" style={{ width: `${fillPercentage}%` }}>
            <Star className="h-6 w-6 text-yellow-400 fill-current" />
          </div>
        </div>
      );
    });
  };

  const validateForm = () => {
    if (!formData.memberName.trim()) {
      toast.error('請輸入會員姓名');
      return false;
    }
    if (!formData.content.trim()) {
      toast.error('請輸入見證內容');
      return false;
    }
    if (formData.rating < 1 || formData.rating > 5) {
      toast.error('評分必須在1-5之間');
      return false;
    }
    return true;
  };

  const deleteOldImage = async (imageUrl: string) => {
    try {
      await fetch('/api/admin/uploadthing/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: imageUrl })
      });
    } catch (error) {
      console.error('刪除舊圖片失敗:', error);
    }
  };

  const handleImageUpdate = async (field: 'imageUrl' | 'beforeImageUrl' | 'afterImageUrl', newUrl: string) => {
    const oldUrl = originalData?.[field];
    if (oldUrl && oldUrl !== newUrl) {
      await deleteOldImage(oldUrl);
    }
    handleInputChange(field, newUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const submitData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : undefined,
        sortOrder: parseInt(formData.sortOrder)
      };

      const response = await fetch(`/api/admin/testimonials/${testimonialId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        toast.success('見證更新成功！');
        router.push('/admin/testimonials');
      } else {
        const data = await response.json();
        toast.error('更新見證失敗：' + data.error);
      }
    } catch (error) {
      console.error('更新見證失敗:', error);
      toast.error('更新見證失敗，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">載入中...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 基本資訊 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900">基本資訊</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="memberName" className="text-gray-700">會員姓名 *</Label>
              <Input
                id="memberName"
                type="text"
                value={formData.memberName}
                onChange={(e) => handleInputChange('memberName', e.target.value)}
                className="mt-1 text-gray-900"
                placeholder="請輸入會員姓名"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age" className="text-gray-700">年齡</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className="mt-1 text-gray-900"
                  placeholder="年齡"
                  min="1"
                  max="120"
                />
              </div>
              <div>
                <Label htmlFor="sortOrder" className="text-gray-700">顯示順序</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => handleInputChange('sortOrder', e.target.value)}
                  className="mt-1 text-gray-900"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="occupation" className="text-gray-700">職業</Label>
              <Input
                id="occupation"
                type="text"
                value={formData.occupation}
                onChange={(e) => handleInputChange('occupation', e.target.value)}
                className="mt-1 text-gray-900"
                placeholder="請輸入職業"
              />
            </div>

            <div>
              <Label htmlFor="trainingPeriod" className="text-gray-700">訓練期間</Label>
              <Input
                id="trainingPeriod"
                type="text"
                value={formData.trainingPeriod}
                onChange={(e) => handleInputChange('trainingPeriod', e.target.value)}
                className="mt-1 text-gray-900"
                placeholder="例如：3個月、半年"
              />
            </div>

            <div>
              <Label className="text-gray-700">評分 *</Label>
              <div className="space-y-3 mt-2">
                <div className="flex items-center space-x-4">
                  <Slider
                    value={[formData.rating]}
                    onValueChange={(value) => handleInputChange('rating', value[0])}
                    max={5}
                    min={0}
                    step={0.1}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600 min-w-[60px]">{formData.rating.toFixed(1)}/5</span>
                </div>
                <div className="flex items-center space-x-2">
                  {renderStars(formData.rating)}
                  <span className="ml-2 text-sm text-gray-500">({formData.rating.toFixed(1)} 顆星)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isPublished"
                checked={formData.isPublished}
                onCheckedChange={(checked) => handleInputChange('isPublished', checked)}
              />
              <Label htmlFor="isPublished" className="text-gray-700">發布狀態</Label>
            </div>
          </CardContent>
        </Card>

        {/* 圖片上傳 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900">圖片</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 會員照片 */}
            <div>
              <Label className="text-gray-700">會員照片</Label>
              <div className="mt-2">
                {formData.imageUrl ? (
                  <div className="relative">
                    <Image 
                      src={formData.imageUrl} 
                      alt="會員照片" 
                      width={400}
                      height={192}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => handleInputChange('imageUrl', '')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <UploadButton
                    endpoint="courseImage"
                    onClientUploadComplete={(res) => {
                      if (res?.[0]?.url) {
                        handleImageUpdate('imageUrl', res[0].url);
                      }
                    }}
                    onUploadError={(error) => {
                      console.error('上傳失敗:', error);
                      toast.error('上傳失敗: ' + error.message);
                    }}
                    className="mt-2"
                  />
                )}
              </div>
            </div>

            {/* 前後對比照 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700">訓練前照片</Label>
                <div className="mt-2">
                  {formData.beforeImageUrl ? (
                    <div className="relative">
                      <Image 
                        src={formData.beforeImageUrl} 
                        alt="訓練前" 
                        width={200}
                        height={128}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1"
                        onClick={() => handleInputChange('beforeImageUrl', '')}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <UploadButton
                      endpoint="courseImage"
                      onClientUploadComplete={(res) => {
                        if (res?.[0]?.url) {
                          handleImageUpdate('beforeImageUrl', res[0].url);
                        }
                      }}
                      onUploadError={(error) => {
                        console.error('上傳失敗:', error);
                        toast.error('上傳失敗: ' + error.message);
                      }}
                      className="text-xs"
                    />
                  )}
                </div>
              </div>

              <div>
                <Label className="text-gray-700">訓練後照片</Label>
                <div className="mt-2">
                  {formData.afterImageUrl ? (
                    <div className="relative">
                      <Image 
                        src={formData.afterImageUrl} 
                        alt="訓練後" 
                        width={200}
                        height={128}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1"
                        onClick={() => handleInputChange('afterImageUrl', '')}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <UploadButton
                      endpoint="courseImage"
                      onClientUploadComplete={(res) => {
                        if (res?.[0]?.url) {
                          handleImageUpdate('afterImageUrl', res[0].url);
                        }
                      }}
                      onUploadError={(error) => {
                        console.error('上傳失敗:', error);
                        toast.error('上傳失敗: ' + error.message);
                      }}
                      className="text-xs"
                    />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 內容區域 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900">見證內容</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="content" className="text-gray-700">見證內容 *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              className="mt-1 text-gray-900"
              placeholder="請輸入會員的訓練心得和成果..."
              rows={6}
              required
            />
          </div>

          {/* 標籤 */}
          <div>
            <Label className="text-gray-700">標籤</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-red-500" 
                    onClick={() => handleRemoveTag(tag)}
                  />
                </Badge>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <Input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="flex-1 text-gray-900"
                placeholder="新增標籤..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <Button type="button" onClick={handleAddTag} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* 成就 */}
          <div>
            <Label className="text-gray-700">訓練成就</Label>
            <div className="mt-2 space-y-2">
              {formData.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center justify-between bg-green-50 px-3 py-2 rounded">
                  <span className="text-gray-900">{achievement}</span>
                  <X 
                    className="h-4 w-4 cursor-pointer hover:text-red-500" 
                    onClick={() => handleRemoveAchievement(achievement)}
                  />
                </div>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <Input
                type="text"
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)}
                className="flex-1 text-gray-900"
                placeholder="新增成就..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAchievement())}
              />
              <Button type="button" onClick={handleAddAchievement} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 提交按鈕 */}
      <div className="flex items-center justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/testimonials')}
          className="text-gray-100 bg-gray-700 hover:bg-gray-800 border-gray-700"
        >
          取消
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          {isSubmitting ? '更新中...' : '更新見證'}
        </Button>
      </div>
    </form>
  );
};

export default EditTestimonialContent;