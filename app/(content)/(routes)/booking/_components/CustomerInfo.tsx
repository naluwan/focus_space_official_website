'use client';

import React from 'react';
import { User, Phone, Mail, MessageSquare } from 'lucide-react';

import type { BookingComponentProps } from '@/types/booking';

interface CustomerInfoProps extends BookingComponentProps {}

const CustomerInfo: React.FC<CustomerInfoProps> = ({
  bookingData,
  setBookingData,
  errors,
}) => {
  
  const handleInputChange = (field: string, value: string | number) => {
    setBookingData({
      ...bookingData,
      [field]: value
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">填寫聯絡資料</h2>
      <p className="text-gray-600 mb-8">請提供您的聯絡資料，我們將透過以下方式與您確認預約</p>
      
      <div className="space-y-6">
        {/* 基本聯絡資料 */}
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-6">
            <User className="w-5 h-5 text-brand-red-500" />
            聯絡資料
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* 姓名 */}
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
                姓名 <span className="text-red-500">*</span>
              </label>
              <input
                id="customerName"
                type="text"
                value={bookingData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                className={`
                  w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors
                  ${errors.customerName 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-brand-red-500'
                  }
                `}
                placeholder="請輸入您的真實姓名"
              />
              {errors.customerName && (
                <p className="text-red-500 text-sm mt-2">{errors.customerName}</p>
              )}
            </div>
            
            {/* 電話 */}
            <div>
              <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-2">
                手機號碼 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="customerPhone"
                  type="tel"
                  value={bookingData.customerPhone}
                  onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                  className={`
                    w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors
                    ${errors.customerPhone 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-brand-red-500'
                    }
                  `}
                  placeholder="09xxxxxxxx"
                />
              </div>
              {errors.customerPhone && (
                <p className="text-red-500 text-sm mt-2">{errors.customerPhone}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">我們會透過手機簡訊確認預約資訊</p>
            </div>
          </div>
          
          {/* 電子郵件 */}
          <div className="mt-6">
            <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-2">
              電子郵件 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="customerEmail"
                type="email"
                value={bookingData.customerEmail}
                onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                className={`
                  w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors
                  ${errors.customerEmail 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-brand-red-500'
                  }
                `}
                placeholder="your.email@example.com"
              />
            </div>
            {errors.customerEmail && (
              <p className="text-red-500 text-sm mt-2">{errors.customerEmail}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">預約確認信和課程相關資訊將發送到此信箱</p>
          </div>
        </div>

        {/* 備註欄位 */}
        <div>
          <label htmlFor="customerNote" className="block text-sm font-medium text-gray-700 mb-2">
            <MessageSquare className="inline w-4 h-4 mr-1" />
            備註事項
          </label>
          <textarea
            id="customerNote"
            value={bookingData.customerNote}
            onChange={(e) => handleInputChange('customerNote', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red-500 resize-none"
            placeholder="如有特殊需求、身體狀況需要注意的事項，或任何想詢問的問題，請在這裡告訴我們..."
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-1">
            <p className="text-gray-500 text-xs">選填，但建議填寫以便我們提供更好的服務</p>
            <span className="text-gray-400 text-xs">
              {bookingData.customerNote?.length || 0}/500
            </span>
          </div>
        </div>

        {/* 預約確認提醒 */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-3">預約確認流程</h4>
          <div className="space-y-2 text-gray-800 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</div>
              <p>提交預約後，系統會立即發送確認信到您的信箱</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</div>
              <p>專業顧問將在24小時內致電與您確認預約詳情</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</div>
              <p>確認後將發送詳細的課程資訊和注意事項</p>
            </div>
          </div>
        </div>

        {/* 課程預約特別提醒 */}
        {bookingData.courseCategory === 'group' && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              團體課程重要提醒
            </h4>
            <div className="text-gray-800 text-sm space-y-1">
              <p>• 團體課程為期2個月，需要完整參與</p>
              <p>• 請確保能配合所選時段的完整課程期間</p>
              <p>• 如需請假請提前通知，以便安排補課</p>
              <p>• 開課後無法退費，請謹慎選擇</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerInfo;