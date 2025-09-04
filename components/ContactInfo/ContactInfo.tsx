'use client';
import React, { useState, useEffect } from 'react';
import GoogleMap from '@/components/GoogleMap/GoogleMap';
import { MicroButton } from '@/components/MicroInteractions/MicroInteractions';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Instagram,
  Facebook,
  MessageCircle,
  Navigation,
  Calendar,
  Users,
  Star,
} from 'lucide-react';

const ContactInfo = () => {
  const router = useRouter();
  const [visibleCards, setVisibleCards] = useState<number[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = parseInt(entry.target.getAttribute('data-contact') || '0');
            setVisibleCards((prev) => [...prev, cardIndex]);
          }
        });
      },
      { threshold: 0.1 },
    );

    document.querySelectorAll('[data-contact]').forEach((card) => {
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  // 營業時間資料
  const businessHours = [
    { day: '週一至週日', hours: '07:00 - 23:00' },
    { day: '國定假日', hours: '07:00 - 23:00' },
  ];

  // 聯絡方式資料
  const contactMethods = [
    {
      icon: <Phone className='h-6 w-6' />,
      title: '電話預約',
      info: '02 2258 8228',
      description: '專人接聽，提供課程諮詢',
      action: 'tel:+886222588228',
      actionText: '立即撥打',
    },
    {
      icon: <Mail className='h-6 w-6' />,
      title: '信箱聯繫',
      info: 'focusspace4648@gmail.com',
      description: '24小時內回覆您的問題',
      action: 'mailto:focusspace4648@gmail.com',
      actionText: '發送信件',
    },
    {
      icon: <MessageCircle className='h-6 w-6' />,
      title: 'LINE 官方',
      info: '@565osqjq',
      description: '即時線上客服服務',
      action: 'https://line.me/R/ti/p/@565osqjq',
      actionText: '加入好友',
    },
  ];

  // 社群媒體連結
  const socialMedia = [
    {
      icon: <Facebook className='h-6 w-6' />,
      name: 'Facebook',
      url: 'https://www.facebook.com/p/Focus%E5%B0%88%E5%BF%83%E7%B7%B4%E9%81%8B%E5%8B%95%E7%A9%BA%E9%96%93-100088179318429/',
      followers: '1.0K',
      color: 'hover:text-blue-600',
    },
    {
      icon: <Instagram className='h-6 w-6' />,
      name: 'Instagram',
      url: 'https://www.instagram.com/focus.space.banqiao/',
      followers: '3.7K',
      color: 'hover:text-pink-600',
    },
  ];

  return (
    <section className='bg-gradient-to-b from-gray-50 to-white py-20'>
      <div className='max-container mx-auto px-6'>
        {/* 標題區 */}
        <div className='mb-16 text-center'>
          <h2 className='text_brand_gradient mb-6 font-bebas_neue text-4xl font-bold md:text-6xl'>
            聯絡我們
          </h2>
          <p className='mx-auto mb-8 max-w-3xl text-xl text-gray-200 md:text-2xl'>
            多種聯繫方式，隨時為您提供專業服務與諮詢
          </p>

          {/* 裝飾線條 */}
          <div className='mb-12 flex items-center justify-center gap-4'>
            <div className='bg_brand_gradient h-1 w-16 rounded-full' />
            <div className='bg_brand_gradient flex h-8 w-8 items-center justify-center rounded-full'>
              <Phone className='h-4 w-4 text-white' />
            </div>
            <div className='bg_brand_gradient h-1 w-16 rounded-full' />
          </div>
        </div>

        {/* 主要聯絡資訊網格 */}
        <div className='mb-16 grid grid-cols-1 gap-8 lg:grid-cols-3'>
          {/* 地址資訊卡 */}
          <div
            data-contact={0}
            className={`
              relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-xl transition-all
              duration-500 hover:-translate-y-2 hover:shadow-2xl lg:col-span-1
              ${
                visibleCards.includes(0)
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-10 opacity-0'
              }
            `}
          >
            {/* 背景裝飾 */}
            <div className='bg_brand_gradient absolute right-0 top-0 h-24 w-24 -translate-y-12 translate-x-12 rounded-full opacity-10' />

            <div className='relative z-10'>
              <div className='bg_brand_gradient mb-6 flex h-16 w-16 items-center justify-center rounded-full'>
                <MapPin className='h-8 w-8 text-white' />
              </div>

              <h3 className='mb-4 text-2xl font-bold text-gray-900'>健身房位置</h3>

              <div className='mb-6 space-y-4'>
                <div>
                  <h4 className='mb-2 font-semibold text-gray-900'>
                    Focus Space 專心練運動空間
                  </h4>
                  <p className='leading-relaxed text-gray-600'>
                    新北市板橋區民生路三段30-1號B1
                    <br />
                    板橋捷運新埔站五號出口
                  </p>
                </div>

                <div className='rounded-xl bg-gray-200 p-4'>
                  <div className='mb-2 flex items-center gap-2 text-sm text-gray-900'>
                    <Navigation className='h-4 w-4 text-gray-800' />
                    交通資訊
                  </div>
                  <p className='text-sm font-medium text-gray-900'>
                    • 捷運：板橋線新埔站五號出口
                    <br />
                    • 公車：多路線可達民生路
                    <br />• 停車：周邊付費停車格
                  </p>
                </div>

                {/* Google 地圖 */}
                <GoogleMap
                  address='22047新北市板橋區民生路三段30-1號B1'
                  lat={25.024814402851522}
                  lng={121.46770227073038}
                  zoom={17}
                  height='200px'
                  className='mb-4'
                />
              </div>
            </div>
          </div>

          {/* 營業時間卡 */}
          <div
            data-contact={1}
            className={`
              relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-xl transition-all
              duration-500 hover:-translate-y-2 hover:shadow-2xl lg:col-span-1
              ${
                visibleCards.includes(1)
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-10 opacity-0'
              }
            `}
            style={{ transitionDelay: '100ms' }}
          >
            {/* 背景裝飾 */}
            <div className='bg_brand_gradient absolute bottom-0 left-0 h-20 w-20 -translate-x-10 translate-y-10 rounded-full opacity-10' />

            <div className='relative z-10'>
              <div className='bg_brand_gradient mb-6 flex h-16 w-16 items-center justify-center rounded-full'>
                <Clock className='h-8 w-8 text-white' />
              </div>

              <h3 className='mb-6 text-2xl font-bold text-gray-900'>營業時間</h3>

              <div className='mb-6 space-y-4'>
                {businessHours.map((schedule, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between border-b border-gray-100 py-3 last:border-0'
                  >
                    <span className='font-semibold text-gray-900'>{schedule.day}</span>
                    <span className='text_brand_gradient font-bold'>
                      {schedule.hours}
                    </span>
                  </div>
                ))}
              </div>

              <div className='rounded-xl border border-brand-yellow-200 bg-brand-yellow-50 p-4'>
                <div className='mb-2 flex items-center gap-2'>
                  <Star className='h-4 w-4 text-brand-yellow-500' />
                  <span className='text-brand-yellow-700 font-semibold'>特別提醒</span>
                </div>
                <p className='text-brand-yellow-700 text-sm'>
                  國定假日或天災時，請以官方Instagram公布之營業時間為準
                </p>
              </div>
            </div>
          </div>

          {/* 快速聯繫區 */}
          <div
            data-contact={2}
            className={`
              bg_brand_gradient relative overflow-hidden rounded-3xl p-8 text-white transition-all
              duration-500 hover:-translate-y-2 hover:shadow-2xl lg:col-span-1
              ${
                visibleCards.includes(2)
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-10 opacity-0'
              }
            `}
            style={{ transitionDelay: '200ms' }}
          >
            {/* 背景裝飾 */}
            <div className='absolute right-0 top-0 h-32 w-32 -translate-y-16 translate-x-16 rounded-full bg-white opacity-10' />
            <div className='absolute bottom-0 left-0 h-24 w-24 -translate-x-12 translate-y-12 rounded-full bg-white opacity-10' />

            <div className='relative z-10'>
              <div className='mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/20'>
                <MessageCircle className='h-8 w-8 text-white' />
              </div>

              <h3 className='mb-4 text-2xl font-bold'>立即預約</h3>
              <p className='mb-6 text-xl opacity-90'>
                免費體驗課程
                <br />
                專業諮詢服務
              </p>

              <div className='mb-8 space-y-4'>
                <div className='flex items-center gap-3'>
                  <Phone className='h-5 w-5 opacity-80' />
                  <span className='font-semibold'>02 2258 8228</span>
                </div>
                <div className='flex items-center gap-3'>
                  <Calendar className='h-5 w-5 opacity-80' />
                  <span>週一至週日 07:00-23:00</span>
                </div>
                <div className='flex items-center gap-3'>
                  <Users className='h-5 w-5 opacity-80' />
                  <span>一對一專業指導</span>
                </div>
              </div>

              <MicroButton
                variant='secondary'
                size='lg'
                className='w-full min-w-[200px] px-8 py-4 text-lg'
                withIcon
                onClick={() => router.push('/booking')}
              >
                立即預約體驗
              </MicroButton>
            </div>
          </div>
        </div>

        {/* 聯絡方式網格 */}
        <div className='mb-16 grid grid-cols-1 gap-6 md:grid-cols-3'>
          {contactMethods.map((method, index) => (
            <div
              key={index}
              data-contact={index + 3}
              className={`
                group rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-lg
                transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl
                ${
                  visibleCards.includes(index + 3)
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-10 opacity-0'
                }
              `}
              style={{ transitionDelay: `${(index + 3) * 100}ms` }}
            >
              {/* 圖標 */}
              <div className='bg_brand_gradient mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:scale-110'>
                {method.icon}
              </div>

              {/* 標題 */}
              <h4 className='group-hover:text_brand_gradient mb-2 font-bold text-gray-900 transition-colors duration-300'>
                {method.title}
              </h4>

              {/* 聯絡資訊 */}
              <p className='mb-2 font-semibold text-gray-700'>{method.info}</p>
              <p className='mb-4 text-sm text-gray-500'>{method.description}</p>

              {/* 行動按鈕 */}
              <a
                href={method.action}
                target='_blank'
                rel='noopener noreferrer'
                className='hover:bg_brand_gradient inline-block w-full rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors duration-300 hover:text-white'
              >
                {method.actionText}
              </a>
            </div>
          ))}
        </div>

        {/* 社群媒體區 */}
        <div className='relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-xl md:p-12'>
          {/* 背景裝飾 */}
          <div className='bg_brand_gradient absolute inset-0 opacity-5' />
          <div className='bg_brand_gradient absolute right-0 top-0 h-32 w-32 -translate-y-16 translate-x-16 rounded-full opacity-10' />
          <div className='bg_brand_gradient absolute bottom-0 left-0 h-24 w-24 -translate-x-12 translate-y-12 rounded-full opacity-10' />

          <div className='relative z-10'>
            <h3 className='mb-4 font-bebas_neue text-3xl font-bold text-gray-900 md:text-4xl'>
              追蹤我們的社群
            </h3>
            <p className='mx-auto mb-8 max-w-2xl text-xl text-gray-600'>
              獲得最新健身資訊、訓練技巧和會員專屬活動通知
            </p>

            {/* 社群媒體按鈕 */}
            <div className='mb-8 flex flex-row flex-wrap items-center justify-center gap-3 md:gap-4'>
              {socialMedia.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={`
                    group flex items-center gap-3 rounded-xl bg-gray-100 px-6 py-4 font-semibold
                    transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${social.color}
                  `}
                >
                  <div className='transition-transform duration-300 group-hover:scale-110'>
                    {social.icon}
                  </div>
                  <div className='text-left'>
                    <div className='font-bold'>{social.name}</div>
                    <div className='text-sm text-gray-500'>{social.followers} 追蹤者</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
