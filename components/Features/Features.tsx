'use client';
import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Target, 
  Shield, 
  Clock, 
  Sparkles, 
  Trophy,
  MapPin,
  Users
} from 'lucide-react';

const Features = () => {
  const [visibleFeatures, setVisibleFeatures] = useState<number[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const featureIndex = parseInt(entry.target.getAttribute('data-feature') || '0');
            setVisibleFeatures(prev => [...prev, featureIndex]);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-feature]').forEach((feature) => {
      observer.observe(feature);
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: <Zap className='w-8 h-8' />,
      title: '免入會費制度',
      description: '無需繁瑣手續，隨時開始您的健身之旅',
      highlight: '立即開始',
      color: 'from-brand-red-500 to-brand-yellow-500'
    },
    {
      icon: <Target className='w-8 h-8' />,
      title: '彈性計費方式',
      description: '單次入場、分鐘計時、月季票制，符合您的需求',
      highlight: '多種選擇',
      color: 'from-brand-yellow-500 to-brand-red-500'
    },
    {
      icon: <Shield className='w-8 h-8' />,
      title: '不綁約承諾',
      description: '無壓力訓練環境，隨時調整您的健身計劃',
      highlight: '自由選擇',
      color: 'from-brand-red-400 to-brand-yellow-400'
    },
    {
      icon: <Clock className='w-8 h-8' />,
      title: '超長營業時間',
      description: '早上7點到晚上11點，配合您的生活作息',
      highlight: '16小時服務',
      color: 'from-brand-yellow-400 to-brand-red-400'
    },
    {
      icon: <Sparkles className='w-8 h-8' />,
      title: '300坪大空間',
      description: '寛敞舒適的訓練環境，不用擔心器材排隊',
      highlight: '超大空間',
      color: 'from-brand-red-600 to-brand-yellow-600'
    },
    {
      icon: <Trophy className='w-8 h-8' />,
      title: '專業器材設備',
      description: '國際品牌健身器材，滿足所有訓練需求',
      highlight: '頂級設備',
      color: 'from-brand-yellow-600 to-brand-red-600'
    },
    {
      icon: <MapPin className='w-8 h-8' />,
      title: '絕佳地理位置',
      description: '捷運新埔站5號出口，交通便利停車方便',
      highlight: '捷運直達',
      color: 'from-brand-red-300 to-brand-yellow-300'
    },
    {
      icon: <Users className='w-8 h-8' />,
      title: '專業教練團隊',
      description: '經驗豐富的教練群，提供專業指導與建議',
      highlight: '專業指導',
      color: 'from-brand-yellow-300 to-brand-red-300'
    }
  ];

  return (
    <section className='bg-gradient-to-b from-gray-50 to-white py-20'>
      <div className='max-container mx-auto px-6'>
        
        {/* 標題區 */}
        <div className='text-center mb-16'>
          <h2 className='text_brand_gradient text-4xl md:text-6xl font-bold font-bebas_neue mb-6'>
            為什麼選擇 Focus Space？
          </h2>
          <p className='text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-8'>
            8大獨特優勢，讓您專注於訓練目標
          </p>
          
          {/* 裝飾線條 */}
          <div className='flex justify-center items-center gap-4 mb-12'>
            <div className='w-16 h-1 bg_brand_gradient rounded-full' />
            <div className='w-8 h-8 bg_brand_gradient rounded-full flex items-center justify-center'>
              <Sparkles className='w-4 h-4 text-white' />
            </div>
            <div className='w-16 h-1 bg_brand_gradient rounded-full' />
          </div>
        </div>

        {/* 特色網格 */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16'>
          {features.map((feature, index) => (
            <div
              key={index}
              data-feature={index}
              className={`
                group relative bg-white rounded-3xl p-8 shadow-lg border border-gray-100
                hover:shadow-2xl hover:-translate-y-3 transition-all duration-500
                ${visibleFeatures.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
              `}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* 背景漸層效果 */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-all duration-300`} />
              
              {/* 圖示區 */}
              <div className='relative z-10 mb-6'>
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                
                {/* 亮點標籤 */}
                <span className='inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold group-hover:bg_brand_gradient group-hover:text-white transition-all duration-300'>
                  {feature.highlight}
                </span>
              </div>

              {/* 內容區 */}
              <div className='relative z-10'>
                <h3 className='text-xl font-bold text-gray-900 mb-3 group-hover:text_brand_gradient transition-colors duration-300'>
                  {feature.title}
                </h3>
                <p className='text-gray-600 leading-relaxed text-sm'>
                  {feature.description}
                </p>
              </div>

              {/* 裝飾元素 */}
              <div className='absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 opacity-20 rounded-full group-hover:scale-125 transition-transform duration-300' />
              <div className='absolute bottom-4 left-4 w-8 h-8 bg_brand_gradient opacity-10 rounded-full group-hover:opacity-20 transition-opacity duration-300' />
            </div>
          ))}
        </div>

        {/* 統計數據區 */}
        <div className='bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 relative overflow-hidden'>
          {/* 背景裝飾 */}
          <div className='absolute inset-0 bg_brand_gradient opacity-5' />
          <div className='absolute top-0 right-0 w-64 h-64 bg_brand_gradient opacity-10 rounded-full -translate-y-32 translate-x-32' />
          <div className='absolute bottom-0 left-0 w-48 h-48 bg_brand_gradient opacity-10 rounded-full translate-y-24 -translate-x-24' />
          
          <div className='relative z-10'>
            <h3 className='text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 font-bebas_neue'>
              Focus Space 實力展現
            </h3>
            
            <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
              {[
                { number: '300', unit: '坪', label: '超大空間' },
                { number: '16', unit: '小時', label: '營業時間' },
                { number: '0', unit: '元', label: '入會費用' },
                { number: '∞', unit: '種', label: '計費方式' }
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`
                    text-center group
                    ${visibleFeatures.includes(index + 8) ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
                  `}
                  data-feature={index + 8}
                  style={{ transitionDelay: `${(index + 8) * 100}ms` }}
                >
                  <div className='text-4xl md:text-5xl font-bold text_brand_gradient mb-2 font-bebas_neue group-hover:scale-110 transition-transform duration-300'>
                    {stat.number}<span className='text-2xl md:text-3xl'>{stat.unit}</span>
                  </div>
                  <p className='text-gray-600 font-semibold'>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Features;