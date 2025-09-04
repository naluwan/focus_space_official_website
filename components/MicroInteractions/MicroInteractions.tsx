'use client';
import React, { useState, useEffect } from 'react';
import { Loader2, ArrowRight } from 'lucide-react';

// 按鈕載入狀態 Hook
export const useButtonLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  return { isLoading, startLoading, stopLoading };
};

// 可重用的載入動畫組件
export const LoadingSpinner: React.FC<{ 
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5', 
    lg: 'w-6 h-6'
  };

  return (
    <Loader2 
      className={`animate-spin ${sizeClasses[size]} ${className}`}
    />
  );
};

// 微互動按鈕組件
export const MicroButton: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  withIcon?: boolean;
  sparkle?: boolean;
}> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  withIcon = false,
  sparkle = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const baseClasses = `
    relative overflow-hidden font-semibold transition-all duration-300 ease-out
    transform-gpu will-change-transform
    focus:outline-none focus:ring-4 focus:ring-brand-red-500/20
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    group inline-flex items-center justify-center gap-2
  `;

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-xl', 
    lg: 'px-8 py-4 text-lg rounded-2xl'
  };

  const variantClasses = {
    primary: `
      bg_brand_gradient text-white shadow-lg
      hover:shadow-2xl hover:shadow-brand-red-500/25
      hover:-translate-y-1 hover:scale-105
      active:translate-y-0 active:scale-100
    `,
    secondary: `
      bg-white text-brand-red-600 border-2 border-brand-red-500 shadow-md
      hover:bg_brand_gradient hover:text-white hover:border-brand-red-600
      hover:shadow-xl hover:-translate-y-1
      active:translate-y-0
    `,
    outline: `
      bg-transparent text-brand-red-600 border-2 border-brand-red-500
      hover:bg-brand-red-50 hover:border-brand-red-600 hover:text-brand-red-900
      hover:-translate-y-0.5 hover:shadow-md
      active:translate-y-0
    `,
    ghost: `
      bg-transparent text-gray-700 
      hover:bg-gray-100 hover:text-brand-red-600
      hover:-translate-y-0.5
      active:translate-y-0
    `
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
  };
  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);

  return (
    <button
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled || loading}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {/* 背景亮片效果 */}
      {sparkle && (
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`
                absolute w-1 h-1 bg-white/40 rounded-full
                ${isHovered ? 'animate-pulse' : ''}
              `}
              style={{
                top: `${20 + i * 30}%`,
                left: `${10 + i * 25}%`,
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* 載入狀態 */}
      {loading && (
        <LoadingSpinner size={size === 'lg' ? 'md' : 'sm'} />
      )}

      {/* 按鈕內容 */}
      <span className={`
        transition-all duration-200 
        ${loading ? 'opacity-50' : 'opacity-100'}
        ${isPressed ? 'scale-95' : 'scale-100'}
      `}>
        {children}
      </span>

      {/* 箭頭圖標 */}
      {withIcon && !loading && (
        <ArrowRight className={`
          w-4 h-4 transition-transform duration-300
          ${isHovered ? 'translate-x-1' : 'translate-x-0'}
        `} />
      )}

      {/* Hover 光效 */}
      <div className={`
        absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
        transform -skew-x-12 -translate-x-full
        ${isHovered ? 'animate-shimmer' : ''}
      `} />
    </button>
  );
};

// 卡片組件微互動
export const MicroCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}> = ({ children, className = '', hoverable = true, clickable = false, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseClasses = `
    transition-all duration-300 ease-out transform-gpu will-change-transform
    ${hoverable ? 'hover:-translate-y-2 hover:shadow-2xl' : ''}
    ${clickable ? 'cursor-pointer hover:scale-[1.02]' : ''}
  `;

  return (
    <div
      className={`${baseClasses} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={clickable ? onClick : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={clickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.();
        }
      } : undefined}
    >
      {children}
      
      {/* 邊框光效 */}
      {hoverable && (
        <div className={`
          absolute inset-0 rounded-inherit border border-brand-red-500/20
          transition-opacity duration-300
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `} />
      )}
    </div>
  );
};

// 輸入框微互動
export const MicroInput: React.FC<{
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  icon?: React.ReactNode;
  error?: boolean;
}> = ({ type = 'text', placeholder, value, onChange, className = '', icon, error = false }) => {
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    // Update focus state based on value
  }, [value]);

  return (
    <div className="relative">
      {/* 圖標 */}
      {icon && (
        <div className={`
          absolute left-3 top-1/2 transform -translate-y-1/2 z-10
          transition-colors duration-200
          ${isFocused ? 'text-brand-red-500' : 'text-gray-400'}
        `}>
          {icon}
        </div>
      )}

      {/* 輸入框 */}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          w-full px-4 py-3 border-2 rounded-xl
          transition-all duration-300 ease-out
          focus:outline-none transform-gpu will-change-transform
          ${icon ? 'pl-11' : 'pl-4'}
          ${error 
            ? 'border-red-500 focus:border-red-600 focus:ring-red-500/20' 
            : isFocused 
              ? 'border-brand-red-500 focus:ring-brand-red-500/20 shadow-lg' 
              : 'border-gray-300 hover:border-gray-400'
          }
          ${isFocused ? 'scale-[1.02] shadow-xl' : 'scale-100'}
          focus:ring-4
          ${className}
        `}
      />

      {/* 底部裝飾線 */}
      <div className={`
        absolute bottom-0 left-1/2 transform -translate-x-1/2
        h-0.5 bg_brand_gradient rounded-full
        transition-all duration-300 ease-out
        ${isFocused ? 'w-full opacity-100' : 'w-0 opacity-0'}
      `} />
    </div>
  );
};

// 載入骨架屏組件
export const SkeletonLoader: React.FC<{
  width?: string;
  height?: string;
  className?: string;
  rounded?: boolean;
}> = ({ width = '100%', height = '20px', className = '', rounded = false }) => {
  return (
    <div 
      className={`
        animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200
        ${rounded ? 'rounded-full' : 'rounded-lg'}
        ${className}
      `}
      style={{ width, height }}
    />
  );
};

// Tooltip 組件
export const Tooltip: React.FC<{
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}> = ({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          setIsVisible(!isVisible);
        }
      }}
    >
      {children}
      
      {/* Tooltip 內容 */}
      <div className={`
        absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg
        transition-all duration-200 ease-out transform-gpu
        ${positionClasses[position]}
        ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
      `}>
        {content}
        
        {/* 箭頭 */}
        <div className={`
          absolute w-2 h-2 bg-gray-900 transform rotate-45
          ${position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -translate-y-1/2' : ''}
          ${position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 translate-y-1/2' : ''}
          ${position === 'left' ? 'left-full top-1/2 -translate-x-1/2 -translate-y-1/2' : ''}
          ${position === 'right' ? 'right-full top-1/2 translate-x-1/2 -translate-y-1/2' : ''}
        `} />
      </div>
    </div>
  );
};

// 導出所有組件供使用
const MicroInteractions = {
  MicroButton,
  MicroCard,
  MicroInput,
  LoadingSpinner,
  SkeletonLoader,
  Tooltip,
  useButtonLoading
};

export default MicroInteractions;