'use client';

import React from 'react';
import { Heart, Calendar, CheckCircle } from 'lucide-react';

import type { BookingComponentProps } from '@/types/booking';

interface BookingTypeSelectionProps extends BookingComponentProps {}

const BookingTypeSelection: React.FC<BookingTypeSelectionProps> = ({
  bookingData,
  setBookingData,
  errors,
}) => {
  
  const handleTypeSelect = (type: 'trial' | 'course') => {
    setBookingData({
      ...bookingData,
      bookingType: type,
      // 體驗預約免費
      totalPrice: type === 'trial' ? 0 : bookingData.totalPrice
    });
  };

  const bookingTypes = [
    {
      id: 'trial',
      title: '場館體驗',
      subtitle: '初次體驗 Focus Space',
      icon: Heart,
      features: [
        '一對一專業諮詢',
        '身體評估與分析',
        '客製化訓練建議',
        '環境參觀導覽',
        '完全免費'
      ],
      price: '免費',
      color: 'from-green-500 to-emerald-500',
      borderColor: 'border-green-500',
      bgColor: 'bg-green-50',
      selectedBgColor: 'bg-green-600',
      selectedTextColor: 'text-white'
    },
    {
      id: 'course',
      title: '課程預約',
      subtitle: '預約正式訓練課程',
      icon: Calendar,
      features: [
        '個人/團體課程選擇',
        '專業教練指導',
        '完整訓練計畫',
        '彈性時段安排',
        '進度追蹤記錄'
      ],
      price: '依課程計價',
      color: 'from-brand-red-500 to-brand-yellow-500',
      borderColor: 'border-brand-red-500',
      bgColor: 'bg-brand-red-50',
      selectedBgColor: 'bg-brand-red-600',
      selectedTextColor: 'text-white'
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">選擇預約類型</h2>
      <p className="text-gray-600 mb-8">請選擇您想要預約的服務類型</p>
      
      <div className="grid md:grid-cols-2 gap-6">
        {bookingTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = bookingData.bookingType === type.id;
          
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => handleTypeSelect(type.id as 'trial' | 'course')}
              className={`
                relative p-6 rounded-2xl border-2 cursor-pointer w-full text-left
                transition-all duration-300 transform hover:scale-105
                ${isSelected 
                  ? `${type.borderColor} ${type.selectedBgColor} shadow-xl` 
                  : 'border-gray-200 hover:border-gray-300 bg-white'
                }
              `}
            >
              {/* 選中標記 */}
              {isSelected && (
                <div className={`absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r ${type.color} rounded-full flex items-center justify-center shadow-lg`}>
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              )}
              
              {/* 圖標 */}
              <div className={`
                w-16 h-16 rounded-xl mb-4 flex items-center justify-center
                ${isSelected 
                  ? 'bg-white/20 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-600'
                }
              `}>
                <Icon className="w-8 h-8" />
              </div>
              
              {/* 標題 */}
              <h3 className={`text-xl font-bold mb-1 ${isSelected ? type.selectedTextColor : 'text-gray-900'}`}>
                {type.title}
              </h3>
              <p className={`text-sm mb-4 ${isSelected ? 'text-white/80' : 'text-gray-600'}`}>
                {type.subtitle}
              </p>
              
              {/* 特色列表 */}
              <ul className="space-y-2 mb-4">
                {type.features.map((feature, index) => (
                  <li key={index} className={`flex items-start gap-2 text-sm ${isSelected ? 'text-white/90' : 'text-gray-600'}`}>
                    <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      isSelected ? 'text-white' : 'text-gray-400'
                    }`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              {/* 價格 */}
              <div className={`pt-4 border-t ${isSelected ? 'border-white/30' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <span className={isSelected ? 'text-white/80' : 'text-gray-600'}>費用</span>
                  <span className={`text-xl font-bold ${
                    isSelected 
                      ? 'text-white' 
                      : type.id === 'trial' 
                        ? 'text-green-600' 
                        : 'text-brand-red-600'
                  }`}>
                    {type.price}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* 錯誤提示 */}
      {errors.bookingType && (
        <p className='text-red-500 text-sm mt-4 text-center'>{errors.bookingType}</p>
      )}
    </div>
  );
};

export default BookingTypeSelection;