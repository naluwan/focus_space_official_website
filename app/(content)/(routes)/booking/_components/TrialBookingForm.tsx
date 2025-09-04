'use client';

import React, { useState } from 'react';
import { User, Activity, Clock } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';

import type { BookingComponentProps } from '@/types/booking';

interface TrialBookingComponentProps extends BookingComponentProps {}

const TrialBookingForm: React.FC<TrialBookingComponentProps> = ({
  bookingData,
  setBookingData,
  errors,
}) => {
  
  const [selectedPreferredDate, setSelectedPreferredDate] = useState<Date | undefined>();
  
  const handleInputChange = (field: string, value: string | number | boolean) => {
    setBookingData({
      ...bookingData,
      [field]: value
    });
  };
  
  const handlePreferredDateChange = (date: Date | undefined) => {
    setSelectedPreferredDate(date);
    if (date) {
      const formattedDate = date.toLocaleDateString('zh-TW');
      setBookingData({
        ...bookingData,
        preferredDate: formattedDate
      });
    }
  };

  const experienceOptions = [
    { value: true, label: '有健身經驗' },
    { value: false, label: '完全新手' }
  ];

  const timePreferences = [
    '早上 (07:00-12:00)',
    '下午 (12:00-18:00)', 
    '晚上 (18:00-23:00)',
    '配合教練時間'
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">填寫體驗預約資料</h2>
      <p className="text-gray-600 mb-8">請詳細填寫資料，幫助教練為您提供更好的服務</p>
      
      <div className="space-y-6">
        {/* 基本資料區塊 */}
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
            <User className="w-5 h-5 text-brand-red-500" />
            基本資料
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            {/* 姓名 */}
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-900 mb-1">
                姓名 <span className="text-red-500">*</span>
              </label>
              <input
                id="customerName"
                type="text"
                value={bookingData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                className={`
                  w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2
                  ${errors.customerName 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-brand-red-500'
                  }
                `}
                placeholder="請輸入您的姓名"
              />
              {errors.customerName && (
                <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
              )}
            </div>
            
            {/* 性別 */}
            <div>
              <label htmlFor="customerGender" className="block text-sm font-medium text-gray-900 mb-1">
                性別
              </label>
              <select
                id="customerGender"
                value={bookingData.customerGender}
                onChange={(e) => handleInputChange('customerGender', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red-500"
              >
                <option value="">請選擇</option>
                <option value="male">男性</option>
                <option value="female">女性</option>
                <option value="other">其他</option>
              </select>
            </div>
            
            {/* 年齡 */}
            <div>
              <label htmlFor="customerAge" className="block text-sm font-medium text-gray-900 mb-1">
                年齡
              </label>
              <input
                id="customerAge"
                type="number"
                min="10"
                max="100"
                value={bookingData.customerAge}
                onChange={(e) => handleInputChange('customerAge', parseInt(e.target.value) || '')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red-500"
                placeholder="請輸入年齡"
              />
            </div>
            
            {/* 電話 */}
            <div>
              <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-900 mb-1">
                電話 <span className="text-red-500">*</span>
              </label>
              <input
                id="customerPhone"
                type="tel"
                value={bookingData.customerPhone}
                onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                className={`
                  w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2
                  ${errors.customerPhone 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-brand-red-500'
                  }
                `}
                placeholder="09xxxxxxxx"
              />
              {errors.customerPhone && (
                <p className="text-red-500 text-sm mt-1">{errors.customerPhone}</p>
              )}
            </div>
          </div>
          
          {/* 電子郵件 */}
          <div className="mt-4">
            <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-900 mb-1">
              電子郵件 <span className="text-red-500">*</span>
            </label>
            <input
              id="customerEmail"
              type="email"
              value={bookingData.customerEmail}
              onChange={(e) => handleInputChange('customerEmail', e.target.value)}
              className={`
                w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2
                ${errors.customerEmail 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-brand-red-500'
                }
              `}
              placeholder="your@email.com"
            />
            {errors.customerEmail && (
              <p className="text-red-500 text-sm mt-1">{errors.customerEmail}</p>
            )}
          </div>
        </div>

        {/* 健身背景區塊 */}
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
            <Activity className="w-5 h-5 text-brand-red-500" />
            健身背景
          </h3>
          
          {/* 健身經驗 */}
          <fieldset className="mb-4">
            <legend className="block text-sm font-medium text-gray-900 mb-2">
              健身經驗
            </legend>
            <div className="flex gap-4">
              {experienceOptions.map((option) => (
                <label key={option.value.toString()} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="hasExperience"
                    checked={bookingData.hasExperience === option.value}
                    onChange={() => handleInputChange('hasExperience', option.value)}
                    className="mr-2 text-brand-red-500 focus:ring-brand-red-500"
                  />
                  <span className="text-gray-900">{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          
          {/* 健身目標 */}
          <div>
            <label htmlFor="fitnessGoals" className="block text-sm font-medium text-gray-900 mb-1">
              健身目標
            </label>
            <textarea
              id="fitnessGoals"
              value={bookingData.fitnessGoals}
              onChange={(e) => handleInputChange('fitnessGoals', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red-500"
              placeholder="例如：減重、增肌、體態改善、健康維持等..."
            />
          </div>
        </div>

        {/* 偏好時間區塊 */}
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
            <Clock className="w-5 h-5 text-brand-red-500" />
            偏好時間
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            {/* 偏好日期 */}
            <div>
              <div className="block text-sm font-medium text-gray-900 mb-1">
                希望預約日期
              </div>
              <DatePicker
                date={selectedPreferredDate}
                onDateChange={handlePreferredDateChange}
                placeholder="請選擇您希望的預約日期"
              />
            </div>
            
            {/* 偏好時段 */}
            <div>
              <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-900 mb-1">
                偏好時段
              </label>
              <select
                id="preferredTime"
                value={bookingData.preferredTime}
                onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red-500"
              >
                <option value="">請選擇時段</option>
                {timePreferences.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 備註區塊 */}
        <div>
          <label htmlFor="customerNote" className="block text-sm font-medium text-gray-900 mb-2">
            其他備註
          </label>
          <textarea
            id="customerNote"
            value={bookingData.customerNote}
            onChange={(e) => handleInputChange('customerNote', e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red-500"
            placeholder="任何特殊需求或想了解的資訊..."
          />
        </div>
      </div>
    </div>
  );
};

export default TrialBookingForm;