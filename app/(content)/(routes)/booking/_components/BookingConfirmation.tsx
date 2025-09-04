'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, Calendar, Clock, User, Phone, Mail, MapPin,
  DollarSign, MessageSquare, Heart, Star, Home
} from 'lucide-react';
import type { BookingData } from '@/types/booking';

interface BookingConfirmationProps {
  bookingData: BookingData;
  onConfirm: () => void;
  onBack: () => void;
  loading?: boolean;
  isCompleted?: boolean;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  bookingData,
  onConfirm,
  onBack,
  loading = false,
  isCompleted = false,
}) => {
  const [countdown, setCountdown] = useState(3);

  // 倒數計時效果
  useEffect(() => {
    if (isCompleted && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isCompleted, countdown]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const getBookingTypeIcon = () => {
    return bookingData.bookingType === 'trial' ? Heart : Star;
  };

  const getBookingTypeName = () => {
    return bookingData.bookingType === 'trial' ? '場館體驗' : '課程預約';
  };

  const getCategoryName = (category?: string) => {
    switch (category) {
      case 'personal': return '個人課程';
      case 'group': return '團體課程';
      case 'special': return '特殊課程';
      default: return category || '未指定';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg_brand_gradient rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {isCompleted ? '預約完成！' : '確認預約資訊'}
        </h2>
        <p className="text-gray-600">
          {isCompleted 
            ? '感謝您的預約！我們會盡快與您聯繫確認時間' 
            : '請仔細檢查以下資訊，確認無誤後送出預約'
          }
        </p>
      </div>

      {isCompleted && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div>
            <p className="text-green-800 font-semibold">預約已成功送出</p>
            <p className="text-green-700 text-sm">確認信已發送至您的信箱，請留意我們的來電或訊息</p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* 預約類型 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            {React.createElement(getBookingTypeIcon(), { 
              className: 'w-6 h-6 text-brand-red-500' 
            })}
            <h3 className="text-xl font-semibold text-gray-900">預約類型</h3>
          </div>
          <div className="border border-gray-100 rounded-xl p-4">
            <p className="text-2xl font-bold text-brand-red-600">{getBookingTypeName()}</p>
            {bookingData.bookingType === 'trial' && (
              <p className="text-gray-600 mt-1">首次體驗 Focus Space 專業服務</p>
            )}
          </div>
        </div>

        {/* 課程資訊（只在課程預約時顯示） */}
        {bookingData.bookingType === 'course' && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Star className="w-6 h-6 text-brand-red-500" />
              <h3 className="text-xl font-semibold text-gray-900">課程資訊</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-gray-100 rounded-xl p-4">
                <p className="text-sm text-gray-600 font-medium mb-1">課程名稱</p>
                <p className="text-lg font-bold text-gray-900">{bookingData.courseName}</p>
              </div>
              <div className="border border-gray-100 rounded-xl p-4">
                <p className="text-sm text-gray-600 font-medium mb-1">課程類型</p>
                <p className="text-lg font-bold text-gray-900">{getCategoryName(bookingData.courseCategory)}</p>
              </div>
              {bookingData.duration && (
                <div className="border border-gray-100 rounded-xl p-4">
                  <p className="text-sm text-gray-600 font-medium mb-1">課程時長</p>
                  <p className="text-lg font-bold text-gray-900">{bookingData.duration} 分鐘</p>
                </div>
              )}
              <div className="border border-gray-100 rounded-xl p-4">
                <p className="text-sm text-gray-600 font-medium mb-1">參與人數</p>
                <p className="text-lg font-bold text-gray-900">{bookingData.participantCount} 人</p>
              </div>
              
              {/* 團體課程的額外時間資訊 */}
              {(bookingData.courseCategory === 'group' || bookingData.courseCategory === 'special') && (
                <>
                  {bookingData.courseStartDate && bookingData.courseEndDate && (
                    <div className="border border-gray-100 rounded-xl p-4 md:col-span-2">
                      <p className="text-sm text-gray-600 font-medium mb-1">課程期間</p>
                      <p className="text-lg font-bold text-gray-900">
                        {formatDate(bookingData.courseStartDate)} ~ {formatDate(bookingData.courseEndDate)}
                      </p>
                    </div>
                  )}
                  
                  {bookingData.courseWeekdays && bookingData.courseWeekdays.length > 0 && (
                    <div className="border border-gray-100 rounded-xl p-4">
                      <p className="text-sm text-gray-600 font-medium mb-1">上課日期</p>
                      <p className="text-lg font-bold text-gray-900">
                        每{bookingData.courseWeekdays.map(day => {
                          const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
                          return weekdays[day];
                        }).join('、')}
                      </p>
                    </div>
                  )}
                  
                  {bookingData.courseTimeSlots && bookingData.courseTimeSlots.length > 0 && (
                    <div className="border border-gray-100 rounded-xl p-4">
                      <p className="text-sm text-gray-600 font-medium mb-1">上課時間</p>
                      <p className="text-lg font-bold text-gray-900">
                        {bookingData.courseTimeSlots.map(slot => 
                          `${slot.startTime} - ${slot.endTime}`
                        ).join('、')}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* 預約時間（只在課程預約時顯示） */}
        {bookingData.bookingType === 'course' && bookingData.bookingDate && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-brand-red-500" />
              <h3 className="text-xl font-semibold text-gray-900">預約時間</h3>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatDate(bookingData.bookingDate)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-5 h-5 text-brand-red-500" />
                    <span className="text-lg font-semibold text-brand-red-600">
                      {bookingData.startTime} - {bookingData.endTime}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <MapPin className="w-5 h-5 text-gray-400 ml-auto mb-1" />
                  <p className="text-sm text-gray-600">Focus Space</p>
                  <p className="text-xs text-gray-500">健身工作室</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 體驗偏好時間（只在體驗預約時顯示） */}
        {bookingData.bookingType === 'trial' && (bookingData.preferredDate || bookingData.preferredTime) && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-brand-red-500" />
              <h3 className="text-xl font-semibold text-gray-900">偏好時間</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {bookingData.preferredDate && (
                <div className="border border-gray-100 rounded-xl p-4">
                  <p className="text-sm text-gray-600 font-medium mb-1">希望日期</p>
                  <p className="text-lg font-bold text-gray-900">{bookingData.preferredDate}</p>
                </div>
              )}
              {bookingData.preferredTime && (
                <div className="border border-gray-100 rounded-xl p-4">
                  <p className="text-sm text-gray-600 font-medium mb-1">偏好時段</p>
                  <p className="text-lg font-bold text-gray-900">{bookingData.preferredTime}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 聯絡資訊 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-6 h-6 text-brand-red-500" />
            <h3 className="text-xl font-semibold text-gray-900">聯絡資訊</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl">
              <User className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">姓名</p>
                <p className="font-semibold text-gray-900">{bookingData.customerName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl">
              <Phone className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">電話</p>
                <p className="font-semibold text-gray-900">{bookingData.customerPhone}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl mt-4">
            <Mail className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">電子郵件</p>
              <p className="font-semibold text-gray-900">{bookingData.customerEmail}</p>
            </div>
          </div>
        </div>

        {/* 體驗預約額外資訊 */}
        {bookingData.bookingType === 'trial' && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-brand-red-500" />
              <h3 className="text-xl font-semibold text-gray-900">體驗資訊</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {bookingData.customerGender && (
                <div className="border border-gray-100 rounded-xl p-4">
                  <p className="text-sm text-gray-600 font-medium mb-1">性別</p>
                  <p className="text-lg font-bold text-gray-900">
                    {bookingData.customerGender === 'male' ? '男性' : 
                     bookingData.customerGender === 'female' ? '女性' : '其他'}
                  </p>
                </div>
              )}
              {bookingData.customerAge && (
                <div className="border border-gray-100 rounded-xl p-4">
                  <p className="text-sm text-gray-600 font-medium mb-1">年齡</p>
                  <p className="text-lg font-bold text-gray-900">{bookingData.customerAge} 歲</p>
                </div>
              )}
              {typeof bookingData.hasExperience === 'boolean' && (
                <div className="border border-gray-100 rounded-xl p-4">
                  <p className="text-sm text-gray-600 font-medium mb-1">健身經驗</p>
                  <p className="text-lg font-bold text-gray-900">
                    {bookingData.hasExperience ? '有健身經驗' : '完全新手'}
                  </p>
                </div>
              )}
            </div>
            {bookingData.fitnessGoals && (
              <div className="border border-gray-100 rounded-xl p-4">
                <p className="text-sm text-gray-600 font-medium mb-2">健身目標</p>
                <p className="text-gray-700">{bookingData.fitnessGoals}</p>
              </div>
            )}
          </div>
        )}

        {/* 費用資訊 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-6 h-6 text-brand-red-500" />
            <h3 className="text-xl font-semibold text-gray-900">費用資訊</h3>
          </div>
          <div className="border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">總費用</p>
                <p className="text-3xl font-bold text-gray-900">
                  {bookingData.bookingType === 'trial' 
                    ? '免費' 
                    : `NT$ ${bookingData.totalPrice || 0}`
                  }
                </p>
              </div>
              {bookingData.bookingType === 'trial' && (
                <div className="text-right">
                  <p className="text-gray-600 text-sm">首次體驗優惠</p>
                  <p className="text-lg font-semibold text-gray-900">完全免費</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 備註 */}
        {bookingData.customerNote && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="w-6 h-6 text-brand-red-500" />
              <h3 className="text-xl font-semibold text-gray-900">備註事項</h3>
            </div>
            <div className="border border-gray-100 rounded-xl p-4">
              <p className="text-gray-700">{bookingData.customerNote}</p>
            </div>
          </div>
        )}

        {/* 注意事項 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            重要提醒
          </h4>
          <div className="text-gray-800 text-sm space-y-2">
            <p>• 送出預約後，系統將立即發送確認信到您的信箱</p>
            <p>• 專業顧問會在24小時內致電與您確認詳細資訊</p>
            {bookingData.bookingType === 'trial' && (
              <p>• 體驗當天請攜帶運動服裝和毛巾，其他設備我們會提供</p>
            )}
            {bookingData.bookingType === 'course' && bookingData.courseCategory === 'group' && (
              <p>• 團體課程開課後無法退費，請確認您能完整參與</p>
            )}
            <p>• 如需取消或變更預約，請提前24小時通知</p>
          </div>
        </div>

        {/* 操作按鈕 */}
        <div className="flex gap-4">
          {isCompleted ? (
            <div className="w-full space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                  <span>預約成功！{countdown > 0 ? `${countdown}秒後` : ''}自動返回首頁</span>
                </div>
              </div>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full px-6 py-3 bg_brand_gradient text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                立即返回首頁
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={onBack}
                disabled={loading}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                返回修改
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 px-6 py-3 bg_brand_gradient text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    送出中...
                  </div>
                ) : (
                  '確認送出預約'
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;