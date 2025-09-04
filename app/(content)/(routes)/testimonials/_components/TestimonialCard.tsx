'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Star, Calendar, Trophy, TrendingUp, Heart, Target, User } from 'lucide-react';

interface Testimonial {
  _id: string;
  memberName: string;
  age?: number;
  occupation?: string;
  content: string;
  rating: number;
  tags: string[];
  achievements: string[];
  trainingPeriod?: string;
  imageUrl?: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  category: string;
  index: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial, category }) => {
  const [imageError, setImageError] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);

  // 獲取分類icon和顏色
  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'weight-loss':
        return {
          icon: <TrendingUp className="w-5 h-5" />,
          label: '減重成功',
          color: 'bg-green-500/20 text-green-700 border-green-500/30'
        };
      case 'muscle-gain':
        return {
          icon: <Trophy className="w-5 h-5" />,
          label: '增肌塑形',
          color: 'bg-orange-500/20 text-orange-700 border-orange-500/30'
        };
      case 'health':
        return {
          icon: <Heart className="w-5 h-5" />,
          label: '健康改善',
          color: 'bg-red-500/20 text-red-700 border-red-500/30'
        };
      default:
        return {
          icon: <Target className="w-5 h-5" />,
          label: '體能提升',
          color: 'bg-blue-500/20 text-blue-700 border-blue-500/30'
        };
    }
  };

  // 渲染星星評分
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star className="w-4 h-4 text-gray-300" />
            <Star 
              className="w-4 h-4 fill-yellow-400 text-yellow-400 absolute top-0 left-0" 
              style={{ 
                clipPath: `polygon(0 0, ${(rating % 1) * 100}% 0, ${(rating % 1) * 100}% 100%, 0% 100%)` 
              }} 
            />
          </div>
        );
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
      }
    }
    return stars;
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
    });
  };

  // 獲取姓名縮寫
  const getInitials = (name: string) => {
    return name.slice(0, 1).toUpperCase();
  };

  // 截取內容
  const truncateContent = (content: string, maxLength: number = 120) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  const categoryInfo = getCategoryInfo(category);

  return (
    <div 
      className={`
        group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden
        hover:shadow-2xl hover:-translate-y-1 transition-all duration-500
        flex flex-col h-full
      `}
    >
      {/* 主要內容區域 - 使用 flex-1 讓它佔滿可用空間 */}
      <div className="flex-1 flex flex-col">
        {/* 頭像和基本資訊區 */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-4 mb-4">
            {/* 頭像 */}
            <div className="relative">
              {testimonial.imageUrl && !imageError ? (
                <Image
                  src={testimonial.imageUrl}
                  alt={testimonial.memberName}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-16 h-16 bg_brand_gradient rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {getInitials(testimonial.memberName)}
                </div>
              )}
              
              {/* 分類標籤 */}
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${categoryInfo.color}`}>
                {categoryInfo.icon}
              </div>
            </div>

            {/* 基本資訊 */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 truncate">
                {testimonial.memberName}
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm text-gray-600 mb-2">
                {testimonial.age && (
                  <span>{testimonial.age}歲</span>
                )}
                {testimonial.occupation && (
                  <>
                    {testimonial.age && <span className="hidden sm:inline">•</span>}
                    <span className="truncate">{testimonial.occupation}</span>
                  </>
                )}
              </div>
              
              {/* 評分 */}
              <div className="flex items-center gap-2">
                <div className="flex">{renderStars(testimonial.rating)}</div>
                <span className="text-sm text-gray-600">({testimonial.rating})</span>
              </div>
            </div>
          </div>

          {/* 分類標籤 */}
          <div className="mb-4">
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${categoryInfo.color}`}>
              {categoryInfo.icon}
              {categoryInfo.label}
            </span>
          </div>
        </div>

        {/* 訓練成就區 */}
        {testimonial.achievements && testimonial.achievements.length > 0 && (
          <div className="px-6 pb-4">
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
              <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-1">
                <Trophy className="w-4 h-4 text-brand-red-500" />
                訓練成就
              </h4>
              <div className="space-y-1 text-xs text-blue-900">
                {testimonial.achievements.map((achievement, index) => (
                  <div key={index} className="font-semibold">• {achievement}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 見證內容 */}
        <div className="px-6 pb-4 flex-1">
          <p className="text-gray-700 leading-relaxed text-sm">
            {showFullContent ? testimonial.content : truncateContent(testimonial.content)}
          </p>
          
          {testimonial.content.length > 120 && (
            <button
              onClick={() => setShowFullContent(!showFullContent)}
              className="text-brand-red-600 hover:text-brand-red-700 text-sm font-semibold mt-2 transition-colors"
            >
              {showFullContent ? '收起' : '展開閱讀'}
            </button>
          )}
        </div>

        {/* 標籤區 */}
        {testimonial.tags.length > 0 && (
          <div className="px-6 pb-4">
            <div className="flex flex-wrap gap-1">
              {testimonial.tags.slice(0, 3).map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                >
                  #{tag}
                </span>
              ))}
              {testimonial.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                  +{testimonial.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* 對比照片預覽 */}
        {(testimonial.beforeImageUrl || testimonial.afterImageUrl) && (
          <div className="px-6 pb-4">
            <div className="text-xs text-gray-800 font-semibold mb-3">訓練對比</div>
            <div className="grid grid-cols-2 gap-3">
              {testimonial.beforeImageUrl && (
                <div className="relative group cursor-pointer">
                  <Image
                    src={testimonial.beforeImageUrl}
                    alt="訓練前"
                    width={200}
                    height={80}
                    className="w-full h-24 sm:h-20 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs opacity-0 group-hover:opacity-100">訓練前</span>
                  </div>
                  {/* 在小螢幕上顯示固定標籤 */}
                  <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded sm:hidden">
                    訓練前
                  </div>
                </div>
              )}
              {testimonial.afterImageUrl && (
                <div className="relative group cursor-pointer">
                  <Image
                    src={testimonial.afterImageUrl}
                    alt="訓練後"
                    width={200}
                    height={80}
                    className="w-full h-24 sm:h-20 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs opacity-0 group-hover:opacity-100">訓練後</span>
                  </div>
                  {/* 在小螢幕上顯示固定標籤 */}
                  <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded sm:hidden">
                    訓練後
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 底部資訊 - 永遠在最底部 */}
      <div className="px-6 py-4 bg-gray-100 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-700 font-medium">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-gray-600" />
            <span>{formatDate(testimonial.createdAt)}</span>
          </div>
          
          {testimonial.trainingPeriod && (
            <div className="flex items-center gap-1">
              <User className="w-3 h-3 text-gray-600" />
              <span>訓練期間: {testimonial.trainingPeriod}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;