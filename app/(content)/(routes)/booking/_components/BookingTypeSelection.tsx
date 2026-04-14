'use client';

import React from 'react';
import { Heart, Calendar, CheckCircle } from 'lucide-react';

import type { BookingComponentProps } from '@/types/booking';

interface BookingTypeSelectionProps extends BookingComponentProps {}

type SelectionId = 'trial-1v1' | 'trial-1v2' | 'course';

const BookingTypeSelection: React.FC<BookingTypeSelectionProps> = ({
  bookingData,
  setBookingData,
  errors,
}) => {
  const handleTypeSelect = (id: SelectionId) => {
    if (id === 'course') {
      setBookingData({
        ...bookingData,
        bookingType: 'course',
        trialType: undefined,
        totalPrice: bookingData.totalPrice,
      });
      return;
    }

    const trialType = id === 'trial-1v1' ? '1v1' : '1v2';
    const price = trialType === '1v1' ? 1000 : 1300;
    setBookingData({
      ...bookingData,
      bookingType: 'trial',
      trialType,
      totalPrice: price,
      participantCount: trialType === '1v2' ? 2 : 1,
    });
  };

  const bookingTypes = [
    {
      id: 'trial-1v1' as SelectionId,
      title: '1對1教練課體驗',
      subtitle: '首次體驗優惠價',
      icon: Heart,
      features: [
        '專業教練一對一指導',
        '高規格身體組成測量',
        '個人化訓練建議',
        '環境參觀導覽',
      ],
      price: 'NT$ 1,000',
      originalPrice: 'NT$ 1,800',
      color: 'from-green-500 to-emerald-500',
      borderColor: 'border-green-500',
      bgColor: 'bg-green-50',
      selectedBgColor: 'bg-green-600',
      selectedTextColor: 'text-white',
      priceColor: 'text-green-600',
    },
    {
      id: 'trial-1v2' as SelectionId,
      title: '1對2教練課體驗',
      subtitle: '首次體驗優惠價',
      icon: Heart,
      features: [
        '專業教練一對二指導',
        '高規格身體組成測量',
        '與親友一同體驗',
        '環境參觀導覽',
      ],
      price: 'NT$ 1,300',
      originalPrice: 'NT$ 2,000',
      color: 'from-teal-500 to-cyan-500',
      borderColor: 'border-teal-500',
      bgColor: 'bg-teal-50',
      selectedBgColor: 'bg-teal-600',
      selectedTextColor: 'text-white',
      priceColor: 'text-teal-600',
    },
    {
      id: 'course' as SelectionId,
      title: '課程預約',
      subtitle: '預約正式訓練課程',
      icon: Calendar,
      features: [
        '個人/團體課程選擇',
        '專業教練指導',
        '完整訓練計畫',
        '彈性時段安排',
        '進度追蹤記錄',
      ],
      price: '依課程計價',
      originalPrice: undefined,
      color: 'from-brand-red-500 to-brand-yellow-500',
      borderColor: 'border-brand-red-500',
      bgColor: 'bg-brand-red-50',
      selectedBgColor: 'bg-brand-red-600',
      selectedTextColor: 'text-white',
      priceColor: 'text-brand-red-600',
    },
  ];

  const currentSelectionId: SelectionId | undefined =
    bookingData.bookingType === 'course'
      ? 'course'
      : bookingData.bookingType === 'trial' && bookingData.trialType === '1v1'
      ? 'trial-1v1'
      : bookingData.bookingType === 'trial' && bookingData.trialType === '1v2'
      ? 'trial-1v2'
      : undefined;

  return (
    <div>
      <h2 className='mb-2 text-2xl font-bold text-gray-900'>選擇預約類型</h2>
      <p className='mb-8 text-gray-600'>請選擇您想要預約的服務類型</p>

      <div className='grid gap-6 md:grid-cols-3'>
        {bookingTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = currentSelectionId === type.id;

          return (
            <button
              key={type.id}
              type='button'
              onClick={() => handleTypeSelect(type.id)}
              className={`
                relative w-full transform cursor-pointer rounded-2xl border-2 p-6
                text-left transition-all duration-300 hover:scale-105
                ${
                  isSelected
                    ? `${type.borderColor} ${type.selectedBgColor} shadow-xl`
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }
              `}
            >
              {/* 選中標記 */}
              {isSelected && (
                <div
                  className={`absolute -right-3 -top-3 h-8 w-8 bg-gradient-to-r ${type.color} flex items-center justify-center rounded-full shadow-lg`}
                >
                  <CheckCircle className='h-5 w-5 text-white' />
                </div>
              )}

              {/* 圖標 */}
              <div
                className={`
                mb-4 flex h-16 w-16 items-center justify-center rounded-xl
                ${
                  isSelected
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600'
                }
              `}
              >
                <Icon className='h-8 w-8' />
              </div>

              {/* 標題 */}
              <h3
                className={`mb-1 text-xl font-bold ${
                  isSelected ? type.selectedTextColor : 'text-gray-900'
                }`}
              >
                {type.title}
              </h3>
              <p
                className={`mb-4 text-sm ${
                  isSelected ? 'text-white/80' : 'text-gray-600'
                }`}
              >
                {type.subtitle}
              </p>

              {/* 特色列表 */}
              <ul className='mb-4 space-y-2'>
                {type.features.map((feature, index) => (
                  <li
                    key={index}
                    className={`flex items-start gap-2 text-sm ${
                      isSelected ? 'text-white/90' : 'text-gray-600'
                    }`}
                  >
                    <CheckCircle
                      className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                        isSelected ? 'text-white' : 'text-gray-400'
                      }`}
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* 價格 */}
              <div
                className={`border-t pt-4 ${
                  isSelected ? 'border-white/30' : 'border-gray-200'
                }`}
              >
                <div className='flex items-end justify-between gap-2'>
                  <span
                    className={`text-sm ${
                      isSelected ? 'text-white/80' : 'text-gray-600'
                    }`}
                  >
                    費用
                  </span>
                  <div className='flex flex-col items-end leading-tight'>
                    {type.originalPrice && (
                      <span
                        className={`whitespace-nowrap text-xs line-through ${
                          isSelected ? 'text-white/60' : 'text-gray-400'
                        }`}
                      >
                        {type.originalPrice}
                      </span>
                    )}
                    <span
                      className={`whitespace-nowrap text-2xl font-bold ${
                        isSelected ? 'text-white' : type.priceColor
                      }`}
                    >
                      {type.price}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 錯誤提示 */}
      {errors.bookingType && (
        <p className='mt-4 text-center text-sm text-red-500'>{errors.bookingType}</p>
      )}
    </div>
  );
};

export default BookingTypeSelection;
