import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Booking, { BookingStatus, BookingType } from '@/models/Booking';
import {
  AnalyticsResponse,
  BookingTrend,
  CoursePerformance,
  PopularCourse,
  TimeSlotHeatmap,
} from '@/types/analytics';

export async function GET(request: NextRequest) {
  try {
    // 驗證管理員權限
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || (session.user.role !== 'admin' && session.user.role !== 'superadmin')) {
      return NextResponse.json(
        { success: false, message: '未授權的請求' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // 取得查詢參數
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // 預設30天
    
    // 計算日期範圍
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));
    startDate.setHours(0, 0, 0, 0);
    
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    // 1. 取得今日統計
    const todayBookings = await Booking.countDocuments({
      createdAt: { $gte: todayStart, $lte: endDate }
    });
    
    const todayRevenue = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: todayStart, $lte: endDate },
          status: { $in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED] }
        }
      },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    // 2. 取得本月統計
    const monthlyBookings = await Booking.countDocuments({
      createdAt: { $gte: monthStart, $lte: endDate }
    });
    
    const monthlyRevenue = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: monthStart, $lte: endDate },
          status: { $in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED] }
        }
      },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    
    const monthlyCompleted = await Booking.countDocuments({
      createdAt: { $gte: monthStart, $lte: endDate },
      status: BookingStatus.COMPLETED
    });

    // 3. 預約狀態統計
    const bookingStats = await Booking.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // 4. 預約趨勢（按天）
    const bookingTrend = await Booking.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            type: '$bookingType'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    // 5. 預約類型分布
    const bookingTypeDistribution = await Booking.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: '$bookingType',
          count: { $sum: 1 }
        }
      }
    ]);

    // 6. 課程表現
    const coursePerformance = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          bookingType: BookingType.COURSE
        }
      },
      {
        $group: {
          _id: '$courseId',
          courseName: { $first: '$courseName' },
          category: { $first: '$courseCategory' },
          bookingCount: { $sum: 1 },
          revenue: { $sum: '$totalPrice' },
          completed: {
            $sum: {
              $cond: [{ $eq: ['$status', BookingStatus.COMPLETED] }, 1, 0]
            }
          }
        }
      },
      {
        $addFields: {
          completionRate: {
            $cond: [
              { $eq: ['$bookingCount', 0] },
              0,
              { $multiply: [{ $divide: ['$completed', '$bookingCount'] }, 100] }
            ]
          }
        }
      },
      { $sort: { bookingCount: -1 } }
    ]);

    // 7. 熱門課程 TOP 3
    const popularCourses = coursePerformance.slice(0, 3).map((course: {
      _id: string;
      courseName: string;
      bookingCount: number;
      revenue: number;
    }) => ({
      courseId: course._id,
      courseName: course.courseName,
      bookingCount: course.bookingCount,
      revenue: course.revenue
    }));

    // 8. 課程類別分布
    const courseCategoryDistribution = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          bookingType: BookingType.COURSE
        }
      },
      {
        $group: {
          _id: '$courseCategory',
          count: { $sum: 1 }
        }
      }
    ]);

    // 9. 時段熱力圖
    const timeSlotHeatmap = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          bookingType: BookingType.COURSE,
          bookingDate: { $exists: true }
        }
      },
      {
        $addFields: {
          weekday: { $dayOfWeek: '$bookingDate' },
          hourNum: {
            $toInt: { $substr: ['$startTime', 0, 2] }
          }
        }
      },
      {
        $group: {
          _id: {
            weekday: '$weekday',
            hour: '$hourNum'
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          weekday: { $subtract: ['$_id.weekday', 1] }, // 轉換為 0-6
          hour: '$_id.hour',
          count: 1
        }
      },
      { $sort: { weekday: 1, hour: 1 } }
    ]);

    // 整理資料格式
    const processedBookingStats = {
      total: 0,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
      noShow: 0
    };

    bookingStats.forEach((stat: { _id: string; count: number }) => {
      processedBookingStats.total += stat.count;
      switch (stat._id) {
        case BookingStatus.PENDING:
          processedBookingStats.pending = stat.count;
          break;
        case BookingStatus.CONFIRMED:
          processedBookingStats.confirmed = stat.count;
          break;
        case BookingStatus.COMPLETED:
          processedBookingStats.completed = stat.count;
          break;
        case BookingStatus.CANCELLED:
          processedBookingStats.cancelled = stat.count;
          break;
        case BookingStatus.NO_SHOW:
          processedBookingStats.noShow = stat.count;
          break;
      }
    });

    // 處理預約趨勢資料
    const processedBookingTrend: BookingTrend[] = bookingTrend.map(
      (item: { _id: { date: string; type: string }; count: number }) => ({
        date: item._id.date,
        count: item.count,
        type: item._id.type as 'trial' | 'course'
      })
    );

    // 處理預約類型分布
    const processedTypeDistribution = {
      trial: 0,
      course: 0
    };

    bookingTypeDistribution.forEach((item: { _id: string; count: number }) => {
      if (item._id === BookingType.TRIAL) {
        processedTypeDistribution.trial = item.count;
      } else if (item._id === BookingType.COURSE) {
        processedTypeDistribution.course = item.count;
      }
    });

    // 處理課程類別分布
    const processedCategoryDistribution = {
      personal: 0,
      group: 0,
      special: 0
    };

    courseCategoryDistribution.forEach((item: { _id: string; count: number }) => {
      if (item._id === 'personal') {
        processedCategoryDistribution.personal = item.count;
      } else if (item._id === 'group') {
        processedCategoryDistribution.group = item.count;
      } else if (item._id === 'special') {
        processedCategoryDistribution.special = item.count;
      }
    });

    // 處理課程表現資料
    const processedCoursePerformance: CoursePerformance[] = coursePerformance.map(
      (course: {
        _id: string;
        courseName: string;
        category: string;
        bookingCount: number;
        revenue: number;
        completionRate: number;
      }) => ({
        courseId: course._id,
        courseName: course.courseName,
        category: course.category as 'personal' | 'group' | 'special',
        bookingCount: course.bookingCount,
        revenue: course.revenue,
        completionRate: Math.round(course.completionRate)
      })
    );

    // 組合回應資料
    const response: AnalyticsResponse = {
      todayStats: {
        bookings: todayBookings,
        revenue: todayRevenue[0]?.total || 0,
        newCustomers: 0 // 暫時設為0，可以之後實作
      },
      monthlyStats: {
        bookings: monthlyBookings,
        revenue: monthlyRevenue[0]?.total || 0,
        completionRate: monthlyBookings > 0 
          ? Math.round((monthlyCompleted / monthlyBookings) * 100) 
          : 0,
        averageOccupancyRate: 0 // 暫時設為0，可以之後實作
      },
      bookingStats: processedBookingStats,
      bookingTrend: processedBookingTrend,
      bookingStatusDistribution: {
        pending: processedBookingStats.pending,
        confirmed: processedBookingStats.confirmed,
        completed: processedBookingStats.completed,
        cancelled: processedBookingStats.cancelled,
        noShow: processedBookingStats.noShow
      },
      bookingTypeDistribution: processedTypeDistribution,
      coursePerformance: processedCoursePerformance,
      popularCourses: popularCourses as PopularCourse[],
      courseCategoryDistribution: processedCategoryDistribution,
      timeSlotHeatmap: timeSlotHeatmap as TimeSlotHeatmap[]
    };

    return NextResponse.json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '獲取分析資料失敗',
        error: process.env.NODE_ENV === 'development' 
          ? (error instanceof Error ? error.message : 'Unknown error') 
          : undefined
      },
      { status: 500 }
    );
  }
}