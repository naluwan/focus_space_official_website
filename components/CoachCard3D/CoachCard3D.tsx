'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Star, 
  Award, 
  Clock, 
  Users,
  Trophy,
  Heart,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';

// 匯入現有的教練照片資料
import { COACH_DATA } from '@/public/constants';

// 教練資料介面
interface Coach3DData {
  id: number;
  name: string;
  title: string;
  experience: string;
  specialties: string[];
  achievements: string[];
  description: string;
  rating: number;
  students: number;
  imageKey: string;
  quote: string;
  isActive: boolean;
  // 3D卡片專用欄位
  email: string;
  phone: string;
  workingHours: string;
  personalBest: string;
  philosophy: string;
  backgroundGradient: string;
}

interface CoachCard3DProps {
  coach: Coach3DData;
  delay?: number;
}

const CoachCard3D: React.FC<CoachCard3DProps> = ({ coach, delay = 0 }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsVisible(true);
            }, delay);
          }
        });
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`coach-card-${coach.id}`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [delay, coach.id]);

  // 根據 imageKey 獲取對應的照片
  const getCoachImage = (imageKey: string) => {
    const coachData = COACH_DATA.find(data => data.key === imageKey);
    return coachData?.img;
  };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <div
      id={`coach-card-${coach.id}`}
      className={`
        relative w-full h-96 perspective-1000 cursor-pointer group
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
        transition-all duration-700 ease-out
      `}
      style={{ transitionDelay: `${delay}ms` }}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`翻轉查看 ${coach.name} 的詳細資訊`}
    >
      {/* 3D卡片容器 */}
      <div
        className={`
          relative w-full h-full transform-style-preserve-3d transition-transform duration-700 ease-in-out
          ${isFlipped ? 'rotate-y-180' : 'rotate-y-0'}
          group-hover:scale-105
        `}
      >
        
        {/* 卡片正面 */}
        <div
          className={`
            absolute inset-0 w-full h-full rounded-3xl shadow-xl overflow-hidden backface-hidden
            ${coach.backgroundGradient || 'bg_brand_gradient'}
          `}
        >
          {/* 背景圖片 */}
          <div className='absolute inset-0'>
            {getCoachImage(coach.imageKey) && (
              <Image
                src={getCoachImage(coach.imageKey)!}
                alt={coach.name}
                fill
                className='object-cover object-center'
                priority
              />
            )}
            {/* 漸層遮罩 */}
            <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent' />
          </div>

          {/* 正面內容 */}
          <div className='relative z-10 h-full flex flex-col justify-end p-6 text-white'>
            {/* 評分標籤 */}
            <div className='absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full flex items-center gap-1'>
              <Star className='w-4 h-4 text-yellow-500 fill-current' />
              <span className='text-sm font-bold text-gray-900'>{coach.rating}</span>
            </div>

            {/* 翻轉提示 */}
            <div className='absolute top-4 left-4 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm'>
              <span className='text-xs font-semibold'>點擊翻轉</span>
            </div>

            {/* 基本資訊 */}
            <div className='space-y-3'>
              <div>
                <h3 className='text-2xl font-bold mb-1'>{coach.name}</h3>
                <p className='text-lg opacity-90'>{coach.title}</p>
              </div>

              <div className='flex items-center gap-4 text-sm'>
                <div className='flex items-center gap-1'>
                  <Clock className='w-4 h-4' />
                  <span>{coach.experience}</span>
                </div>
                <div className='flex items-center gap-1'>
                  <Users className='w-4 h-4' />
                  <span>{coach.students}位學員</span>
                </div>
              </div>

              {/* 主要專長 */}
              <div className='flex flex-wrap gap-2'>
                {coach.specialties.slice(0, 2).map((specialty, idx) => (
                  <span 
                    key={idx}
                    className='bg-white/20 text-white px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm'
                  >
                    {specialty}
                  </span>
                ))}
                {coach.specialties.length > 2 && (
                  <span className='bg-white/20 text-white px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm'>
                    +{coach.specialties.length - 2}
                  </span>
                )}
              </div>

              {/* 翻轉指示 */}
              <div className='flex justify-center pt-2'>
                <div className='w-8 h-1 bg-white/50 rounded-full animate-pulse' />
              </div>
            </div>
          </div>
        </div>

        {/* 卡片背面 */}
        <div
          className='absolute inset-0 w-full h-full bg-white rounded-3xl shadow-xl overflow-hidden backface-hidden rotate-y-180'
        >
          {/* 背景裝飾 */}
          <div className='absolute inset-0'>
            <div className={`absolute inset-0 opacity-5 ${coach.backgroundGradient || 'bg_brand_gradient'}`} />
            <div className='absolute top-0 right-0 w-32 h-32 bg_brand_gradient opacity-10 rounded-full -translate-y-16 translate-x-16' />
            <div className='absolute bottom-0 left-0 w-24 h-24 bg_brand_gradient opacity-10 rounded-full translate-y-12 -translate-x-12' />
          </div>

          {/* 背面內容 */}
          <div className='relative z-10 h-full p-6 flex flex-col'>
            {/* 返回提示 */}
            <div className='flex justify-between items-center mb-4'>
              <div className='text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full'>
                點擊返回
              </div>
              <div className='flex items-center gap-1'>
                <Star className='w-4 h-4 text-yellow-500 fill-current' />
                <span className='text-sm font-bold text-gray-900'>{coach.rating}</span>
              </div>
            </div>

            {/* 教練名稱 */}
            <div className='text-center mb-4'>
              <h3 className='text-xl font-bold text_brand_gradient mb-1'>{coach.name}</h3>
              <p className='text-gray-600'>{coach.title}</p>
            </div>

            {/* 詳細資訊 */}
            <div className='flex-1 space-y-4 text-sm'>
              {/* 教練理念 */}
              <div>
                <h4 className='font-semibold text-gray-900 mb-2 flex items-center gap-2'>
                  <Heart className='w-4 h-4 text-brand-red-500' />
                  教練理念
                </h4>
                <p className='text-gray-600 leading-relaxed'>{coach.philosophy}</p>
              </div>

              {/* 個人成就 */}
              <div>
                <h4 className='font-semibold text-gray-900 mb-2 flex items-center gap-2'>
                  <Trophy className='w-4 h-4 text-brand-red-500' />
                  個人紀錄
                </h4>
                <p className='text-gray-600'>{coach.personalBest}</p>
              </div>

              {/* 專業認證 */}
              <div>
                <h4 className='font-semibold text-gray-900 mb-2 flex items-center gap-2'>
                  <Award className='w-4 h-4 text-brand-red-500' />
                  專業認證
                </h4>
                <div className='space-y-1'>
                  {coach.achievements.map((achievement, idx) => (
                    <div key={idx} className='flex items-center gap-2'>
                      <div className='w-1.5 h-1.5 bg_brand_gradient rounded-full' />
                      <span className='text-gray-600 text-xs'>{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 聯絡資訊 */}
            <div className='border-t border-gray-100 pt-4 space-y-2'>
              <div className='flex items-center gap-2 text-xs text-gray-600'>
                <Calendar className='w-3 h-3' />
                <span>{coach.workingHours}</span>
              </div>
              <div className='flex items-center gap-2 text-xs text-gray-600'>
                <Mail className='w-3 h-3' />
                <span>{coach.email}</span>
              </div>
              <div className='flex items-center gap-2 text-xs text-gray-600'>
                <Phone className='w-3 h-3' />
                <span>{coach.phone}</span>
              </div>
            </div>

            {/* 預約按鈕 */}
            <button 
              className='w-full btn_brand_primary text-sm py-3 mt-4 hover:scale-105 transition-transform duration-300'
              onClick={(e) => {
                e.stopPropagation();
                // 預約功能
              }}
            >
              預約 {coach.name}
            </button>
          </div>
        </div>
      </div>

      {/* 陰影效果 */}
      <div 
        className={`
          absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-3/4 h-6 bg-black/10 rounded-full blur-lg
          transition-all duration-700 group-hover:scale-110 group-hover:opacity-75
          ${isFlipped ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}
        `} 
      />
    </div>
  );
};

export default CoachCard3D;