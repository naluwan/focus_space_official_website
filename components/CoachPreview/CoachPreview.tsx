'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Star, 
  Award, 
  Clock, 
  Users,
  Trophy,
  Target,
  Heart,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// 匯入現有的教練照片資料
import { COACH_DATA } from '@/public/constants';

// 教練資料介面（未來可以從後台 API 或資料庫獲取）
interface CoachData {
  id: number;
  name: string;
  title: string;
  experience: string;
  specialties: string[];
  achievements: string[];
  description: string;
  rating: number;
  students: number;
  imageKey: string; // 對應 COACH_DATA 的 key
  quote: string;
  isActive: boolean; // 是否顯示在首頁
}

const CoachPreview = () => {
  const [visibleCoaches, setVisibleCoaches] = useState<number[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const coachIndex = parseInt(entry.target.getAttribute('data-coach') || '0');
            setVisibleCoaches(prev => [...prev, coachIndex]);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-coach]').forEach((coach) => {
      observer.observe(coach);
    });

    return () => observer.disconnect();
  }, []);

  // 教練資料（未來可以從 API 或資料庫獲取）
  const coaches: CoachData[] = [
    {
      id: 1,
      name: '李志強教練',
      title: '重量訓練專家',
      experience: '8年經驗',
      specialties: ['重量訓練', '肌力提升', '體態雕塑'],
      achievements: ['ACSM認證', 'NSCA-CPT', '全國健美季軍'],
      description: '專精於重量訓練與肌力提升，協助學員建立正確的訓練觀念與技巧',
      rating: 4.9,
      students: 150,
      imageKey: 'coach1',
      quote: '每一次的突破，都是為了更好的自己',
      isActive: true
    },
    {
      id: 2,
      name: '張美玲教練',
      title: '有氧舞蹈專家',
      experience: '6年經驗',
      specialties: ['有氧舞蹈', 'HIIT訓練', '體重管理'],
      achievements: ['Zumba國際認證', 'TRX懸吊訓練', '瑜珈RYT200'],
      description: '結合舞蹈與有氧訓練，讓運動變得更有趣、更有效果',
      rating: 4.8,
      students: 200,
      imageKey: 'coach2',
      quote: '運動是最好的音樂，身體是最美的舞台',
      isActive: true
    },
    {
      id: 3,
      name: '王建華教練',
      title: '功能性訓練專家',
      experience: '10年經驗',
      specialties: ['功能性訓練', '運動傷害防護', '復健訓練'],
      achievements: ['物理治療師執照', 'FMS功能性動作', 'SFMA認證'],
      description: '專注於功能性動作訓練，幫助學員改善日常生活品質',
      rating: 4.9,
      students: 120,
      imageKey: 'coach3',
      quote: '訓練不只是運動，更是生活品質的提升',
      isActive: true
    },
    {
      id: 4,
      name: '陳雅琪教練',
      title: '瑜珈皮拉提斯專家',
      experience: '7年經驗',
      specialties: ['哈達瑜珈', '皮拉提斯', '核心訓練'],
      achievements: ['RYT500瑜珈認證', 'BASI皮拉提斯', '正念冥想指導'],
      description: '透過瑜珈與皮拉提斯，幫助學員找到身心靈的平衡',
      rating: 4.8,
      students: 180,
      imageKey: 'coach4',
      quote: '身體的柔軟，來自內心的堅強',
      isActive: true
    }
  ];

  // 過濾出要顯示在首頁的教練
  const activeCoaches = coaches.filter(coach => coach.isActive);

  // 根據 imageKey 獲取對應的照片
  const getCoachImage = (imageKey: string) => {
    const coachData = COACH_DATA.find(data => data.key === imageKey);
    return coachData?.img;
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % activeCoaches.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + activeCoaches.length) % activeCoaches.length);
  };

  return (
    <section className='bg-gradient-to-b from-white to-gray-50 py-20'>
      <div className='max-container mx-auto px-6'>
        
        {/* 標題區 */}
        <div className='text-center mb-16'>
          <h2 className='text_brand_gradient text-4xl md:text-6xl font-bold font-bebas_neue mb-6'>
            專業教練團隊
          </h2>
          <p className='text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8'>
            經驗豐富的專業教練，提供個人化指導與專業建議
          </p>
          
          {/* 裝飾線條 */}
          <div className='flex justify-center items-center gap-4 mb-12'>
            <div className='w-16 h-1 bg_brand_gradient rounded-full' />
            <div className='w-8 h-8 bg_brand_gradient rounded-full flex items-center justify-center'>
              <Trophy className='w-4 h-4 text-white' />
            </div>
            <div className='w-16 h-1 bg_brand_gradient rounded-full' />
          </div>
        </div>

        {/* 主打教練卡片 */}
        <div className='relative mb-16'>
          <div className='overflow-hidden rounded-3xl'>
            <div 
              className='flex transition-transform duration-500 ease-in-out'
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {activeCoaches.map((coach) => (
                <div
                  key={coach.id}
                  className='w-full flex-shrink-0'
                >
                  <div className='bg-white rounded-3xl shadow-xl overflow-hidden mx-4'>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                      
                      {/* 教練照片區 */}
                      <div className='relative h-96 lg:h-full overflow-hidden rounded-l-3xl'>
                        {/* 教練照片 */}
                        {getCoachImage(coach.imageKey) && (
                          <Image
                            src={getCoachImage(coach.imageKey)!}
                            alt={coach.name}
                            fill
                            className='object-cover object-center'
                            priority
                          />
                        )}
                        
                        {/* 評分標籤 */}
                        <div className='absolute top-6 right-6 bg-white/90 px-4 py-2 rounded-full flex items-center gap-2'>
                          <Star className='w-5 h-5 text-yellow-500 fill-current' />
                          <span className='font-bold'>{coach.rating}</span>
                        </div>
                      </div>

                      {/* 教練資訊區 */}
                      <div className='p-8 lg:p-12'>
                        
                        {/* 基本資訊 */}
                        <div className='mb-6'>
                          <div className='flex items-center gap-4 mb-4'>
                            <div className='flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full'>
                              <Clock className='w-4 h-4 text-brand-red-500' />
                              <span className='text-sm font-semibold'>{coach.experience}</span>
                            </div>
                            <div className='flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full'>
                              <Users className='w-4 h-4 text-brand-red-500' />
                              <span className='text-sm font-semibold'>{coach.students}位學員</span>
                            </div>
                          </div>
                          
                          <p className='text-gray-600 leading-relaxed mb-6'>
                            {coach.description}
                          </p>
                          
                          {/* 名言 */}
                          <blockquote className='border-l-4 border-brand-red-500 pl-4 italic text-gray-700 mb-6'>
                            "{coach.quote}"
                          </blockquote>
                        </div>

                        {/* 專長領域 */}
                        <div className='mb-6'>
                          <h4 className='font-bold text-gray-900 mb-3 flex items-center gap-2'>
                            <Target className='w-5 h-5 text-brand-red-500' />
                            專長領域
                          </h4>
                          <div className='flex flex-wrap gap-2'>
                            {coach.specialties.map((specialty, idx) => (
                              <span 
                                key={idx}
                                className='bg_brand_gradient text-white px-3 py-1 rounded-full text-sm font-semibold'
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* 專業認證 */}
                        <div className='mb-8'>
                          <h4 className='font-bold text-gray-900 mb-3 flex items-center gap-2'>
                            <Award className='w-5 h-5 text-brand-red-500' />
                            專業認證
                          </h4>
                          <div className='space-y-2'>
                            {coach.achievements.map((achievement, idx) => (
                              <div key={idx} className='flex items-center gap-2'>
                                <div className='w-2 h-2 bg_brand_gradient rounded-full' />
                                <span className='text-sm text-gray-600'>{achievement}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 預約按鈕 */}
                        <button className='w-full btn_brand_primary text-lg py-4 hover:scale-105 transition-transform duration-300'>
                          預約 {coach.name} 課程
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 導航按鈕 */}
          <button
            onClick={prevSlide}
            className='absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg_brand_gradient hover:text-white transition-all duration-300 z-10'
          >
            <ChevronLeft className='w-6 h-6' />
          </button>
          <button
            onClick={nextSlide}
            className='absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg_brand_gradient hover:text-white transition-all duration-300 z-10'
          >
            <ChevronRight className='w-6 h-6' />
          </button>

          {/* 指示器 */}
          <div className='flex justify-center gap-2 mt-6'>
            {activeCoaches.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg_brand_gradient scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 教練團隊概覽 */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-16'>
          {activeCoaches.map((coach, index) => (
            <div
              key={coach.id}
              data-coach={index}
              className={`
                group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center
                hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer
                ${visibleCoaches.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
              `}
              style={{ transitionDelay: `${index * 100}ms` }}
              onClick={() => setCurrentSlide(index)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setCurrentSlide(index); }}
              role="button"
              tabIndex={0}
            >
              {/* 教練頭像 */}
              <div className='relative w-20 h-20 rounded-full mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 overflow-hidden'>
                {getCoachImage(coach.imageKey) ? (
                  <Image
                    src={getCoachImage(coach.imageKey)!}
                    alt={coach.name}
                    fill
                    className='object-cover'
                  />
                ) : (
                  <div className='w-full h-full bg_brand_gradient flex items-center justify-center'>
                    <Users className='w-10 h-10 text-white' />
                  </div>
                )}
              </div>
              
              {/* 教練資訊 */}
              <h3 className='font-bold text-gray-900 mb-2 group-hover:text_brand_gradient transition-colors duration-300'>
                {coach.name}
              </h3>
              <p className='text-sm text-gray-600 mb-3'>{coach.title}</p>
              
              {/* 評分 */}
              <div className='flex items-center justify-center gap-1 mb-3'>
                <Star className='w-4 h-4 text-yellow-500 fill-current' />
                <span className='text-sm font-semibold'>{coach.rating}</span>
                <span className='text-xs text-gray-500'>({coach.students})</span>
              </div>
              
              {/* 主要專長 */}
              <div className='text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full'>
                {coach.specialties[0]}
              </div>
            </div>
          ))}
        </div>

        {/* 行動號召區 */}
        <div className='text-center bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 relative overflow-hidden'>
          {/* 背景裝飾 */}
          <div className='absolute inset-0 bg_brand_gradient opacity-5' />
          <div className='absolute top-0 right-0 w-32 h-32 bg_brand_gradient opacity-10 rounded-full -translate-y-16 translate-x-16' />
          <div className='absolute bottom-0 left-0 w-24 h-24 bg_brand_gradient opacity-10 rounded-full translate-y-12 -translate-x-12' />
          
          <div className='relative z-10'>
            <div className='flex justify-center mb-6'>
              <div className='w-16 h-16 bg_brand_gradient rounded-full flex items-center justify-center'>
                <Heart className='w-8 h-8 text-white' />
              </div>
            </div>
            
            <h3 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-bebas_neue'>
              找到最適合您的專業教練
            </h3>
            <p className='text-xl text-gray-600 mb-8 max-w-2xl mx-auto'>
              每位教練都有豐富的教學經驗和專業認證，為您提供最優質的訓練指導
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <button className='btn_brand_primary text-lg px-8 py-4'>
                查看完整教練團隊
              </button>
              <button className='border-2 border-brand-red-500 text-brand-red-600 px-8 py-4 rounded-xl font-semibold hover:bg-brand-red-500 hover:text-white transition-colors duration-300'>
                預約免費諮詢
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CoachPreview;