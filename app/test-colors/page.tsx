'use client';

import React from 'react';

/**
 * Focus Space 品牌色彩系統視覺測試頁面
 * 用於實際瀏覽器中測試所有品牌色彩的顯示效果
 */
const TestColorsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text_brand_gradient">
          Focus Space 品牌色彩系統測試
        </h1>

        {/* 主要品牌色彩 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">主要品牌色彩</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Red 50', class: 'bg-brand-red-50', text: 'text-gray-900' },
              { name: 'Red 100', class: 'bg-brand-red-100', text: 'text-white' },
              { name: 'Red 600', class: 'bg-brand-red-600', text: 'text-white' },
              { name: 'Yellow 50', class: 'bg-brand-yellow-50', text: 'text-gray-900' },
              { name: 'Yellow 100', class: 'bg-brand-yellow-100', text: 'text-gray-900' },
              { name: 'Yellow 500', class: 'bg-brand-yellow-500', text: 'text-gray-900' },
            ].map((color) => (
              <div
                key={color.name}
                className={`${color.class} ${color.text} h-24 rounded-lg flex items-center justify-center font-semibold shadow-md`}
              >
                {color.name}
              </div>
            ))}
          </div>
        </section>

        {/* 漸層效果展示 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">品牌漸層效果</h2>
          <div className="space-y-4">
            <div className="bg_brand_gradient h-24 rounded-lg flex items-center justify-center text-white font-semibold text-xl shadow-lg">
              主要漸層 (Primary Gradient)
            </div>
            <div className="bg_brand_gradient_reverse h-24 rounded-lg flex items-center justify-center text-white font-semibold text-xl shadow-lg">
              反向漸層 (Reverse Gradient)
            </div>
            <div className="bg_brand_gradient_vertical h-24 rounded-lg flex items-center justify-center text-white font-semibold text-xl shadow-lg">
              垂直漸層 (Vertical Gradient)
            </div>
          </div>
        </section>

        {/* 按鈕樣式測試 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">品牌按鈕樣式</h2>
          <div className="flex flex-wrap gap-4">
            <button className="btn_brand_primary">
              主要按鈕 (Primary)
            </button>
            <button className="btn_brand_outline">
              外框按鈕 (Outline)
            </button>
            <button className="btn_brand_yellow">
              黃色按鈕 (Yellow)
            </button>
            <button className="btn_brand_red">
              紅色按鈕 (Red)
            </button>
          </div>
        </section>

        {/* 文字漸層效果 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">品牌文字漸層</h2>
          <div className="space-y-4 text-center">
            <h1 className="text-6xl font-bold text_brand_gradient font-bebas_neue">
              FOCUS SPACE
            </h1>
            <h2 className="text-3xl font-semibold text_brand_gradient">
              專心練健身房
            </h2>
            <p className="text-xl text_brand_gradient">
              Focus On Your Own Training Space
            </p>
          </div>
        </section>

        {/* CSS 變數直接測試 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">CSS 變數直接測試</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              className="h-24 rounded-lg flex items-center justify-center text-white font-semibold shadow-md"
              style={{ backgroundColor: 'var(--brand-red-primary)' }}
            >
              var(--brand-red-primary)
            </div>
            <div 
              className="h-24 rounded-lg flex items-center justify-center text-gray-900 font-semibold shadow-md"
              style={{ backgroundColor: 'var(--brand-yellow-primary)' }}
            >
              var(--brand-yellow-primary)
            </div>
            <div 
              className="h-24 rounded-lg flex items-center justify-center text-white font-semibold shadow-md"
              style={{ background: 'var(--brand-gradient-primary)' }}
            >
              var(--brand-gradient-primary)
            </div>
            <div 
              className="h-24 rounded-lg flex items-center justify-center text-white font-semibold shadow-md"
              style={{ background: 'var(--brand-gradient-reverse)' }}
            >
              var(--brand-gradient-reverse)
            </div>
          </div>
        </section>

        {/* 響應式測試 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">響應式測試</h2>
          <div className="bg_brand_gradient p-8 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-lg text-white text-center"
                >
                  響應式卡片 {i + 1}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 深色模式預覽 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">深色模式預覽</h2>
          <div className="bg-gray-900 p-8 rounded-lg">
            <h3 className="text_brand_gradient text-2xl font-bold mb-4">
              深色背景上的品牌色彩
            </h3>
            <div className="flex flex-wrap gap-4">
              <button className="btn_brand_primary">主要按鈕</button>
              <button className="btn_brand_outline bg-transparent border-brand-yellow-500 text-brand-yellow-500 hover:bg-brand-yellow-500 hover:text-gray-900">
                調整後外框按鈕
              </button>
            </div>
          </div>
        </section>

        {/* 使用案例展示 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">實際使用案例</h2>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* 模擬導航欄 */}
            <div className="bg_brand_gradient p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-white font-bold text-xl">Focus Space</h3>
                <div className="flex gap-4">
                  <button className="text-white hover:text-brand-yellow-100 transition-colors">
                    關於我們
                  </button>
                  <button className="text-white hover:text-brand-yellow-100 transition-colors">
                    課程
                  </button>
                  <button className="text-white hover:text-brand-yellow-100 transition-colors">
                    教練
                  </button>
                </div>
              </div>
            </div>
            
            {/* 模擬內容區 */}
            <div className="p-8">
              <h3 className="text_brand_gradient text-3xl font-bold mb-4">
                歡迎來到 Focus Space
              </h3>
              <p className="text-gray-600 mb-6">
                專心練健身房致力於提供最專業的健身環境，讓每位會員都能專注於自己的訓練目標。
              </p>
              <div className="flex gap-4">
                <button className="btn_brand_primary">立即加入</button>
                <button className="btn_brand_outline">了解更多</button>
              </div>
            </div>
          </div>
        </section>

        {/* 返回首頁按鈕 */}
        <div className="text-center">
          <button 
            onClick={() => window.location.href = '/'}
            className="btn_brand_primary"
          >
            返回首頁
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestColorsPage;