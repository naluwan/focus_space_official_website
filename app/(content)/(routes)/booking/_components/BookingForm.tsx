'use client';

import React, { useState } from 'react';
import BookingTypeSelection from './BookingTypeSelection';
import CourseSelection from './CourseSelection';
import TimeSlotSelection from './TimeSlotSelection';
import CustomerInfo from './CustomerInfo';
import TrialBookingForm from './TrialBookingForm';
import BookingConfirmation from './BookingConfirmation';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import type { BookingErrors, BookingFormProps } from '@/types/booking';

const BookingForm: React.FC<BookingFormProps> = ({
  currentStep,
  setCurrentStep,
  bookingData,
  setBookingData,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [isBookingCompleted, setIsBookingCompleted] = useState(false);
  const router = useRouter();

  // 根據預約類型獲取最大步驟數
  const getMaxSteps = () => {
    if (bookingData.bookingType === 'trial') {
      return 3; // 1.選擇類型 2.填寫資料 3.確認預約
    } else if (bookingData.bookingType === 'course') {
      return 5; // 1.選擇類型 2.選擇課程 3.選擇時段 4.填寫資料 5.確認預約
    }
    return 1; // 只有選擇類型
  };

  // 驗證當前步驟
  const validateStep = () => {
    const newErrors: BookingErrors = {};
    
    // 根據預約類型決定步驟驗證
    if (bookingData.bookingType === 'trial') {
      switch (currentStep) {
        case 1:
          if (!bookingData.bookingType) {
            newErrors.bookingType = '請選擇預約類型';
          }
          break;
        case 2:
          // 驗證體驗預約必填欄位
          if (!bookingData.customerName?.trim()) {
            newErrors.customerName = '請輸入姓名';
          }
          if (!bookingData.customerEmail?.trim()) {
            newErrors.customerEmail = '請輸入電子郵件';
          } else if (!/^\S+@\S+\.\S+$/.test(bookingData.customerEmail)) {
            newErrors.customerEmail = '請輸入有效的電子郵件';
          }
          if (!bookingData.customerPhone?.trim()) {
            newErrors.customerPhone = '請輸入電話號碼';
          } else if (!/^09\d{8}$/.test(bookingData.customerPhone)) {
            newErrors.customerPhone = '請輸入有效的手機號碼（09xxxxxxxx）';
          }
          break;
      }
    } else if (bookingData.bookingType === 'course') {
      switch (currentStep) {
        case 1:
          if (!bookingData.bookingType) {
            newErrors.bookingType = '請選擇預約類型';
          }
          break;
        case 2:
          if (!bookingData.courseId) {
            newErrors.course = '請選擇課程';
          }
          break;
        case 3:
          // 對於個人課程需要選擇日期時間，團體課程則不需要
          if (bookingData.courseCategory === 'personal') {
            if (!bookingData.bookingDate) {
              newErrors.date = '請選擇日期';
            }
            if (!bookingData.startTime) {
              newErrors.time = '請選擇時段';
            }
          }
          // 所有課程都需要選擇參與人數
          if (!bookingData.participantCount || bookingData.participantCount < 1) {
            newErrors.participantCount = '請選擇參與人數';
          }
          break;
        case 4:
          // 課程預約客戶資料驗證
          if (!bookingData.customerName?.trim()) {
            newErrors.customerName = '請輸入姓名';
          }
          if (!bookingData.customerEmail?.trim()) {
            newErrors.customerEmail = '請輸入電子郵件';
          } else if (!/^\S+@\S+\.\S+$/.test(bookingData.customerEmail)) {
            newErrors.customerEmail = '請輸入有效的電子郵件';
          }
          if (!bookingData.customerPhone?.trim()) {
            newErrors.customerPhone = '請輸入電話號碼';
          } else if (!/^09\d{8}$/.test(bookingData.customerPhone)) {
            newErrors.customerPhone = '請輸入有效的手機號碼（09xxxxxxxx）';
          }
          break;
      }
    } else {
      // 未選擇預約類型時的驗證
      if (currentStep === 1 && !bookingData.bookingType) {
        newErrors.bookingType = '請選擇預約類型';
      }
    }
    
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    // Validation completed
    return isValid;
  };

  // 處理下一步
  const handleNext = () => {
    if (validateStep()) {
      const maxSteps = getMaxSteps();
      if (currentStep < maxSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  // 處理上一步
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // 進入確認頁面（不發送API請求）
  const handleSubmit = async () => {
    if (!validateStep()) {
      // Validation failed
      toast.error('請填寫所有必填欄位');
      return;
    }
    
    // Moving to confirmation step
    // 直接進入確認頁面，不發送API請求
    const maxSteps = getMaxSteps();
    setCurrentStep(maxSteps);
  };

  // 完成預約（發送API請求並寫入資料庫）
  const handleConfirm = async () => {
    // Confirming booking
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });
      
      const result = await response.json();
      // API response received
      
      if (!response.ok) {
        // 處理 API 回傳的驗證錯誤
        if (result.errors) {
          console.error('Validation errors:', result.errors);
          setErrors(result.errors);
          toast.error('預約資料有誤，請檢查並重新填寫');
          return;
        }
        throw new Error(result.message || '預約失敗');
      }
      
      // 更新預約資料
      setBookingData({
        ...bookingData,
        bookingNumber: result.data.bookingNumber,
        bookingId: result.data.bookingId
      });
      
      // Booking successful
      toast.success('預約已提交！我們會盡快與您聯繫確認');
      
      // 設置預約完成狀態並在短暫延遲後導向首頁
      setIsBookingCompleted(true);
      
      // 3秒後自動跳轉到首頁，避免用戶重複提交
      setTimeout(() => {
        router.push('/');
      }, 3000);
      
    } catch (error) {
      console.error('預約錯誤:', error);
      toast.error(error instanceof Error ? error.message : '預約失敗，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  // 判斷是否為確認步驟
  const isConfirmationStep = () => {
    const maxSteps = getMaxSteps();
    return currentStep === maxSteps;
  };

  // 判斷是否為最後的資料填寫步驟
  const isLastDataStep = () => {
    if (bookingData.bookingType === 'trial') {
      return currentStep === 2; // 體驗預約的資料填寫步驟
    } else if (bookingData.bookingType === 'course') {
      return currentStep === 4; // 課程預約的資料填寫步驟
    }
    return false;
  };

  // 渲染當前步驟內容
  const renderStepContent = () => {
    // 體驗預約流程
    if (bookingData.bookingType === 'trial') {
      switch (currentStep) {
        case 1:
          return (
            <BookingTypeSelection
              bookingData={bookingData}
              setBookingData={setBookingData}
              errors={errors}
            />
          );
        case 2:
          return (
            <TrialBookingForm
              bookingData={bookingData}
              setBookingData={setBookingData}
              errors={errors}
            />
          );
        case 3:
          return (
            <BookingConfirmation
              bookingData={bookingData}
              onConfirm={handleConfirm}
              onBack={handlePrevious}
              loading={isLoading}
              isCompleted={isBookingCompleted}
            />
          );
        default:
          return null;
      }
    }
    // 課程預約流程
    else if (bookingData.bookingType === 'course') {
      switch (currentStep) {
        case 1:
          return (
            <BookingTypeSelection
              bookingData={bookingData}
              setBookingData={setBookingData}
              errors={errors}
            />
          );
        case 2:
          return (
            <CourseSelection
              bookingData={bookingData}
              setBookingData={setBookingData}
              errors={errors}
            />
          );
        case 3:
          return (
            <TimeSlotSelection
              bookingData={bookingData}
              setBookingData={setBookingData}
              errors={errors}
            />
          );
        case 4:
          return (
            <CustomerInfo
              bookingData={bookingData}
              setBookingData={setBookingData}
              errors={errors}
            />
          );
        case 5:
          return (
            <BookingConfirmation
              bookingData={bookingData}
              onConfirm={handleConfirm}
              onBack={handlePrevious}
              loading={isLoading}
              isCompleted={isBookingCompleted}
            />
          );
        default:
          return null;
      }
    }
    // 初始狀態：選擇預約類型
    else {
      return (
        <BookingTypeSelection
          bookingData={bookingData}
          setBookingData={setBookingData}
          errors={errors}
        />
      );
    }
  };

  return (
    <div className='max-w-4xl mx-auto'>
      <div className='bg-white rounded-3xl shadow-xl p-6 md:p-10'>
        {/* 步驟內容 */}
        <div className='min-h-[400px]'>
          {renderStepContent()}
        </div>
        
        {/* 操作按鈕 */}
        {!isConfirmationStep() && (
          <div className='flex justify-between items-center mt-10 pt-8 border-t'>
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`
                flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 
                font-semibold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50
                ${currentStep === 1 ? 'invisible' : ''}
              `}
            >
              <ArrowLeft className='w-5 h-5' />
              上一步
            </button>
            
            {isLastDataStep() ? (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 bg_brand_gradient text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 className='w-5 h-5 animate-spin' />
                    處理中...
                  </>
                ) : (
                  <>
                    確認預約資訊
                    <ArrowRight className='w-5 h-5' />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg_brand_gradient text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-brand-red-300 focus:ring-opacity-50"
              >
                下一步
                <ArrowRight className='w-5 h-5' />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingForm;