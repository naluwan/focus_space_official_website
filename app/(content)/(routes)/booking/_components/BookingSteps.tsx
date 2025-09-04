'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Step {
  number: number;
  title: string;
  icon: LucideIcon;
}

interface BookingStepsProps {
  steps: Step[];
  currentStep: number;
}

const BookingSteps: React.FC<BookingStepsProps> = ({ steps, currentStep }) => {
  return (
    <div className='flex justify-center items-center'>
      <div className='flex items-center space-x-4 md:space-x-8'>
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.number === currentStep;
          const isCompleted = step.number < currentStep;
          
          return (
            <React.Fragment key={step.number}>
              <div className='flex flex-col items-center'>
                <div
                  className={`
                    w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center
                    transition-all duration-300 transform
                    ${isActive 
                      ? 'bg_brand_gradient text-white scale-110 shadow-lg' 
                      : isCompleted 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }
                  `}
                >
                  <Icon className='w-6 h-6 md:w-8 md:h-8' />
                </div>
                <span className={`
                  mt-2 text-sm md:text-base font-semibold
                  ${isActive ? 'text_brand_gradient' : isCompleted ? 'text-green-500' : 'text-gray-500'}
                `}>
                  {step.title}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div className={`
                  w-12 md:w-24 h-1 rounded-full transition-all duration-300
                  ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                `} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default BookingSteps;