import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Course from '@/models/CourseMongoose';
import Testimonial from '@/models/TestimonialMongoose';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || (session.user.role !== 'admin' && session.user.role !== 'superadmin')) {
      return NextResponse.json({ error: '未授權訪問' }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // 預設30天
    
    const daysAgo = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    // 並行獲取所有統計資料
    const [
      totalCourses,
      totalTestimonials,
      totalBookings,
      bookingStats,
      courseStats,
      recentBookings,
      monthlyBookings,
      statusDistribution
    ] = await Promise.all([
      // 總課程數
      Course.countDocuments(),
      
      // 總見證數
      Testimonial.countDocuments(),
      
      // 總預約數
      Booking.countDocuments(),
      
      // 預約統計
      Booking.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalRevenue: { $sum: '$totalPrice' }
          }
        }
      ]),
      
      // 課程預約統計
      Booking.aggregate([
        { 
          $match: { 
            bookingType: 'course',
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: '$courseName',
            count: { $sum: 1 },
            revenue: { $sum: '$totalPrice' }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]),
      
      // 最近預約
      Booking.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select('bookingNumber customerName bookingType status createdAt')
        .lean(),
        
      // 近30天每日預約統計
      Booking.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            count: { $sum: 1 },
            revenue: { $sum: '$totalPrice' }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
        }
      ]),
      
      // 預約狀態分布
      Booking.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    // 計算統計資料
    interface BookingStat {
      _id: string;
      count: number;
      totalRevenue?: number;
    }
    
    const pendingBookings = bookingStats.find((s: BookingStat) => s._id === 'pending')?.count || 0;
    const confirmedBookings = bookingStats.find((s: BookingStat) => s._id === 'confirmed')?.count || 0;
    const completedBookings = bookingStats.find((s: BookingStat) => s._id === 'completed')?.count || 0;
    const cancelledBookings = bookingStats.find((s: BookingStat) => s._id === 'cancelled')?.count || 0;
    
    const totalRevenue = bookingStats.reduce((sum: number, stat: BookingStat) => sum + (stat.totalRevenue || 0), 0);
    
    // 計算本月和上月的預約數進行比較
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    const [thisMonthBookings, lastMonthBookings] = await Promise.all([
      Booking.countDocuments({ createdAt: { $gte: thisMonth } }),
      Booking.countDocuments({ 
        createdAt: { 
          $gte: lastMonth, 
          $lt: thisMonth 
        } 
      })
    ]);
    
    const bookingGrowth = lastMonthBookings > 0 
      ? Math.round(((thisMonthBookings - lastMonthBookings) / lastMonthBookings) * 100)
      : 0;

    return NextResponse.json({
      overview: {
        totalCourses,
        totalTestimonials,
        totalBookings,
        totalRevenue,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
        bookingGrowth
      },
      charts: {
        dailyBookings: monthlyBookings,
        statusDistribution,
        popularCourses: courseStats
      },
      recent: {
        bookings: recentBookings
      },
      activities: [
        {
          type: 'booking',
          message: `收到 ${pendingBookings} 個待確認預約`,
          timestamp: new Date(),
          priority: pendingBookings > 0 ? 'high' : 'normal'
        },
        {
          type: 'system',
          message: '系統運行正常',
          timestamp: new Date(),
          priority: 'normal'
        },
        {
          type: 'revenue',
          message: `本月營收 NT$${totalRevenue.toLocaleString()}`,
          timestamp: new Date(),
          priority: 'normal'
        }
      ]
    });

  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json({ error: '獲取統計資料失敗' }, { status: 500 });
  }
}