'use client';

import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: {
    value: number;
    isPositive: boolean;
  };
  bgColor?: string;
  iconBgColor?: string;
  iconColor?: string;
}

const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  change,
  bgColor = 'bg-white',
  iconBgColor = 'bg-red-100',
  iconColor = 'text-red-600'
}: StatsCardProps) => {
  return (
    <div className={`${bgColor} rounded-lg shadow-sm border border-gray-200 p-6`}>
      <div className='flex items-center justify-between'>
        <div className='flex-1'>
          <p className='text-sm text-gray-600 mb-1'>{title}</p>
          <p className='text-2xl font-bold text-gray-900'>{value}</p>
          {change && (
            <div className='flex items-center mt-2'>
              <span className={`text-sm font-medium ${
                change.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {change.isPositive ? '+' : ''}{change.value}%
              </span>
              <span className='text-xs text-gray-500 ml-1'>vs 上月</span>
            </div>
          )}
        </div>
        <div className={`${iconBgColor} p-3 rounded-lg`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;