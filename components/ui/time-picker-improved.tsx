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

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i).filter(i => i % 5 === 0); // 5分鐘間隔

  const handleTimeSelect = (hour: number, minute: number) => {
    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    setSelectedHour(hour);
    setSelectedMinute(minute);
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
      <PopoverContent className="w-80 p-3" align="start">
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-900 text-center">選擇時間</div>
          
          <div className="grid grid-cols-2 gap-3">
            {/* 小時選擇 */}
            <div>
              <div className="text-xs text-gray-600 text-center mb-2">小時</div>
              <div className="h-32 overflow-y-auto border rounded-md bg-gray-50">
                {hours.map((hour) => (
                  <button
                    key={hour}
                    onClick={() => handleTimeSelect(hour, selectedMinute)}
                    className={cn(
                      'w-full px-2 py-1 text-xs text-center hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-b-0',
                      selectedHour === hour && 'bg-red-100 text-red-700 font-medium'
                    )}
                  >
                    {hour.toString().padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>

            {/* 分鐘選擇 */}
            <div>
              <div className="text-xs text-gray-600 text-center mb-2">分鐘</div>
              <div className="h-32 overflow-y-auto border rounded-md bg-gray-50">
                {minutes.map((minute) => (
                  <button
                    key={minute}
                    onClick={() => handleTimeSelect(selectedHour, minute)}
                    className={cn(
                      'w-full px-2 py-1 text-xs text-center hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-b-0',
                      selectedMinute === minute && 'bg-red-100 text-red-700 font-medium'
                    )}
                  >
                    {minute.toString().padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 快速選擇時間 */}
          <div className="border-t pt-2">
            <div className="text-xs text-gray-600 mb-2">常用時間</div>
            <div className="grid grid-cols-2 gap-1">
              {[
                { label: '上午 9:00', value: '09:00' },
                { label: '下午 1:00', value: '13:00' },
                { label: '下午 6:00', value: '18:00' },
                { label: '晚上 8:00', value: '20:00' },
              ].map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => {
                    const [hour, minute] = preset.value.split(':');
                    handleTimeSelect(parseInt(hour), parseInt(minute));
                  }}
                  className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};