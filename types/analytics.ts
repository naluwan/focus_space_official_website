// 分析報告資料類型定義

// 預約狀態統計
export interface BookingStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  noShow: number;
}

// 日期範圍預約統計
export interface BookingTrend {
  date: string;
  count: number;
  type: 'trial' | 'course';
}

// 預約類型分布
export interface BookingTypeDistribution {
  trial: number;
  course: number;
}

// 課程表現資料
export interface CoursePerformance {
  courseId: string;
  courseName: string;
  category: 'personal' | 'group' | 'special';
  bookingCount: number;
  revenue: number;
  completionRate: number;
}

// 熱門課程
export interface PopularCourse {
  courseId: string;
  courseName: string;
  bookingCount: number;
  revenue: number;
}

// 時段熱力圖資料
export interface TimeSlotHeatmap {
  weekday: number; // 0-6 (星期日到星期六)
  hour: number; // 0-23
  count: number;
}

// 今日統計
export interface TodayStats {
  bookings: number;
  revenue: number;
  newCustomers: number;
}

// 本月統計
export interface MonthlyStats {
  bookings: number;
  revenue: number;
  completionRate: number;
  averageOccupancyRate: number;
}

// 預約狀態分布
export interface BookingStatusDistribution {
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  noShow: number;
}

// 課程類別分布
export interface CourseCategoryDistribution {
  personal: number;
  group: number;
  special: number;
}

// 完整的分析資料回應
export interface AnalyticsResponse {
  // 基礎統計
  todayStats: TodayStats;
  monthlyStats: MonthlyStats;
  
  // 預約分析
  bookingStats: BookingStats;
  bookingTrend: BookingTrend[];
  bookingStatusDistribution: BookingStatusDistribution;
  bookingTypeDistribution: BookingTypeDistribution;
  
  // 課程分析
  coursePerformance: CoursePerformance[];
  popularCourses: PopularCourse[];
  courseCategoryDistribution: CourseCategoryDistribution;
  timeSlotHeatmap: TimeSlotHeatmap[];
}

// API 請求參數
export interface AnalyticsQuery {
  startDate?: string;
  endDate?: string;
  period?: 'day' | 'week' | 'month' | 'year';
}

// 圖表資料格式（用於 Recharts）
export interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}