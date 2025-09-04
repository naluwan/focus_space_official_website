'use client';

import * as React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface TimePickerProps {
  time?: string
  onTimeChange?: (time: string) => void
  placeholder?: string
  className?: string
}

export const TimePicker = ({
  time,
  onTimeChange,
  placeholder = '選擇時間',
  className
}: TimePickerProps) => {
  const [selectedHour, setSelectedHour] = React.useState(
    time ? parseInt(time.split(':')[0]) : 9
  );
  const [selectedMinute, setSelectedMinute] = React.useState(
    time ? parseInt(time.split(':')[1]) : 0
  );

  // 常用時間選項
  const commonTimes = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
  ];

  const handleTimeSelect = (timeString: string) => {
    const [hour, minute] = timeString.split(':');
    setSelectedHour(parseInt(hour));
    setSelectedMinute(parseInt(minute));
    onTimeChange?.(timeString);
  };

  const formatTimeDisplay = (time: string) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const period = hourNum >= 12 ? '下午' : '上午';
    const displayHour = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
    return `${period} ${displayHour}:${minute}`;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal text-gray-900 hover:text-gray-900',
            !time && 'text-gray-600',
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4 text-gray-600" />
          {time ? (
            <span className="text-gray-900">{formatTimeDisplay(time)}</span>
          ) : (
            <span className="text-gray-600">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-3" align="start">
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-900 text-center">選擇時間</div>
          
          {/* 時間網格 */}
          <div className="grid grid-cols-4 gap-1 max-h-48 overflow-y-auto">
            {commonTimes.map((timeOption) => (
              <button
                key={timeOption}
                onClick={() => handleTimeSelect(timeOption)}
                className={cn(
                  'px-2 py-1.5 text-xs text-center border rounded hover:bg-gray-100 transition-colors',
                  time === timeOption 
                    ? 'bg-red-500 text-white border-red-500 hover:bg-red-600' 
                    : 'border-gray-200 text-gray-700'
                )}
              >
                {formatTimeDisplay(timeOption)}
              </button>
            ))}
          </div>

          {/* 自定義時間輸入 */}
          <div className="border-t pt-3">
            <div className="text-xs text-gray-600 mb-2">或輸入自定時間</div>
            <div className="flex items-center gap-1">
              <select
                value={selectedHour}
                onChange={(e) => {
                  const hour = parseInt(e.target.value);
                  setSelectedHour(hour);
                  const timeString = `${hour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
                  handleTimeSelect(timeString);
                }}
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded text-gray-900 bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>
                    {i.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
              <span className="text-gray-500 text-xs">:</span>
              <select
                value={selectedMinute}
                onChange={(e) => {
                  const minute = parseInt(e.target.value);
                  setSelectedMinute(minute);
                  const timeString = `${selectedHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                  handleTimeSelect(timeString);
                }}
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded text-gray-900 bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                {Array.from({ length: 12 }, (_, i) => i * 5).map(minute => (
                  <option key={minute} value={minute}>
                    {minute.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};