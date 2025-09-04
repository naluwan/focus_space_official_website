'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Clock,
  MapPin,
  Users,
  Dumbbell,
  Heart,
  Trophy,
  Facebook,
  Instagram,
} from 'lucide-react';

const Introduce = () => {
  const router = useRouter();
  const [visibleCards, setVisibleCards] = useState<number[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = parseInt(entry.target.getAttribute('data-card') || '0');
            setVisibleCards((prev) => [...prev, cardIndex]);
          }
        });
      },
      { threshold: 0.1 },
    );

    document.querySelectorAll('[data-card]').forEach((card) => {
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  const services = [
    {
      icon: <Dumbbell className='h-8 w-8' />,
      title: '自由重量區',
      description: '國際品牌器材，滿足所有重訓需求',
      features: ['專業槓鈴架', '多元啞鈴設備', '安全輔助器材'],
    },
    {
      icon: <Heart className='h-8 w-8' />,
      title: '多元有氧區',
      description: '豐富有氧設備，提升心肺功能',
      features: ['跑步機', '飛輪車', '橢圓機'],
    },
    {
      icon: <Users className='h-8 w-8' />,
      title: '教練服務',
      description: '專業教練指導，客製化訓練',
      features: ['私人教練', '團體課程', '場地租借'],
    },
    {
      icon: <Trophy className='h-8 w-8' />,
      title: '彈性方案',
      description: '多種收費方式，符合不同需求',
      features: ['單次入場', '計時收費', '月季票制'],
    },
  ];

  const highlights = [
    { icon: <MapPin className='h-6 w-6' />, text: '捷運新埔站5號出口' },
    { icon: <Clock className='h-6 w-6' />, text: '07:00 - 23:00' },
    { text: '免入會費 • 不綁約' },
    { text: '300坪大空間' },
  ];

  const socialMediaData = [
    {
      title: 'facebook',
      src: 'https://www.facebook.com/profile.php?id=100088179318429',
      icon: Facebook,
    },
    {
      title: 'instagram',
      src: 'https://www.instagram.com/focus.space.banqiao/',
      icon: Instagram,
    },
  ];

  return (
    <div className='bg-white py-20'>
      <div className='max-container mx-auto px-6'>
        {/* 品牌介紹區 */}
        <div className='mb-16 text-center'>
          <h2 className='text_brand_gradient mb-6 font-bebas_neue text-4xl font-bold md:text-6xl'>
            Focus Space 專心練
          </h2>
          <p className='mx-auto mb-8 max-w-3xl text-xl text-gray-600 md:text-2xl'>
            板橋市中心最專業的健身空間，300坪大空間讓您專注於訓練目標
          </p>

          {/* 亮點標籤 */}
          <div className='mb-8 flex flex-wrap justify-center gap-4'>
            {highlights.map((highlight, index) => (
              <div
                key={index}
                className='hover:bg_brand_gradient flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-gray-700 transition-all duration-300 hover:text-white'
              >
                {highlight.icon}
                <span className='font-semibold'>{highlight.text}</span>
              </div>
            ))}
          </div>

          {/* 社群媒體 */}
          <div className='flex justify-center gap-6'>
            {socialMediaData.map((item) => (
              <a
                key={item.title}
                href={item.src}
                target='_blank'
                rel='noopener noreferrer'
                className='group relative'
              >
                <div className='group-hover:bg_brand_gradient flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 transition-all duration-300 group-hover:scale-110'>
                  <item.icon className='h-6 w-6 text-gray-700 transition-all duration-300 group-hover:text-white' />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* 服務介紹卡片 */}
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
          {services.map((service, index) => (
            <div
              key={index}
              data-card={index}
              className={`
                group relative rounded-2xl border border-gray-100 bg-white p-8 shadow-lg
                transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl
                ${
                  visibleCards.includes(index)
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-10 opacity-0'
                }
              `}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* 品牌漸層背景 */}
              <div className='bg_brand_gradient absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-5' />

              {/* 圖示 */}
              <div className='relative z-10 mb-6'>
                <div className='bg_brand_gradient flex h-16 w-16 items-center justify-center rounded-2xl text-white transition-transform duration-300 group-hover:scale-110'>
                  {service.icon}
                </div>
              </div>

              {/* 內容 */}
              <div className='relative z-10'>
                <h3 className='group-hover:text_brand_gradient mb-3 text-xl font-bold text-gray-900 transition-colors duration-300'>
                  {service.title}
                </h3>
                <p className='mb-4 leading-relaxed text-gray-600'>
                  {service.description}
                </p>

                {/* 特色列表 */}
                <ul className='space-y-2'>
                  {service.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className='flex items-center text-sm font-medium text-gray-700'
                    >
                      <div className='bg_brand_gradient mr-3 h-1.5 w-1.5 rounded-full' />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 裝飾元素 */}
              <div className='bg_brand_gradient absolute right-4 top-4 h-20 w-20 rounded-full opacity-5 transition-opacity duration-300 group-hover:opacity-10' />
            </div>
          ))}
        </div>

        {/* 行動號召區 */}
        <div className='mt-16 text-center'>
          <div className='bg_brand_gradient relative overflow-hidden rounded-3xl p-8 text-white md:p-12'>
            {/* 背景裝飾 */}
            <div className='absolute inset-0 bg-black/10' />
            <div className='absolute right-0 top-0 h-32 w-32 -translate-y-16 translate-x-16 rounded-full bg-white/10' />
            <div className='absolute bottom-0 left-0 h-24 w-24 -translate-x-12 translate-y-12 rounded-full bg-white/10' />

            <div className='relative z-10'>
              <h3 className='mb-4 font-bebas_neue text-3xl font-bold md:text-4xl'>
                準備開始您的健身之旅？
              </h3>
              <p className='mb-8 text-xl opacity-90'>
                加入 Focus Space，專注於您的訓練目標
              </p>
              <div className='flex justify-center'>
                <button 
                  onClick={() => router.push('/booking')}
                  className='w-full rounded-xl bg-white px-8 py-4 font-semibold text-brand-red-600 transition-colors duration-300 hover:bg-gray-100'
                >
                  預約參觀
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Introduce;
