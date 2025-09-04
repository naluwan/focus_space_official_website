'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useUploadThing } from '@/lib/uploadthing';
import { Star, X, Plus } from 'lucide-react';
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

interface ImageFiles {
  memberImage: File | null
  beforeImage: File | null
  afterImage: File | null
}

interface ImagePreviews {
  memberImage: string | null
  beforeImage: string | null
  afterImage: string | null
}

const NewTestimonialContent = () => {
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
  
  const [selectedImages, setSelectedImages] = useState<ImageFiles>({
    memberImage: null,
    beforeImage: null,
    afterImage: null
  });
  
  const [imagePreviews, setImagePreviews] = useState<ImagePreviews>({
    memberImage: null,
    beforeImage: null,
    afterImage: null
  });
  
  const [newTag, setNewTag] = useState('');
  const [newAchievement, setNewAchievement] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { startUpload } = useUploadThing('courseImage');

  const handleInputChange = (field: keyof FormData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageSelect = (imageType: keyof ImageFiles, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImages(prev => ({ ...prev, [imageType]: file }));
      const previewUrl = URL.createObjectURL(file);
      setImagePreviews(prev => ({ ...prev, [imageType]: previewUrl }));
    }
  };

  const removeImage = (imageType: keyof ImageFiles) => {
    // Clean up preview URL
    if (imagePreviews[imageType]) {
      URL.revokeObjectURL(imagePreviews[imageType]!);
    }
    setSelectedImages(prev => ({ ...prev, [imageType]: null }));
    setImagePreviews(prev => ({ ...prev, [imageType]: null }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      let imageUrl = formData.imageUrl;
      let beforeImageUrl = formData.beforeImageUrl;  
      let afterImageUrl = formData.afterImageUrl;

      // Upload member image if selected
      if (selectedImages.memberImage) {
        const uploadResult = await startUpload([selectedImages.memberImage]);
        if (uploadResult && uploadResult[0]) {
          imageUrl = uploadResult[0].url;
        } else {
          toast.error('會員照片上傳失敗');
          throw new Error('會員照片上傳失敗');
        }
      }

      // Upload before image if selected
      if (selectedImages.beforeImage) {
        const uploadResult = await startUpload([selectedImages.beforeImage]);
        if (uploadResult && uploadResult[0]) {
          beforeImageUrl = uploadResult[0].url;
        } else {
          toast.error('訓練前照片上傳失敗');
          throw new Error('訓練前照片上傳失敗');
        }
      }

      // Upload after image if selected
      if (selectedImages.afterImage) {
        const uploadResult = await startUpload([selectedImages.afterImage]);
        if (uploadResult && uploadResult[0]) {
          afterImageUrl = uploadResult[0].url;
        } else {
          toast.error('訓練後照片上傳失敗');
          throw new Error('訓練後照片上傳失敗');
        }
      }

      const submitData = {
        ...formData,
        imageUrl,
        beforeImageUrl,
        afterImageUrl,
        age: formData.age ? parseInt(formData.age) : undefined,
        sortOrder: parseInt(formData.sortOrder)
      };

      const response = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        // Clean up preview URLs
        Object.values(imagePreviews).forEach(url => {
          if (url) URL.revokeObjectURL(url);
        });
        toast.success('見證新增成功！');
        router.push('/admin/testimonials');
      } else {
        const data = await response.json();
        toast.error('建立見證失敗：' + data.error);
      }
    } catch (error) {
      console.error('建立見證失敗:', error);
      toast.error(error instanceof Error ? error.message : '建立見證失敗，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <Label htmlFor="isPublished" className="text-gray-700">立即發布</Label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">會員照片</label>
              <div className="mt-2">
                {imagePreviews.memberImage || formData.imageUrl ? (
                  <div className="relative">
                    <Image 
                      src={imagePreviews.memberImage || formData.imageUrl} 
                      alt="會員照片" 
                      width={400}
                      height={192}
                      className="w-full h-48 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage('memberImage')}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageSelect('memberImage', e)}
                        className="hidden"
                        id="member-image-input"
                      />
                      <label
                        htmlFor="member-image-input"
                        className="bg-gradient-to-r from-red-600 to-yellow-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-shadow cursor-pointer inline-block"
                      >
                        選擇會員照片
                      </label>
                      <p className="text-gray-600 text-sm mt-2">支援 JPG、PNG 格式，最大 4MB</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 前後對比照 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">訓練前照片</label>
                <div className="mt-2">
                  {imagePreviews.beforeImage || formData.beforeImageUrl ? (
                    <div className="relative">
                      <Image 
                        src={imagePreviews.beforeImage || formData.beforeImageUrl} 
                        alt="訓練前" 
                        width={200}
                        height={128}
                        className="w-full h-32 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage('beforeImage')}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <div className="text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageSelect('beforeImage', e)}
                          className="hidden"
                          id="before-image-input"
                        />
                        <label
                          htmlFor="before-image-input"
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors cursor-pointer inline-block"
                        >
                          選擇圖片
                        </label>
                        <p className="text-xs text-gray-600 mt-1">訓練前</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">訓練後照片</label>
                <div className="mt-2">
                  {imagePreviews.afterImage || formData.afterImageUrl ? (
                    <div className="relative">
                      <Image 
                        src={imagePreviews.afterImage || formData.afterImageUrl} 
                        alt="訓練後" 
                        width={200}
                        height={128}
                        className="w-full h-32 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage('afterImage')}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <div className="text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageSelect('afterImage', e)}
                          className="hidden"
                          id="after-image-input"
                        />
                        <label
                          htmlFor="after-image-input"
                          className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors cursor-pointer inline-block"
                        >
                          選擇圖片
                        </label>
                        <p className="text-xs text-gray-600 mt-1">訓練後</p>
                      </div>
                    </div>
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
          {isSubmitting ? '建立中...' : '建立見證'}
        </Button>
      </div>
    </form>
  );
};

export default NewTestimonialContent;