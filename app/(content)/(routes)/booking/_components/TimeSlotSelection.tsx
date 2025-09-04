'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';

import type { BookingComponentProps } from '@/types/booking';

interface TimeSlotSelectionProps extends BookingComponentProps {}

const TimeSlotSelection: React.FC<TimeSlotSelectionProps> = ({
  bookingData,
  setBookingData,
  errors,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [availableSlots, setAvailableSlots] = useState<Array<{ startTime: string; endTime: string; available: boolean }>>([]);
  const [loading, setLoading] = useState(false);

  // 輔助函數
  const weekdayToString = (weekday: number): string => {
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    return weekdays[weekday] || '未知';
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatTimeSlot = (timeSlot: { startTime: string; endTime: string }): string => {
    return `${timeSlot.startTime} - ${timeSlot.endTime}`;
  };

  // 檢查是否為團體課程
  const isGroupCourse = bookingData.courseCategory === 'group';


  const checkAvailableSlots = useCallback(async () => {
    const timeSlots = [
      { startTime: '07:00', endTime: '08:00', available: true },
      { startTime: '08:00', endTime: '09:00', available: true },
      { startTime: '09:00', endTime: '10:00', available: true },
      { startTime: '10:00', endTime: '11:00', available: true },
      { startTime: '11:00', endTime: '12:00', available: true },
      { startTime: '13:00', endTime: '14:00', available: true },
      { startTime: '14:00', endTime: '15:00', available: true },
      { startTime: '15:00', endTime: '16:00', available: true },
      { startTime: '16:00', endTime: '17:00', available: true },
      { startTime: '17:00', endTime: '18:00', available: true },
      { startTime: '18:00', endTime: '19:00', available: true },
      { startTime: '19:00', endTime: '20:00', available: true },
      { startTime: '20:00', endTime: '21:00', available: true },
      { startTime: '21:00', endTime: '22:00', available: true },
      { startTime: '22:00', endTime: '23:00', available: false }
    ];
    
    setLoading(true);
    try {
      // 這裡應該要呼叫 API 檢查實際可用時段
      // 現在先使用假資料
      setTimeout(() => {
        setAvailableSlots(timeSlots);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to check slots:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDate) {
      checkAvailableSlots();
    }
  }, [selectedDate, checkAvailableSlots]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setBookingData({
        ...bookingData,
        bookingDate: date.toISOString(),
        startTime: '',
        endTime: ''
      });
    }
  };

  const handleTimeSelect = (slot: { startTime: string; endTime: string; available: boolean }) => {
    if (!slot.available) return;
    
    setBookingData({
      ...bookingData,
      startTime: slot.startTime,
      endTime: slot.endTime
    });
  };

  const handleParticipantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value) || 1;
    const basePrice = (bookingData.totalPrice || 0) / (bookingData.participantCount || 1);
    setBookingData({
      ...bookingData,
      participantCount: count,
      totalPrice: basePrice * count
    });
  };

  const isSlotSelected = (slot: { startTime: string; endTime: string }) => {
    return bookingData.startTime === slot.startTime && bookingData.endTime === slot.endTime;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isGroupCourse ? '課程時間資訊' : '選擇預約時間'}
      </h2>
      
      {/* 團體課程：顯示固定時間資訊 */}
      {isGroupCourse && bookingData.courseStartDate && (
        <div className="mb-8 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg_brand_gradient rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-4">團體課程 - 固定時間</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-800">
                      <strong>課程期間：</strong>
                      {bookingData.courseStartDate ? formatDate(bookingData.courseStartDate) : ''} ~ {bookingData.courseEndDate ? formatDate(bookingData.courseEndDate) : ''}
                    </span>
                  </div>
                  
                  {bookingData.courseWeekdays && bookingData.courseWeekdays.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-800">
                        <strong>上課星期：</strong>
                        每{bookingData.courseWeekdays.sort().map((day: number) => weekdayToString(day)).join('、')}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  {bookingData.courseTimeSlots && bookingData.courseTimeSlots.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-800">
                        <strong>上課時間：</strong>
                        {bookingData.courseTimeSlots.map((slot: { startTime: string; endTime: string }) => formatTimeSlot(slot)).join('、')}
                      </span>
                    </div>
                  )}
                  
                  {bookingData.duration && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-800">
                        <strong>每堂時長：</strong>{bookingData.duration}分鐘
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* 根據是否允許插班顯示不同的提示 */}
              {bookingData.allowLateEnrollment ? (
                <div className="mt-4 p-3 bg-white rounded-lg border border-orange-200">
                  <p className="text-gray-800 text-sm">
                    <strong>插班說明：</strong>此課程允許插班加入。您將從下次上課開始參與，
                    費用會根據剩餘課程數調整。請聯繫我們確認詳細資訊。
                  </p>
                </div>
              ) : (
                <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
                  <p className="text-gray-800 text-sm">
                    <strong>注意事項：</strong>團體課程為固定時間，無需額外選擇日期時段。
                    請準時參加每週的固定課程時間。
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* 個人課程：原有的日期時間選擇 */}
      {!isGroupCourse && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* 左側：日期選擇 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-red-500" />
              選擇日期
            </h3>
            
            <div className="bg-gray-50 p-4 rounded-xl">
              <DatePicker
                date={selectedDate}
                onDateChange={handleDateSelect}
                placeholder="請選擇預約日期"
              />
            </div>
            
            {errors.date && (
              <p className="text-red-500 text-sm mt-2">{errors.date}</p>
            )}
          </div>

          {/* 右側：時段選擇 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-red-500" />
              選擇時段
            </h3>
            
            {!selectedDate ? (
              <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-500">
                請先選擇日期
              </div>
            ) : loading ? (
              <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-500">
                載入可用時段...
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 max-h-96 overflow-y-auto pr-2">
                {availableSlots.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => handleTimeSelect(slot)}
                    disabled={!slot.available}
                    className={`
                      p-3 rounded-lg text-sm font-semibold transition-all duration-200
                      ${isSlotSelected(slot)
                        ? 'bg_brand_gradient text-white shadow-lg scale-105'
                        : slot.available
                          ? 'bg-white border border-gray-200 text-gray-700 hover:border-brand-red-500 hover:bg-brand-red-50'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }
                    `}
                  >
                    <div>{slot.startTime}</div>
                    <div className="text-xs opacity-75">-</div>
                    <div>{slot.endTime}</div>
                  </button>
                ))}
              </div>
            )}
            
            {errors.time && (
              <p className="text-red-500 text-sm mt-2">{errors.time}</p>
            )}
          </div>
        </div>
      )}
      
      {/* 參與人數選擇 (所有課程類型都需要) */}
      <div className="mt-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Users className="w-5 h-5 text-brand-red-500" />
          參與人數
        </h3>
        
        <div className="flex items-center gap-4">
          <input
            type="number"
            min="1"
            max={bookingData.courseCategory === 'group' ? '10' : '1'}
            value={bookingData.participantCount || 1}
            onChange={handleParticipantChange}
            className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red-500"
          />
          <span className="text-gray-600">人</span>
        </div>
        
        {bookingData.courseCategory === 'personal' && (bookingData.participantCount || 1) > 1 && (
          <p className="text-orange-500 text-sm mt-2 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            個人課程建議1對1教學
          </p>
        )}
      </div>

      {/* 費用顯示 (所有課程類型都需要) */}
      <div className="mt-6 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-900">預估費用</span>
          <span className="text-2xl font-bold text-brand-red-600">
            NT$ {bookingData.totalPrice || 0}
          </span>
        </div>
        {isGroupCourse && (
          <p className="text-sm text-gray-600 mt-2">
            * 團體課程費用為整個課程期間的總費用
          </p>
        )}
      </div>

      {/* 已選擇資訊摘要 - 只對個人課程顯示 */}
      {!isGroupCourse && bookingData.bookingDate && bookingData.startTime && (
        <div className="mt-6 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
          <p className="text-gray-800 font-semibold">
            已選擇：{new Date(bookingData.bookingDate).toLocaleDateString('zh-TW')} {bookingData.startTime} - {bookingData.endTime}
          </p>
        </div>
      )}
    </div>
  );
};

export default TimeSlotSelection;