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
  const minutes = [0, 15, 30, 45];

  const handleTimeSelect = (hour: number, minute: number) => {
    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    setSelectedHour(hour);
    setSelectedMinute(minute);
    onTimeChange?.(timeString);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !time && 'text-muted-foreground',
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {time ? time : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="flex">
          <div className="max-h-48 overflow-y-auto">
            <div className="p-2 border-r">
              <div className="text-sm font-medium text-center mb-2">時</div>
              {hours.map((hour) => (
                <button
                  key={hour}
                  onClick={() => handleTimeSelect(hour, selectedMinute)}
                  className={cn(
                    'w-full px-3 py-1 text-sm hover:bg-gray-100 rounded',
                    selectedHour === hour && 'bg-red-100 text-red-700'
                  )}
                >
                  {hour.toString().padStart(2, '0')}
                </button>
              ))}
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            <div className="p-2">
              <div className="text-sm font-medium text-center mb-2">分</div>
              {minutes.map((minute) => (
                <button
                  key={minute}
                  onClick={() => handleTimeSelect(selectedHour, minute)}
                  className={cn(
                    'w-full px-3 py-1 text-sm hover:bg-gray-100 rounded',
                    selectedMinute === minute && 'bg-red-100 text-red-700'
                  )}
                >
                  {minute.toString().padStart(2, '0')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};