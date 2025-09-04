'use client';
import React, { useState, useEffect } from 'react';
import CoachCard3D from '@/components/CoachCard3D/CoachCard3D';
import { Trophy, Sparkles, RotateCcw } from 'lucide-react';

// 3D 教練卡片展示區組件
const Coach3DShowcase = () => {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = parseInt(entry.target.getAttribute('data-showcase') || '0');
            setVisibleCards(prev => [...prev, cardIndex]);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-showcase]').forEach((card) => {
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  // 3D 教練卡片資料（示例數據）
  const coaches3D = [
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
      isActive: true,
      email: 'focusspace4648@gmail.com',
      phone: '02 2258 8228',
      workingHours: '週一至週日 07:00-23:00',
      personalBest: '深蹲 200kg / 臥推 150kg / 硬舉 220kg',
      philosophy: '相信每個人都有無限潛能，我的使命是幫助學員發現並超越自己的極限，在安全的環境下達到最佳訓練效果。',
      backgroundGradient: 'bg-gradient-to-br from-red-600 to-orange-500'
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
      isActive: true,
      email: 'focusspace4648@gmail.com',
      phone: '02 2258 8228',
      workingHours: '週一至週日 07:00-23:00',
      personalBest: '馬拉松 3小時45分 / 體脂率 12%',
      philosophy: '運動應該是快樂的！透過音樂和舞蹈的結合，讓每一次的訓練都充滿活力和樂趣，健康和美麗會自然而來。',
      backgroundGradient: 'bg-gradient-to-br from-pink-500 to-purple-600'
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
      isActive: true,
      email: 'focusspace4648@gmail.com',
      phone: '02 2258 8228',
      workingHours: '週一至週日 07:00-23:00',
      personalBest: '單腳深蹲 x20 / 土耳其起立 32kg',
      philosophy: '身體是我們一生的夥伴，透過正確的功能性訓練，不僅能提升運動表現，更能讓日常生活變得更輕鬆自在。',
      backgroundGradient: 'bg-gradient-to-br from-blue-600 to-teal-500'
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
      isActive: true,
      email: 'focusspace4648@gmail.com',
      phone: '02 2258 8228',
      workingHours: '週一至週日 07:00-23:00',
      personalBest: '倒立 10分鐘 / 一字馬 180度',
      philosophy: '真正的力量來自於內在的平靜與專注。瑜珈不僅是身體的練習，更是心靈的修煉，幫助每個人找到屬於自己的平衡。',
      backgroundGradient: 'bg-gradient-to-br from-green-500 to-emerald-600'
    }
  ];

  return (
    <section className='bg-gradient-to-b from-white to-gray-50 py-20'>
      <div className='max-container mx-auto px-6'>
        
        {/* 標題區 */}
        <div className='text-center mb-16'>
          <div
            data-showcase={0}
            className={`
              ${visibleCards.includes(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
              transition-all duration-700 ease-out
            `}
          >
            <h2 className='text_brand_gradient text-4xl md:text-6xl font-bold font-bebas_neue mb-6'>
              3D 教練團隊
            </h2>
            <p className='text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8'>
              全新 3D 互動體驗，深度了解每位專業教練
            </p>
            
            {/* 裝飾線條 */}
            <div className='flex justify-center items-center gap-4 mb-8'>
              <div className='w-16 h-1 bg_brand_gradient rounded-full' />
              <div className='w-8 h-8 bg_brand_gradient rounded-full flex items-center justify-center'>
                <Sparkles className='w-4 h-4 text-white' />
              </div>
              <div className='w-16 h-1 bg_brand_gradient rounded-full' />
            </div>

            {/* 使用說明 */}
            <div className='bg-white rounded-2xl p-6 shadow-lg border border-gray-100 max-w-md mx-auto mb-12'>
              <div className='flex items-center gap-3 justify-center mb-3'>
                <RotateCcw className='w-5 h-5 text_brand_gradient' />
                <span className='font-semibold text-gray-900'>互動說明</span>
              </div>
              <p className='text-gray-600 text-sm'>
                點擊教練卡片即可翻轉查看詳細資訊，包含聯絡方式、專業認證和個人理念
              </p>
            </div>
          </div>
        </div>

        {/* 3D 教練卡片網格 */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16'>
          {coaches3D.map((coach, index) => (
            <div
              key={coach.id}
              data-showcase={index + 1}
              className={`
                ${visibleCards.includes(index + 1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                transition-all duration-700 ease-out
              `}
              style={{ transitionDelay: `${(index + 1) * 150}ms` }}
            >
              <CoachCard3D 
                coach={coach} 
                delay={index * 100}
              />
            </div>
          ))}
        </div>

        {/* 特色說明區 */}
        <div
          data-showcase={5}
          className={`
            text-center bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 relative overflow-hidden
            ${visibleCards.includes(5) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
            transition-all duration-700 ease-out
          `}
          style={{ transitionDelay: '600ms' }}
        >
          {/* 背景裝飾 */}
          <div className='absolute inset-0 bg_brand_gradient opacity-5' />
          <div className='absolute top-0 right-0 w-32 h-32 bg_brand_gradient opacity-10 rounded-full -translate-y-16 translate-x-16' />
          <div className='absolute bottom-0 left-0 w-24 h-24 bg_brand_gradient opacity-10 rounded-full translate-y-12 -translate-x-12' />
          
          <div className='relative z-10'>
            <div className='flex justify-center mb-6'>
              <div className='w-16 h-16 bg_brand_gradient rounded-full flex items-center justify-center'>
                <Trophy className='w-8 h-8 text-white' />
              </div>
            </div>
            
            <h3 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-bebas_neue'>
              創新 3D 互動設計
            </h3>
            <p className='text-xl text-gray-600 mb-8 max-w-2xl mx-auto'>
              採用先進的 CSS 3D 變換技術，提供沉浸式的教練資訊瀏覽體驗
            </p>
            
            {/* 特色列表 */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto'>
              {[
                {
                  title: '3D 翻轉效果',
                  description: '流暢的翻轉動畫展示詳細資訊'
                },
                {
                  title: '個人化資料',
                  description: '深度了解每位教練的專業背景'
                },
                {
                  title: '直接預約',
                  description: '一鍵預約您心儀的專業教練'
                }
              ].map((feature, index) => (
                <div key={index} className='text-center'>
                  <h4 className='font-bold text-gray-900 mb-2'>{feature.title}</h4>
                  <p className='text-sm text-gray-600'>{feature.description}</p>
                </div>
              ))}
            </div>
            
            <div className='flex flex-col sm:flex-row gap-4 justify-center mt-8'>
              <button className='btn_brand_primary text-lg px-8 py-4'>
                查看所有教練
              </button>
              <button className='border-2 border-brand-red-500 text-brand-red-600 px-8 py-4 rounded-xl font-semibold hover:bg-brand-red-500 hover:text-white transition-colors duration-300'>
                預約體驗課程
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Coach3DShowcase;