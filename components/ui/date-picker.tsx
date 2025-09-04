'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { zhTW } from 'date-fns/locale';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DatePickerProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
}

export const DatePicker = ({
  date,
  onDateChange,
  placeholder = '選擇日期',
  className
}: DatePickerProps) => {
  const [currentDate, setCurrentDate] = React.useState(date || new Date());
  const [viewMode, setViewMode] = React.useState<'days' | 'years'>('days');

  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ];

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];

    // 上個月的日期
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);
    
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: daysInPrevMonth - i,
        isCurrentMonth: false,
        isToday: false,
        fullDate: new Date(prevYear, prevMonth, daysInPrevMonth - i)
      });
    }

    // 當月的日期
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const fullDate = new Date(currentYear, currentMonth, day);
      days.push({
        date: day,
        isCurrentMonth: true,
        isToday: today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear,
        fullDate
      });
    }

    // 下個月的日期
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    const totalCells = 42; // 6 weeks * 7 days
    const remainingCells = totalCells - days.length;
    
    for (let day = 1; day <= remainingCells; day++) {
      days.push({
        date: day,
        isCurrentMonth: false,
        isToday: false,
        fullDate: new Date(nextYear, nextMonth, day)
      });
    }

    return days;
  };

  const generateYears = () => {
    const years = [];
    const startYear = currentYear - (currentYear % 10);
    for (let i = 0; i < 12; i++) {
      years.push(startYear + i);
    }
    return years;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentMonth - 1);
    } else {
      newDate.setMonth(currentMonth + 1);
    }
    setCurrentDate(newDate);
  };

  const navigateYear = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setFullYear(currentYear - 12);
    } else {
      newDate.setFullYear(currentYear + 12);
    }
    setCurrentDate(newDate);
  };

  const selectDate = (fullDate: Date) => {
    onDateChange?.(fullDate);
  };

  const selectYear = (year: number) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    setCurrentDate(newDate);
    setViewMode('days');
  };

  const isSelected = (fullDate: Date) => {
    return date && 
           date.getDate() === fullDate.getDate() &&
           date.getMonth() === fullDate.getMonth() &&
           date.getFullYear() === fullDate.getFullYear();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal text-gray-900 hover:text-gray-900',
            !date && 'text-gray-600',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-gray-600" />
          {date ? (
            <span className="text-gray-900">
              {format(date, 'yyyy/MM/dd', { locale: zhTW })}
            </span>
          ) : (
            <span className="text-gray-600">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="bg-white text-gray-900 border border-gray-200 rounded-lg p-4 min-w-[280px] shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => viewMode === 'days' ? navigateMonth('prev') : navigateYear('prev')}
              className="h-8 w-8 p-0 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => setViewMode(viewMode === 'days' ? 'years' : 'days')}
              className="text-gray-900 hover:bg-gray-100 font-medium px-3 py-1 rounded-md transition-colors"
            >
              {viewMode === 'days' 
                ? `${monthNames[currentMonth]} ${currentYear}`
                : `${Math.floor(currentYear / 10) * 10} - ${Math.floor(currentYear / 10) * 10 + 11}`
              }
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => viewMode === 'days' ? navigateMonth('next') : navigateYear('next')}
              className="h-8 w-8 p-0 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {viewMode === 'days' ? (
            <>
              {/* Week headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-600 p-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-1">
                {generateCalendarDays().map((day, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => selectDate(day.fullDate)}
                    className={cn(
                      'h-8 w-8 p-0 text-sm font-normal text-gray-900 hover:bg-gray-100 rounded-md transition-colors',
                      !day.isCurrentMonth && 'text-gray-400',
                      day.isToday && 'bg-gray-100 font-medium ring-1 ring-gray-300',
                      isSelected(day.fullDate) && 'bg-red-500 text-white hover:bg-red-600'
                    )}
                  >
                    {day.date}
                  </Button>
                ))}
              </div>
            </>
          ) : (
            /* Year selection */
            <div className="grid grid-cols-4 gap-2">
              {generateYears().map(year => (
                <Button
                  key={year}
                  variant="ghost"
                  onClick={() => selectYear(year)}
                  className={cn(
                    'h-10 text-sm font-normal text-gray-900 hover:bg-gray-100 rounded-md transition-colors',
                    year === currentYear && 'bg-red-500 text-white hover:bg-red-600'
                  )}
                >
                  {year}
                </Button>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};