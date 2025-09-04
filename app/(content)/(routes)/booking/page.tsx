'use client';

import React, { useState } from 'react';
import BookingForm from './_components/BookingForm';
import BookingSteps from './_components/BookingSteps';
import { Calendar, Clock, CheckCircle } from 'lucide-react';
import type { BookingFormData } from '@/types/booking';

const BookingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingFormData>({
    bookingType: undefined,
    // 課程預約欄位
    courseId: '',
    courseName: '',
    courseCategory: undefined,
    bookingDate: '',
    startTime: '',
    endTime: '',
    duration: 0,
    participantCount: 1,
    totalPrice: 0,
    // 客戶基本資訊
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerNote: '',
    // 體驗預約專屬欄位
    customerGender: undefined,
    customerAge: 0,
    hasExperience: false,
    fitnessGoals: '',
    preferredDate: '',
    preferredTime: ''
  });

  // 根據預約類型調整步驟
  const getSteps = () => {
    if (bookingData.bookingType === 'trial') {
      return [
        { number: 1, title: '選擇類型', icon: Calendar },
        { number: 2, title: '填寫資料', icon: CheckCircle }
      ];
    } else if (bookingData.bookingType === 'course') {
      return [
        { number: 1, title: '選擇類型', icon: Calendar },
        { number: 2, title: '選擇課程', icon: Calendar },
        { number: 3, title: '選擇時段', icon: Clock },
        { number: 4, title: '填寫資料', icon: CheckCircle }
      ];
    } else {
      return [
        { number: 1, title: '選擇類型', icon: Calendar }
      ];
    }
  };

  const steps = getSteps();

  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='max-container mx-auto px-6'>
        {/* 頁面標題 */}
        <div className='text-center mb-10'>
          <h1 className='text_brand_gradient text-4xl md:text-6xl font-bold font-bebas_neue mb-4'>
            {bookingData.bookingType === 'trial' ? '預約體驗' : 
             bookingData.bookingType === 'course' ? '預約課程' : '線上預約'}
          </h1>
          <p className='text-xl text-gray-900 font-medium'>
            {bookingData.bookingType === 'trial' ? '簡單兩步驟，預約您的專屬場館體驗' :
             bookingData.bookingType === 'course' ? '簡單四步驟，輕鬆預約您的專屬訓練時段' :
             '選擇您想要的預約類型，開始您的健身之旅'}
          </p>
        </div>

        {/* 步驟指示器 */}
        <BookingSteps steps={steps} currentStep={currentStep} />

        {/* 預約表單 */}
        <div className='mt-10'>
          <BookingForm
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            bookingData={bookingData}
            setBookingData={setBookingData}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingPage;