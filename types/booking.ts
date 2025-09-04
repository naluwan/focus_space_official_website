export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  category: 'personal' | 'group' | 'special';
  duration: number;
  price: number;
  maxParticipants?: number;
  instructor?: string;
  startDate: string;
  endDate: string;
  weekdays: number[];
  timeSlots: TimeSlot[];
  allowLateEnrollment?: boolean;
}

export interface BookingData {
  bookingType?: 'trial' | 'course';
  bookingNumber?: string;
  bookingId?: string;
  
  // 客戶基本資料
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerNote?: string;
  customerGender?: 'male' | 'female' | 'other';
  customerAge?: number;
  
  // 課程相關資料
  courseId?: string;
  courseName?: string;
  courseCategory?: 'personal' | 'group' | 'special';
  duration?: number;
  totalPrice?: number;
  participantCount?: number;
  courseStartDate?: string;
  courseEndDate?: string;
  courseWeekdays?: number[];
  courseTimeSlots?: TimeSlot[];
  allowLateEnrollment?: boolean;
  bookingDate?: string;
  startTime?: string;
  endTime?: string;
  courseRequirements?: string;
  courseFeatures?: string[];
  
  // 體驗預約相關資料
  hasExperience?: boolean;
  fitnessGoals?: string;
  preferredDate?: string;
  preferredTime?: string;
}

// 前端表單狀態使用的資料格式（包含必需屬性）
export interface BookingFormData {
  bookingType: 'trial' | 'course' | undefined;
  bookingNumber?: string;
  bookingId?: string;
  
  // 客戶基本資料
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerNote: string;
  customerGender: 'male' | 'female' | 'other' | undefined;
  customerAge: number;
  
  // 課程相關資料
  courseId: string;
  courseName: string;
  courseCategory: 'personal' | 'group' | 'special' | undefined;
  duration: number;
  totalPrice: number;
  participantCount: number;
  courseStartDate?: string;
  courseEndDate?: string;
  courseWeekdays?: number[];
  courseTimeSlots?: TimeSlot[];
  allowLateEnrollment?: boolean;
  bookingDate: string;
  startTime: string;
  endTime: string;
  courseRequirements?: string;
  courseFeatures?: string[];
  
  // 體驗預約專屬欄位
  hasExperience: boolean;
  fitnessGoals: string;
  preferredDate: string;
  preferredTime: string;
}

export interface BookingFormProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  bookingData: BookingFormData;
  setBookingData: (data: BookingFormData) => void;
}

export interface BookingComponentProps {
  bookingData: BookingFormData;
  setBookingData: (data: BookingFormData) => void;
  errors: BookingErrors;
}

export interface BookingErrors {
  [key: string]: string;
}