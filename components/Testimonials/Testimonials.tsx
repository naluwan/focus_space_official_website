'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Users,
  Trophy,
  Heart,
  Target,
} from 'lucide-react';
import { MicroButton } from '@/components/MicroInteractions/MicroInteractions';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// 會員見證資料介面
interface TestimonialData {
  _id: string;
  memberName: string;
  age?: number;
  occupation?: string;
  content: string;
  rating: number;
  imageUrl?: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  tags: string[];
  trainingPeriod?: string;
  achievements: string[];
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

const Testimonials = () => {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleTestimonials, setVisibleTestimonials] = useState<number[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // 獲取見證資料
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('/api/testimonials?featured=true');
        if (response.ok) {
          const data = await response.json();
          setTestimonials(data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch testimonials:', error);
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // 動畫效果
  useEffect(() => {
    if (testimonials.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const testimonialIndex = parseInt(
              entry.target.getAttribute('data-testimonial') || '0',
            );
            setVisibleTestimonials((prev) => [...prev, testimonialIndex]);
          }
        });
      },
      { threshold: 0.1 },
    );

    document.querySelectorAll('[data-testimonial]').forEach((testimonial) => {
      observer.observe(testimonial);
    });

    return () => observer.disconnect();
  }, [testimonials]);

  // 輔助函數
  const getAvatarText = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const getCategoryFromTags = (tags: string[]) => {
    if (tags.some((tag) => tag.includes('減重') || tag.includes('減脂')))
      return 'weight-loss';
    if (tags.some((tag) => tag.includes('增肌') || tag.includes('塑形')))
      return 'muscle-gain';
    if (tags.some((tag) => tag.includes('健康') || tag.includes('復健'))) return 'health';
    return 'fitness';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => {
      const fillPercentage = Math.min(100, Math.max(0, (rating - i) * 100));
      return (
        <div key={i} className='relative h-6 w-6'>
          <Star className='absolute h-6 w-6 text-gray-300' />
          <div
            className='absolute overflow-hidden'
            style={{ width: `${fillPercentage}%` }}
          >
            <Star className='h-6 w-6 fill-current text-yellow-500' />
          </div>
        </div>
      );
    });
  };

  const categories = [
    { id: 'all', label: '全部見證', icon: <Users className='h-4 w-4' /> },
    { id: 'weight-loss', label: '減重成功', icon: <Target className='h-4 w-4' /> },
    { id: 'muscle-gain', label: '增肌塑形', icon: <Trophy className='h-4 w-4' /> },
    { id: 'health', label: '健康改善', icon: <Heart className='h-4 w-4' /> },
    { id: 'fitness', label: '體能提升', icon: <Star className='h-4 w-4' /> },
  ];

  const activeTestimonials = testimonials.filter(
    (testimonial) =>
      selectedCategory === 'all' ||
      getCategoryFromTags(testimonial.tags) === selectedCategory,
  );

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % activeTestimonials.length);
  }, [activeTestimonials.length]);

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + activeTestimonials.length) % activeTestimonials.length,
    );
  };

  // 自動輪播
  useEffect(() => {
    if (activeTestimonials.length > 0) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [activeTestimonials.length, nextSlide]);

  // 如果沒有見證資料且載入完成，則不顯示整個組件
  if (!loading && testimonials.length === 0) {
    return null;
  }

  return (
    <section className='bg-gradient-to-b from-gray-50 to-white py-20'>
      <div className='max-container mx-auto px-6'>
        {/* 標題區 */}
        <div className='mb-16 text-center'>
          <h2 className='text_brand_gradient mb-6 font-bebas_neue text-4xl font-bold md:text-6xl'>
            會員真實見證
          </h2>
          <p className='mx-auto mb-8 max-w-3xl text-xl text-gray-600 md:text-2xl'>
            他們的成功故事，將是您開始健身之旅的最佳動力
          </p>

          {/* 裝飾線條 */}
          <div className='mb-12 flex items-center justify-center gap-4'>
            <div className='bg_brand_gradient h-1 w-16 rounded-full' />
            <div className='bg_brand_gradient flex h-8 w-8 items-center justify-center rounded-full'>
              <Quote className='h-4 w-4 text-white' />
            </div>
            <div className='bg_brand_gradient h-1 w-16 rounded-full' />
          </div>
        </div>

        {loading ? (
          <div className='py-16 text-center'>
            <div className='text-gray-500'>載入中...</div>
          </div>
        ) : testimonials.length === 0 ? null : (
          <>
            {/* 分類標籤 */}
            <div className='mb-12 flex flex-wrap justify-center gap-4'>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setCurrentSlide(0);
                  }}
                  className={`
                    flex items-center gap-2 rounded-full px-6 py-3 font-semibold transition-all duration-300
                    ${
                      selectedCategory === category.id
                        ? 'bg_brand_gradient scale-105 text-white shadow-lg'
                        : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  {category.icon}
                  {category.label}
                </button>
              ))}
            </div>

            {/* 主要見證輪播 */}
            {activeTestimonials.length > 0 && (
              <div className='relative mb-16'>
                <div className='overflow-hidden rounded-3xl'>
                  <div
                    className='flex transition-transform duration-500 ease-in-out'
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {activeTestimonials.map((testimonial) => (
                      <div key={testimonial._id} className='w-full flex-shrink-0'>
                        <div className='mx-4 overflow-hidden rounded-3xl bg-white shadow-xl'>
                          <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
                            {/* 會員資訊區 */}
                            <div className='bg_brand_gradient flex flex-col justify-center p-8 text-white lg:p-12'>
                              <div className='text-center'>
                                {/* 頭像 */}
                                <div className='mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/20'>
                                  {testimonial.imageUrl ? (
                                    <Image
                                      src={testimonial.imageUrl}
                                      alt={testimonial.memberName}
                                      width={96}
                                      height={96}
                                      className='h-full w-full rounded-full object-cover'
                                    />
                                  ) : (
                                    <span className='text-3xl font-bold'>
                                      {getAvatarText(testimonial.memberName)}
                                    </span>
                                  )}
                                </div>

                                {/* 基本資訊 */}
                                <h3 className='mb-2 text-2xl font-bold'>
                                  {testimonial.memberName}
                                </h3>
                                <p className='mb-2 text-xl font-medium text-white/95'>
                                  {testimonial.age && `${testimonial.age}歲`}
                                  {testimonial.age && testimonial.occupation && ' • '}
                                  {testimonial.occupation}
                                </p>
                                {testimonial.trainingPeriod && (
                                  <p className='mb-4 font-medium text-white/90'>
                                    訓練期間：{testimonial.trainingPeriod}
                                  </p>
                                )}

                                {/* 成就標籤 */}
                                {testimonial.achievements &&
                                  testimonial.achievements.length > 0 && (
                                    <div className='mb-6 rounded-full border border-white/20 bg-white/30 px-4 py-2 backdrop-blur-sm'>
                                      <span className='font-bold text-white'>
                                        {testimonial.achievements[0]}
                                      </span>
                                    </div>
                                  )}

                                {/* 訓練前後照片（如果有） */}
                                {testimonial.beforeImageUrl &&
                                  testimonial.afterImageUrl && (
                                    <div className='grid grid-cols-2 gap-4'>
                                      <div className='bg-white/15 rounded-xl border border-white/20 p-3 backdrop-blur-sm'>
                                        <p className='mb-2 text-sm font-semibold text-white/90'>
                                          訓練前
                                        </p>
                                        <Image
                                          src={testimonial.beforeImageUrl}
                                          alt='訓練前'
                                          width={100}
                                          height={80}
                                          className='h-20 w-full rounded-lg object-cover'
                                        />
                                      </div>
                                      <div className='bg-white/15 rounded-xl border border-white/20 p-3 backdrop-blur-sm'>
                                        <p className='mb-2 text-sm font-semibold text-white/90'>
                                          訓練後
                                        </p>
                                        <Image
                                          src={testimonial.afterImageUrl}
                                          alt='訓練後'
                                          width={100}
                                          height={80}
                                          className='h-20 w-full rounded-lg object-cover'
                                        />
                                      </div>
                                    </div>
                                  )}
                              </div>
                            </div>

                            {/* 見證內容區 */}
                            <div className='flex flex-col justify-center p-8 lg:col-span-2 lg:p-12'>
                              {/* 評分 */}
                              <div className='mb-6 flex items-center gap-2'>
                                {renderStars(testimonial.rating)}
                                <span className='ml-2 text-lg font-semibold text-gray-700'>
                                  {testimonial.rating}
                                </span>
                              </div>

                              {/* 引言符號 */}
                              <Quote className='text_brand_gradient mb-6 h-12 w-12' />

                              {/* 見證內容 */}
                              <blockquote className='mb-8 text-lg italic leading-relaxed text-gray-700'>
                                "{testimonial.content}"
                              </blockquote>

                              {/* 標籤 */}
                              {testimonial.tags.length > 0 && (
                                <div className='mb-6'>
                                  <div className='flex flex-wrap gap-2'>
                                    {testimonial.tags.map((tag, index) => (
                                      <span
                                        key={index}
                                        className='rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700'
                                      >
                                        #{tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* 成就亮點 */}
                              {testimonial.achievements &&
                                testimonial.achievements.length > 0 && (
                                  <div className='rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6'>
                                    <h4 className='mb-3 flex items-center gap-2 font-bold text-blue-900'>
                                      <Trophy className='h-5 w-5 text-brand-red-500' />
                                      主要成就
                                    </h4>
                                    <div className='space-y-2'>
                                      {testimonial.achievements.map(
                                        (achievement, index) => (
                                          <p
                                            key={index}
                                            className='text-sm font-bold text-blue-900'
                                          >
                                            • {achievement}
                                          </p>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 導航按鈕 */}
                {activeTestimonials.length > 1 && (
                  <>
                    <button
                      onClick={prevSlide}
                      className='hover:bg_brand_gradient absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-300 hover:text-white'
                    >
                      <ChevronLeft className='h-6 w-6' />
                    </button>
                    <button
                      onClick={nextSlide}
                      className='hover:bg_brand_gradient absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-300 hover:text-white'
                    >
                      <ChevronRight className='h-6 w-6' />
                    </button>
                  </>
                )}

                {/* 指示器 */}
                {activeTestimonials.length > 1 && (
                  <div className='mt-6 flex justify-center gap-2'>
                    {activeTestimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-3 w-3 rounded-full transition-all duration-300 ${
                          index === currentSlide
                            ? 'bg_brand_gradient scale-125'
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 統計數據 */}
            {testimonials.length > 0 && (
              <div className='mb-16 grid grid-cols-2 gap-8 md:grid-cols-4'>
                {[
                  {
                    number: '500+',
                    label: '滿意會員',
                    icon: <Users className='h-8 w-8' />,
                  },
                  {
                    number: '4.9',
                    label: '平均評分',
                    icon: <Star className='h-8 w-8' />,
                  },
                  {
                    number: '95%',
                    label: '達成目標',
                    icon: <Target className='h-8 w-8' />,
                  },
                  {
                    number: '2年',
                    label: '平均會員期',
                    icon: <Heart className='h-8 w-8' />,
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    data-testimonial={index + 10}
                    className={`
                      rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-lg
                      transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
                      ${
                        visibleTestimonials.includes(index + 10)
                          ? 'scale-100 opacity-100'
                          : 'scale-95 opacity-0'
                      }
                    `}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className='bg_brand_gradient mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-white'>
                      {stat.icon}
                    </div>
                    <div className='text_brand_gradient mb-2 font-bebas_neue text-3xl font-bold md:text-4xl'>
                      {stat.number}
                    </div>
                    <p className='font-semibold text-gray-600'>{stat.label}</p>
                  </div>
                ))}
              </div>
            )}

            {/* 行動號召區 */}
            {testimonials.length > 0 && (
              <div className='relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-xl md:p-12'>
                {/* 背景裝飾 */}
                <div className='bg_brand_gradient absolute inset-0 opacity-5' />
                <div className='bg_brand_gradient absolute right-0 top-0 h-32 w-32 -translate-y-16 translate-x-16 rounded-full opacity-10' />
                <div className='bg_brand_gradient absolute bottom-0 left-0 h-24 w-24 -translate-x-12 translate-y-12 rounded-full opacity-10' />

                <div className='relative z-10'>
                  <h3 className='mb-4 font-bebas_neue text-3xl font-bold text-gray-900 md:text-4xl'>
                    您也想成為下一個成功故事嗎？
                  </h3>
                  <p className='mx-auto mb-8 max-w-2xl text-xl text-gray-600'>
                    加入 Focus Space 大家庭，開始您的轉變之旅
                  </p>
                  <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
                    <MicroButton
                      variant='primary'
                      size='lg'
                      onClick={() => {
                        router.push('/booking');
                      }}
                      withIcon
                      sparkle
                      className='w-full px-8 py-4 text-lg'
                    >
                      <Heart className='h-5 w-5' />
                      開始免費體驗
                    </MicroButton>
                    <MicroButton
                      variant='outline'
                      size='lg'
                      onClick={() => (window.location.href = '/testimonials')}
                      withIcon
                      className='w-full px-8 py-4 text-lg hover:text-white'
                    >
                      <Target className='h-5 w-5' />
                      查看更多見證
                    </MicroButton>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
